/*
 script populating the database with initial data for all collections defined in 'interfaces.ts'.
 */

import {
  collection,
  addDoc,
  setDoc,
  doc,
  writeBatch,
  Timestamp,
} from 'firebase/firestore'
import type {
  User,
  QuestionBankItem,
  Survey,
  Question,
  Response,
  Answer,
  ConsentGrant,
  Mail,
} from './interfaces'
import { db } from './seed-config'

const SAMPLE_STUDENT_UID = 'sample-student-uid-for-testing'
const SAMPLE_LEADER_UID = 'sample-leader-uid-for-testing'
const SAMPLE_SURVEY_ID = 'sample-survey-id-for-testing'

/**
 * Creates sample users in the 'users' collection.
 */
async function seedUsers() {
  console.log('Seeding sample users...')

  const usersToCreate: { uid: string; data: Omit<User, 'uid'> }[] = [
    {
      uid: SAMPLE_STUDENT_UID,
      data: {
        email: 'student@example.com',
        name: 'Sample Student',
        role: 'student',
        school_id: 'sample-school-123',
        district_id: 'sample-district-abc',
        createdAt: Timestamp.now(),
      },
    },
    {
      uid: SAMPLE_LEADER_UID,
      data: {
        email: 'leader@example.com',
        name: 'Sample Leader',
        role: 'leader',
        school_id: 'sample-school-123',
        district_id: 'sample-district-abc',
        createdAt: Timestamp.now(),
      },
    },
    {
      uid: 'sample-parent-uid-for-testing',
      data: {
        email: 'parent@example.com',
        name: 'Sample Parent',
        role: 'parent',
        school_id: 'sample-school-123',
        district_id: 'sample-district-abc',
        createdAt: Timestamp.now(),
      },
    },
  ]

  try {
    const batch = writeBatch(db)
    const collectionRef = collection(db, 'users')

    usersToCreate.forEach((user) => {
      const docRef = doc(collectionRef, user.uid)
      batch.set(docRef, user.data)
    })

    await batch.commit()
    console.log(`✅ Seeded ${usersToCreate.length} users.`)
  } catch (error) {
    console.error('Error seeding users:', error)
  }
}

/**
 * Adds initial questions to the 'questionBank' collection.
 */
async function seedQuestionBank() {
  console.log('Seeding question bank...')
  const questions: Omit<QuestionBankItem, 'id' | 'validation'>[] = [
    {
      text: 'How satisfied are you with the school environment?',
      domain: 'school-climate',
      type: 'rating-5',
      options: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
    {
      text: 'Do you feel safe at school?',
      domain: 'safety',
      type: 'multiple-choice',
      options: ['Yes', 'No', 'Sometimes'],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  ]

  try {
    const batch = writeBatch(db)
    const collectionRef = collection(db, 'questionBank')

    questions.forEach((q) => {
      const docRef = doc(collectionRef) // Auto-generate ID
      batch.set(docRef, q)
    })

    await batch.commit()
    console.log(`✅ Seeded ${questions.length} questions to questionBank.`)
  } catch (error) {
    console.error('Error seeding question bank:', error)
  }
}

/**
 * Creates a sample survey in the 'surveys' collection.
 */
async function seedSurvey() {
  console.log('Seeding sample survey...')

  const surveyQuestions: Question[] = [
    {
      question_id: 'q1_satisfaction',
      order: 1,
      required: true,
      text: 'How satisfied are you with the school environment?',
    },
    {
      question_id: 'q2_safety',
      order: 2,
      required: true,
      text: 'Do you feel safe at school?',
    },
  ]

  const newSurvey: Omit<Survey, 'id'> = {
    title: 'Sample School Climate Survey',
    description: 'A sample survey created by the seed script.',
    type: 'school-climate',
    status: 'published',
    visibility: 'public',
    school_id: 'all-schools',
    district_id: 'all-districts',
    questions: surveyQuestions,
    createdBy: 'system-seed-script',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  try {
    // Use setDoc with a predictable ID so other functions can reference it
    const surveyRef = doc(db, 'surveys', SAMPLE_SURVEY_ID)
    await setDoc(surveyRef, newSurvey)
    console.log(`✅ Seeded draft survey with ID: ${SAMPLE_SURVEY_ID}`)
  } catch (error) {
    console.error('Error seeding draft survey:', error)
  }
}

/**
 * Creates a sample response in the 'responses' collection.
 */
async function seedResponse() {
  console.log('Seeding sample response...')

  const sampleAnswers: Answer[] = [
    { question_id: 'q1_satisfaction', value: 4 }, // Assuming 4 out of 5
    { question_id: 'q2_safety', value: 'Sometimes' },
  ]

  const newResponse: Omit<Response, 'id'> = {
    survey_id: SAMPLE_SURVEY_ID,
    surveyTitle: 'Sample School Climate Survey',
    uid: SAMPLE_STUDENT_UID,
    school_id: 'sample-school-123',
    district_id: 'sample-district-abc',
    answers: sampleAnswers,
    submittedAt: Timestamp.now(),
  }

  try {
    const docRef = await addDoc(collection(db, 'responses'), newResponse)
    console.log(`✅ Seeded sample response with ID: ${docRef.id}`)
  } catch (error) {
    console.error('Error seeding sample response:', error)
  }
}

/**
 * Creates a sample consent grant in the 'consentGrants' collection.
 */
async function seedConsent() {
  console.log('Seeding sample consent grant...')

  // The schema implies the grantId is a composite key
  const grantId = `${SAMPLE_SURVEY_ID}:${SAMPLE_STUDENT_UID}`

  const newGrant: Omit<ConsentGrant, 'grantId'> = {
    surveyId: SAMPLE_SURVEY_ID,
    respondentKey: SAMPLE_STUDENT_UID,
    grantedAt: Timestamp.now(),
  }

  try {
    const grantRef = doc(db, 'consentGrants', grantId)
    await setDoc(grantRef, newGrant)
    console.log(`✅ Seeded sample consent grant with ID: ${grantId}`)
  } catch (error) {
    console.error('Error seeding sample consent grant:', error)
  }
}

/**
 * Creates a sample mail item in the 'mail' collection.
 */
async function seedMail() {
  console.log('Seeding sample mail queue item...')

  const newMail: Omit<Mail, 'id' | 'sentAt'> = {
    to: ['student@example.com'],
    template: {
      name: 'surveyInvite',
      data: {
        surveyName: 'Sample School Climate Survey',
        studentName: 'Sample Student',
      },
    },
    status: 'pending',
    createdAt: Timestamp.now(),
  }

  try {
    const docRef = await addDoc(collection(db, 'mail'), newMail)
    console.log(`✅ Seeded sample mail item with ID: ${docRef.id}`)
  } catch (error) {
    console.error('Error seeding sample mail item:', error)
  }
}

/**
 * Main function to run all seeding operations.
 */
async function seedDatabase() {
  console.log('--- Starting Database Seed ---')

  // Seed all collections from models.ts
  await seedUsers()
  await seedQuestionBank()
  await seedSurvey()
  await seedResponse()
  await seedConsent()
  await seedMail()

  console.log('--- Database Seed Finished ---')
}

// Run the seed script
seedDatabase().catch((error) => {
  console.error('Unhandled error in seed script:', error)
  // @ts-ignore
  process.exit(1)
})
