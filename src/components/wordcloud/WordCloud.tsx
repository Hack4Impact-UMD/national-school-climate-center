// WordCloud2
// A simple word cloud using react-d3-cloud.
// - Scales font size based on each word's value using a linear interpolation
// - Optional rotation strategy: none, random preset angles, or a custom function
// - Container size is controlled by width/height props (no auto-resize)
// import WordCloud from 'react-d3-cloud'
import { WordCloud as ReactWordCloud } from '@isoterik/react-word-cloud'

export type WordCloudDatum = {
  text: string
  value: number
}

export type WordCloudProps = {
  words?: WordCloudDatum[]
  width?: number
  height?: number
}

export default function WordCloud({
  words = [],
  width = 700,
  height = 300,
}: WordCloudProps) {
  console.log(words)

  return (
    // The library renders an SVG to fill this container; control size here.
    <div style={{ width, height }}>
      <ReactWordCloud
        words={words}
        width={width}
        height={height}
      />
    </div>
  )
}
