import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../services/api.js'
import { useAuth } from '../services/authContext.jsx'

export default function Signup() {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await signup(form)
      loginWithToken(data.token, data.user)
      navigate('/dashboard')
    } catch (e) {
      setError('Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">{loading? 'Creating...' : 'Sign up'}</button>
      </form>
    </div>
  )
}


