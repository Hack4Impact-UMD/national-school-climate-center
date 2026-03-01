import { setGlobalOptions } from 'firebase-functions'
import { onRequest } from 'firebase-functions/https'
import * as logger from 'firebase-functions/logger'
import * as admin from 'firebase-admin'
import { generateWordCloud } from './generateWordCloud'
import { Responses } from '../../src/types/survey'

setGlobalOptions({ maxInstances: 10 })

admin.initializeApp()

export const getWordCloud = onRequest(async (req, res) => {
  try {
    const responsesSnap = await admin
      .firestore()
      .collectionGroup('responses')
      .get()


    const responses: Responses[] = responsesSnap.docs.map(
      (doc) => doc.data() as Responses
    )
    const result = generateWordCloud(responses)

    res.json(result)
  } catch (err) {
    logger.error('WordCloud Error:', err)
    res.status(500).json({ error: 'Failed to generate word cloud' })
  }
})
