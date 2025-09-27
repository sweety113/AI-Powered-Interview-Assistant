import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, User } from 'lucide-react';
import { useInterviewStore } from '@/store/interviewStore';

export const WelcomeBackModal = () => {
  const { 
    showWelcomeBackModal, 
    currentCandidate, 
    closeWelcomeBackModal, 
    resumeInterview,
    setActiveTab 
  } = useInterviewStore();

  const handleResumeInterview = () => {
    if (currentCandidate) {
      resumeInterview(currentCandidate.id);
      setActiveTab('interviewee');
    }
  };

  const handleStartFresh = () => {
    closeWelcomeBackModal();
    setActiveTab('interviewee');
  };

  if (!currentCandidate) return null;

  const questionsCompleted = currentCandidate.answers.length;
  const totalQuestions = 6;
  const timeElapsed = Math.round((Date.now() - currentCandidate.startedAt) / (1000 * 60));

  return (
    <Dialog open={showWelcomeBackModal} onOpenChange={closeWelcomeBackModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-primary" />
            Welcome Back!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Previous Session</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Candidate:</span>
                <span className="font-medium text-foreground">{currentCandidate.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Progress:</span>
                <span className="font-medium text-foreground">
                  {questionsCompleted}/{totalQuestions} questions
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Time elapsed:
                </span>
                <span className="font-medium text-foreground">{timeElapsed} minutes</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            You have an unfinished interview session. Would you like to continue where you left off?
          </p>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleResumeInterview}
              className="flex-1 gradient-primary text-white font-medium"
            >
              Continue Interview
            </Button>
            <Button 
              onClick={handleStartFresh}
              variant="outline"
              className="flex-1"
            >
              Start Fresh
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};