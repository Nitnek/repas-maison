import { useState } from 'react'

async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function Login({ onSuccess }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const hash = await sha256(pwd)
    if (hash === import.meta.env.VITE_PASSWORD_HASH) {
      sessionStorage.setItem('auth', '1')
      onSuccess()
    } else {
      setError(true)
      setPwd('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍽️</div>
          <h1 className="text-white text-xl font-semibold">Qu'est-ce qu'on mange ?</h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setError(false) }}
            placeholder="Mot de passe"
            autoFocus
            className={`w-full bg-slate-800 border rounded-2xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none ${
              error ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'
            }`}
          />
          {error && <p className="text-red-400 text-xs text-center">Mot de passe incorrect</p>}
          <button
            type="submit"
            disabled={!pwd || loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-2xl py-3 text-sm font-medium transition-colors"
          >
            {loading ? 'Vérification…' : 'Entrer'}
          </button>
        </form>
      </div>
    </div>
  )
}
