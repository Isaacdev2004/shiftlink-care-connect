
import CourseMarketplace from '@/components/CourseMarketplace';

const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Healthcare Training Courses</h1>
            <p className="mt-2 text-gray-600">Advance your career with professional healthcare certifications</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CourseMarketplace />
      </div>
    </div>
  );
};

export default CoursesPage;
