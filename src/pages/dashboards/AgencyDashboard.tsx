import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Calendar, MessageSquare, BarChart3, Plus } from 'lucide-react';
import ShiftPosting from '@/components/ShiftPosting';
import PostedShiftsList, { PostedShift } from '@/components/PostedShiftsList';
import MessagingSystem from '@/components/MessagingSystem';

const AgencyDashboard = () => {
  const [stats, setStats] = useState({
    totalShifts: 45,
    activeDSPs: 28,
    pendingApplications: 12,
    thisMonthHours: 1240
  });

  const [postedShifts, setPostedShifts] = useState<PostedShift[]>([]);
  const [showShiftForm, setShowShiftForm] = useState(false);

  const handleShiftPosted = (shiftData: any) => {
    const newShift: PostedShift = {
      id: Date.now().toString(),
      ...shiftData,
      status: 'active' as const,
      applicationsCount: 0,
      createdAt: new Date().toISOString()
    };
    
    setPostedShifts(prev => [newShift, ...prev]);
    setStats(prev => ({
      ...prev,
      totalShifts: prev.totalShifts + 1
    }));
    setShowShiftForm(false);
  };

  const handleUpdateShift = (updatedShift: PostedShift) => {
    setPostedShifts(prev => 
      prev.map(shift => 
        shift.id === updatedShift.id ? updatedShift : shift
      )
    );
  };

  const handleDeleteShift = (shiftId: string) => {
    setPostedShifts(prev => prev.filter(shift => shift.id !== shiftId));
    setStats(prev => ({
      ...prev,
      totalShifts: Math.max(0, prev.totalShifts - 1)
    }));
  };

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
              <h1 className="text-lg font-bold text-medical-blue">ShiftLink Agency</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                className="bg-medical-blue hover:bg-blue-800"
                onClick={() => setShowShiftForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Shift
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <span className="text-sm font-medium">Sunrise Healthcare</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agency Dashboard</h2>
          <p className="text-gray-600">Manage your shifts, DSPs, and operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Shifts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalShifts}</p>
                </div>
                <Calendar className="w-8 h-8 text-medical-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active DSPs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeDSPs}</p>
                </div>
                <Users className="w-8 h-8 text-medical-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Apps</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Hours</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonthHours}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="shifts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shifts">Shift Management</TabsTrigger>
            <TabsTrigger value="dsps">DSP Network</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="shifts" className="space-y-6">
            {showShiftForm ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Post New Shift</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowShiftForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <ShiftPosting onShiftPosted={handleShiftPosted} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Manage Your Shifts</h3>
                  <Button 
                    className="bg-medical-blue hover:bg-blue-800"
                    onClick={() => setShowShiftForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Shift
                  </Button>
                </div>
                <PostedShiftsList 
                  shifts={postedShifts}
                  onUpdateShift={handleUpdateShift}
                  onDeleteShift={handleDeleteShift}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="dsps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DSP Network Management</CardTitle>
                <CardDescription>Manage your network of Direct Support Professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">DSP Network</h3>
                  <p className="text-gray-600 mb-4">View and manage your DSP relationships</p>
                  <Button className="bg-medical-blue hover:bg-blue-800">
                    View DSP Network
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <MessagingSystem userRole="agency" />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>Track your agency's performance and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600 mb-4">View detailed analytics and reports</p>
                  <Button className="bg-medical-blue hover:bg-blue-800">
                    View Analytics
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

export default AgencyDashboard;
