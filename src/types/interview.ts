export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  difficulty: DifficultyLevel;
  timeLimit: number; // in seconds
  category: string;
}

export interface Answer {
  questionId: string;
  text: string;
  timestamp: number;
  timeSpent: number; // seconds taken to answer
  score?: number; // 0-10 evaluation score
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeText?: string;
  resumeFileName?: string;
  startedAt: number;
  completedAt?: number;
  currentQuestionIndex: number;
  answers: Answer[];
  totalScore?: number;
  finalSummary?: string;
  status: 'incomplete' | 'completed';
}

export interface InterviewSession {
  candidateId: string;
  questions: Question[];
  currentQuestionIndex: number;
  isActive: boolean;
  timeRemaining: number;
  isPaused: boolean;
}

export interface InterviewStore {
  // Current session state
  currentCandidate: Candidate | null;
  currentSession: InterviewSession | null;
  
  // All candidates data
  candidates: Candidate[];
  
  // UI state
  activeTab: 'interviewee' | 'interviewer';
  showWelcomeBackModal: boolean;
  
  // Actions
  setActiveTab: (tab: 'interviewee' | 'interviewer') => void;
  startInterview: (candidate: Omit<Candidate, 'id' | 'startedAt' | 'currentQuestionIndex' | 'answers' | 'status'>) => void;
  resumeInterview: (candidateId: string) => void;
  submitAnswer: (answer: Omit<Answer, 'questionId' | 'timestamp'>) => void;
  nextQuestion: () => void;
  completeInterview: () => void;
  updateTimeRemaining: (time: number) => void;
  pauseInterview: () => void;
  resumeInterviewTimer: () => void;
  closeWelcomeBackModal: () => void;
}