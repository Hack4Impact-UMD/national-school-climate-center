import { useEffect, useRef, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

const LOGOUT = 5 * 60 * 1000
const INTERVAL = 1000
const WRITE_COOLDOWN = 1000
const LAST_ACTIVE = "lastActive"
const LOGOUT_WARNING = 10 * 1000


export function InactiveLogout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const lastWriteTime = useRef(Date.now())
  const [popUp, setPopUp] = useState(false)
  const [countdown, setCountdown] = useState(10)

  const handleLogout = useCallback(() => {
    localStorage.removeItem(LAST_ACTIVE)
    logout()
    navigate("/login")
  }, [navigate, logout])

  const activityStamp = useCallback(() => {
    setPopUp(false)
    setCountdown(LOGOUT_WARNING / 1000)

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
      const timeActive = temp ? Number(temp) : Date.now()
      const timeLeft = LOGOUT - (Date.now() - timeActive)

      if (timeLeft <= 0){
        clearInterval(interval)  
        handleLogout()
        return
      }

      if (timeLeft <= LOGOUT_WARNING) {
        const secondsLeft = Math.ceil(timeLeft / 1000)
        setPopUp(true)
        setCountdown(secondsLeft)
      } else {
        setPopUp(false)
        setCountdown(LOGOUT_WARNING / 1000)
      }
  
      
    }, INTERVAL)

    return () => {
      events.map(e => window.removeEventListener(e, activityStamp))
      clearInterval(interval)
    }
  }, [user, activityStamp, handleLogout])

  return {popUp, countdown}

}