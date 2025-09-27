import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Clock } from 'lucide-react';
import { useInterviewStore } from '@/store/interviewStore';
import { motion } from 'framer-motion';
import 'react-circular-progressbar/dist/styles.css';

export const InterviewTimer = () => {
  const { currentSession, updateTimeRemaining } = useInterviewStore();

  useEffect(() => {
    if (!currentSession || currentSession.isPaused || currentSession.timeRemaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      updateTimeRemaining(currentSession.timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession?.timeRemaining, currentSession?.isPaused, updateTimeRemaining]);

  if (!currentSession) return null;

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const totalTime = currentQuestion.timeLimit;
  const timeRemaining = currentSession.timeRemaining;
  const percentage = (timeRemaining / totalTime) * 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (percentage > 50) return 'hsl(var(--easy))';
    if (percentage > 25) return 'hsl(var(--timer-warning))';
    return 'hsl(var(--timer-critical))';
  };

  const getTimerBgColor = () => {
    if (percentage > 50) return 'hsl(var(--easy-light))';
    if (percentage > 25) return 'hsl(var(--medium-light))';
    return 'hsl(var(--hard-light))';
  };

  return (
    <Card className="shadow-custom">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Time Remaining
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <motion.div
            key={currentSession.currentQuestionIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-24 h-24"
          >
            <CircularProgressbar
              value={percentage}
              text={formatTime(timeRemaining)}
              styles={buildStyles({
                pathColor: getTimerColor(),
                textColor: 'hsl(var(--foreground))',
                trailColor: getTimerBgColor(),
                pathTransitionDuration: 0.5,
                textSize: '20px',
              })}
            />
            
            {currentSession.isPaused && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                <span className="text-xs font-medium">PAUSED</span>
              </div>
            )}
          </motion.div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            {currentQuestion.difficulty === 'easy' && 'Quick Response'}
            {currentQuestion.difficulty === 'medium' && 'Detailed Answer'}
            {currentQuestion.difficulty === 'hard' && 'Comprehensive Response'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total: {formatTime(totalTime)}
          </p>
        </div>

        {timeRemaining <= 10 && timeRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded-md"
          >
            <p className="text-xs text-center text-destructive font-medium">
              ⚠️ Time almost up!
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};