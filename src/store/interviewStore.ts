import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { InterviewStore, Candidate, InterviewSession, Question, DifficultyLevel } from '@/types/interview';
import { mockQuestions } from '@/data/mockQuestions';

const DIFFICULTY_TIME_LIMITS: Record<DifficultyLevel, number> = {
  easy: 20,
  medium: 60,
  hard: 120,
};

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentCandidate: null,
      currentSession: null,
      candidates: [],
      activeTab: 'interviewee',
      showWelcomeBackModal: false,

      // Actions
      setActiveTab: (tab) => set({ activeTab: tab }),

      startInterview: (candidateData) => {
        const candidateId = crypto.randomUUID();
        const newCandidate: Candidate = {
          ...candidateData,
          id: candidateId,
          startedAt: Date.now(),
          currentQuestionIndex: 0,
          answers: [],
          status: 'incomplete',
        };

        const questions = mockQuestions.slice(0, 6); // 2 easy, 2 medium, 2 hard
        const session: InterviewSession = {
          candidateId,
          questions,
          currentQuestionIndex: 0,
          isActive: true,
          timeRemaining: DIFFICULTY_TIME_LIMITS[questions[0].difficulty],
          isPaused: false,
        };

        set((state) => ({
          currentCandidate: newCandidate,
          currentSession: session,
          candidates: [...state.candidates, newCandidate],
        }));
      },

      resumeInterview: (candidateId) => {
        const candidate = get().candidates.find(c => c.id === candidateId);
        if (!candidate || candidate.status === 'completed') return;

        const questions = mockQuestions.slice(0, 6);
        const currentQuestion = questions[candidate.currentQuestionIndex];
        
        const session: InterviewSession = {
          candidateId,
          questions,
          currentQuestionIndex: candidate.currentQuestionIndex,
          isActive: true,
          timeRemaining: currentQuestion ? DIFFICULTY_TIME_LIMITS[currentQuestion.difficulty] : 0,
          isPaused: false,
        };

        set({
          currentCandidate: candidate,
          currentSession: session,
          showWelcomeBackModal: false,
        });
      },

      submitAnswer: (answerData) => {
        const { currentCandidate, currentSession } = get();
        if (!currentCandidate || !currentSession) return;

        const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
        const answer = {
          ...answerData,
          questionId: currentQuestion.id,
          timestamp: Date.now(),
          score: Math.floor(Math.random() * 6) + 5, // Mock score 5-10
        };

        const updatedCandidate = {
          ...currentCandidate,
          answers: [...currentCandidate.answers, answer],
        };

        set((state) => ({
          currentCandidate: updatedCandidate,
          candidates: state.candidates.map(c => 
            c.id === updatedCandidate.id ? updatedCandidate : c
          ),
        }));

        get().nextQuestion();
      },

      nextQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const nextIndex = currentSession.currentQuestionIndex + 1;
        
        if (nextIndex >= currentSession.questions.length) {
          get().completeInterview();
          return;
        }

        const nextQuestion = currentSession.questions[nextIndex];
        
        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            currentQuestionIndex: nextIndex,
            timeRemaining: DIFFICULTY_TIME_LIMITS[nextQuestion.difficulty],
          } : null,
          currentCandidate: state.currentCandidate ? {
            ...state.currentCandidate,
            currentQuestionIndex: nextIndex,
          } : null,
        }));

        // Update candidate in candidates array
        const { currentCandidate } = get();
        if (currentCandidate) {
          set((state) => ({
            candidates: state.candidates.map(c => 
              c.id === currentCandidate.id ? { ...currentCandidate, currentQuestionIndex: nextIndex } : c
            ),
          }));
        }
      },

      completeInterview: () => {
        const { currentCandidate } = get();
        if (!currentCandidate) return;

        // Calculate final score (weighted average)
        const totalScore = currentCandidate.answers.reduce((sum, answer, index) => {
          const question = mockQuestions[index];
          const weight = question.difficulty === 'easy' ? 1 : question.difficulty === 'medium' ? 2 : 3;
          return sum + (answer.score || 0) * weight;
        }, 0);

        const maxScore = currentCandidate.answers.length * 3 * 10; // Max weighted score
        const finalScore = Math.round((totalScore / maxScore) * 100);

        const completedCandidate = {
          ...currentCandidate,
          completedAt: Date.now(),
          totalScore: finalScore,
          finalSummary: `Interview completed with ${finalScore}% overall score. Strong performance in technical areas.`,
          status: 'completed' as const,
        };

        set((state) => ({
          currentCandidate: completedCandidate,
          currentSession: null,
          candidates: state.candidates.map(c => 
            c.id === completedCandidate.id ? completedCandidate : c
          ),
        }));
      },

      updateTimeRemaining: (time) => {
        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            timeRemaining: time,
          } : null,
        }));

        if (time <= 0) {
          // Auto-submit empty answer on timeout
          get().submitAnswer({
            text: '',
            timeSpent: get().currentSession?.questions[get().currentSession?.currentQuestionIndex || 0]?.timeLimit || 0,
          });
        }
      },

      pauseInterview: () => {
        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            isPaused: true,
          } : null,
        }));
      },

      resumeInterviewTimer: () => {
        set((state) => ({
          currentSession: state.currentSession ? {
            ...state.currentSession,
            isPaused: false,
          } : null,
        }));
      },

      closeWelcomeBackModal: () => {
        set({ showWelcomeBackModal: false });
      },
    }),
    {
      name: 'interview-assistant-store',
      partialize: (state) => ({
        candidates: state.candidates,
        currentCandidate: state.currentCandidate?.status === 'incomplete' ? state.currentCandidate : null,
        currentSession: state.currentCandidate?.status === 'incomplete' ? state.currentSession : null,
        showWelcomeBackModal: !!state.currentCandidate && state.currentCandidate.status === 'incomplete',
      }),
    }
  )
);