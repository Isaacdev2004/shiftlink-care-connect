
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Shield, Users, MapPin, Star } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>('');

  const userRoles = [
    {
      id: 'dsp',
      title: 'Direct Support Professional',
      description: 'Find quality healthcare shifts that match your skills and availability',
      features: ['Flexible scheduling', 'Competitive pay', 'Skill-based matching', 'Career growth'],
      icon: Users,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      id: 'agency',
      title: 'Healthcare Agency',
      description: 'Connect with qualified DSPs and fill your shifts efficiently',
      features: ['Verified professionals', 'Real-time matching', 'Compliance tracking', 'Quality ratings'],
      icon: Shield,
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      id: 'trainer',
      title: 'Credential Trainer',
      description: 'Offer CPR, First Aid, and specialized healthcare training courses',
      features: ['Course management', 'Direct certification', 'Payment processing', 'Student tracking'],
      icon: Star,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      id: 'county',
      title: 'County Board Admin',
      description: 'Monitor local healthcare staffing and maintain compliance oversight',
      features: ['Staffing analytics', 'Compliance monitoring', 'Worker verification', 'Data reporting'],
      icon: MapPin,
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    }
  ];

  const handleGetStarted = () => {
    if (selectedRole) {
      navigate(`/register?role=${selectedRole}`);
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-medical-blue rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-medical-blue">Home Health ShiftLink</h1>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')} className="bg-medical-blue hover:bg-blue-800">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Connecting Healthcare
              <span className="text-medical-blue block">Professionals & Agencies</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The secure platform that matches qualified Direct Support Professionals with healthcare agencies, 
              while ensuring compliance and streamlining credential management.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Check className="w-4 h-4 mr-2" />
                GPS Clock-In/Out
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Shield className="w-4 h-4 mr-2" />
                Secure & Compliant
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                Real-Time Matching
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Role</h3>
            <p className="text-xl text-gray-600">Select the option that best describes you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {userRoles.map((role) => {
              const IconComponent = role.icon;
              return (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all duration-200 ${role.color} ${
                    selectedRole === role.id ? 'ring-2 ring-medical-blue shadow-lg' : ''
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                      <IconComponent className="w-6 h-6 text-medical-blue" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900">{role.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <Check className="w-4 h-4 text-medical-green mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-medical-blue hover:bg-blue-800 text-white px-8 py-3 text-lg"
            >
              Get Started Today
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Join thousands of healthcare professionals already using ShiftLink
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ShiftLink?</h3>
            <p className="text-xl text-gray-600">Built specifically for healthcare professionals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-medical-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Secure & Compliant</h4>
              <p className="text-gray-600">End-to-end encryption, HIPAA compliance, and secure document management with 6-year retention.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-medical-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Smart Matching</h4>
              <p className="text-gray-600">AI-powered matching based on credentials, location, availability, and care specialties.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Real-Time Updates</h4>
              <p className="text-gray-600">Live shift updates, GPS clock-in/out, and instant notifications for all stakeholders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">Home Health ShiftLink</h3>
            </div>
            <p className="text-gray-400 mb-6">Secure healthcare staffing solutions</p>
            <div className="flex justify-center space-x-6 text-sm">
              <button onClick={() => navigate('/terms')} className="hover:text-medical-blue-light transition-colors">
                Terms of Service
              </button>
              <button onClick={() => navigate('/privacy')} className="hover:text-medical-blue-light transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => navigate('/contact')} className="hover:text-medical-blue-light transition-colors">
                Contact
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
