import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, Users, Calendar, DollarSign, Plus, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import DatabaseCourseForm from './DatabaseCourseForm';
import CourseContentManager from './CourseContentManager';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration_hours: number;
  category: string;
  max_students: number;
  is_active: boolean;
  created_at: string;
  requirements: string;
  enrollment_count?: number;
}

const DatabaseCourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showContentManager, setShowContentManager] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log('DatabaseCourseManager: useEffect triggered, user:', user);
    if (user) {
      fetchCourses();
    } else {
      console.log('DatabaseCourseManager: No user found, stopping loading');
      setLoading(false);
      setError('Please log in to view your courses');
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      console.log('DatabaseCourseManager: Fetching courses for user:', user?.id);
      setError(null);
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_enrollments(count)
        `)
        .eq('trainer_id', user?.id);

      console.log('DatabaseCourseManager: Supabase response:', { data, error });

      if (error) {
        console.error('DatabaseCourseManager: Supabase error:', error);
        throw error;
      }

      const coursesWithCounts = data?.map(course => ({
        ...course,
        enrollment_count: course.course_enrollments?.[0]?.count || 0
      })) || [];

      console.log('DatabaseCourseManager: Processed courses:', coursesWithCounts);
      setCourses(coursesWithCounts);
    } catch (error) {
      console.error('DatabaseCourseManager: Error fetching courses:', error);
      setError('Failed to load courses. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      setCourses(courses.filter(course => course.id !== courseId));
      toast({
        title: "Success",
        description: "Course deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive"
      });
    }
  };

  const handleCourseUpdate = () => {
    fetchCourses();
    setEditingCourse(null);
    setShowCreateForm(false);
  };

  const getStatusBadge = (course: Course) => {
    if (!course.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (course.enrollment_count >= course.max_students) {
      return <Badge className="bg-orange-100 text-orange-800">Full</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access the course manager.</p>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Course Overview</TabsTrigger>
          <TabsTrigger value="content">Content Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Course Management</h3>
              <p className="text-gray-600">Manage your training courses and track enrollments</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} className="bg-medical-blue hover:bg-blue-800">
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </div>
                    {getStatusBadge(course)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-xl font-bold text-green-600">${course.price}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {course.duration_hours}h
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Category: {course.category}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Enrollment</span>
                      <span className="font-medium">{course.enrollment_count}/{course.max_students}</span>
                    </div>
                    <Progress value={(course.enrollment_count / course.max_students) * 100} className="h-2" />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setEditingCourse(course)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveTab('content');
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Content
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Students ({course.enrollment_count})
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {courses.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-4">Create your first course to start teaching.</p>
                <Button onClick={() => setShowCreateForm(true)} className="bg-medical-blue hover:bg-blue-800">
                  Create Your First Course
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content">
          {selectedCourse ? (
            <CourseContentManager course={selectedCourse} />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                <p className="text-gray-600 mb-4">Choose a course from the overview tab to manage its content.</p>
                <Button onClick={() => setActiveTab('overview')} variant="outline">
                  Go to Course Overview
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Course Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <DatabaseCourseForm
            onSuccess={handleCourseUpdate}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          {editingCourse && (
            <DatabaseCourseForm
              course={editingCourse}
              onSuccess={handleCourseUpdate}
              onCancel={() => setEditingCourse(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatabaseCourseManager;
