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

  const { nome, email, pais, paisCode, timestamp, cargo, area } = body

  if (
    typeof nome !== 'string' || !nome.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof pais !== 'string' || !pais.trim() ||
    typeof paisCode !== 'string' || !paisCode.trim() ||
    typeof timestamp !== 'string' || !timestamp.trim()
  ) {
    return { status: 400, jsonBody: { error: 'Missing required fields' } }
  }

  if (!isValidEmail(email)) {
    return { status: 400, jsonBody: { error: 'Invalid email format' } }
  }

  const normalizedCode = paisCode.toLowerCase()
  if (!SUPPORTED_CODES.has(normalizedCode)) {
    return { status: 400, jsonBody: { error: 'Country not supported' } }
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

    await container.items.create({
      id,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      pais: pais.trim(),
      paisCode: normalizedCode,
      timestamp,
      cargo: typeof cargo === 'string' ? cargo.trim() : '',
      area: typeof area === 'string' ? area.trim() : '',
      sharedToMural: false,
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
