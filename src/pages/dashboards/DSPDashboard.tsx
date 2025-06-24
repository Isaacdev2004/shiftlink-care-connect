import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, MapPin, DollarSign, Users, AlertTriangle, Upload, Clock } from 'lucide-react';
import CredentialAlerts from '@/components/CredentialAlerts';
import CredentialTracker from '@/components/CredentialTracker';
import CertificateUpload from '@/components/CertificateUpload';
import EVVClockSystem from '@/components/EVVClockSystem';

const DSPDashboard = () => {
  const navigate = useNavigate();
  
  const [upcomingShifts] = useState([
    {
      id: '1',
      facility: 'Sunrise Care Center',
      date: '2024-06-15',
      time: '7:00 AM - 3:00 PM',
      rate: '$22/hr',
      status: 'confirmed'
    },
    {
      id: '2',
      facility: 'Meadowbrook Assisted Living',
      date: '2024-06-16',
      time: '3:00 PM - 11:00 PM',
      rate: '$24/hr',
      status: 'pending'
    }
  ]);

  const [stats] = useState({
    totalShifts: 45,
    totalEarnings: 8750.25,
    avgRating: 4.8,
    completionRate: 96
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">DSP Dashboard</h1>
              <p className="text-gray-600">Manage your shifts, credentials, and training</p>
            </div>
            <Button 
              className="bg-medical-blue hover:bg-blue-800"
              onClick={() => navigate('/shifts')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Browse Shifts
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalShifts}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-600">${stats.totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.avgRating}</p>
                </div>
                <Users className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completionRate}%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="shifts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="shifts">My Shifts</TabsTrigger>
            <TabsTrigger value="clockin">Clock In/Out</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="tracking">Credential Tracking</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>

          <TabsContent value="shifts">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Shifts</CardTitle>
                <CardDescription>View and manage your scheduled shifts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingShifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{shift.facility}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{shift.date}</span>
                          </div>
                          <span>{shift.time}</span>
                          <span className="font-medium text-green-600">{shift.rate}</span>
                        </div>
                      </div>
                      <Badge variant={shift.status === 'confirmed' ? 'default' : 'secondary'}>
                        {shift.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clockin">
            <EVVClockSystem />
          </TabsContent>

          <TabsContent value="credentials">
            <CredentialAlerts />
          </TabsContent>

          <TabsContent value="tracking">
            <CredentialTracker />
          </TabsContent>

          <TabsContent value="certificates">
            <CertificateUpload />
          </TabsContent>

          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Training Courses</CardTitle>
                <CardDescription>Browse and enroll in training courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Training course enrollment coming soon</p>
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
