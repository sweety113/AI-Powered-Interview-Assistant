import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageCircle } from 'lucide-react';
import { useInterviewStore } from '@/store/interviewStore';
import { IntervieweeChat } from '@/components/IntervieweeChat';
import { InterviewerDashboard } from '@/components/InterviewerDashboard';
import { WelcomeBackModal } from '@/components/WelcomeBackModal';
import { motion } from 'framer-motion';

const Index = () => {
  const { activeTab, setActiveTab } = useInterviewStore();

  return (
    <div className="min-h-screen bg-background">
      <WelcomeBackModal />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                AI Interview Assistant
              </h1>
              <p className="text-sm text-muted-foreground">
                Professional interview management platform
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'interviewee' | 'interviewer')}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="interviewee" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Interview
              </TabsTrigger>
              <TabsTrigger value="interviewer" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="interviewee" className="mt-0">
            <IntervieweeChat />
          </TabsContent>

          <TabsContent value="interviewer" className="mt-0">
            <InterviewerDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
