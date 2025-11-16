/*
 script populating the database with initial data for all collections defined in 'interfaces.ts'.
 */

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
import { db } from './admin-seed-config'
import { FieldValue } from 'firebase-admin/firestore'

const SAMPLE_STUDENT_UID = 'sample-student-uid-for-testing'
const SAMPLE_LEADER_UID = 'sample-leader-uid-for-testing'
const SAMPLE_ADMIN_UID = 'sample-admin-uid-for-testing'
const SAMPLE_SUPER_ADMIN_UID = 'sample-super-admin-uid-for-testing'
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
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      uid: SAMPLE_LEADER_UID,
      data: {
        email: 'leader@example.com',
        name: 'Sample Leader',
        role: 'school_personnel',
        school_id: 'sample-school-123',
        district_id: 'sample-district-abc',
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      uid: SAMPLE_ADMIN_UID,
      data: {
        email: 'admint@example.com',
        name: 'Sample Admin',
        role: 'admin',
        school_id: 'all-schools',
        district_id: 'all-districts',
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      uid: SAMPLE_SUPER_ADMIN_UID,
      data: {
        email: 'super-admin@example.com',
        name: 'Sample Super Admin',
        role: 'super_admin',
        school_id: 'all-schools',
        district_id: 'all-districts',
        createdAt: FieldValue.serverTimestamp(),
      },
    },
  ]

  try {
    const batch = db.batch()
    const collectionRef = db.collection('members')

    usersToCreate.forEach((user) => {
      const docRef = collectionRef.doc(user.uid)
      batch.set(docRef, user.data)
    })

    await batch.commit()
    console.log(`✅ Seeded ${usersToCreate.length} members.`)
  } catch (error) {
    console.error('Error seeding members:', error)
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
      domain: 'environment',
      type: 'rating-5',
      options: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    {
      text: 'Do you feel safe at school?',
      domain: 'safety',
      type: 'multiple-choice',
      options: ['Yes', 'No', 'Sometimes'],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    {
      text: 'How often do you feel supported by school staff?',
      domain: 'relationships',
      type: 'multiple-choice',
      options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    {
      text: 'Do you have access to the learning resources you need?',
      domain: 'learning',
      type: 'multiple-choice',
      options: ['Yes', 'No'],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    {
      text: 'Does school leadership communicate effectively with students?',
      domain: 'leadership',
      type: 'multiple-choice',
      options: ['Yes', 'No', 'Sometimes'],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
  ]

  try {
    const batch = db.batch()
    const collectionRef = db.collection('questionBank')

    questions.forEach((q) => {
      // Auto-generate ID
      const docRef = collectionRef.doc()
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
    {
      question_id: 'q3_support',
      order: 3,
      required: false,
      text: 'How often do you feel supported by school staff?',
    },
    {
      question_id: 'q4_resources',
      order: 4,
      required: false,
      text: 'Do you have access to the learning resources you need?',
    },
  ]

  const newSurvey: Omit<Survey, 'id'> = {
    title: 'Sample School Climate Survey',
    description: 'A sample survey created by the seed script.',
    type: 'custom',
    status: 'published',
    visibility: 'public',
    school_id: 'all-schools',
    district_id: 'all-districts',
    questions: surveyQuestions,
    createdBy: 'system-seed-script',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }

  try {
    const surveyRef = db.collection('surveys').doc(SAMPLE_SURVEY_ID)
    await surveyRef.set(newSurvey)
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
    consent: true,
    answers: sampleAnswers,
    submittedAt: FieldValue.serverTimestamp(),
  }

  try {
    const responsesRef = db.collection('responses')
    const docRef = await responsesRef.add(newResponse)
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

  const grantId = `${SAMPLE_SURVEY_ID}:${SAMPLE_STUDENT_UID}`

  const newGrant: Omit<ConsentGrant, 'grantId'> = {
    surveyId: SAMPLE_SURVEY_ID,
    respondentKey: SAMPLE_STUDENT_UID,
    grantedAt: FieldValue.serverTimestamp(),
  }

  try {
    const grantRef = db.collection('consentGrants').doc(grantId)
    await grantRef.set(newGrant)
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
    to: [
      'student1@example.com',
      'student2@example.com',
      'student3@example.com',
    ],
    template: {
      name: 'surveyInvite',
      data: {
        surveyName: 'Sample School Climate Survey',
        studentName: 'Sample Student',
      },
    },
    status: 'pending',
    createdAt: FieldValue.serverTimestamp(),
  }

  try {
    const mailRef = db.collection('mail')
    const docRef = await mailRef.add(newMail)
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
  // eslint-disable-next-line n/no-process-exit
  process.exit(1)
})
