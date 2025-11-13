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
const SAMPLE_ADMIN_UID = 'sample-admin-uid-for-testing'
const SAMPLE_PERSONNEL_UID = 'sample-personnel-uid-for-testing'
const SAMPLE_SUPERADMIN_UID = 'sample-superadmin-uid-for-testing'
const SAMPLE_SURVEY_ID = 'sample-survey-id-for-testing'

/**
 * Creates sample users in the 'users' collection.
 */
async function seedUsers() {
  console.log('Seeding sample users...')

  const usersToCreate: { uid: string; data: Omit<User, 'uid'> }[] = [
    {
      uid: SAMPLE_SUPERADMIN_UID,
      data: {
        email: 'superadmin@example.com',
        name: 'Super Admin',
        role: 'super_admin',
        school_id: 'district-wide',
        district_id: 'all',
        createdAt: Timestamp.now(),
      }
    },
    {
      uid: SAMPLE_ADMIN_UID,
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        school_id: 'sample-school-123',
        district_id: 'sample-district-abc',
        createdAt: Timestamp.now(),
      }
    },
    {
      uid: SAMPLE_PERSONNEL_UID,
      data: {
        email: 'personnel@example.com',
        name: 'School Personnel',
        role: 'school_personnel',
        school_id: 'sample-school-123',
        district_id: 'sample-district-abc',
        createdAt: Timestamp.now(),
      }
    },
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
  ]

  try {
    const batch = writeBatch(db)
    const ref = collection(db, 'users')
    usersToCreate.forEach((user) => {
      batch.set(doc(ref, user.uid), user.data)
    })
    await batch.commit()
    console.log(`✅ Seeded ${usersToCreate.length} users.`)
  } catch (error) {
    console.error('Error seeding users:', error)
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
    school_id: 'sample-school-123',
    district_id: 'sample-district-abc',
    questions: surveyQuestions,
    createdBy: SAMPLE_ADMIN_UID,
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
 * Main function to run all seeding operations.
 */
async function seedDatabase() {
  console.log('--- Starting Database Seed ---')

  // Seed all collections from models.ts
  await seedUsers()
  await seedSurvey()
  await seedResponse()

  console.log('--- Database Seed Finished ---')
}

// Run the seed script
seedDatabase().catch((error) => {
  console.error('Unhandled error in seed script:', error)
  // @ts-ignore
  process.exit(1)
})
