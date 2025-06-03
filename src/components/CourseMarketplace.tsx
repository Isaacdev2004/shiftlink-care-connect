
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, MapPin, Calendar, Users, Clock, DollarSign } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorRating: number;
  price: number;
  duration: string;
  location: string;
  category: string;
  nextDate: string;
  spotsLeft: number;
  rating: number;
  reviews: number;
}

const CourseMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'CPR & First Aid Certification',
      description: 'Comprehensive CPR and First Aid training with American Heart Association certification. Learn life-saving techniques.',
      instructor: 'Dr. Sarah Johnson',
      instructorRating: 4.9,
      price: 99.99,
      duration: '4 hours',
      location: 'Columbus, OH',
      category: 'CPR/First Aid',
      nextDate: '2024-06-15',
      spotsLeft: 5,
      rating: 4.8,
      reviews: 32
    },
    {
      id: '2',
      title: 'Medication Administration Training',
      description: 'Learn proper medication administration techniques, safety protocols, and documentation requirements.',
      instructor: 'Nurse Patricia Williams',
      instructorRating: 4.7,
      price: 149.99,
      duration: '6 hours',
      location: 'Online',
      category: 'Medication',
      nextDate: '2024-06-20',
      spotsLeft: 8,
      rating: 4.9,
      reviews: 18
    },
    {
      id: '3',
      title: 'Mental Health First Aid',
      description: 'Training to recognize signs of mental health crises and provide initial support to individuals in need.',
      instructor: 'Dr. Michael Chen',
      instructorRating: 4.8,
      price: 119.99,
      duration: '8 hours',
      location: 'Cincinnati, OH',
      category: 'Mental Health',
      nextDate: '2024-06-25',
      spotsLeft: 12,
      rating: 4.7,
      reviews: 24
    }
  ]);

  const categories = ['all', 'CPR/First Aid', 'Medication', 'Mental Health', 'Safety', 'Specialized'];
  const locations = ['all', 'Columbus, OH', 'Cincinnati, OH', 'Cleveland, OH', 'Online'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || course.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleEnroll = (courseId: string) => {
    console.log('Enrolling in course:', courseId);
    // This will be replaced with actual payment integration
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Healthcare Training Marketplace</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find and enroll in professional healthcare training courses. Earn certifications from qualified instructors.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="secondary">{course.category}</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{course.rating}</span>
                  <span className="text-sm text-gray-500">({course.reviews})</span>
                </div>
              </div>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription className="line-clamp-3">{course.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Instructor */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">{course.instructorRating} instructor rating</span>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">${course.price}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{course.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Next: {course.nextDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{course.spotsLeft} spots left</span>
                </div>
              </div>

              {/* Enroll Button */}
              <Button 
                className="w-full bg-medical-blue hover:bg-blue-800"
                onClick={() => handleEnroll(course.id)}
                disabled={course.spotsLeft === 0}
              >
                {course.spotsLeft === 0 ? 'Fully Booked' : 'Enroll Now'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse all available courses.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseMarketplace;
