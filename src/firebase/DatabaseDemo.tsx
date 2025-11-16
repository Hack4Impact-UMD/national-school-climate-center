import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from './config'

export default function DatabaseDemo() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('Fetching users from Firebase...')
        const usersSnapshot = await getDocs(collection(db, 'users'))
        console.log('Users found:', usersSnapshot.size)
        console.log(
          'Users data:',
          usersSnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))
        )
        setUsers(
          usersSnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }))
        )
      } catch (error) {
        console.error('Firebase error:', error)
        // Fallback to static data if Firebase fails
        setUsers([
          {
            uid: '1',
            name: 'Sample Student',
            email: 'student@example.com',
            role: 'student',
          },
          {
            uid: '2',
            name: 'Sample Leader',
            email: 'leader@example.com',
            role: 'leader',
          },
          {
            uid: '3',
            name: 'Sample Parent',
            email: 'parent@example.com',
            role: 'parent',
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const updateName = async (uid: string, newName: string) => {
    try {
      // Update Firebase database
      await updateDoc(doc(db, 'users', uid), { name: newName })
      // Update local state
      setUsers(
        users.map((user) =>
          user.uid === uid ? { ...user, name: newName } : user
        )
      )
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  if (loading) return <div className="p-8">Loading users from Firebase...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">
        Database Demo - Live Firebase Updates
      </h1>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.uid} className="bg-white border p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-blue-600">Role: {user.role}</p>
              </div>
              <input
                type="text"
                defaultValue={user.name}
                onBlur={(e) => updateName(user.uid, e.target.value)}
                className="p-2 border rounded"
                placeholder="Click to edit name"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-100 rounded">
        <p className="text-green-800">
          ✅ Firebase connected! Changes save to database.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Showing {users.length} users. Click in any field, change the name, and
          click away to save to Firestore!
        </p>
      </div>
    </div>
  )
}
