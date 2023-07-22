export const generateUrl = (endpoint: string) => {
  const base = process.env.NODE_ENV === 'production' ? 'https://app.audea.id' : 'http://localhost:3000'

  return new URL(endpoint, base)
}
