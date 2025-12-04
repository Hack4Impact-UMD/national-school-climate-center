import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/contexts/AuthContext";
import type { Question } from "@/types/surveybuilder";
import { Button } from "@/components/ui/button";
import { SurveyHeader } from "@/components/survey/SurveyHeader";

type LocationState = {
  questions: Question[];
  surveyTitle?: string;
  surveyType?: "challenge" | "pulse";
};

export default function ReviewSurveyPage({
  defaultSurveyType,
}: {
  defaultSurveyType?: "challenge" | "pulse";
}) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();

  const { questions = [], surveyTitle, surveyType } = (state || {}) as LocationState;

  const [publishing, setPublishing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const effectiveSurveyType = surveyType ?? defaultSurveyType ?? "challenge";
  const effectiveTitle =
    surveyTitle ?? (effectiveSurveyType === "pulse" ? "Pulse Survey" : "Challenge Survey");

  async function handlePublish() {
    if (!questions.length) {
      setError("There are no questions to publish.");
      return;
    }

    setPublishing(true);
    setError(null);

    try {
      const questionDocs = questions.map((q) => ({
        question_id: q.id,
        text: q.prompt || q.name,
        questionType: q.questionType,
      }));

      const docRef = await addDoc(collection(db, "surveys"), {
        title: effectiveTitle,
        type: effectiveSurveyType,
        questions: questionDocs,
        createdBy: user?.uid ?? null,
        createdAt: serverTimestamp(),
        status: "published",
      });

      const url = `${window.location.origin}/surveys/respond/${docRef.id}`;
      setShareLink(url);

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).catch(() => {});
      }
    } catch (err) {
      console.error(err);
      setError("Failed to publish survey. Please try again.");
    } finally {
      setPublishing(false);
    }
  }

  function handleEdit() {
    const targetPath =
      effectiveSurveyType === "pulse"
        ? "/surveys/create/pulse"
        : "/surveys/create/challenge";

    navigate(targetPath, {
      state: {
        questions,
        surveyTitle: effectiveTitle,
        surveyType: effectiveSurveyType,
        activeTab: "question",
      },
    });
  }

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <SurveyHeader title={effectiveTitle} subtitle="Name of School/District" />
        <p className="mt-6 font-body text-body text-left">
          No survey questions found. Please return to the builder.
        </p>
        <Button className="mt-4 cursor-pointer" onClick={() => navigate(-1)}>
          Back to Builder
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <img src="/logo.png" alt="National School Climate Center" className="w-40" />
      <SurveyHeader title={effectiveTitle} subtitle="Name of School/District" />

      <div className="mt-4 border-b border-secondary">
        <button
          type="button"
          className="mr-6 pb-2 font-body text-base text-secondary cursor-pointer"
        >
          Review
        </button>
        <button
          type="button"
          className="pb-2 font-body text-base text-body cursor-pointer"
          onClick={handleEdit}
        >
          Edit
        </button>
      </div>

      <div className="mt-8 space-y-10 text-left">
        {questions.map((q, idx) => (
          <div key={q.id} className="space-y-4">
            <p className="font-body">
              Question {idx + 1}
            </p>

            <div className="border border-primary rounded-sm px-4 py-3 bg-white text-sm leading-snug">
              {(q.prompt || q.name) || "Question Question\nQuestion Question"}
            </div>

            {q.questionType === "multiple-choice" && (
                <div className="space-y-1">
                  <div className="text-sm font-semibold">Choices</div>
                  <ul className="space-y-1 text-sm">
                    {q.options.map((opt, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full border" />
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        ))}

        <div className="mt-6 flex flex-col items-start gap-3">
          <Button
            className="px-6 cursor-pointer"
            onClick={handlePublish}
            disabled={publishing}
          >
            {publishing ? "Publishing..." : "Publish Survey"}
          </Button>

          {shareLink && (
            <div className="w-full max-w-xl space-y-1">
              <p className="text-sm font-body text-body">
                Survey published! Share this link with respondents:
              </p>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-md border px-3 py-2 text-sm bg-white"
                  value={shareLink}
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(shareLink)}
                  className="whitespace-nowrap cursor-pointer"
                >
                  Copy Link
                </Button>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 font-body">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
