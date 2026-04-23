import { useState, useCallback } from 'react'

const STORAGE_KEY = 'repas-maison-data'

const defaultData = {
  semaine: [],      // [{id, nom, type, recette, ingredients, duree, portions}]
  historique: [],   // [{semaine: 'YYYY-Wnn', repas: [...noms]}]
  courses: [],      // [{id, nom, quantite, unite, rayon, checked}]
  lastUpdated: null,
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultData, ...JSON.parse(raw) } : defaultData
  } catch {
    return defaultData
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, lastUpdated: new Date().toISOString() }))
}

export default function useRepas() {
  const [data, setData] = useState(load)

  const update = useCallback((fn) => {
    setData(prev => {
      const next = fn(prev)
      save(next)
      return next
    })
  }, [])

  const setSemaine = useCallback((repas) => {
    update(prev => ({ ...prev, semaine: repas }))
  }, [update])

  const validerSemaine = useCallback(() => {
    update(prev => {
      const weekLabel = getWeekLabel()
      const existingIdx = prev.historique.findIndex(h => h.semaine === weekLabel)
      const entry = { semaine: weekLabel, repas: prev.semaine.map(r => r.nom) }
      const historique = existingIdx >= 0
        ? prev.historique.map((h, i) => i === existingIdx ? entry : h)
        : [entry, ...prev.historique].slice(0, 12)
      return { ...prev, historique }
    })
  }, [update])

  const setCourses = useCallback((courses) => {
    update(prev => ({ ...prev, courses }))
  }, [update])

  const toggleCourse = useCallback((id) => {
    update(prev => ({
      ...prev,
      courses: prev.courses.map(c => c.id === id ? { ...c, checked: !c.checked } : c),
    }))
  }, [update])

  const setRawData = useCallback((raw) => {
    const merged = { ...defaultData, ...raw }
    save(merged)
    setData(merged)
  }, [])

  return {
    semaine: data.semaine,
    historique: data.historique,
    courses: data.courses,
    lastUpdated: data.lastUpdated,
    rawData: data,
    setSemaine,
    validerSemaine,
    setCourses,
    toggleCourse,
    setRawData,
  }
}

function getWeekLabel() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}
