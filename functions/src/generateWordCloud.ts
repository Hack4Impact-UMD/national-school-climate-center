import { Responses } from '../../src/types/survey'
export interface WordCloudDatum {
  text: string
  value: number
}

const STOPWORDS = new Set([
  'the',
  'be',
  'to',
  'of',
  'and',
  'a',
  'in',
  'that',
  'have',
  'it',
  'for',
  'not',
  'on',
  'with',
  'he',
  'she',
  'they',
  'we',
  'you',
  'do',
  'at',
  'this',
  'but',
  'his',
  'her',
  'from',
  'or',
  'an',
  'all',
  'would',
  'there',
  'their',
  'what',
  'so',
  'up',
  'out',
  'if',
  'about',
  'who',
  'get',
  'which',
  'go',
  'me',
  'when',
  'make',
  'can',
  'like',
  'time',
  'no',
  'just',
  'him',
  'know',
  'take',
  'people',
  'into',
  'year',
  'your',
  'good',
  'some',
  'could',
  'them',
  'see',
  'other',
  'than',
  'then',
  'now',
  'look',
  'only',
  'come',
  'its',
  'over',
  'think',
  'also',
  'back',
  'after',
  'use',
  'two',
  'how',
  'our',
  'work',
  'first',
  'well',
  'way',
  'even',
  'new',
  'want',
  'because',
  'any',
  'these',
  'give',
  'day',
  'most',
  'us',
  'was',
  'are',
  'is',
  'has',
  'had',
  'did',
  'will',
  'been',
  'said',
  'were',
  'more',
  'very',
  'my',
  'one',
  'said',
  'each',
  'much',
  'too',
  'really',
  'actually',
  'thing',
  'things',
  'got',
  'get',
  'going',
  'i',
  'im',
  'ive',
  'id',
  'ill',
  'dont',
  'doesnt',
  'didnt',
  'cant',
  'wont',
  'isnt',
  'arent',
  'wasnt',
  'werent',
  'hasnt',
  'havent',
  'hadnt',
])

// Simple Porter Stemmer (handles common English suffixes)
function stem(word: string): string {
  if (word.length <= 3) return word

  // Step 1: Remove common suffixes
  const rules: [RegExp, string][] = [
    [/ational$/, 'ate'],
    [/tional$/, 'tion'],
    [/enci$/, 'ence'],
    [/anci$/, 'ance'],
    [/izer$/, 'ize'],
    [/ising$/, 'ise'],
    [/izing$/, 'ize'],
    [/ising$/, 'ise'],
    [/ness$/, ''],
    [/ment$/, ''],
    [/ful$/, ''],
    [/less$/, ''],
    [/ing$/, ''],
    [/tion$/, 't'],
    [/ed$/, ''],
    [/er$/, ''],
    [/ly$/, ''],
    [/es$/, ''],
    [/s$/, ''],
  ]

  for (const [pattern, replacement] of rules) {
    const stemmed = word.replace(pattern, replacement)
    if (stemmed.length > 2) return stemmed
  }

  return word
}

function tokenize(text: string): string[] {
  return text.match(/\b[a-z]+\b/g) ?? []
}

export function generateWordCloud(responses: Responses[]): WordCloudDatum[] {
  let allText = ''

  responses.forEach((resp) => {
    resp.answers.forEach((answer) => {
      if (
        typeof answer.value === 'string' &&
        answer.value.split(' ').length > 2
      ) {
        allText += ' ' + answer.value
      }
    })
  })

  allText = allText.toLowerCase().replace(/[^\w\s]/g, ' ')


  console.log('All Text', allText)

  let words = tokenize(allText)
  words = words.filter((w) => !STOPWORDS.has(w) && w.length > 2)
  words = words.map(stem)

  const freq: Record<string, number> = {}
  words.forEach((w) => {
    freq[w] = (freq[w] ?? 0) + 1
  })

  const result: WordCloudDatum[] = Object.entries(freq).map(
    ([text, value]) => ({ text, value })
  )
  result.sort((a, b) => b.value - a.value)
  return result.slice(0, 100)
}
