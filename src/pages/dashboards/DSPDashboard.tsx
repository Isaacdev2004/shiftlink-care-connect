
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Users, Clock, Award, TrendingUp, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import StudentLearningInterface from '@/components/StudentLearningInterface';
import DatabaseCourseMarketplace from '@/components/DatabaseCourseMarketplace';
import StudentStats from '@/components/StudentStats';
import StudentCertificates from '@/components/StudentCertificates';
import StudentProgressCharts from '@/components/StudentProgressCharts';

const DSPDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleBrowseCourses = () => {
    // Scroll to the Browse Courses tab
    const tabsList = document.querySelector('[data-tab="courses"]');
    if (tabsList) {
      (tabsList as HTMLElement).click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
              <p className="text-gray-600">Track your learning progress and continue your training</p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => window.location.href = '/learning'}
                className="bg-medical-blue hover:bg-blue-800 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Continue Learning</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time Stats */}
        <StudentStats />

        {/* Quick Actions with proper click handlers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/learning'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Continue Learning</span>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </CardTitle>
              <CardDescription>Resume your current courses and lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Pick up where you left off in your training modules.</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleBrowseCourses}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Browse Course Catalog</span>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </CardTitle>
              <CardDescription>Discover and enroll in new training courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Explore our comprehensive course catalog and find new learning opportunities.</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="learning" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="learning">My Learning</TabsTrigger>
            <TabsTrigger value="courses" data-tab="courses">Browse Courses</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="progress">Progress Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="learning" className="mt-6">
            <StudentLearningInterface />
          </TabsContent>
          
          <TabsContent value="courses" className="mt-6">
            <DatabaseCourseMarketplace />
          </TabsContent>
          
          <TabsContent value="certificates" className="mt-6">
            <StudentCertificates />
          </TabsContent>
          
          <TabsContent value="progress" className="mt-6">
            <StudentProgressCharts />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DSPDashboard;
