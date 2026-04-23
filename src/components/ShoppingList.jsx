const rayonOrder = ['fruits et légumes', 'viandes', 'poissons', 'produits laitiers', 'épicerie', 'surgelés', 'boissons', 'autres']

export default function ShoppingList({ courses, onToggle, onClear }) {
  const done = courses.filter(c => c.checked).length
  const total = courses.length

  const byRayon = courses.reduce((acc, c) => {
    const r = c.rayon || 'autres'
    if (!acc[r]) acc[r] = []
    acc[r].push(c)
    return acc
  }, {})

  const sortedRayons = Object.keys(byRayon).sort((a, b) => {
    const ia = rayonOrder.indexOf(a)
    const ib = rayonOrder.indexOf(b)
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })

  if (total === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-4xl mb-3">🛒</p>
        <p className="text-sm">Aucune liste de courses</p>
        <p className="text-xs mt-1">Sélectionne des repas pour la semaine</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{done}/{total} articles cochés</p>
        {done > 0 && (
          <button onClick={onClear} className="text-xs text-slate-500 hover:text-red-400 transition-colors">
            Effacer les cochés
          </button>
        )}
      </div>

      {sortedRayons.map(rayon => (
        <div key={rayon}>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">{rayon}</p>
          <div className="space-y-1">
            {byRayon[rayon].map(item => (
              <button
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                  item.checked ? 'bg-slate-800/50 opacity-50' : 'bg-slate-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-none transition-colors ${
                  item.checked ? 'border-green-500 bg-green-500 text-white' : 'border-slate-600'
                }`}>
                  {item.checked && <span className="text-xs">✓</span>}
                </div>
                <span className={`flex-1 text-sm ${item.checked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {item.nom}
                </span>
                <span className="text-xs text-slate-500 flex-none">
                  {item.quantite} {item.unite}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
