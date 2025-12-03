import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, Phone, Settings, Shield, User } from 'lucide-react'

const SUPPORT_EMAIL = 'nscc@gmail.com'
const SUPPORT_PHONE = '123-456-789'

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 md:py-12 bg-white min-h-screen">
      <header className="mb-12">
        <h1 className="font-heading text-4xl font-bold text-heading mb-4">
          Contact Us
        </h1>
      </header>

      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
          Contact Information
        </h2>
        <div className="space-y-3 font-body text-body">
          <ContactRow icon={<Mail className="w-5 h-5 text-primary" />} value={SUPPORT_EMAIL} />
          <ContactRow icon={<Phone className="w-5 h-5 text-primary" />} value={SUPPORT_PHONE} />
        </div>
      </section>

      <section>
        <h2 className="font-heading text-2xl font-semibold text-primary mb-2">
          Need Help?
        </h2>
        <p className="font-body text-body mb-6">
          Look at our resources for support.
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
            description="Manage your accounting information."
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
    </div>
  )
}

type ContactRowProps = {
  to: string
  title: string
  description: string
  icon: ReactNode
}

function ResourceCard({ to, title, description, icon }: ResourceCardProps) {
  return (
    <Link
      to={to}
      className="flex flex-col gap-2 border border-primary rounded-xl p-5 bg-white hover:-translate-y-0.5 hover:shadow-md transition"
    >
      <div className="flex items-center gap-3 text-primary">
        {icon}
        <span className="font-heading text-heading">{title}</span>
      </div>
      <p className="font-body text-body text-sm">{description}</p>
    </Link>
  )
}

function ContactRow({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-body text-heading">{value}</span>
    </div>
  )
}
