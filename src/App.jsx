import { useState, useEffect } from 'react'
import Login from './components/Login'
import MealCard from './components/MealCard'
import RecipeDetail from './components/RecipeDetail'
import ShoppingList from './components/ShoppingList'
import SyncSettings from './components/SyncSettings'
import useRepas from './hooks/useRepas'
import { useGistSync } from './hooks/useGistSync'
import './App.css'

const TABS = [
  { id: 'semaine', label: 'Semaine', emoji: '📅' },
  { id: 'courses', label: 'Courses', emoji: '🛒' },
  { id: 'historique', label: 'Historique', emoji: '📖' },
  { id: 'reglages', label: 'Réglages', emoji: '⚙️' },
]

export default function App() {
  const { semaine, historique, courses, rawData, setSemaine, validerSemaine, setCourses, toggleCourse, setRawData } = useRepas()
  const { fetchFromGist, pushToGist, saveCredentials, clearCredentials, hasCredentials, syncing, lastSync, syncError } = useGistSync()
  const [auth, setAuth] = useState(() => sessionStorage.getItem('auth') === '1')
  const [tab, setTab] = useState('semaine')
  const [selected, setSelected] = useState(null)
  const [credsStored, setCredsStored] = useState(hasCredentials)

  useEffect(() => {
    if (!auth || !hasCredentials()) return
    fetchFromGist().then(data => { if (data) setRawData(data) })
  }, [auth, credsStored])

  useEffect(() => {
    if (!auth || !hasCredentials()) return
    pushToGist(rawData)
  }, [rawData])

  if (!auth) return <Login onSuccess={() => setAuth(true)} />

  const handleClearDone = () => {
    setCourses(courses.filter(c => !c.checked))
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="text-white font-semibold text-base">Qu'est-ce qu'on mange ?</h1>
          {syncing
            ? <span className="text-xs text-blue-400">sync…</span>
            : syncError
            ? <span className="text-xs text-red-400">⚠ sync</span>
            : lastSync
            ? <span className="text-xs text-emerald-500">✓ sync</span>
            : null}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {tab === 'semaine' && (
          <div className="space-y-3 pt-2">
            {semaine.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-5xl mb-4">🍽️</p>
                <p className="text-sm font-medium text-slate-400">Aucun repas cette semaine</p>
                <p className="text-xs mt-2">Utilise <code className="bg-slate-800 px-1.5 py-0.5 rounded">/repas-semaine</code> pour générer des suggestions</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500">{semaine.length} repas planifiés</p>
                {semaine.map(r => (
                  <MealCard
                    key={r.id}
                    repas={r}
                    onClick={() => setSelected(r)}
                  />
                ))}
                <button
                  onClick={validerSemaine}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-3 text-sm font-medium transition-colors"
                >
                  Valider la semaine
                </button>
              </>
            )}
          </div>
        )}

        {tab === 'courses' && (
          <div className="pt-2">
            <ShoppingList
              courses={courses}
              onToggle={toggleCourse}
              onClear={handleClearDone}
            />
          </div>
        )}

        {tab === 'historique' && (
          <div className="space-y-4 pt-2">
            {historique.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <p className="text-4xl mb-3">📖</p>
                <p className="text-sm">Aucun historique</p>
              </div>
            ) : (
              historique.map(h => (
                <div key={h.semaine} className="bg-slate-800 rounded-2xl p-4">
                  <p className="text-xs text-slate-500 mb-2">{h.semaine}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {h.repas.map((nom, i) => (
                      <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full">{nom}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'reglages' && (
          <div className="pt-2">
            <SyncSettings
              hasCredentials={credsStored}
              onSave={(pat, gistId) => { saveCredentials(pat, gistId); setCredsStored(true) }}
              onClear={() => { clearCredentials(); setCredsStored(false) }}
              syncing={syncing} lastSync={lastSync} syncError={syncError}
            />
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-slate-900/95 backdrop-blur border-t border-slate-800 pb-safe">
        <div className="flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors ${
                tab === t.id ? 'text-blue-400' : 'text-slate-500'
              }`}
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="text-xs">{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {selected && <RecipeDetail repas={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
