// WordCloud1
// A self-contained example using @visx/wordcloud rendered inside SVG.
// - Uses a log scale to map word frequency -> font size
// - Optional rotation toggled via a checkbox
// - Tailwind handles layout/styling (no styled-jsx)
// - Data source: simple frequency map from a text fixture (Toto - Africa)
import { useState } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import { totoAfricaLyrics } from './text.fixture';

// Public props for the demo component
interface ExampleProps {
  width: number;
  height: number;
  showControls?: boolean;
}

// Shape of each word datum
export interface WordData {
  text: string;
  value: number;
}

// A small palette to color words; rotates through by index
const colors = ['#143059', '#2F6B9A', '#82a6c2'];

// Convert a block of text into [{ text, value }] by counting words.
// Very simple tokenization for demo purposes.
function wordFreq(text: string): WordData[] {
  const words: string[] = text.replace(/\./g, '').split(/\s/);
  const freqMap: Record<string, number> = {};

  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0;
    freqMap[w] += 1;
  }
  return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }));
}

// Provide a small random rotation (± up to ~60°) when enabled
function getRotationDegree() {
  const rand = Math.random();
  const degree = rand > 0.5 ? 60 : -60;
  return rand * degree;
}

// Build the words array once from the lyrics
const words = wordFreq(totoAfricaLyrics);

// Log scale gives nicer distribution across large frequency ranges
const fontScale = scaleLog({
  domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
  range: [10, 100],
});
const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

// Fix the random seed so layout is stable between renders
const fixedValueGenerator = () => 0.5;

type SpiralType = 'archimedean' | 'rectangular';

// Example word cloud with optional UI controls (spiral + rotation)
export default function Example({ width, height, showControls }: ExampleProps) {
  const [spiralType, setSpiralType] = useState<SpiralType>('archimedean');
  const [withRotation, setWithRotation] = useState(false);

  return (
    <div className="flex flex-col select-none">
      {/* Word cloud SVG container */}
      <div className="my-4 cursor-pointer">
        <Wordcloud
          words={words}
          width={width}
          height={height}
          fontSize={fontSizeSetter}
          font={'Impact'}
          padding={2}
          spiral={spiralType}
          rotate={withRotation ? getRotationDegree : 0}
          random={fixedValueGenerator}
        >
          {/* Render-prop: map positioned words to <Text> elements */}
          {(cloudWords) =>
            cloudWords.map((w, i) => (
              <Text
                key={w.text}
                fill={colors[i % colors.length]}
                textAnchor={'middle'}
                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={w.font}
              >
                {w.text}
              </Text>
            ))
          }
        </Wordcloud>
      </div>
      {showControls && (
        <div>
          {/* Spiral selector */}
          <label className="inline-flex items-center text-sm mr-2">
            Spiral type &nbsp;
            <select
              onChange={(e) => setSpiralType(e.target.value as SpiralType)}
              value={spiralType}
            >
              <option key={'archimedean'} value={'archimedean'}>
                archimedean
              </option>
              <option key={'rectangular'} value={'rectangular'}>
                rectangular
              </option>
            </select>
          </label>
          {/* Toggle rotation on/off */}
          <label className="inline-flex items-center text-sm mr-2">
            With rotation &nbsp;
            <input
              type="checkbox"
              checked={withRotation}
              onChange={() => setWithRotation(!withRotation)}
            />
          </label>
          <br />
        </div>
      )}
    </div>
  );
}
