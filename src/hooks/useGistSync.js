import { useState, useCallback, useRef } from 'react'

const GIST_FILE = 'repas.json'
const PAT_KEY = 'repas-gist-pat'
const GIST_ID_KEY = 'repas-gist-id'

export function useGistSync() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const [syncError, setSyncError] = useState(null)
  const debounceRef = useRef(null)

  const getPat = () => localStorage.getItem(PAT_KEY)
  const getGistId = () => localStorage.getItem(GIST_ID_KEY)
  const saveCredentials = (pat, gistId) => {
    localStorage.setItem(PAT_KEY, pat)
    localStorage.setItem(GIST_ID_KEY, gistId)
  }
  const clearCredentials = () => {
    localStorage.removeItem(PAT_KEY)
    localStorage.removeItem(GIST_ID_KEY)
  }
  const hasCredentials = () => !!(getPat() && getGistId())

  const fetchFromGist = useCallback(async () => {
    const pat = getPat(); const gistId = getGistId()
    if (!pat || !gistId) return null
    setSyncing(true); setSyncError(null)
    try {
      const res = await fetch(`https://api.github.com/gists/${gistId}`, {
        headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github+json' },
      })
      if (!res.ok) throw new Error(`GitHub API ${res.status}`)
      const data = await res.json()
      const content = data.files?.[GIST_FILE]?.content
      setLastSync(new Date())
      return content ? JSON.parse(content) : null
    } catch (e) {
      setSyncError(e.message)
      return null
    } finally {
      setSyncing(false)
    }
  }, [])

  const pushToGist = useCallback((data) => {
    const pat = getPat(); const gistId = getGistId()
    if (!pat || !gistId) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSyncing(true); setSyncError(null)
      try {
        const res = await fetch(`https://api.github.com/gists/${gistId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `token ${pat}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files: { [GIST_FILE]: { content: JSON.stringify(data, null, 2) } } }),
        })
        if (!res.ok) throw new Error(`GitHub API ${res.status}`)
        setLastSync(new Date())
      } catch (e) {
        setSyncError(e.message)
      } finally {
        setSyncing(false)
      }
    }, 1500)
  }, [])

  return { fetchFromGist, pushToGist, saveCredentials, clearCredentials, hasCredentials, syncing, lastSync, syncError }
}
