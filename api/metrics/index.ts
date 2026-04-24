import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { CosmosClient } from '@azure/cosmos'

interface ParticipantDoc {
  nome: string
  email: string
  pais: string
  paisCode: string
  timestamp: string
}

async function metricsHandler(
  req: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const adminKey = process.env.ADMIN_KEY
  if (!adminKey) {
    context.error('[metrics] ADMIN_KEY is not set')
    return { status: 500, jsonBody: { error: 'Server configuration error' } }
  }

  const providedKey = req.headers.get('x-admin-key')
  if (!providedKey || providedKey !== adminKey) {
    return { status: 401, jsonBody: { error: 'Unauthorized' } }
  }

  const connectionString = process.env.COSMOS_CONNECTION_STRING
  if (!connectionString) {
    context.error('[metrics] COSMOS_CONNECTION_STRING is not set')
    return { status: 500, jsonBody: { error: 'Server configuration error' } }
  }

  try {
    const client = new CosmosClient(connectionString)
    const container = client.database('beyondsummit').container('participants')

    const { resources } = await container.items
      .query<ParticipantDoc>('SELECT c.nome, c.email, c.pais, c.paisCode, c.timestamp FROM c ORDER BY c.timestamp DESC')
      .fetchAll()

    const countMap = new Map<string, { name: string; count: number }>()
    for (const p of resources) {
      const entry = countMap.get(p.paisCode)
      if (entry) {
        entry.count += 1
      } else {
        countMap.set(p.paisCode, { name: p.pais, count: 1 })
      }
    }

    const byCountry = Array.from(countMap.entries())
      .map(([code, { name, count }]) => ({ code, name, count }))
      .sort((a, b) => b.count - a.count)

    return {
      status: 200,
      jsonBody: {
        total: resources.length,
        byCountry,
        participants: resources,
      },
    }
  } catch (err) {
    context.error('[metrics] Cosmos DB error:', err)
    return { status: 500, jsonBody: { error: 'Internal server error' } }
  }
}

app.http('metrics', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: metricsHandler,
})
