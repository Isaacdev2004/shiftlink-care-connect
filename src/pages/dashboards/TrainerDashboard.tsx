
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, BookOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import TrainerProfile from '@/components/TrainerProfile';
import DatabaseCourseManager from '@/components/DatabaseCourseManager';
import TrainerStats from '@/components/TrainerStats';
import CourseCreationWizard from '@/components/CourseCreationWizard';
import CourseContentManager from '@/components/CourseContentManager';

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
    // Optionally, you could automatically select the newly created course
    // for content management
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="profile">Profile & Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses" className="mt-6">
            <DatabaseCourseManager 
              key={refreshCourses}
              onManageCourse={handleManageCourse}
            />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-6">
            <TrainerProfile />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Performance Analytics</span>
                </CardTitle>
                <CardDescription>Track your training business performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">Advanced analytics dashboard coming soon...</p>
                  <p className="text-sm text-gray-400 mt-2">
                    View detailed insights about your courses, student progress, and revenue trends.
                  </p>
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
