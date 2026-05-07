import type { ParticipantRecord } from '@/types/stamp'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export async function registerParticipant(data: ParticipantRecord): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      console.error('[analytics] Failed to register participant:', res.status)
      return null
    }
    const json = (await res.json()) as { ok?: boolean; id?: string }
    return json.id ?? null
  } catch (err) {
    console.error('[analytics] Error registering participant:', err)
    return null
  }
}
