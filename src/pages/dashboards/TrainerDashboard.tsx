
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Users, DollarSign, Star, Calendar, MapPin } from 'lucide-react';
import CourseManager from '@/components/CourseManager';
import TrainerProfile from '@/components/TrainerProfile';
import CommissionTracker from '@/components/CommissionTracker';

const TrainerDashboard = () => {
  const [courses] = useState([
    {
      id: '1',
      title: 'CPR & First Aid Certification',
      description: 'Comprehensive CPR and First Aid training with AHA certification',
      price: 99.99,
      duration: '4 hours',
      location: 'Columbus, OH',
      capacity: 20,
      enrolled: 15,
      nextDate: '2024-06-15',
      status: 'active',
      rating: 4.8,
      reviews: 32
    },
    {
      id: '2',
      title: 'Medication Administration Training',
      description: 'Learn proper medication administration techniques and safety protocols',
      price: 149.99,
      duration: '6 hours',
      location: 'Online',
      capacity: 30,
      enrolled: 22,
      nextDate: '2024-06-20',
      status: 'active',
      rating: 4.9,
      reviews: 18
    }
  ]);

  const [stats] = useState({
    totalEarnings: 4750.25,
    totalStudents: 156,
    activeCourses: 4,
    averageRating: 4.8,
    pendingCommission: 475.25,
    completedCourses: 23
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trainer Dashboard</h1>
              <p className="text-gray-600">Manage your courses and track your earnings</p>
            </div>
            <Button className="bg-medical-blue hover:bg-blue-800">
              <Plus className="w-4 h-4 mr-2" />
              Create New Course
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">${stats.totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.activeCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.averageRating}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <CourseManager courses={courses} />
          </TabsContent>

          <TabsContent value="profile">
            <TrainerProfile />
          </TabsContent>

          <TabsContent value="earnings">
            <CommissionTracker stats={stats} />
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>View and manage your students across all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Student management features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrainerDashboard;
