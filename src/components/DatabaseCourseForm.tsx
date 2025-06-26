
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration_hours: number;
  category: string;
  requirements: string;
  max_students: number;
  is_active: boolean;
}

interface DatabaseCourseFormProps {
  course?: Course;
  onSuccess: () => void;
  onCancel: () => void;
}

const DatabaseCourseForm = ({ course, onSuccess, onCancel }: DatabaseCourseFormProps) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price || 0,
    duration_hours: course?.duration_hours || 1,
    category: course?.category || '',
    requirements: course?.requirements || '',
    max_students: course?.max_students || 20,
    is_active: course?.is_active ?? true
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const categories = [
    'CPR/First Aid',
    'Medication Administration',
    'Mental Health',
    'Safety Training',
    'Specialized Care',
    'Professional Development'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const courseData = {
        ...formData,
        trainer_id: user?.id,
        updated_at: new Date().toISOString(),
      };

      if (course) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', course.id);

        if (error) throw error;
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: course ? "Course updated successfully" : "Course created successfully"
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving course:', error);
      toast({
        title: "Error",
        description: "Failed to save course. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter course title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter course description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="Enter any prerequisites or requirements"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration_hours">Duration (hours)</Label>
              <Input
                id="duration_hours"
                type="number"
                min="1"
                value={formData.duration_hours}
                onChange={(e) => handleInputChange('duration_hours', parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max_students">Max Students</Label>
              <Input
                id="max_students"
                type="number"
                min="1"
                value={formData.max_students}
                onChange={(e) => handleInputChange('max_students', parseInt(e.target.value) || 20)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Course is active and visible to students</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-medical-blue hover:bg-blue-800" disabled={loading}>
              {loading ? 'Saving...' : (course ? 'Update Course' : 'Create Course')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DatabaseCourseForm;
