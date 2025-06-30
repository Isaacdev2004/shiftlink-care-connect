
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, DollarSign, Star, BookOpen, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CourseAnalytics {
  id: string;
  title: string;
  totalStudents: number;
  completedStudents: number;
  completionRate: number;
  totalRevenue: number;
  averageRating: number;
  certificatesIssued: number;
  isActive: boolean;
}

const CourseAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<CourseAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCourseAnalytics();
    }
  }, [user]);

  const fetchCourseAnalytics = async () => {
    try {
      // Get courses with enrollment and completion data
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          is_active,
          course_enrollments(
            id,
            amount_paid,
            student_id,
            payment_status
          ),
          certificates(
            id,
            student_id
          )
        `)
        .eq('trainer_id', user?.id);

      if (coursesError) throw coursesError;

      const analyticsData: CourseAnalytics[] = courses?.map(course => {
        const enrollments = course.course_enrollments || [];
        const certificates = course.certificates || [];
        
        const paidEnrollments = enrollments.filter(e => e.payment_status === 'completed');
        const totalStudents = paidEnrollments.length;
        const completedStudents = certificates.length;
        const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;
        const totalRevenue = paidEnrollments.reduce((sum, e) => sum + (e.amount_paid || 0), 0);

        return {
          id: course.id,
          title: course.title,
          totalStudents,
          completedStudents,
          completionRate,
          totalRevenue: Number(totalRevenue),
          averageRating: 4.2, // Placeholder - would need feedback system
          certificatesIssued: certificates.length,
          isActive: course.is_active
        };
      }) || [];

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching course analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-24 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Course Analytics</h3>
        <p className="text-gray-600">Detailed performance metrics for your courses</p>
      </div>

      {analytics.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Course Data Available</h3>
            <p className="text-gray-500">Create courses and get enrollments to see analytics here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analytics.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <Badge variant={course.isActive ? "default" : "secondary"}>
                    {course.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium">{course.totalStudents}</div>
                      <div className="text-gray-500">Students</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">${course.totalRevenue.toFixed(0)}</div>
                      <div className="text-gray-500">Revenue</div>
                    </div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-medium">{course.completionRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>

                {/* Additional Metrics */}
                <div className="flex justify-between items-center text-sm pt-2 border-t">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span>{course.averageRating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span>{course.certificatesIssued} certs</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseAnalyticsDashboard;
