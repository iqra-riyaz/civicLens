import React from 'react'
import { useAuth } from '../services/authContext.jsx'

export default function Profile() {
  const { user } = useAuth()
  if (!user) return null
  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="space-y-2">
        {user.avatarUrl && <img src={user.avatarUrl} className="w-24 h-24 rounded-full" />}
        <div><span className="text-gray-500">Name:</span> {user.name}</div>
        <div><span className="text-gray-500">Email:</span> {user.email}</div>
        <div><span className="text-gray-500">Role:</span> {user.role}</div>
      </div>
    </div>
  )
}


