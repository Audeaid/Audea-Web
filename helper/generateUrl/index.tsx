import { NODE_ENV } from '@/utils/constant'

export function generateUrl(endpoint: string) {
  const base = NODE_ENV === 'production' ? 'https://app.audea.id' : 'http://localhost:3000'

  return new URL(endpoint, base)
}
