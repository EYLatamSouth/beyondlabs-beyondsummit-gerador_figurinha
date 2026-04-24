import type { StickerUploadResult } from '@/types/stamp'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export async function uploadSticker(
  pngBlob: Blob,
  participantId: string,
): Promise<StickerUploadResult> {
  try {
    if (pngBlob.size > MAX_FILE_SIZE) {
      return { ok: false, error: 'File exceeds 2MB limit' }
    }

    const formData = new FormData()
    formData.append('file', pngBlob, 'figurinha.png')
    formData.append('participantId', participantId)

    const res = await fetch(`${API_BASE}/api/upload-sticker`, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      console.error('[sticker-upload] Failed to upload sticker:', res.status)
      return { ok: false, error: `Upload failed with status ${res.status}` }
    }

    return (await res.json()) as StickerUploadResult
  } catch (err) {
    console.error('[sticker-upload] Error uploading sticker:', err)
    return { ok: false, error: 'Network error' }
  }
}
