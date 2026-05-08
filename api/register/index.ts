import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { CosmosClient } from '@azure/cosmos'

const SUPPORTED_CODES = new Set([
  'br', 'ar', 'mx', 'cl', 'co', 'uy', 'pe', 'ec',
  'bo', 'cr', 'cu', 'sv', 'gt', 'hn', 'ni', 'pa',
  'py', 'pr', 'do', 've', 'pt', 'es',
])

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface RegisterBody {
  nome?: unknown
  email?: unknown
  pais?: unknown
  paisCode?: unknown
  timestamp?: unknown
  cargo?: unknown
  area?: unknown
  status?: unknown
}

async function registerHandler(
  req: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  let body: RegisterBody
  try {
    body = (await req.json()) as RegisterBody
  } catch {
    return { status: 400, jsonBody: { error: 'Invalid JSON body' } }
  }

  const { nome, email, pais, paisCode, timestamp, cargo, area, status } = body

  const isStarted = status === 'started'

  if (typeof email !== 'string' || !email.trim()) {
    return { status: 400, jsonBody: { error: 'Missing required fields' } }
  }

  if (typeof timestamp !== 'string' || !timestamp.trim()) {
    return { status: 400, jsonBody: { error: 'Missing required fields' } }
  }

  if (!isStarted) {
    if (
      typeof nome !== 'string' || !nome.trim() ||
      typeof pais !== 'string' || !pais.trim() ||
      typeof paisCode !== 'string' || !paisCode.trim()
    ) {
      return { status: 400, jsonBody: { error: 'Missing required fields' } }
    }
  }

  if (!isValidEmail(email)) {
    return { status: 400, jsonBody: { error: 'Invalid email format' } }
  }

  if (!isStarted) {
    const normalizedCode = (paisCode as string).toLowerCase()
    if (!SUPPORTED_CODES.has(normalizedCode)) {
      return { status: 400, jsonBody: { error: 'Country not supported' } }
    }
  }

  const connectionString = process.env.COSMOS_CONNECTION_STRING
  if (!connectionString) {
    context.error('[register] COSMOS_CONNECTION_STRING is not set')
    return { status: 500, jsonBody: { error: 'Server configuration error' } }
  }

  try {
    const client = new CosmosClient(connectionString)
    const container = client.database('beyondsummit').container('participants')

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const normalizedCode = isStarted ? '' : (paisCode as string).toLowerCase()

    await container.items.create({
      id,
      nome: typeof nome === 'string' ? nome.trim() : '',
      email: email.trim().toLowerCase(),
      pais: typeof pais === 'string' ? pais.trim() : '',
      paisCode: normalizedCode,
      timestamp,
      cargo: typeof cargo === 'string' ? cargo.trim() : '',
      area: typeof area === 'string' ? area.trim() : '',
      status: isStarted ? 'started' : 'completed',
    })

    return { status: 200, jsonBody: { ok: true, id } }
  } catch (err) {
    context.error('[register] Cosmos DB error:', err)
    return { status: 500, jsonBody: { error: 'Internal server error' } }
  }
}

app.http('register', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: registerHandler,
})
