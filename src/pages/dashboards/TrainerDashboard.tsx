import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, BookOpen, Users, DollarSign, Star, Calendar, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CourseManager from '@/components/CourseManager';
import CourseForm from '@/components/CourseForm';
import TrainerProfile from '@/components/TrainerProfile';
import CommissionTracker from '@/components/CommissionTracker';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  capacity: number;
  enrolled: number;
  nextDate: string;
  status: string;
  rating: number;
  reviews: number;
}

interface Student {
  id: string;
  courseId: string;
  name: string;
  email: string;
  phone: string;
  enrolledDate: string;
  status: 'enrolled' | 'completed' | 'dropped';
  progress: number;
}

const TrainerDashboard = () => {
  const [courses, setCourses] = useState<Course[]>([
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

  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      courseId: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      enrolledDate: '2024-06-01',
      status: 'enrolled',
      progress: 75
    },
    {
      id: '2',
      courseId: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 987-6543',
      enrolledDate: '2024-06-02',
      status: 'completed',
      progress: 100
    }
  ]);

  const [showCreateCourseDialog, setShowCreateCourseDialog] = useState(false);

  const [stats] = useState({
    totalEarnings: 4750.25,
    totalStudents: 156,
    activeCourses: 4,
    averageRating: 4.8,
    pendingCommission: 475.25,
    completedCourses: 23
  });

  const handleCreateCourse = (courseData: Omit<Course, 'id' | 'enrolled' | 'rating' | 'reviews'>) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      ...courseData,
      enrolled: 0,
      rating: 0,
      reviews: 0
    };
    
    setCourses(prev => [...prev, newCourse]);
    setShowCreateCourseDialog(false);
    toast({
      title: "Success",
      description: "Course created successfully"
    });
  };

  const handleStudentsChange = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    
    // Update course enrollment counts
    const updatedCourses = courses.map(course => {
      const courseStudents = updatedStudents.filter(student => student.courseId === course.id);
      return {
        ...course,
        enrolled: courseStudents.length
      };
    });
    setCourses(updatedCourses);
  };

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
            <Button 
              className="bg-medical-blue hover:bg-blue-800"
              onClick={() => setShowCreateCourseDialog(true)}
            >
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
                  <p className="text-2xl font-bold text-blue-600">{students.length}</p>
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
                  <p className="text-2xl font-bold text-purple-600">{courses.filter(c => c.status === 'active').length}</p>
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
            <CourseManager 
              courses={courses} 
              onCoursesChange={setCourses}
              students={students}
              onStudentsChange={handleStudentsChange}
            />
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
                <div className="space-y-4">
                  {courses.map(course => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{course.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {students.filter(s => s.courseId === course.id).length} students enrolled
                      </p>
                      <div className="space-y-2">
                        {students
                          .filter(student => student.courseId === course.id)
                          .map(student => (
                            <div key={student.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-sm text-gray-600">{student.email}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={
                                  student.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  student.status === 'enrolled' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                                }>
                                  {student.status}
                                </Badge>
                                <p className="text-sm text-gray-600 mt-1">{student.progress}% complete</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Course Dialog */}
      <Dialog open={showCreateCourseDialog} onOpenChange={setShowCreateCourseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <CourseForm
            onSave={handleCreateCourse}
            onCancel={() => setShowCreateCourseDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainerDashboard;
