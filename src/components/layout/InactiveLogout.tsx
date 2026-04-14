import { useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

const LOGOUT = 5 * 60 * 1000
const INTERVAL = 2 * 1000
const WRITE_COOLDOWN = 1000
const LAST_ACTIVE = "lastActive"


export function InactiveLogout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const lastWriteTime = useRef(0)

  const handleLogout = useCallback(() => {
    localStorage.removeItem(LAST_ACTIVE)
    logout()
    navigate("/login")
  }, [navigate, logout])

  const activityStamp = useCallback(() => {
    if (!user) return
    const now = Date.now()
    if (now - lastWriteTime.current < WRITE_COOLDOWN) return
    lastWriteTime.current = now
    localStorage.setItem(LAST_ACTIVE, now.toString())
  }, [user])

  useEffect(() => {
    if (!user) return
    const now = Date.now()
    lastWriteTime.current = now
    localStorage.setItem(LAST_ACTIVE, now.toString())

    const events = ["mousemove", "scroll", "keydown", "touchstart", "click"]
    events.map(e => window.addEventListener(e, activityStamp))

    const interval = setInterval(() => {
      const temp = localStorage.getItem(LAST_ACTIVE)
      const timeInactive = Date.now() - (temp ? Number(temp) : 0)

      if (timeInactive > LOGOUT) {
        handleLogout()
      }
    }, INTERVAL)

    return () => {
      events.map(e => window.removeEventListener(e, activityStamp))
      clearInterval(interval)
    }
  }, [user, activityStamp, handleLogout])
}