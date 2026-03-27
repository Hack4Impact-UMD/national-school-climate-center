import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase/config"
import { Button } from "@/components/ui/button"

type Survey = {
  title?: string
  school_name?: string
}

export default function SurveyLandingPage() {
  const { surveyId } = useParams()
  const navigate = useNavigate()

  const [survey, setSurvey] = useState<Survey | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSurvey() {
      if (!surveyId) return

      try{
        const docRef = doc(db, "surveys", surveyId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()){
          setSurvey(docSnap.data() as Survey)
        } else {
          console.error("Survey not found")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSurvey()
  }, [surveyId])

  const handleStart = () => {
    navigate(`/surveys/take/${surveyId}`)
  }

  if(loading){
    return <div className="p-6">Loading survey...</div>
  }

  if(!survey){
    return <div className="p-6">Survey not found.</div>
  }

  return(
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        <img
          src="/logo.png"
          alt="National School Climate Center"
          className="w-40"
        />

        <h1 className="text-4xl text-primary font-semibold">
          School Climate Survey
        </h1>

        <p className="text-lg text-gray-600 mt-1">
          {survey.school_name || "School Name/District"}
        </p>

        <div className="mt-8 text-sm text-gray-500">
          <p>Quick Info</p>
          <p>Anonymous</p>
        </div>
      </div>

      <div className="flex justify-center items-center mt-20">
        <Button
          onClick={handleStart}
          className="px-6 py-3 text-lg"
        >
          Start Survey
        </Button>
      </div>
    </div>
  )
}