import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";


export default function QuestionSetting({
label,
options,
value,
onChange,
}: {
label: string;
options: string[];
value?: string;
onChange?: (v: string) => void;
}) {
const [internal, setInternal] = useState<string>(value ?? options[0] ?? "");
const selected = value ?? internal;


function handleChange(v: string) {
if (onChange) onChange(v);
else setInternal(v);
}


return (
<div className="grid gap-2">
<Label>{label}</Label>
<RadioGroup value={selected} onValueChange={handleChange} className="flex flex-wrap gap-4">
{options.map((opt) => (
<div key={opt} className="flex items-center gap-2">
<RadioGroupItem id={`${label}-${opt}`} value={opt} />
<Label htmlFor={`${label}-${opt}`} className="text-sm">
{opt}
</Label>
</div>
))}
</RadioGroup>
</div>
);
}