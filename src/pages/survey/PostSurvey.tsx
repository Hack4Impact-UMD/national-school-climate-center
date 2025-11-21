import React from 'react';


// Define the component's props
interface SurveyCompletionPageProps {
  surveyName: string; // e.g., "School Climate Survey"
}

const SurveyCompletionPage: React.FC<SurveyCompletionPageProps> = ({
  surveyName,
}) => {
    
  // Placeholder for the contact information line
  const contactEmail = '[insert contact/email]';
  const schoolName = 'School Name/District';

  return (
    <div className="survey-completion-page min-h-screen bg-white text-[#444444]">
      {/* --- Top Header (Logo and Survey Info) --- */}
      <header className="mx-auto max-w-6xl p-6">
        <img src="/logo.png" alt="National School Climate Center" className="w-40 h-auto" />
        <h1 className="mt-2 text-[28px] leading-8 font-semibold text-[#2F6CC0]">{surveyName}</h1>
        <p className="mt-1 text-lg text-[#444444]">{schoolName}</p>
      </header>

      {/* --- Main Thank You Message Block --- */}
      <main className="mx-auto max-w-3xl px-6 py-8 space-y-4 text-center">
        <h2 className="text-lg font-semibold text-[#2F6CC0]">
          Thanks for completing the survey!
        </h2>
        
        <p className="text-sm leading-relaxed">
          Your answers are anonymous, we won't know who said what, so please don't worry about that.
        </p>
        
        <p className="text-sm leading-relaxed">
          If you have any questions or want to talk about anything from the survey or about your school climate, you can reach out to us anytime at {contactEmail}.
        </p>
      </main>

      {/* The backend notes are for internal development, not part of the rendered page, so we omit them here. */}
    </div>
  );
};

export default SurveyCompletionPage;