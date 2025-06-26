
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DatabaseCourseMarketplace from '@/components/DatabaseCourseMarketplace';
import DatabaseCourseManager from '@/components/DatabaseCourseManager';

const CoursesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('marketplace');

  // Check if user is a trainer
  const isTrainer = user?.user_metadata?.role === 'trainer';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Courses</h1>
          <p className="text-gray-600">
            {isTrainer ? 
              "Manage your courses and browse the marketplace for professional development" :
              "Browse and enroll in professional healthcare training courses"
            }
          </p>
        </div>

        {isTrainer ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="marketplace">Course Marketplace</TabsTrigger>
              <TabsTrigger value="manage">Manage My Courses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="marketplace" className="mt-6">
              <DatabaseCourseMarketplace />
            </TabsContent>
            
            <TabsContent value="manage" className="mt-6">
              <DatabaseCourseManager />
            </TabsContent>
          </Tabs>
        ) : (
          <DatabaseCourseMarketplace />
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
