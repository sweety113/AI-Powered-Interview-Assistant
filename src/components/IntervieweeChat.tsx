import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Send, Play, Pause } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useInterviewStore } from '@/store/interviewStore';
import { parseResumeFile, validateContactInfo } from '@/utils/resumeParser';
import { InterviewTimer } from './InterviewTimer';
import { ContactForm } from './ContactForm';
import { motion, AnimatePresence } from 'framer-motion';

export const IntervieweeChat = () => {
  const {
    currentCandidate,
    currentSession,
    startInterview,
    submitAnswer,
    pauseInterview,
    resumeInterviewTimer,
  } = useInterviewStore();

  const [answer, setAnswer] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [resumeData, setResumeData] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const parsed = await parseResumeFile(file);
      setResumeData(parsed.text);
      
      const extracted = {
        name: parsed.name || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
      };
      
      setContactData(extracted);
      
      const validation = validateContactInfo(extracted);
      if (!validation.isValid) {
        setShowContactForm(true);
      } else {
        handleStartInterview(extracted, parsed.text, file.name);
      }
    } catch (error) {
      console.error('Resume parsing error:', error);
      // Fallback to manual entry
      setShowContactForm(true);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    multiple: false,
  });

  const handleStartInterview = (contact: typeof contactData, resume?: string, fileName?: string) => {
    startInterview({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      resumeText: resume,
      resumeFileName: fileName,
    });
    setShowContactForm(false);
  };

  const handleSubmitAnswer = () => {
    if (!currentSession || !answer.trim()) return;
    
    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    const timeSpent = currentQuestion.timeLimit - currentSession.timeRemaining;
    
    submitAnswer({
      text: answer.trim(),
      timeSpent,
    });
    
    setAnswer('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  if (showContactForm) {
    return (
      <ContactForm
        initialData={contactData}
        onSubmit={(contact) => handleStartInterview(contact, resumeData || undefined)}
        onCancel={() => setShowContactForm(false)}
      />
    );
  }

  if (!currentCandidate || !currentSession) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 gradient-primary bg-clip-text text-transparent">
            AI Interview Assistant
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your resume to begin the interview process
          </p>
        </motion.div>

        <Card className="shadow-custom">
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
              
              {isUploading ? (
                <div className="space-y-3">
                  <p className="text-lg font-medium">Processing resume...</p>
                  <div className="max-w-xs mx-auto">
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              ) : isDragActive ? (
                <p className="text-lg font-medium text-primary">Drop your resume here</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drop your resume here, or click to browse</p>
                  <p className="text-sm text-muted-foreground">Supports PDF and DOCX files</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <Button
                onClick={() => setShowContactForm(true)}
                variant="outline"
                className="text-sm"
              >
                Continue without resume
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
  const progress = ((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold">Interview in Progress</h1>
          <p className="text-muted-foreground">Question {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {currentCandidate.name}
        </Badge>
      </motion.div>

      <Progress value={progress} className="h-2" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSession.currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-custom">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      Question {currentSession.currentQuestionIndex + 1}
                      <Badge 
                        className={`
                          ${currentQuestion.difficulty === 'easy' ? 'bg-easy text-easy-foreground' : ''}
                          ${currentQuestion.difficulty === 'medium' ? 'bg-medium text-medium-foreground' : ''}
                          ${currentQuestion.difficulty === 'hard' ? 'bg-hard text-hard-foreground' : ''}
                        `}
                      >
                        {currentQuestion.difficulty.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-4 leading-relaxed">{currentQuestion.text}</p>
                  <p className="text-sm text-muted-foreground">
                    Category: {currentQuestion.category}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <Card className="shadow-custom">
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={textareaRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your answer here... (Ctrl+Enter to submit)"
                className="min-h-32 resize-none"
                disabled={currentSession.isPaused}
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Ctrl + Enter to submit • {answer.length} characters
                </p>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim() || currentSession.isPaused}
                  className="gradient-primary text-white font-medium"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Answer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <InterviewTimer />
          
          <Card className="shadow-custom">
            <CardHeader>
              <CardTitle className="text-sm">Interview Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={currentSession.isPaused ? resumeInterviewTimer : pauseInterview}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  {currentSession.isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Timer will auto-submit when time runs out
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};