import * as functions from 'firebase-functions'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    student: 'Student',
    school_personnel: 'School Personnel',
}

export const sendInviteEmail = functions.https.onCall(
    {
        cors: ['http://localhost:5173', '<onboarding@resend.dev>'],
    },
    async (request) => {
        if (!request.auth) {
            throw new functions.https.HttpsError('unauthenticated', 'Must be logged in')
        }

        const { email, role, inviteLink } = request.data

        if (!email || !role || !inviteLink) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields')
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

        if (error) {
            throw new functions.https.HttpsError('internal', error.message)
        }

        return { success: true }
    }
)