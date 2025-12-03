import { FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  LifeBuoy,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react'

const SUPPORT_EMAIL = 'support@schoolclimate.org'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('account')
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(
      `${topic ? `${topic} support` : 'Support request'}`
    )
    const body = encodeURIComponent(
      `Name: ${name || 'N/A'}\nEmail: ${email || 'N/A'}\nTopic: ${
        topic || 'general'
      }\n\n${message}`
    )
    return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
  }, [email, message, name, topic])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name || !email || !message) {
      setFormError('Name, email, and message are required.')
      return
    }

    setFormError('')
    window.location.href = mailtoHref
  }

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto bg-white min-h-screen">
      <div className="flex flex-col gap-4 mb-10">
        <p className="inline-flex items-center gap-2 text-sm font-heading text-primary uppercase tracking-wide">
          <LifeBuoy className="w-4 h-4" />
          Support
        </p>
        <h1 className="font-heading text-4xl font-bold text-heading">
          Contact the NSCC team
        </h1>
        <p className="font-body text-body max-w-3xl">
          Have a question about your account, surveys, or data? Send us a note
          and we’ll get back to you within one business day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 border border-border rounded-2xl p-6 shadow-sm bg-background/40">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-heading text-lg text-heading">Email support</p>
                <p className="font-body text-sm text-muted-foreground">
                  {SUPPORT_EMAIL} · Weekdays 9am–6pm ET
                </p>
              </div>
            </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-heading text-heading">Name*</span>
                <input
                  className="border border-border rounded-lg px-3 py-2 font-body focus:outline-none focus:ring-2 focus:ring-primary/40"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-heading text-heading">
                  Work email*
                </span>
                <input
                  className="border border-border rounded-lg px-3 py-2 font-body focus:outline-none focus:ring-2 focus:ring-primary/40"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@school.edu"
                  required
                />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-heading text-heading">
                Topic (optional)
              </span>
              <select
                className="border border-border rounded-lg px-3 py-2 font-body focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
              >
                <option value="account">Account access</option>
                <option value="survey">Survey setup</option>
                <option value="data">Data and reporting</option>
                <option value="feedback">Share feedback</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-heading text-heading">
                How can we help?*
              </span>
              <textarea
                className="border border-border rounded-lg px-3 py-2 font-body min-h-[140px] resize-vertical focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Include any relevant details or links."
                required
              />
            </label>

            {formError && (
              <p className="text-sm text-destructive font-body">{formError}</p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-heading shadow-sm hover:shadow-md transition"
              >
                Send message
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs font-body text-muted-foreground">
                Submitting opens your email client so you can keep a copy.
              </p>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <div className="border border-border rounded-2xl p-5 shadow-sm bg-background/60">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-5 h-5 text-primary" />
              <p className="font-heading text-lg text-heading">Talk with us</p>
            </div>
            <p className="font-body text-body">
              For urgent issues, include your phone number in the form and a team
              member will call you back.
            </p>
          </div>

          <div className="border border-border rounded-2xl p-5 shadow-sm bg-background/60 space-y-4">
            <div className="flex items-center gap-3">
              <UserRound className="w-5 h-5 text-primary" />
              <div>
                <p className="font-heading text-lg text-heading">
                  Quick resources
                </p>
                <p className="font-body text-sm text-muted-foreground">
                  Common account and setup links
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <ResourceLink
                title="Getting started"
                description="Review the onboarding checklist."
                to="/home"
              />
              <ResourceLink
                title="Account settings"
                description="Update org details and permissions."
                to="/general"
              />
              <ResourceLink
                title="Privacy and security"
                description="Learn how we handle student data."
                to="/about"
              />
            </div>
          </div>

          <div className="border border-border rounded-2xl p-5 shadow-sm bg-background/60 space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <p className="font-heading text-lg text-heading">Data safety</p>
            </div>
            <p className="font-body text-sm text-muted-foreground">
              Please avoid sharing student names or identifiable information in
              your message. We’ll ask for details if needed once you’re speaking
              with a support specialist.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

type ResourceLinkProps = {
  title: string
  description: string
  to: string
}

function ResourceLink({ title, description, to }: ResourceLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-start gap-3 group border border-border rounded-xl p-3 hover:border-primary hover:shadow-sm transition"
    >
      <ArrowRight className="w-4 h-4 mt-1 text-muted-foreground group-hover:text-primary" />
      <div>
        <p className="font-heading text-heading group-hover:text-primary">
          {title}
        </p>
        <p className="font-body text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}
