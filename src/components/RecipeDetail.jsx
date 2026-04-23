export default function RecipeDetail({ repas, onClose }) {
  if (!repas) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50" onClick={onClose}>
      <div
        className="w-full max-w-md bg-slate-900 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-white font-semibold text-lg leading-tight">{repas.nom}</h2>
          <button onClick={onClose} className="text-slate-400 text-xl leading-none flex-none">×</button>
        </div>

        <div className="flex gap-3 text-xs text-slate-400">
          {repas.duree && <span>⏱ {repas.duree} min</span>}
          {repas.portions && <span>👨‍👩‍👧 {repas.portions} personnes</span>}
          {repas.type && <span className="capitalize">{repas.type}</span>}
        </div>

        {repas.ingredients?.length > 0 && (
          <div>
            <h3 className="text-slate-300 text-sm font-medium mb-2">Ingrédients</h3>
            <ul className="space-y-1">
              {repas.ingredients.map((ing, i) => (
                <li key={i} className="text-slate-400 text-sm flex gap-2">
                  <span className="text-slate-600">•</span>
                  <span>{ing.quantite} {ing.unite} {ing.nom}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {repas.recette && (
          <div>
            <h3 className="text-slate-300 text-sm font-medium mb-2">Recette</h3>
            <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{repas.recette}</div>
          </div>
        )}
      </div>
    </div>
  )
}
