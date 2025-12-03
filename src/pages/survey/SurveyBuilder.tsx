import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ExistingSurvey from "@/components/survey/ExistingSurvey";
import challengeIcon from "@/assets/survey_builder/challenge.png";
import pulseIcon from "@/assets/survey_builder/pulse.png";
import { useSurveys } from "@/hooks/useSurveys";
import { loadSurveyQuestions } from "@/lib/surveyUtils";

export default function SurveyBuilder() {
  const navigate = useNavigate();
  const { surveys, loading, error } = useSurveys();
  const [duplicating, setDuplicating] = useState(false);

  // Show all surveys for duplication
  const challengeSurveys = surveys;

  const handleDuplicate = async (surveyId: string) => {
    try {
      setDuplicating(true);
      // Load survey questions from Firebase
      const questions = await loadSurveyQuestions(surveyId);

      // Navigate to editor with questions and default to List tab
      navigate('/surveys/create/challenge', {
        state: { questions, defaultTab: 'list' }
      });
    } catch (err) {
      console.error('Error duplicating survey:', err);
      alert('Failed to duplicate survey. Please try again.');
    } finally {
      setDuplicating(false);
    }
  };

    return (
      <div className="mx-auto max-w-6xl p-6">
        <img src="/logo.png" alt="National School Climate Center" className="w-40" />
        <h2 className=" font-semibold font-body text-3xl mb-1">Survey Builder</h2>
        <p className="font-body text-2xl font-normal mb-4">
        Create a Survey
      </p>
      <div className="flex flex-col md:flex-row items-stretch gap-4 mb-5">
        <button
          onClick={() => navigate('/surveys/create/challenge', { state: { defaultTab: 'list' } })}
          className="rounded-2xl border bg-transparent p-6 flex-none w-full md:w-80 md:h-60 min-h-[12rem] hover:bg-muted/40 transition-colors cursor-pointer shadow-md"
        >
          <div className="flex flex-col items-center text-center gap-2">
            <img src={challengeIcon} alt="Challenge Icon" className="w-20 h-20 mb-4 object-contain" />
            <h3 className="text-2xl font-normal font-body text-heading">Challenge</h3>
            <p className="text-sm font-light font-body">An anonymous survey shared widely to gather broad opinions or quick feedback on a specific topic.</p>
          </div>
        </button>

        <div className="rounded-2xl border bg-transparent p-6 flex-none w-full md:w-80 md:h-60 min-h-[12rem] shadow-md">
          <div className="flex flex-col items-center text-center gap-2">
            <img src={pulseIcon} alt="Pulse Icon" className="w-20 h-20 mb-4 object-contain" />
            <h3 className="text-2xl font-normal font-body text-heading">Pulse</h3>
            <p className="text-sm font-light font-body">A focused, recurring survey tailored to specific schools or districts to track trends and insights over time.</p>
          </div>
        </div>
      </div>

      <p className="font-body text-2xl font-normal mb-5">
        Build on a Previous One
      </p>

      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading surveys...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-destructive">Error loading surveys: {error}</p>
        </div>
      )}

      {!loading && !error && challengeSurveys.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No challenge surveys found.</p>
        </div>
      )}

      {!loading && !error && challengeSurveys.length > 0 && (
        <div className="flex flex-col md:flex-row items-start gap-4 mb-5">
          {challengeSurveys.map((survey) => (
            <ExistingSurvey
              key={survey.id}
              title={survey.title}
              description={survey.description}
              onOpen={() => handleDuplicate(survey.id)}
            />
          ))}
        </div>
      )}

      {duplicating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p className="text-lg">Duplicating survey...</p>
          </div>
        </div>
      )}
      
    </div>
  );
}