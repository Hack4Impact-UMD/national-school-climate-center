import { useMemo } from 'react'
import * as sw from 'stopword'

type WordCloudDatum = {
  text: string
  value: number
}

type ResponseRecord = {
  answerValue: string
  questionType: string | null
}

function getWordFrequency(text: string): WordCloudDatum[] {
  const cleanText = text.toLowerCase().replace(/[^a-zA-Z\s]/g, '')
  const words = cleanText.split(/\s+/).filter((word) => word.length > 1)
  const filteredWords = sw.removeStopwords(words, sw.eng)

  const freqMap: Record<string, number> = {}
  filteredWords.forEach((word: string) => {
    freqMap[word] = (freqMap[word] || 0) + 1
  })

  return Object.entries(freqMap)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 100)
}

export function useWordCloud(responses: ResponseRecord[]): WordCloudDatum[] {
  return useMemo(() => {
    const textParts = responses.map((r) => r.answerValue).filter(Boolean)
    return getWordFrequency(textParts.join(' '))
  }, [responses])
}
