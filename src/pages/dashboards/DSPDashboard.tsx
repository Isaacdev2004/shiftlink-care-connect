
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Clock, 
  MapPin, 
  Star, 
  FileText, 
  Calendar, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Upload,
  Bell
} from 'lucide-react';

const DSPDashboard = () => {
  const [profileCompletion] = useState(75);
  
  const upcomingShifts = [
    {
      id: 1,
      agency: 'Sunrise Healthcare',
      client: 'Mrs. Johnson',
      date: '2024-06-03',
      time: '8:00 AM - 4:00 PM',
      location: 'Columbus, OH',
      pay: '$18/hr',
      status: 'confirmed'
    },
    {
      id: 2,
      agency: 'Compassionate Care',
      client: 'Mr. Smith',
      date: '2024-06-05',
      time: '2:00 PM - 10:00 PM',
      location: 'Dublin, OH',
      pay: '$20/hr',
      status: 'pending'
    }
  ];

  const credentials = [
    { name: 'CPR Certification', status: 'valid', expiry: '2024-12-15', urgent: false },
    { name: 'First Aid', status: 'valid', expiry: '2024-11-20', urgent: false },
    { name: 'Background Check', status: 'expired', expiry: '2024-05-01', urgent: true },
    { name: 'Med Administration', status: 'valid', expiry: '2024-08-30', urgent: false }
  ];

  const availableShifts = [
    {
      id: 1,
      agency: 'Golden Years Care',
      type: 'Personal Care',
      date: '2024-06-04',
      time: '6:00 AM - 2:00 PM',
      location: 'Westerville, OH',
      pay: '$19/hr',
      distance: '5.2 miles'
    },
    {
      id: 2,
      agency: 'Family First Home Care',
      type: 'Companionship',
      date: '2024-06-06',
      time: '10:00 AM - 6:00 PM',
      location: 'Hilliard, OH',
      pay: '$17/hr',
      distance: '8.1 miles'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-medical-blue">ShiftLink</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, John!</h2>
          <p className="text-gray-600">Here's what's happening with your healthcare shifts</p>
        </div>

        {/* Profile Completion Alert */}
        <Card className="mb-6 border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <CardTitle className="text-lg">Complete Your Profile</CardTitle>
              </div>
              <span className="text-sm text-gray-600">{profileCompletion}% complete</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={profileCompletion} className="mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              Complete your profile to unlock more shift opportunities and increase your visibility to agencies.
            </p>
            <Button size="sm" className="bg-medical-blue hover:bg-blue-800">
              Complete Profile
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">24 Hours</p>
                </div>
                <Clock className="w-8 h-8 text-medical-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">$432</p>
                </div>
                <DollarSign className="w-8 h-8 text-medical-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="shifts">Available Shifts</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Shifts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Upcoming Shifts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingShifts.map((shift) => (
                    <div key={shift.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{shift.agency}</h4>
                        <Badge variant={shift.status === 'confirmed' ? 'default' : 'secondary'}>
                          {shift.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Client: {shift.client}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {shift.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {shift.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {shift.location}
                        </span>
                        <span className="font-medium text-medical-green">{shift.pay}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Credential Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Credential Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {credentials.map((credential, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {credential.status === 'valid' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{credential.name}</p>
                          <p className="text-sm text-gray-600">Expires: {credential.expiry}</p>
                        </div>
                      </div>
                      {credential.urgent && (
                        <Badge variant="destructive">Urgent</Badge>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Documents
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shifts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Shifts Near You</CardTitle>
                <CardDescription>
                  Shifts matching your credentials and availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableShifts.map((shift) => (
                  <div key={shift.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{shift.agency}</h4>
                      <Badge variant="outline">{shift.type}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {shift.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {shift.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {shift.distance}
                      </div>
                      <div className="flex items-center font-medium text-medical-green">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {shift.pay}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{shift.location}</span>
                      <Button size="sm" className="bg-medical-blue hover:bg-blue-800">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credentials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Your Credentials</CardTitle>
                <CardDescription>
                  Keep your certifications up to date to qualify for more shifts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Credential Management</h3>
                  <p className="text-gray-600 mb-4">Upload and manage your professional credentials</p>
                  <Button className="bg-medical-blue hover:bg-blue-800">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Credentials
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Management</h3>
                  <p className="text-gray-600 mb-4">Update your professional profile and preferences</p>
                  <Button className="bg-medical-blue hover:bg-blue-800">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DSPDashboard;
