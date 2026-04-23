import { useState } from 'react'

export default function SyncSettings({ hasCredentials, onSave, onClear, syncing, lastSync, syncError }) {
  const [pat, setPat] = useState('')
  const [gistId, setGistId] = useState('')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!pat.trim() || !gistId.trim()) return
    onSave(pat.trim(), gistId.trim())
    setPat(''); setGistId('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-200">Sync GitHub Gist</span>
          <span className={`flex items-center gap-1.5 text-xs ${hasCredentials ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${hasCredentials ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            {hasCredentials ? 'Connecté' : 'Non configuré'}
          </span>
        </div>

        {hasCredentials ? (
          <>
            {syncing && <p className="text-xs text-blue-400">Synchronisation…</p>}
            {syncError && <p className="text-xs text-red-400">Erreur : {syncError}</p>}
            {lastSync && !syncing && <p className="text-xs text-slate-500">Dernière sync : {lastSync.toLocaleTimeString('fr-FR')}</p>}
            <button onClick={onClear} className="w-full py-2.5 rounded-xl bg-red-900/40 text-red-400 text-sm font-medium active:scale-95 transition-transform">
              Déconnecter
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-slate-400">PAT GitHub (scope <code className="text-slate-300">gist</code>) + ID du Gist.</p>
            <input type="password" value={pat} onChange={e => setPat(e.target.value)} placeholder="ghp_xxxxxxxxxxxx"
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-blue-500" />
            <input type="text" value={gistId} onChange={e => setGistId(e.target.value)} placeholder="ID du Gist (32 caractères)"
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-blue-500" />
            <button onClick={handleSave} disabled={!pat.trim() || !gistId.trim()}
              className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold active:scale-95 transition-transform disabled:opacity-40">
              {saved ? 'Enregistré ✓' : 'Enregistrer'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
