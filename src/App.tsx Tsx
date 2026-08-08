import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')

  useEffect(() => {
    supabase.auth.getSession().then(({ error }) => {
      setStatus(error ? 'error' : 'connected')
    })
  }, [])

  return (
    <div className="min-h-screen bg-base text-ink flex flex-col items-center justify-center px-6 text-center font-sans">
      <h1 className="text-3xl font-extrabold tracking-tight">
        SL <span className="text-ember">Marketplace</span>
      </h1>
      <p className="mt-3 text-sm text-muted max-w-xs">
        Base project is running.
      </p>
      <span
        className={`mt-4 inline-block rounded-pill px-4 py-1.5 text-sm font-semibold ${
          status === 'connected'
            ? 'bg-success/15 text-success'
            : status === 'error'
            ? 'bg-alert/15 text-alert'
            : 'bg-muted/10 text-muted'
        }`}
      >
        Supabase: {status}
      </span>
    </div>
  )
}

export default App
