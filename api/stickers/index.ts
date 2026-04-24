import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { CosmosClient } from '@azure/cosmos'

interface ParticipantDoc {
  id: string
  nome: string
  cargo: string
  area: string
  pais: string
  paisCode: string
  stickerUrl: string
  sharedToMural: boolean
}

interface MuralSticker {
  id: string
  stickerUrl: string
  nome: string
  cargo: string
  area: string
  paisCode: string
  pais: string
}

const MAX_RESULTS = 200

async function stickersHandler(
  req: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const connectionString = process.env.COSMOS_CONNECTION_STRING
  if (!connectionString) {
    context.error('[stickers] COSMOS_CONNECTION_STRING is not set')
    return { status: 500, jsonBody: { error: 'Server configuration error' } }
  }

  const nameFilter = req.query.get('name')?.toLowerCase() ?? ''
  const areaFilter = req.query.get('area')?.toLowerCase() ?? ''
  const cargoFilter = req.query.get('cargo')?.toLowerCase() ?? ''
  const countryFilter = req.query.get('country')?.toLowerCase() ?? ''

  try {
    const client = new CosmosClient(connectionString)
    const container = client.database('beyondsummit').container('participants')

    const { resources } = await container.items
      .query<ParticipantDoc>(
        'SELECT c.id, c.nome, c.cargo, c.area, c.pais, c.paisCode, c.stickerUrl FROM c WHERE c.sharedToMural = true',
      )
      .fetchAll()

    let stickers: MuralSticker[] = resources.map((doc) => ({
      id: doc.id,
      stickerUrl: doc.stickerUrl,
      nome: doc.nome,
      cargo: doc.cargo ?? '',
      area: doc.area ?? '',
      paisCode: doc.paisCode,
      pais: doc.pais,
    }))

    if (nameFilter) {
      stickers = stickers.filter((s) => s.nome.toLowerCase().includes(nameFilter))
    }
    if (areaFilter) {
      stickers = stickers.filter((s) => s.area.toLowerCase() === areaFilter)
    }
    if (cargoFilter) {
      stickers = stickers.filter((s) => s.cargo.toLowerCase() === cargoFilter)
    }
    if (countryFilter) {
      stickers = stickers.filter((s) => s.paisCode.toLowerCase() === countryFilter)
    }

    return {
      status: 200,
      jsonBody: { stickers: stickers.slice(0, MAX_RESULTS) },
    }
  } catch (err) {
    context.error('[stickers] Cosmos DB error:', err)
    return { status: 500, jsonBody: { error: 'Internal server error' } }
  }
}

app.http('stickers', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: stickersHandler,
})
