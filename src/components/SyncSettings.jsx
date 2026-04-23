import { useState } from 'react'

export default function SyncSettings({ syncHook, onClose, onImport }) {
  const { status, errorMsg, hasCreds, saveCredentials, fetchFromGist, pushToGist, pat, gistId } = syncHook
  const [patVal, setPatVal] = useState(pat())
  const [gistVal, setGistVal] = useState(gistId())
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveCredentials(patVal.trim(), gistVal.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleFetch = async () => {
    const data = await fetchFromGist()
    if (data) onImport(data)
  }

  const statusColor = status === 'ok' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-slate-400'
  const statusLabel = { idle: 'En attente', syncing: 'Synchronisation…', ok: 'Connecté', error: `Erreur : ${errorMsg}` }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50" onClick={onClose}>
      <div
        className="w-full max-w-md bg-slate-900 rounded-t-3xl p-6 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold">Synchronisation Gist</h2>
          <button onClick={onClose} className="text-slate-400 text-xl leading-none">×</button>
        </div>

        <p className={`text-xs ${statusColor}`}>{statusLabel[status]}</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">GitHub PAT (scope gist)</label>
            <input
              type="password"
              value={patVal}
              onChange={e => setPatVal(e.target.value)}
              placeholder="ghp_..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Gist ID</label>
            <input
              type="text"
              value={gistVal}
              onChange={e => setGistVal(e.target.value)}
              placeholder="485ed9fd9c53b86bd73074178ccd38b4"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-xl py-2.5 text-sm transition-colors"
          >
            {saved ? 'Sauvegardé ✓' : 'Sauvegarder'}
          </button>
          <button
            onClick={handleFetch}
            disabled={!hasCreds()}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl py-2.5 text-sm transition-colors"
          >
            Importer
          </button>
        </div>
      </div>
    </div>
  )
}
