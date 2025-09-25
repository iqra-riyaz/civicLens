import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, googleLogin } from '../services/api.js'
import { useAuth } from '../services/authContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await login(form)
      loginWithToken(data.token, data.user)
      navigate('/dashboard')
    } catch (e) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    /* global google */
    if (!window.google) return
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) return
    google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          const data = await googleLogin(response.credential)
          loginWithToken(data.token, data.user)
          navigate('/dashboard')
        } catch (e) {
          setError('Google login failed')
        }
      },
    })
    google.accounts.id.renderButton(document.getElementById('googleBtn'), { theme: 'outline', size: 'large' })
  }, [])

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">{loading? 'Logging in...' : 'Login'}</button>
      </form>
      <div className="my-4 text-center text-gray-500">or</div>
      <div id="googleBtn" className="flex justify-center"></div>
    </div>
  )
}


