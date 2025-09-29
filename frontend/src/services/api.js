import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }
}

export async function signup(payload) {
  const { data } = await api.post('/auth/signup', payload)
  return data
}

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export async function googleLogin(idToken) {
  const { data } = await api.post('/auth/google', { idToken })
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}

export async function fetchReports(params) {
  const { data } = await api.get('/reports', { params })
  return data
}

export async function fetchMyReports() {
  const { data } = await api.get('/reports/mine')
  return data
}

export async function createReport(formData) {
  const { data } = await api.post('/reports', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return data
}

export async function updateReportStatus(id, status) {
  const { data } = await api.patch(`/reports/${id}/status`, { status })
  return data
}

export async function updateReport(id, reportData) {
  const { data } = await api.put(`/reports/${id}`, reportData)
  return data
}

export async function deleteReport(id) {
  const { data } = await api.delete(`/reports/${id}`)
  return data
}

export default api


