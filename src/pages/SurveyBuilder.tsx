import ExistingSurvey from "@/components/ExistingSurvey";

export default function SurveyBuilder() {
    return (
      <div>
        <img src="/logo.png" alt="National School Climate Center" className="w-40" />
        <h2 className="text-3xl font-body font-bold mb-1">Survey Builder</h2>
        <p className="font-body text-2xl mb-6">
        Create a Survey
      </p>  
      <ExistingSurvey title="Survey 1" description="This survey is about the climate of the school." />
    </div>
  );
}