import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { CosmosClient } from '@azure/cosmos'
import { BlobServiceClient } from '@azure/storage-blob'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

async function uploadStickerHandler(
  req: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return { status: 400, jsonBody: { error: 'Invalid multipart/form-data body' } }
  }

  const fileEntry = formData.get('file')
  const participantId = formData.get('participantId')

  if (!fileEntry || !(fileEntry instanceof Blob)) {
    return { status: 400, jsonBody: { error: 'Missing file field' } }
  }

  if (typeof participantId !== 'string' || !participantId.trim()) {
    return { status: 400, jsonBody: { error: 'Missing participantId field' } }
  }

  if (fileEntry.type !== 'image/png') {
    return { status: 400, jsonBody: { error: 'File must be a PNG image' } }
  }

  if (fileEntry.size > MAX_FILE_SIZE) {
    return { status: 400, jsonBody: { error: 'File exceeds maximum size of 2MB' } }
  }

  const cosmosConnectionString = process.env.COSMOS_CONNECTION_STRING
  if (!cosmosConnectionString) {
    context.error('[upload-sticker] COSMOS_CONNECTION_STRING is not set')
    return { status: 500, jsonBody: { error: 'Server configuration error' } }
  }

  const blobConnectionString = process.env.BLOB_CONNECTION_STRING
  const blobAccountName = process.env.BLOB_ACCOUNT_NAME
  const blobContainerName = process.env.BLOB_CONTAINER_NAME ?? 'stickers'

  if (!blobConnectionString || !blobAccountName) {
    context.error('[upload-sticker] Blob Storage environment variables are not set')
    return { status: 500, jsonBody: { error: 'Server configuration error' } }
  }

  try {
    const cosmosClient = new CosmosClient(cosmosConnectionString)
    const container = cosmosClient.database('beyondsummit').container('participants')

    const { resource: participant } = await container.item(participantId.trim(), participantId.trim()).read()
    if (!participant) {
      return { status: 400, jsonBody: { error: 'Participant not found' } }
    }

    const stickerId = `${participantId.trim()}-${Date.now()}`
    const blobName = `${stickerId}.png`

    const fileBuffer = Buffer.from(await fileEntry.arrayBuffer())
    const blobServiceClient = BlobServiceClient.fromConnectionString(blobConnectionString)
    const containerClient = blobServiceClient.getContainerClient(blobContainerName)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: { blobContentType: 'image/png' },
    })

    const stickerUrl = `https://${blobAccountName}.blob.core.windows.net/${blobContainerName}/${blobName}`

    await container.item(participantId.trim(), participantId.trim()).patch([
      { op: 'add', path: '/stickerUrl', value: stickerUrl },
      { op: 'add', path: '/sharedToMural', value: true },
    ])

    return { status: 200, jsonBody: { ok: true, stickerUrl, stickerId } }
  } catch (err) {
    context.error('[upload-sticker] Error:', err)
    return { status: 500, jsonBody: { error: 'Internal server error' } }
  }
}

app.http('upload-sticker', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: uploadStickerHandler,
})
