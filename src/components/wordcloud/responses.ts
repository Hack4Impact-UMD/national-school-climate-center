//sample firebase response data

import type { Responses } from '@/types/survey'
import { Timestamp } from 'firebase/firestore'

export const r1: Responses = {
  userId: 'user_1029',
  submittedAt: Timestamp.fromDate(new Date('2026-03-01T14:32:00Z')),
  answers: {
    1: 'I feel safe at school and supported by my teachers',
    2: 'The school environment is welcoming and respectful',
    3: 'Staff members listen to students and care about our wellbeing',
  },
}

export const r2: Responses = {
  userId: 'user_2341',
  submittedAt: Timestamp.fromDate(new Date('2026-03-01T15:10:00Z')),
  answers: {
    1: 'Teachers are helpful and explain lessons clearly',
    2: 'Sometimes bullying happens and it affects student confidence',
    3: 'I wish there were more mental health resources at school',
  },
}

export const r3: Responses = {
  userId: null,
  submittedAt: Timestamp.fromDate(new Date('2026-03-01T16:05:00Z')),
  answers: {
    1: 'I enjoy learning here and feel motivated to do my best',
    2: 'Students respect each other and value diversity',
    3: 'Communication between families and teachers is strong',
  },
}

export const r4: Responses = {
  userId: 'user_8812',
  submittedAt: Timestamp.fromDate(new Date('2026-03-01T17:42:00Z')),
  answers: {
    1: 'The school feels crowded and sometimes unsafe',
    2: 'More support is needed for struggling students',
    3: 'Teachers try hard but are often overwhelmed',
  },
}

export const r5: Responses = {
  userId: 'user_4470',
  submittedAt: Timestamp.fromDate(new Date('2026-03-01T18:20:00Z')),
  answers: {
    1: 'I feel connected to my classmates and teachers',
    2: 'School activities help build community and belonging',
    3: 'More opportunities for student leadership would be great',
  },
}
