import { Responses } from '../types/survey'
import { Timestamp } from 'firebase/firestore'

export const r1: Responses = {
  userId: 'user_1029',
  submittedAt: Timestamp.fromDate(new Date('2026-03-01T14:32:00Z')),
  answers: [
    { question_id: '1', value: 'I feel safe at school and supported by my teachers' },
    { question_id: '2', value: 'The school environment is welcoming and respectful' },
    { question_id: '3', value: 'Staff members listen to students and care about our wellbeing' },
  ],
}

export const r2: Responses = {
  userId: 'user_2341',
  submittedAt: Timestamp.fromDate(new Date('2026-03-01T15:10:00Z')),
  answers: [
    { question_id: '1', value: 'Teachers are helpful and explain lessons clearly' },
    { question_id: '2', value: 'Sometimes bullying happens and it affects student confidence' },
    { question_id: '3', value: 'I wish there were more mental health resources at school' },
  ],
}

export const r3: Responses = {
  userId: null,
  submittedAt: Timestamp.fromDate(new Date('2026-03-01T16:05:00Z')),
  answers: [
    { question_id: '1', value: 'I enjoy learning here and feel motivated to do my best' },
    { question_id: '2', value: 'Students respect each other and value diversity' },
    { question_id: '3', value: 'Communication between families and teachers is strong' },
  ],
}

export const r4: Responses = {
  userId: 'user_8812',
  submittedAt: Timestamp.fromDate(new Date('2026-03-01T17:42:00Z')),
  answers: [
    { question_id: '1', value: 'The school feels crowded and sometimes unsafe' },
    { question_id: '2', value: 'More support is needed for struggling students' },
    { question_id: '3', value: 'Teachers try hard but are often overwhelmed' },
  ],
}

export const r5: Responses = {
  userId: 'user_4470',
  submittedAt: Timestamp.fromDate(new Date('2026-03-01T18:20:00Z')),
  answers: [
    { question_id: '1', value: 'I feel connected to my classmates and teachers' },
    { question_id: '2', value: 'School activities help build community and belonging' },
    { question_id: '3', value: 'More opportunities for student leadership would be great' },
  ],
}