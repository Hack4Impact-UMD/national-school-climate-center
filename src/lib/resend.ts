// lib/resend.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInviteEmail(
    email: string,
    role: string,
    inviteLink: string
) {
    const { error } = await resend.emails.send({
        from: 'Onboarding <onboarding@resend.dev>',
        to: [email],
        subject: "You've been invited!",
        html: `
      <p>You've been invited to join as <strong>${role}</strong>.</p>
      <p><a href="${inviteLink}">Click here to accept your invitation</a></p>
      <p>This link will expire in 7 days.</p>
    `,
    })

    if (error) throw new Error(error.message)
}