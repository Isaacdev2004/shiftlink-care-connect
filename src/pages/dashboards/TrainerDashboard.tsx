
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, BookOpen, TrendingUp, Users, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import TrainerProfile from '@/components/TrainerProfile';
import DatabaseCourseManager from '@/components/DatabaseCourseManager';
import TrainerStats from '@/components/TrainerStats';
import CourseCreationWizard from '@/components/CourseCreationWizard';
import CourseContentManager from '@/components/CourseContentManager';
import CourseAnalyticsDashboard from '@/components/CourseAnalyticsDashboard';
import StudentProgressCharts from '@/components/StudentProgressCharts';

const TrainerDashboard = () => {
  const { user, loading } = useAuth();
  const [showCourseWizard, setShowCourseWizard] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; title: string } | null>(null);
  const [refreshCourses, setRefreshCourses] = useState(0);

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

  const handleCourseCreated = (courseId: string) => {
    setShowCourseWizard(false);
    setRefreshCourses(prev => prev + 1);
  };

  const handleManageCourse = (course: { id: string; title: string }) => {
    setSelectedCourse(course);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Trainer Dashboard</h1>
              <p className="text-gray-600">Manage your courses, track students, and grow your training business</p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowCourseWizard(true)}
                className="bg-medical-blue hover:bg-blue-800 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Course</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Real-time Stats */}
        <TrainerStats />

        {/* Course Content Manager */}
        {selectedCourse && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Course Content Manager</span>
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCourse(null)}
                >
                  Close
                </Button>
              </div>
              <CardDescription>
                Managing content for: <strong>{selectedCourse.title}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseContentManager course={selectedCourse} />
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="progress">Student Progress</TabsTrigger>
            <TabsTrigger value="profile">Profile & Settings</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="mt-6">
            <DatabaseCourseManager 
              key={refreshCourses}
              onManageCourse={handleManageCourse}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <CourseAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <StudentProgressCharts />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-6">
            <TrainerProfile />
          </TabsContent>
          
          <TabsContent value="engagement" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Student Engagement Tools</span>
                </CardTitle>
                <CardDescription>Communicate with students and track engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Messaging System</h3>
                      <p className="text-sm text-gray-600 mb-4">Send messages and announcements to your students</p>
                      <Button variant="outline" className="w-full">
                        Open Messages
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <Users className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Student Feedback</h3>
                      <p className="text-sm text-gray-600 mb-4">View and respond to student reviews and feedback</p>
                      <Button variant="outline" className="w-full">
                        View Feedback
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Progress Alerts</h3>
                      <p className="text-sm text-gray-600 mb-4">Set up automated notifications and reminders</p>
                      <Button variant="outline" className="w-full">
                        Configure Alerts
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🚀 Enhanced Engagement Features</h4>
                  <p className="text-sm text-blue-800 mb-4">
                    The messaging system, feedback collection, and automated notifications are now set up in your database. 
                    The engagement tools help you maintain better communication with your students and track their progress more effectively.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                      <strong>✅ Student Progress Tracking:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• Detailed lesson completion tracking</li>
                        <li>• Time spent analytics</li>
                        <li>• Quiz performance monitoring</li>
                      </ul>
                    </div>
                    <div>
                      <strong>✅ Communication Tools:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• Direct messaging with students</li>
                        <li>• Course announcements</li>
                        <li>• Automated reminders</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Course Creation Wizard Dialog */}
        <Dialog open={showCourseWizard} onOpenChange={setShowCourseWizard}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <CourseCreationWizard
              onCourseCreated={handleCourseCreated}
              onCancel={() => setShowCourseWizard(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TrainerDashboard;
