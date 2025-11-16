/*
 script populating the database with initial data for all collections defined in 'interfaces.ts'.
 */

import type {
  User,
  QuestionBankItem,
  Survey,
  Question,
  Response,
  ConsentGrant,
  Mail,
} from './interfaces'
import { db } from './admin-seed-config'
import { FieldValue } from 'firebase-admin/firestore'

const SAMPLE_SCHOOL_ID = 'sample-school-123'
const SAMPLE_DISTRICT_ID = 'sample-district-abc'
const SAMPLE_STUDENT_PROFILES = [
  {
    uid: 'sample-student-01',
    email: 'avery.student@example.com',
    name: 'Avery Student',
  },
  {
    uid: 'sample-student-02',
    email: 'brooke.student@example.com',
    name: 'Brooke Student',
  },
  {
    uid: 'sample-student-03',
    email: 'carlos.student@example.com',
    name: 'Carlos Student',
  },
  {
    uid: 'sample-student-04',
    email: 'devon.student@example.com',
    name: 'Devon Student',
  },
  {
    uid: 'sample-student-05',
    email: 'emery.student@example.com',
    name: 'Emery Student',
  },
  {
    uid: 'sample-student-06',
    email: 'finley.student@example.com',
    name: 'Finley Student',
  },
] as const

const SAMPLE_LEADER_UID = 'sample-leader-uid-for-testing'
const SAMPLE_ADMIN_UID = 'sample-admin-uid-for-testing'
const SAMPLE_SUPER_ADMIN_UID = 'sample-super-admin-uid-for-testing'
const SAMPLE_SURVEY_ID = 'sample-survey-id-for-testing'
const SAMPLE_SURVEY_IDS = {
  climate: SAMPLE_SURVEY_ID,
  safety: 'sample-safety-survey-id',
  engagement: 'sample-engagement-survey-id',
} as const

/**
 * Creates sample users in the 'users' collection.
 */
