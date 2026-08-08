import { Link, useLocation } from 'react-router-dom'
import { MailCheck } from 'lucide-react'

export function VerifyEmail() {
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email

  return (
    <div className="px-4 pt-8 pb-8 max-w-sm mx-auto text-center">
      <div className="w-14 h-14 rounded-full bg-ember/15 flex items-center justify-center mx-auto mb-4">
        <MailCheck className="w-6 h-6 text-ember" />
      </div>
      <h1 className="font-extrabold text-2xl mb-2">Check your email</h1>
      <p className="text-muted text-sm">
        We sent a confirmation link{email ? <> to <span className="text-ink">{email}</span></> : ''}.
        Tap the link in that email to finish creating your account — you'll be signed in automatically.
      </p>
      <Link to="/login" className="text-ember font-semibold text-sm mt-6 inline-block">
        Back to log in
      </Link>
    </div>
  )
}
