import { useState, useRef, useEffect } from 'react'
import { removeBackground } from '@imgly/background-removal'
import { toast } from 'sonner'

export type RemovalStatus = 'idle' | 'processing' | 'done' | 'error'

interface UseBackgroundRemovalReturn {
  status: RemovalStatus
  processedUrl: string | null
  processFile: (file: File) => Promise<void>
  reset: () => void
}

export function useBackgroundRemoval(): UseBackgroundRemovalReturn {
  const [status, setStatus] = useState<RemovalStatus>('idle')
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const blobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }
    }
  }, [])

  async function processFile(file: File): Promise<void> {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }

    setStatus('processing')
    setProcessedUrl(null)

    try {
      const blob = await removeBackground(file)
      const url = URL.createObjectURL(blob)
      blobUrlRef.current = url
      setProcessedUrl(url)
      setStatus('done')

      if (import.meta.env.DEV) {
        console.log('[useBackgroundRemoval] processedUrl:', url)
      }
    } catch (err) {
      console.error('[useBackgroundRemoval] error:', err)
      setStatus('error')
      toast.error('Não foi possível remover o fundo. Tente com outra foto.')
    }
  }

  function reset(): void {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setProcessedUrl(null)
    setStatus('idle')
  }

  return { status, processedUrl, processFile, reset }
}