async function seedUsers() {
  console.log('Seeding sample users...')

  const studentUsers: { uid: string; data: Omit<User, 'uid'> }[] =
    SAMPLE_STUDENT_PROFILES.map((student) => ({
      uid: student.uid,
      data: {
        email: student.email,
        name: student.name,
        role: 'student',
        school_id: SAMPLE_SCHOOL_ID,
        district_id: SAMPLE_DISTRICT_ID,
        createdAt: FieldValue.serverTimestamp(),
      },
    }))

  const usersToCreate: { uid: string; data: Omit<User, 'uid'> }[] = [
    ...studentUsers,
    {
      uid: SAMPLE_LEADER_UID,
      data: {
        email: 'leader@example.com',
        name: 'Sample Leader',
        role: 'school_personnel',
        school_id: SAMPLE_SCHOOL_ID,
        district_id: SAMPLE_DISTRICT_ID,
        createdAt: FieldValue.serverTimestamp(),
      },
    },
    {
      uid: SAMPLE_ADMIN_UID,
      data: {
        email: 'admin@example.com',
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
    {
      text: 'How connected do you feel to your classmates?',
      domain: 'relationships',
      type: 'rating-5',
      options: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    {
      text: 'How often do bullying incidents occur on campus?',
      domain: 'safety',
      type: 'multiple-choice',
      options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    {
      text: 'How confident are you in reporting safety concerns?',
      domain: 'leadership',
      type: 'rating-5',
      options: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    {
      text: 'How enthusiastic are you about attending school each day?',
      domain: 'environment',
      type: 'rating-5',
      options: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    {
      text: 'Do you have the tools needed to complete assignments at home?',
      domain: 'learning',
      type: 'multiple-choice',
      options: ['Always', 'Most of the time', 'Sometimes', 'Rarely', 'Never'],
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
 * Creates sample surveys in the 'surveys' collection.
 */
async function seedSurveys() {
  console.log('Seeding sample surveys...')

  const surveys: { id: string; data: Omit<Survey, 'id'> }[] = [
    {
      id: SAMPLE_SURVEY_IDS.climate,
      data: {
        title: 'School Climate Benchmark',
        description: 'Baseline climate data for all students.',
        type: 'custom',
        status: 'published',
        visibility: 'public',
        school_id: 'all-schools',
        district_id: 'all-districts',
        questions: [
          {
            question_id: 'climate_q1_satisfaction',
            order: 1,
            required: true,
            text: 'How satisfied are you with the school environment?',
          },
          {
            question_id: 'climate_q2_safety',
            order: 2,
            required: true,
            text: 'Do you feel safe at school during the day?',
          },
          {
            question_id: 'climate_q3_resources',
            order: 3,
            required: true,
            text: 'Do you have access to the learning resources you need?',
          },
          {
            question_id: 'climate_q4_support',
            order: 4,
            required: false,
            text: 'How often do you feel supported by school staff?',
          },
          {
            question_id: 'climate_q5_leadership',
            order: 5,
            required: false,
            text: 'Does school leadership communicate effectively with students?',
          },
        ],
        createdBy: 'system-seed-script',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: SAMPLE_SURVEY_IDS.safety,
      data: {
        title: 'Student Safety Pulse',
        description: 'Quick pulse-check on day-to-day safety concerns.',
        type: 'pulse',
        status: 'published',
        visibility: 'district',
        school_id: SAMPLE_SCHOOL_ID,
        district_id: SAMPLE_DISTRICT_ID,
        questions: [
          {
            question_id: 'safety_q1_commute',
            order: 1,
            required: true,
            text: 'How safe do you feel traveling to and from school?',
          },
          {
            question_id: 'safety_q2_bullying',
            order: 2,
            required: true,
            text: 'How often do you witness or experience bullying?',
          },
          {
            question_id: 'safety_q3_reporting',
            order: 3,
            required: true,
            text: 'How confident are you in reporting safety concerns?',
          },
          {
            question_id: 'safety_q4_supervision',
            order: 4,
            required: false,
            text: 'Do adults intervene quickly when issues arise?',
          },
        ],
        createdBy: 'system-seed-script',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
    },
    {
      id: SAMPLE_SURVEY_IDS.engagement,
      data: {
        title: 'Community Engagement Challenge',
        description:
          'Understanding how engaged students feel with the school community.',
        type: 'challenge',
        status: 'published',
        visibility: 'school',
        school_id: SAMPLE_SCHOOL_ID,
        district_id: SAMPLE_DISTRICT_ID,
        questions: [
          {
            question_id: 'engagement_q1_belonging',
            order: 1,
            required: true,
            text: 'How connected do you feel to your classmates?',
          },
          {
            question_id: 'engagement_q2_voice',
            order: 2,
            required: true,
            text: 'Do you feel your voice is heard during school decisions?',
          },
          {
            question_id: 'engagement_q3_attendance',
            order: 3,
            required: false,
            text: 'How enthusiastic are you about attending school each day?',
          },
          {
            question_id: 'engagement_q4_extracurricular',
            order: 4,
            required: false,
            text: 'Do you participate in extracurricular activities?',
          },
          {
            question_id: 'engagement_q5_home_resources',
            order: 5,
            required: false,
            text: 'Do you have the tools needed to complete assignments at home?',
          },
        ],
        createdBy: 'system-seed-script',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
    },
  ]

  try {
    const batch = db.batch()
    const surveyCollection = db.collection('surveys')

    surveys.forEach((survey) => {
      const docRef = surveyCollection.doc(survey.id)
      batch.set(docRef, survey.data)
    })

    await batch.commit()
    console.log(`✅ Seeded ${surveys.length} surveys.`)
  } catch (error) {
    console.error('Error seeding surveys:', error)
  }
}

/**
 * Creates multiple sample responses in the 'responses' collection.
 */
async function seedResponses() {
  console.log('Seeding sample responses...')

  const baseResponseData = {
    school_id: SAMPLE_SCHOOL_ID,
    district_id: SAMPLE_DISTRICT_ID,
    consent: true,
    submittedAt: FieldValue.serverTimestamp(),
  }

  const sampleResponses: Omit<Response, 'id'>[] = [
    {
      survey_id: SAMPLE_SURVEY_IDS.climate,
      surveyTitle: 'School Climate Benchmark',
      uid: SAMPLE_STUDENT_PROFILES[0].uid,
      ...baseResponseData,
      answers: [
        { question_id: 'climate_q1_satisfaction', value: 5 },
        { question_id: 'climate_q2_safety', value: 'Yes' },
        { question_id: 'climate_q3_resources', value: 'Yes' },
        { question_id: 'climate_q4_support', value: 'Often' },
        { question_id: 'climate_q5_leadership', value: 'Yes' },
      ],
    },
    {
      survey_id: SAMPLE_SURVEY_IDS.climate,
      surveyTitle: 'School Climate Benchmark',
      uid: SAMPLE_STUDENT_PROFILES[1].uid,
      ...baseResponseData,
      answers: [
        { question_id: 'climate_q1_satisfaction', value: 3 },
        { question_id: 'climate_q2_safety', value: 'Sometimes' },
        { question_id: 'climate_q3_resources', value: 'No' },
        { question_id: 'climate_q4_support', value: 'Rarely' },
        { question_id: 'climate_q5_leadership', value: 'Sometimes' },
      ],
    },
    {
      survey_id: SAMPLE_SURVEY_IDS.safety,
      surveyTitle: 'Student Safety Pulse',
      uid: SAMPLE_STUDENT_PROFILES[2].uid,
      ...baseResponseData,
      answers: [
        { question_id: 'safety_q1_commute', value: 'Safe' },
        { question_id: 'safety_q2_bullying', value: 'Rarely' },
        { question_id: 'safety_q3_reporting', value: 4 },
        { question_id: 'safety_q4_supervision', value: 'Most of the time' },
      ],
    },
    {
      survey_id: SAMPLE_SURVEY_IDS.safety,
      surveyTitle: 'Student Safety Pulse',
      uid: SAMPLE_STUDENT_PROFILES[3].uid,
      ...baseResponseData,
      answers: [
        { question_id: 'safety_q1_commute', value: 'Unsafe' },
        { question_id: 'safety_q2_bullying', value: 'Weekly' },
        { question_id: 'safety_q3_reporting', value: 2 },
        { question_id: 'safety_q4_supervision', value: 'Rarely' },
      ],
    },
    {
      survey_id: SAMPLE_SURVEY_IDS.engagement,
      surveyTitle: 'Community Engagement Challenge',
      uid: SAMPLE_STUDENT_PROFILES[4].uid,
      ...baseResponseData,
      answers: [
        { question_id: 'engagement_q1_belonging', value: 4 },
        { question_id: 'engagement_q2_voice', value: 'Yes' },
        { question_id: 'engagement_q3_attendance', value: 5 },
        { question_id: 'engagement_q4_extracurricular', value: 'Yes' },
        { question_id: 'engagement_q5_home_resources', value: 'Always' },
      ],
    },
    {
      survey_id: SAMPLE_SURVEY_IDS.engagement,
      surveyTitle: 'Community Engagement Challenge',
      uid: SAMPLE_STUDENT_PROFILES[0].uid,
      ...baseResponseData,
      answers: [
        { question_id: 'engagement_q1_belonging', value: 3 },
        { question_id: 'engagement_q2_voice', value: 'Sometimes' },
        { question_id: 'engagement_q3_attendance', value: 3 },
        { question_id: 'engagement_q4_extracurricular', value: 'No' },
        { question_id: 'engagement_q5_home_resources', value: 'Most of the time' },
      ],
    },
  ]

  try {
    const responsesRef = db.collection('responses')
    for (const response of sampleResponses) {
      const docRef = await responsesRef.add(response)
      console.log(`✅ Seeded sample response with ID: ${docRef.id}`)
    }
  } catch (error) {
    console.error('Error seeding sample responses:', error)
  }
}

/**
 * Creates sample consent grants in the 'consentGrants' collection.
 */
async function seedConsents() {
  console.log('Seeding sample consent grants...')

  const responsesSnapshot = await db.collection('responses').get()
  const consentPairs = new Set<string>()

  try {
    const batch = db.batch()
    responsesSnapshot.forEach((doc) => {
      const data = doc.data() as Response
      const pairKey = `${data.survey_id}:${data.uid}`
      if (consentPairs.has(pairKey)) {
        return
      }

      consentPairs.add(pairKey)

      const grantId = pairKey
      const grantRef = db.collection('consentGrants').doc(grantId)
      const newGrant: Omit<ConsentGrant, 'grantId'> = {
        surveyId: data.survey_id,
        respondentKey: data.uid,
        grantedAt: FieldValue.serverTimestamp(),
      }
      batch.set(grantRef, newGrant)
    })

    if (consentPairs.size > 0) {
      await batch.commit()
    }

    console.log(`✅ Seeded ${consentPairs.size} consent grants.`)
  } catch (error) {
    console.error('Error seeding sample consent grants:', error)
  }
}

/**
 * Creates a sample mail item in the 'mail' collection.
 */
async function seedMail() {
  console.log('Seeding sample mail queue item...')

  const newMail: Omit<Mail, 'id' | 'sentAt'> = {
    to: SAMPLE_STUDENT_PROFILES.map((student) => student.email),
    template: {
      name: 'surveyInvite',
      data: {
        surveyName: 'School Climate Benchmark',
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
  await seedSurveys()
  await seedResponses()
  await seedConsents()
  await seedMail()

  console.log('--- Database Seed Finished ---')
}

// Run the seed script
seedDatabase().catch((error) => {
  console.error('Unhandled error in seed script:', error)
  // eslint-disable-next-line n/no-process-exit
  process.exit(1)
})
