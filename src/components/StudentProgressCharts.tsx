
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ProgressData {
  date: string;
  hoursSpent: number;
  quizScore: number;
}

interface CourseProgress {
  courseName: string;
  completedLessons: number;
  totalLessons: number;
  progress: number;
}

const StudentProgressCharts = () => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const chartConfig = {
    hoursSpent: {
      label: "Hours Spent",
      color: "#3b82f6",
    },
    quizScore: {
      label: "Quiz Score",
      color: "#10b981",
    },
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  useEffect(() => {
    if (user) {
      fetchProgressData();
    }
  }, [user]);

  const fetchProgressData = async () => {
    try {
      console.log('Fetching progress data for user:', user?.id);

      // Get progress data over time
      const { data: progressData, error: progressError } = await supabase
        .from('student_progress')
        .select(`
          created_at,
          time_spent_minutes,
          quiz_score,
          course_id,
          courses (title)
        `)
        .eq('student_id', user?.id)
        .order('created_at', { ascending: true });

      if (progressError) throw progressError;

      // Process data for line chart (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailyProgress: { [key: string]: { hours: number; scores: number[]; count: number } } = {};

      progressData?.forEach(item => {
        const date = new Date(item.created_at).toLocaleDateString();
        if (new Date(item.created_at) >= thirtyDaysAgo) {
          if (!dailyProgress[date]) {
            dailyProgress[date] = { hours: 0, scores: [], count: 0 };
          }
          dailyProgress[date].hours += (item.time_spent_minutes || 0) / 60;
          if (item.quiz_score) {
            dailyProgress[date].scores.push(item.quiz_score);
          }
          dailyProgress[date].count++;
        }
      });

      const chartData = Object.entries(dailyProgress).map(([date, data]) => ({
        date,
        hoursSpent: Math.round(data.hours * 10) / 10,
        quizScore: data.scores.length > 0 
          ? Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length)
          : 0
      }));

      setProgressData(chartData);

      // Get course progress data
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('course_enrollments')
        .select(`
          courses (
            id,
            title,
            course_modules (
              course_lessons (
                id
              )
            )
          )
        `)
        .eq('student_id', user?.id);

      if (enrollmentError) throw enrollmentError;

      const courseProgressData: CourseProgress[] = [];

      for (const enrollment of enrollments || []) {
        if (enrollment.courses) {
          const course = enrollment.courses;
          const totalLessons = course.course_modules?.reduce((sum, module) => 
            sum + (module.course_lessons?.length || 0), 0) || 0;

          // Get completed lessons for this course
          const { data: completedLessons, error: completedError } = await supabase
            .from('student_progress')
            .select('lesson_id')
            .eq('student_id', user?.id)
            .eq('course_id', course.id)
            .not('completed_at', 'is', null);

          if (!completedError && totalLessons > 0) {
            const completed = completedLessons?.length || 0;
            courseProgressData.push({
              courseName: course.title,
              completedLessons: completed,
              totalLessons,
              progress: Math.round((completed / totalLessons) * 100)
            });
          }
        }
      }

      setCourseProgress(courseProgressData);
      console.log('Progress data loaded:', { chartData, courseProgressData });

    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Learning Progress Over Time</span>
          </CardTitle>
          <CardDescription>Your daily learning hours and quiz scores (last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          {progressData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="hoursSpent" 
                    stroke={chartConfig.hoursSpent.color}
                    strokeWidth={2}
                    dot={{ fill: chartConfig.hoursSpent.color, strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="quizScore" 
                    stroke={chartConfig.quizScore.color}
                    strokeWidth={2}
                    dot={{ fill: chartConfig.quizScore.color, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No progress data available yet. Start learning to see your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Course Completion Progress</span>
          </CardTitle>
          <CardDescription>Your progress in each enrolled course</CardDescription>
        </CardHeader>
        <CardContent>
          {courseProgress.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseProgress} layout="horizontal">
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="courseName" 
                    tick={{ fontSize: 12 }}
                    width={150}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value, name) => [
                        `${value}% (${courseProgress.find(c => c.progress === value)?.completedLessons || 0}/${courseProgress.find(c => c.progress === value)?.totalLessons || 0} lessons)`,
                        'Progress'
                      ]}
                    />} 
                  />
                  <Bar 
                    dataKey="progress" 
                    fill={chartConfig.hoursSpent.color}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No enrolled courses yet. Browse and enroll in courses to track your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProgressCharts;
