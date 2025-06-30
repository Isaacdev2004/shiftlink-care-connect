import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, BookOpen, TrendingUp, Users, MessageCircle, BarChart3, FileText, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import TrainerProfile from '@/components/TrainerProfile';
import DatabaseCourseManager from '@/components/DatabaseCourseManager';
import TrainerStats from '@/components/TrainerStats';
import CourseCreationWizard from '@/components/CourseCreationWizard';
import CourseContentManager from '@/components/CourseContentManager';
import CourseAnalyticsDashboard from '@/components/CourseAnalyticsDashboard';
import StudentProgressCharts from '@/components/StudentProgressCharts';
import RevenueAnalytics from '@/components/RevenueAnalytics';
import CourseComparison from '@/components/CourseComparison';
import StudentRetentionMetrics from '@/components/StudentRetentionMetrics';
import ExportReports from '@/components/ExportReports';
import MarketingGrowthTools from '@/components/MarketingGrowthTools';

const TrainerDashboard = () => {
  const { user, loading } = useAuth();
  const [showCourseWizard, setShowCourseWizard] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; title: string } | null>(null);
  const [refreshCourses, setRefreshCourses] = useState(0);
  const [activeTab, setActiveTab] = useState('courses');

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

  const navigateToTab = (tabValue: string) => {
    setActiveTab(tabValue);
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="comparison">Compare</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
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

          <TabsContent value="revenue" className="mt-6">
            <RevenueAnalytics />
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <CourseComparison />
          </TabsContent>

          <TabsContent value="retention" className="mt-6">
            <StudentRetentionMetrics />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ExportReports />
          </TabsContent>

          <TabsContent value="marketing" className="mt-6">
            <MarketingGrowthTools 
              courses={[]} 
              onCourseCreated={() => setRefreshCourses(prev => prev + 1)} 
            />
          </TabsContent>
          
          <TabsContent value="profile" className="mt-6">
            <TrainerProfile />
          </TabsContent>
        </Tabs>

        {/* Phase 2 Analytics Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Advanced Analytics & Reporting</span>
            </CardTitle>
            <CardDescription>Comprehensive business intelligence for your training business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Revenue Analytics</h3>
                  <p className="text-sm text-gray-600 mb-4">Track financial performance with monthly/quarterly trends and forecasting</p>
                  <Button variant="outline" className="w-full" onClick={() => navigateToTab('revenue')}>
                    View Revenue
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Course Comparison</h3>
                  <p className="text-sm text-gray-600 mb-4">Side-by-side analysis of course performance and metrics</p>
                  <Button variant="outline" className="w-full" onClick={() => navigateToTab('comparison')}>
                    Compare Courses
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Student Retention</h3>
                  <p className="text-sm text-gray-600 mb-4">Monitor engagement and identify at-risk students</p>
                  <Button variant="outline" className="w-full" onClick={() => navigateToTab('retention')}>
                    View Retention
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Export Reports</h3>
                  <p className="text-sm text-gray-600 mb-4">Generate PDF/Excel reports for business analysis</p>
                  <Button variant="outline" className="w-full" onClick={() => navigateToTab('reports')}>
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🚀 Phase 2: Advanced Analytics & Reporting Complete!</h4>
              <p className="text-sm text-blue-800 mb-4">
                Your trainer dashboard now includes comprehensive business intelligence tools to help you make data-driven decisions and grow your training business.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <strong>✅ Revenue Analytics:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Monthly/quarterly revenue trends</li>
                    <li>• Growth forecasting</li>
                    <li>• Revenue breakdown analysis</li>
                    <li>• Financial performance metrics</li>
                  </ul>
                </div>
                <div>
                  <strong>✅ Advanced Features:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• Course performance comparison</li>
                    <li>• Student retention tracking</li>
                    <li>• Risk assessment tools</li>
                    <li>• PDF/Excel export capabilities</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
