export function SurveyHeader({ title, subtitle }: { title: string; subtitle?: string }) {
return (
<header>
<h1 className="text-3xl font-body font-semibold tracking-tight">{title}</h1>
{subtitle ? (
<p className="mt-1 text-xl font-body">{subtitle}</p>
) : null}
</header>
);
}