
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, Users, Calendar, MapPin, Star, DollarSign } from 'lucide-react';

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

interface CourseManagerProps {
  courses: Course[];
}

const CourseManager = ({ courses }: CourseManagerProps) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case 'full':
        return <Badge className="bg-orange-100 text-orange-800">Full</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Course Management</h3>
          <p className="text-gray-600">Manage your training courses and track enrollments</p>
        </div>
        <Button className="bg-medical-blue hover:bg-blue-800">
          Create New Course
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
                {getStatusBadge(course.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Price and Rating */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xl font-bold text-green-600">${course.price}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{course.rating}</span>
                  <span className="text-sm text-gray-500">({course.reviews})</span>
                </div>
              </div>

              {/* Course Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Next: {course.nextDate} • {course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{course.location}</span>
                </div>
              </div>

              {/* Enrollment Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Enrollment</span>
                  <span className="font-medium">{course.enrolled}/{course.capacity}</span>
                </div>
                <Progress value={(course.enrolled / course.capacity) * 100} className="h-2" />
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  Students
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseManager;
