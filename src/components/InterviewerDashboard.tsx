import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Trophy, Clock, FileText, Star, Calendar, User } from 'lucide-react';
import { useInterviewStore } from '@/store/interviewStore';
import { Candidate } from '@/types/interview';
import { mockQuestions } from '@/data/mockQuestions';
import { motion } from 'framer-motion';

export const InterviewerDashboard = () => {
  const { candidates } = useInterviewStore();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const completedCandidates = candidates.filter(c => c.status === 'completed');
  const incompleteCandidates = candidates.filter(c => c.status === 'incomplete');
  
  const sortedCompleted = [...completedCandidates].sort((a, b) => {
    return (b.totalScore || 0) - (a.totalScore || 0);
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (startTime: number, endTime?: number) => {
    const duration = (endTime || Date.now()) - startTime;
    const minutes = Math.floor(duration / (1000 * 60));
    return `${minutes} min`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-easy';
    if (score >= 60) return 'text-medium';
    return 'text-hard';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const CandidateCard = ({ candidate, index }: { candidate: Candidate; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" 
            onClick={() => setSelectedCandidate(candidate)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">{candidate.email}</p>
              <p className="text-xs text-muted-foreground">{candidate.phone}</p>
            </div>
            {candidate.totalScore !== undefined && (
              <Badge variant={getScoreBadgeVariant(candidate.totalScore)} className="text-lg font-bold px-3 py-1">
                {candidate.totalScore}%
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(candidate.startedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDuration(candidate.startedAt, candidate.completedAt)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {candidate.answers.length}/6 questions
              </span>
            </div>
            <Badge variant={candidate.status === 'completed' ? 'default' : 'secondary'}>
              {candidate.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const StatsCard = ({ title, value, icon: Icon, color }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color: string;
  }) => (
    <Card className="shadow-custom">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color.replace('text-', 'text-').replace('-foreground', '')}/20`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Interviewer Dashboard
          </h1>
          <p className="text-muted-foreground">Manage and review interview sessions</p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Candidates"
          value={candidates.length}
          icon={Users}
          color="text-primary"
        />
        <StatsCard
          title="Completed"
          value={completedCandidates.length}
          icon={Trophy}
          color="text-easy"
        />
        <StatsCard
          title="In Progress"
          value={incompleteCandidates.length}
          icon={Clock}
          color="text-medium"
        />
        <StatsCard
          title="Avg Score"
          value={completedCandidates.length > 0 
            ? `${Math.round(completedCandidates.reduce((sum, c) => sum + (c.totalScore || 0), 0) / completedCandidates.length)}%`
            : 'N/A'
          }
          icon={Star}
          color="text-primary"
        />
      </div>

      {/* Candidates List */}
      <Tabs defaultValue="completed" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="completed">Completed Interviews ({completedCandidates.length})</TabsTrigger>
          <TabsTrigger value="incomplete">In Progress ({incompleteCandidates.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="completed" className="space-y-4">
          {sortedCompleted.length === 0 ? (
            <Card className="shadow-custom">
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed interviews yet</h3>
                <p className="text-muted-foreground">
                  Completed interviews will appear here sorted by score
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sortedCompleted.map((candidate, index) => (
                <CandidateCard key={candidate.id} candidate={candidate} index={index} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="incomplete" className="space-y-4">
          {incompleteCandidates.length === 0 ? (
            <Card className="shadow-custom">
              <CardContent className="p-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No active interviews</h3>
                <p className="text-muted-foreground">
                  Active interview sessions will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {incompleteCandidates.map((candidate, index) => (
                <CandidateCard key={candidate.id} candidate={candidate} index={index} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Candidate Detail Modal */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {selectedCandidate?.name} - Interview Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="space-y-6">
              {/* Candidate Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Contact Information</h4>
                  <p className="text-sm text-muted-foreground">Email: {selectedCandidate.email}</p>
                  <p className="text-sm text-muted-foreground">Phone: {selectedCandidate.phone}</p>
                  <p className="text-sm text-muted-foreground">
                    Started: {formatDate(selectedCandidate.startedAt)}
                  </p>
                  {selectedCandidate.completedAt && (
                    <p className="text-sm text-muted-foreground">
                      Completed: {formatDate(selectedCandidate.completedAt)}
                    </p>
                  )}
                </div>
                
                {selectedCandidate.totalScore !== undefined && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Performance</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Overall Score:</span>
                      <Badge variant={getScoreBadgeVariant(selectedCandidate.totalScore)} className="text-lg font-bold">
                        {selectedCandidate.totalScore}%
                      </Badge>
                    </div>
                    {selectedCandidate.finalSummary && (
                      <p className="text-sm text-muted-foreground">{selectedCandidate.finalSummary}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Answers */}
              <div>
                <h4 className="font-medium mb-4">Interview Transcript</h4>
                <div className="space-y-4">
                  {selectedCandidate.answers.map((answer, index) => {
                    const question = mockQuestions[index];
                    return (
                      <Card key={answer.questionId} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  Q{index + 1}
                                </Badge>
                                <Badge 
                                  className={`text-xs
                                    ${question?.difficulty === 'easy' ? 'bg-easy/20 text-easy' : ''}
                                    ${question?.difficulty === 'medium' ? 'bg-medium/20 text-medium' : ''}
                                    ${question?.difficulty === 'hard' ? 'bg-hard/20 text-hard' : ''}
                                  `}
                                >
                                  {question?.difficulty?.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium mb-2">{question?.text}</p>
                            </div>
                            {answer.score && (
                              <Badge variant="outline" className="ml-2">
                                {answer.score}/10
                              </Badge>
                            )}
                          </div>
                          
                          <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-sm">
                              {answer.text || <em className="text-muted-foreground">No answer provided (timeout)</em>}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Time spent: {Math.floor(answer.timeSpent / 60)}:{(answer.timeSpent % 60).toString().padStart(2, '0')}</span>
                              <span>Submitted: {formatDate(answer.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};