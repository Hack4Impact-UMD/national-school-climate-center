// src/pages/AcceptInvite.tsx
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

export default function AcceptInvite() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!token) {
            setError('Invalid invite link.')
            return
        }

        getDoc(doc(db, 'invitations', token)).then((snap) => {
            if (!snap.exists() || snap.data().status !== 'pending') {
                setError('This invite is invalid or has already been used.')
                return
            }

            const role = snap.data().role

            // Redirect to the appropriate create account page with the token
            if (role === 'school_personnel' || role === 'student') {
                navigate(`/create-account/school?token=${token}`)
            } else {
                navigate(`/create-account/nscc?token=${token}`)
            }
        })
    }, [token, navigate])

    if (error) return (
        <main className="min-h-screen flex items-center justify-center">
            <p className="text-red-600">{error}</p>
        </main>
    )

    return (
        <main className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Validating invite...</p>
        </main>
    )
}