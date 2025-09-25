import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../services/authContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">CivicLens</Link>
        <nav className="flex items-center gap-4">
          <NavLink to="/" className={({isActive})=> isActive? 'text-blue-600' : ''}>Home</NavLink>
          {user && (<>
            {user.role !== 'admin' && (
              <NavLink to="/dashboard" className={({isActive})=> isActive? 'text-blue-600' : ''}>Dashboard</NavLink>
            )}
            <NavLink to="/profile" className={({isActive})=> isActive? 'text-blue-600' : ''}>Profile</NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" className={({isActive})=> isActive? 'text-blue-600' : ''}>Admin</NavLink>
            )}
          </>)}
          {!user ? (
            <>
              <NavLink to="/login" className={({isActive})=> isActive? 'text-blue-600' : ''}>Login</NavLink>
              <NavLink to="/signup" className={({isActive})=> isActive? 'text-blue-600' : ''}>Signup</NavLink>
            </>
          ) : (
            <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          )}
        </nav>
      </div>
    </header>
  )
}


