import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialEmail = (location.state as { email?: string } | null)?.email ?? ''

  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/profile')
  }

  return (
    <div className="px-4 pt-8 pb-8 max-w-sm mx-auto">
      <h1 className="font-extrabold text-2xl mb-1">Confirm your email</h1>
      <p className="text-muted text-sm mb-6">
        Enter the code we sent to your email to finish creating your account.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold mb-2 block">Email</label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 block">Verification code</label>
          <Input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" inputMode="numeric" />
        </div>

        {error && <p className="text-alert text-sm">{error}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify & continue'}
        </Button>
      </form>
    </div>
  )
}
