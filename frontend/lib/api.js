const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

async function request(method, path, data = null) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  })

  const json = await res.json()
  if (!json.success) throw new Error(json.message || 'Request failed')
  return json.data
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, data) => request('POST', path, data),
  put: (path, data) => request('PUT', path, data),
  patch: (path, data) => request('PATCH', path, data),
  delete: (path) => request('DELETE', path),
}
