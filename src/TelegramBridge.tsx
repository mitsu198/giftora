import { useEffect, useState } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string
        ready: () => void
        expand: () => void
        colorScheme?: string
      }
    }
  }
}

type TelegramStatus = 'checking' | 'inside' | 'unverified' | 'outside' | 'error'

export default function TelegramBridge() {
  const [status, setStatus] = useState<TelegramStatus>('checking')

  useEffect(() => {
    const webApp = window.Telegram?.WebApp
    if (!webApp) {
      setStatus('outside')
      return
    }
    webApp.ready()
    webApp.expand()
    if (!webApp.initData) {
      setStatus('error')
      return
    }
    const base = import.meta.env.VITE_API_BASE_URL
    if (!base) {
      setStatus('unverified')
      return
    }
    fetch(`${base.replace(/\/$/, '')}/api/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ init_data: webApp.initData }),
    }).then(response => {
      if (!response.ok) throw new Error('Telegram initData verification failed')
      setStatus('inside')
    }).catch(() => setStatus('error'))
  }, [])

  if (status === 'checking') return null
  return <span className={`telegram-status ${status}`}>
    {status === 'inside' ? 'TELEGRAM VERIFIED' : status === 'unverified' ? 'TELEGRAM · API NOT SET' : status === 'outside' ? 'WEB PREVIEW' : 'TELEGRAM AUTH ERROR'}
  </span>
}
