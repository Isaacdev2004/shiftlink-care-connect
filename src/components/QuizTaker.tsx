
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, CheckCircle, XCircle, HelpCircle, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string;
  explanation: string;
  order_index: number;
}

interface QuizTakerProps {
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  onBack: () => void;
  onComplete: (score: number) => void;
}

const QuizTaker = ({ lessonId, lessonTitle, courseId, onBack, onComplete }: QuizTakerProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, [lessonId]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index');

      if (error) throw error;

      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      toast({
        title: "Error",
        description: "Failed to load quiz questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      // Calculate score
      let correctAnswers = 0;
      questions.forEach(question => {
        if (answers[question.id] === question.correct_answer) {
          correctAnswers++;
        }
      });

      const finalScore = Math.round((correctAnswers / questions.length) * 100);
      setScore(finalScore);

      // Save progress
      await supabase
        .from('student_progress')
        .upsert({
          student_id: user?.id,
          course_id: courseId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
          quiz_score: finalScore,
          time_spent_minutes: 0 // Could be tracked more accurately
        });

      setShowResults(true);
      
      toast({
        title: "Quiz Completed",
        description: `You scored ${finalScore}%`
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Award className="w-6 h-6 text-green-600" />;
    if (score >= 60) return <CheckCircle className="w-6 h-6 text-yellow-600" />;
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Available</h3>
            <p className="text-gray-600 mb-4">This quiz doesn't have any questions yet.</p>
            <Button onClick={onBack} variant="outline">
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Course</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getScoreIcon(score)}
            </div>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <p className="text-gray-600">{lessonTitle}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(score)}`}>
                {score}%
              </div>
              <p className="text-gray-600">
                You got {questions.filter(q => answers[q.id] === q.correct_answer).length} out of {questions.length} questions correct
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Question Review</h4>
              {questions.map((question, index) => {
                const isCorrect = answers[question.id] === question.correct_answer;
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">Question {index + 1}</p>
                        <p className="text-gray-700 mb-2">{question.question_text}</p>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="text-gray-500">Your answer: </span>
                            <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {answers[question.id] || 'Not answered'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="text-gray-500">Correct answer: </span>
                              <span className="text-green-600">{question.correct_answer}</span>
                            </p>
                          )}
                          {question.explanation && (
                            <p className="text-gray-600 text-xs mt-2">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => onComplete(score)}
                className="bg-medical-blue hover:bg-blue-800"
              >
                Continue Learning
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const allAnswered = questions.every(q => answers[q.id]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Course</span>
        </Button>
        
        <Badge variant="outline">
          Question {currentQuestionIndex + 1} of {questions.length}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{lessonTitle}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentQuestionIndex + 1}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-gray-700 leading-relaxed">{currentQuestion.question_text}</p>

          {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            >
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={value as string} id={`${currentQuestion.id}-${key}`} />
                  <Label 
                    htmlFor={`${currentQuestion.id}-${key}`} 
                    className="flex-1 cursor-pointer"
                  >
                    {value as string}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.question_type === 'true_false' && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="True" id={`${currentQuestion.id}-true`} />
                <Label htmlFor={`${currentQuestion.id}-true`} className="cursor-pointer">
                  True
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="False" id={`${currentQuestion.id}-false`} />
                <Label htmlFor={`${currentQuestion.id}-false`} className="cursor-pointer">
                  False
                </Label>
              </div>
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex items-center space-x-3">
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitQuiz}
              disabled={!allAnswered || submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
        </div>
      </div>

      {!allAnswered && currentQuestionIndex === questions.length - 1 && (
        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Please answer all questions before submitting the quiz.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizTaker;
