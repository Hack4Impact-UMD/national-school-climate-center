import { setGlobalOptions } from 'firebase-functions'
import { r1, r2, r3, r4, r5 } from './data/responses'
import type { WordCloudDatum } from './types/wordcloud'
//const { logger } = require('firebase-functions')
import { onRequest } from 'firebase-functions/https'
import * as sw from 'stopword';
import { initializeApp } from 'firebase-admin/app'
//const { getFirestore } = require('firebase-admin/firestore')

initializeApp()

//req should pass in a survey id, will do that logic later
export const generateWordCloud = onRequest(async (req, res) => {
  const responses = [r1, r2, r3, r4, r5]

  let textParts: string[] = []

  // Loop through each response object
  responses.forEach((response) => {
    // Loop through the answers array inside that response
    response.answers.forEach((answer) => {
      if (answer.value && typeof answer.value === 'string') {
        textParts.push(answer.value)
      }
    })
  })

  // Join them all into one giant string separated by spaces
  const allText = textParts.join(' ')

  const wordCloud = getWordFrequency(allText)
  res.send(wordCloud)
})

function getWordFrequency(text: string): WordCloudDatum[] {
  //  Lowercase and remove punctuation/special characters
  const cleanText = text.toLowerCase().replace(/[^a-zA-Z\s]/g, '')

  // Split into an array of words
  const words = cleanText.split(/\s+/).filter((word) => word.length > 1)

  //  Remove common stopwords (the, a, is, etc.)
  // sw.eng is the English dictionary provided by the library
  const filteredWords = sw.removeStopwords(words, sw.eng)

  // Count occurrences
  const freqMap: Record<string, number> = {}
  filteredWords.forEach((word: string) => {
    freqMap[word] = (freqMap[word] || 0) + 1
  })

  // Transform to WordCloudDatum[]
  return Object.entries(freqMap)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 100) // Return top 100 words for performance
}

setGlobalOptions({ maxInstances: 10 })
