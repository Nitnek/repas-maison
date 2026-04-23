import { useState, useCallback } from 'react'

const PAT_KEY = 'repas-gist-pat'
const GIST_ID_KEY = 'repas-gist-id'
const FILENAME = 'repas.json'

export default function useGistSync() {
  const [status, setStatus] = useState('idle') // idle | syncing | ok | error
  const [errorMsg, setErrorMsg] = useState('')

  const getPat = () => localStorage.getItem(PAT_KEY) || ''
  const getGistId = () => localStorage.getItem(GIST_ID_KEY) || ''
  const hasCreds = () => !!(getPat() && getGistId())

  const saveCredentials = useCallback((pat, gistId) => {
    localStorage.setItem(PAT_KEY, pat)
    localStorage.setItem(GIST_ID_KEY, gistId)
  }, [])

  const fetchFromGist = useCallback(async () => {
    if (!hasCreds()) return null
    setStatus('syncing')
    try {
      const res = await fetch(`https://api.github.com/gists/${getGistId()}`, {
        headers: { Authorization: `token ${getPat()}`, Accept: 'application/vnd.github.v3+json' },
      })
      if (!res.ok) throw new Error(`GitHub API ${res.status}`)
      const json = await res.json()
      const content = json.files?.[FILENAME]?.content
      if (!content) { setStatus('ok'); return null }
      setStatus('ok')
      return JSON.parse(content)
    } catch (e) {
      setStatus('error')
      setErrorMsg(e.message)
      return null
    }
  }, [])

  const pushToGist = useCallback(async (data) => {
    if (!hasCreds()) return
    try {
      const res = await fetch(`https://api.github.com/gists/${getGistId()}`, {
        method: 'PATCH',
        headers: {
          Authorization: `token ${getPat()}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: { [FILENAME]: { content: JSON.stringify(data, null, 2) } } }),
      })
      if (!res.ok) throw new Error(`GitHub API ${res.status}`)
      setStatus('ok')
    } catch (e) {
      setStatus('error')
      setErrorMsg(e.message)
    }
  }, [])

  return {
    status,
    errorMsg,
    hasCreds,
    saveCredentials,
    fetchFromGist,
    pushToGist,
    pat: getPat,
    gistId: getGistId,
  }
}
