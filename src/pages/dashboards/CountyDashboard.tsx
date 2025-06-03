
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, Flag, Calendar, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import ShiftAnalytics from '@/components/ShiftAnalytics';
import CredentialReports from '@/components/CredentialReports';
import DSPApprovalManager from '@/components/DSPApprovalManager';
import JobFairManager from '@/components/JobFairManager';

const CountyDashboard = () => {
  const [stats] = useState({
    totalDSPs: 156,
    pendingApprovals: 12,
    activeDSPs: 144,
    flaggedDSPs: 8,
    upcomingJobFairs: 3,
    totalShifts: 2847,
    credentialIssues: 23,
    complianceRate: 94.2
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">County Board Dashboard</h1>
              <p className="text-gray-600">Regional oversight and compliance management</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
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
                  <p className="text-sm font-medium text-gray-600">Active DSPs</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeDSPs}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingApprovals}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Flagged DSPs</p>
                  <p className="text-2xl font-bold text-red-600">{stats.flaggedDSPs}</p>
                </div>
                <Flag className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.complianceRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Shift Analytics</TabsTrigger>
            <TabsTrigger value="credentials">Credential Reports</TabsTrigger>
            <TabsTrigger value="dsps">DSP Management</TabsTrigger>
            <TabsTrigger value="jobfairs">Job Fairs</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <ShiftAnalytics />
          </TabsContent>

          <TabsContent value="credentials">
            <CredentialReports />
          </TabsContent>

          <TabsContent value="dsps">
            <DSPApprovalManager />
          </TabsContent>

          <TabsContent value="jobfairs">
            <JobFairManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CountyDashboard;
