import { useMemo } from "react";
import WordCloud from "react-d3-cloud";

// demonstration file for react-d3-cloud library
// also added a declaration module in the types folder for the library

export type WordCloudDatum = {
  text: string;
  value: number;
};

export type WordCloud2Props = {
  words?: WordCloudDatum[];
  width?: number;
  height?: number;
  minFontSize?: number;
  maxFontSize?: number;
  padding?: number;
  rotate?: "none" | "random" | ((word: WordCloudDatum, index: number) => number);
};

// the default values for the text dictate the size of each word.. this can be changed through the fontSizeMapper prop
const DEFAULT_WORDS: WordCloudDatum[] = [
  { text: "school", value: 1020 },
  { text: "climate", value: 900 },
  { text: "student", value: 840 },
  { text: "community", value: 720 },
  { text: "safety", value: 660 },
  { text: "support", value: 600 },
  { text: "engagement", value: 540 },
  { text: "respect", value: 480 },
  { text: "inclusion", value: 660 },
  { text: "belonging", value: 630 },
  { text: "equity", value: 600 },
  { text: "trust", value: 570 },
  { text: "wellbeing", value: 540 },
  { text: "learning", value: 690 },
  { text: "achievement", value: 510 },
  { text: "teacher", value: 480 },
  { text: "family", value: 450 },
  { text: "collaboration", value: 450 },
  { text: "communication", value: 420 },
  { text: "diversity", value: 420 },
  { text: "motivation", value: 390 },
  { text: "connection", value: 390 },
  { text: "wellness", value: 390 },
  { text: "resources", value: 390 },
  { text: "feedback", value: 360 },
  { text: "fairness", value: 360 },
  { text: "bullying", value: 360 },
  { text: "attendance", value: 330 },
  { text: "involvement", value: 330 },
];

export default function WordCloud2({
  words = DEFAULT_WORDS,
  width = 700,
  height = 300,
  minFontSize = 16,
  maxFontSize = 29,
  padding = 2,
  rotate = "random",
}: WordCloud2Props) {
  const [minVal, maxVal] = useMemo<[number, number]>(() => {
    if (!words.length) return [0, 0];
    let min = words[0].value;
    let max = words[0].value;
    for (const w of words) {
      if (w.value < min) min = w.value;
      if (w.value > max) max = w.value;
    }
    return [min, max];
  }, [words]);

  const fontSize = useMemo<((word: WordCloudDatum) => number)>(() => {
    if (maxVal === minVal) {
      const mid = Math.round((minFontSize + maxFontSize) / 2);
      return () => mid;
    }
    const range = maxVal - minVal;
    return (word: WordCloudDatum) => {
      const t = (word.value - minVal) / range;
      return Math.round(minFontSize + t * (maxFontSize - minFontSize));
    };
  }, [minVal, maxVal, minFontSize, maxFontSize]);

  const rotateMapper = useMemo<((word: WordCloudDatum, index: number) => number)>(() => {
    if (typeof rotate === "function") return rotate;
    if (rotate === "none") return () => 0;
    const angles = [-90, -60, -30, 0, 30, 60, 90];
    return () => angles[Math.floor(Math.random() * angles.length)];
  }, [rotate]);

  return (
    <div style={{ width, height }}>
      <WordCloud
        data={words}
        width={width}
        height={height}
        padding={padding}
        font="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        fontSize={fontSize}
        rotate={rotateMapper}
        spiral="archimedean"
      />
    </div>
  );
}