import ExistingSurvey from "@/components/ExistingSurvey";
import challengeIcon from "@/assets/survey_builder/challenge.png";
import pulseIcon from "@/assets/survey_builder/pulse.png";

export default function SurveyBuilder() {
    return (
      <div className="ml-6">
        <img src="/logo.png" alt="National School Climate Center" className="w-40" />
        <h2 className=" font-semibold font-body text-3xl mb-1">Survey Builder</h2>
        <p className="font-body text-2xl font-normal mb-4">
        Create a Survey
      </p>  
      <div className="flex flex-col md:flex-row items-stretch gap-4 mb-5">
        <div className="rounded-md border bg-transparent p-6 flex-none w-full md:w-80 md:h-60 min-h-[12rem]">
          <div className="flex flex-col items-center text-center gap-2">
            <img src={challengeIcon} alt="Challenge Icon" className="w-20 h-20 mb-4 object-contain" />
            <h3 className="text-2xl font-normal font-body text-heading">Challenge</h3>
            <p className="text-sm font-light font-body">An anonymous survey shared widely to gather broad opinions or quick feedback on a specific topic.</p>
          </div>
        </div>

        <div className="rounded-md border bg-transparent p-6 flex-none w-full md:w-80 md:h-60 min-h-[12rem]">
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
      <div className="flex flex-col md:flex-row items-stretch gap-4 mb-5">
        <ExistingSurvey title="Survey 1" description="This survey is about the climate of the school." />
      <ExistingSurvey title="Survey 2" description="This survey is about the climate of the school." />
      </div>
      
    </div>
  );
}