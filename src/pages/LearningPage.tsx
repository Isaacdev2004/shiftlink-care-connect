
import StudentLearningInterface from '@/components/StudentLearningInterface';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const LearningPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <StudentLearningInterface />
      </div>
    </div>
  );
};

export default LearningPage;
