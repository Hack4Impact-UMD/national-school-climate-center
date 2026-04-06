// server/index.ts
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Resend } from 'resend'

const app = express()
const resend = new Resend(process.env.RESEND_API_KEY)

app.use(cors({ origin: ['http://localhost:5173', 'https://yourdomain.com'] }))
app.use(express.json())

app.post('/api/invite', async (req, res) => {
    const { email, role, inviteLink } = req.body

    if (!email || !role || !inviteLink) {
        return res.status(400).json({ error: 'Missing required fields' })
    }

    const roleLabels: Record<string, string> = {
        super_admin: 'Super Admin',
        admin: 'Admin',
        student: 'Student',
        school_personnel: 'School Personnel',
    }

    const { error } = await resend.emails.send({
        from: 'Onboarding <onboarding@resend.dev>',
        to: [email],
        subject: "You've been invited!",
        html: `
      <p>You've been invited to join as <strong>${roleLabels[role] ?? role}</strong>.</p>
      <p><a href="${inviteLink}">Click here to accept your invitation</a></p>
      <p>This link will expire in 7 days.</p>
    `,
    })

    if (error) return res.status(500).json({ error: error.message })

    res.json({ success: true })
})

app.listen(3001, () => console.log('Server running on port 3001'))