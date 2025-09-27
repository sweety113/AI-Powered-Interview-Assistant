import { Question } from '@/types/interview';

export const mockQuestions: Question[] = [
  // Easy Questions (20 seconds each)
  {
    id: 'easy-1',
    text: 'Tell me about yourself and your professional background.',
    difficulty: 'easy',
    timeLimit: 20,
    category: 'Introduction',
  },
  {
    id: 'easy-2', 
    text: 'What interests you most about this role and our company?',
    difficulty: 'easy',
    timeLimit: 20,
    category: 'Motivation',
  },
  
  // Medium Questions (60 seconds each)
  {
    id: 'medium-1',
    text: 'Describe a challenging project you worked on. What obstacles did you face and how did you overcome them?',
    difficulty: 'medium',
    timeLimit: 60,
    category: 'Problem Solving',
  },
  {
    id: 'medium-2',
    text: 'How do you prioritize tasks when working under tight deadlines with multiple projects?',
    difficulty: 'medium', 
    timeLimit: 60,
    category: 'Time Management',
  },
  
  // Hard Questions (120 seconds each)
  {
    id: 'hard-1',
    text: 'Design a system that can handle 1 million concurrent users. Walk me through your architecture decisions and explain how you would handle scalability challenges.',
    difficulty: 'hard',
    timeLimit: 120,
    category: 'System Design',
  },
  {
    id: 'hard-2',
    text: 'You discover a critical security vulnerability in production that affects user data. The fix requires significant changes that might break existing functionality. Walk me through your decision-making process and action plan.',
    difficulty: 'hard',
    timeLimit: 120,
    category: 'Critical Thinking',
  },
];

// Additional questions for variety (not used in current implementation but available for expansion)
export const additionalQuestions: Question[] = [
  {
    id: 'easy-3',
    text: 'What programming languages are you most comfortable with?',
    difficulty: 'easy',
    timeLimit: 20,
    category: 'Technical Skills',
  },
  {
    id: 'medium-3',
    text: 'Explain the difference between REST and GraphQL APIs. When would you choose one over the other?',
    difficulty: 'medium',
    timeLimit: 60,
    category: 'Technical Knowledge',
  },
  {
    id: 'hard-3',
    text: 'Implement a rate limiting algorithm that can handle different limits for different user tiers. Explain your approach and discuss edge cases.',
    difficulty: 'hard',
    timeLimit: 120,
    category: 'Algorithm Design',
  },
];