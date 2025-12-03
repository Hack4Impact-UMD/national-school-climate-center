import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, Phone, Settings, Shield, UserRound } from 'lucide-react'

const SUPPORT_EMAIL = 'support@schoolclimate.org'
const SUPPORT_PHONE = '(212) 555-0149'

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-12 bg-white min-h-screen">
      <header className="mb-10">
        <h1 className="font-heading text-4xl font-bold text-heading mb-3">
          Contact Us
        </h1>
        <p className="font-body text-body max-w-3xl">
          Reach out to the National School Climate Center team for account help, survey questions, or general support.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-heading mb-4">
          Contact Information
        </h2>
        <div className="space-y-3">
          <ContactRow icon={<Mail className="w-5 h-5 text-primary" />} label="Email" value={SUPPORT_EMAIL} />
          <ContactRow icon={<Phone className="w-5 h-5 text-primary" />} label="Phone" value={SUPPORT_PHONE} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-heading text-2xl font-semibold text-heading mb-2">
          Need Help?
        </h2>
        <p className="font-body text-body mb-6">
          Explore quick resources or get in touch and we&apos;ll point you in the right direction.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ResourceCard
            to="/home"
            title="Getting Started"
            description="Learn how to create and share surveys."
            icon={<ArrowRight className="w-5 h-5 text-primary" />}
          />
          <ResourceCard
            to="/general"
            title="Account Settings"
            description="Manage organization details and access."
            icon={<Settings className="w-5 h-5 text-primary" />}
          />
          <ResourceCard
            to="/about"
            title="Privacy & Security"
            description="Understand how we protect your data."
            icon={<Shield className="w-5 h-5 text-primary" />}
          />
        </div>
      </section>

      <section className="border border-border rounded-xl p-6 bg-background/60">
        <div className="flex items-center gap-3 mb-2">
          <UserRound className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-xl font-semibold text-heading">Our Commitment</h3>
        </div>
        <p className="font-body text-body">
          We aim to respond within one business day. Please avoid sharing student names or sensitive information in your initial message.
        </p>
      </section>
    </div>
  )
}

type ContactRowProps = {
  icon: ReactNode
  label: string
  value: string
}

function ContactRow({ icon, label, value }: ContactRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
        {icon}
      </div>
      <div>
        <p className="font-heading text-sm text-body">{label}</p>
        <p className="font-body text-heading">{value}</p>
      </div>
    </div>
  )
}

type ResourceCardProps = {
  to: string
  title: string
  description: string
  icon: ReactNode
}

function ResourceCard({ to, title, description, icon }: ResourceCardProps) {
  return (
    <Link
      to={to}
      className="flex flex-col gap-3 border border-border rounded-xl p-5 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          {icon}
          <span className="font-heading text-heading">{title}</span>
        </div>
        <ArrowRight className="w-4 h-4 text-body" />
      </div>
      <p className="font-body text-body text-sm">{description}</p>
    </Link>
  )
}
