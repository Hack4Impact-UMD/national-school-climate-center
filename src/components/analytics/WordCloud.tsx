import { useWordCloud } from '@/hooks/useWordCloud'
import { WordCloud as ReactWordCloud } from '@isoterik/react-word-cloud'

type ResponseRecord = {
  answerValue: string
  questionType: string | null
}

export type WordCloudProps = {
  responses: ResponseRecord[]
  width?: number
  height?: number
}

export const WordCloud = ({ responses, width, height }: WordCloudProps) => {
  const wordCloud = useWordCloud(responses)

  if (!wordCloud.length) return <div>No text responses found.</div>

  const maxValue = Math.max(...wordCloud.map((word) => word.value))
  const Cloud = ReactWordCloud as any

  return (
    <Cloud
      words={wordCloud}
      width={width}
      height={height}
      fontSize={(word: { value: number }) =>
        (Math.sqrt(word.value) / Math.sqrt(maxValue)) * 15 + 15
      }
    />
  )
}
