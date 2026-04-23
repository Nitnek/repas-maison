const typeColors = {
  viande: 'bg-red-600/20 text-red-400 border-red-600/30',
  poisson: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  végétarien: 'bg-green-600/20 text-green-400 border-green-600/30',
  pâtes: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
  soupe: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  autre: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
}

const typeEmojis = {
  viande: '🥩', poisson: '🐟', végétarien: '🥦', pâtes: '🍝', soupe: '🍲', autre: '🍴',
}

export default function MealCard({ repas, onClick, selected, onToggleSelect }) {
  const colorClass = typeColors[repas.type] || typeColors.autre
  const emoji = typeEmojis[repas.type] || '🍴'

  return (
    <div
      className={`bg-slate-800 rounded-2xl p-4 cursor-pointer transition-all ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-none w-10 h-10 flex items-center justify-center">{emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-white text-sm font-medium leading-tight">{repas.nom}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${colorClass}`}>{repas.type}</span>
          </div>
          <div className="flex gap-3 text-xs text-slate-500">
            {repas.duree && <span>⏱ {repas.duree} min</span>}
            {repas.portions && <span>👨‍👩‍👧 {repas.portions} pers.</span>}
          </div>
        </div>
        {onToggleSelect && (
          <button
            onClick={e => { e.stopPropagation(); onToggleSelect(repas.id) }}
            className={`flex-none w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-600 text-transparent'
            }`}
          >
            ✓
          </button>
        )}
      </div>
    </div>
  )
}
