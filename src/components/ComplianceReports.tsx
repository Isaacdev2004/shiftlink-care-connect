
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Shield, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

const ComplianceReports = () => {
  const [reportPeriod, setReportPeriod] = useState('monthly');

  const complianceData = [
    { month: 'Jan', compliant: 94, nonCompliant: 6, total: 100 },
    { month: 'Feb', compliant: 96, nonCompliant: 4, total: 100 },
    { month: 'Mar', compliant: 92, nonCompliant: 8, total: 100 },
    { month: 'Apr', compliant: 98, nonCompliant: 2, total: 100 },
    { month: 'May', compliant: 95, nonCompliant: 5, total: 100 },
    { month: 'Jun', compliant: 97, nonCompliant: 3, total: 100 }
  ];

  const violationTypes = [
    { name: 'Missing GPS', value: 35, color: '#ef4444' },
    { name: 'Late Clock-In', value: 25, color: '#f97316' },
    { name: 'Missing Clock-Out', value: 20, color: '#eab308' },
    { name: 'Location Mismatch', value: 15, color: '#8b5cf6' },
    { name: 'Other', value: 5, color: '#6b7280' }
  ];

  const chartConfig = {
    compliant: {
      label: "Compliant",
      color: "#10b981",
    },
    nonCompliant: {
      label: "Non-Compliant",
      color: "#ef4444",
    }
  };

  const generateDODDReport = () => {
    console.log('Generating DODD compliance report...');
    // This would generate a detailed report for DODD submission
  };

  const exportComplianceData = () => {
    const reportData = {
      period: reportPeriod,
      generatedAt: new Date().toISOString(),
      summary: {
        totalVisits: 2847,
        compliantVisits: 2753,
        nonCompliantVisits: 94,
        complianceRate: 96.7
      },
      violations: violationTypes,
      monthlyData: complianceData
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evv-compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <Select value={reportPeriod} onValueChange={setReportPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly Reports</SelectItem>
            <SelectItem value="monthly">Monthly Reports</SelectItem>
            <SelectItem value="quarterly">Quarterly Reports</SelectItem>
            <SelectItem value="annual">Annual Reports</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportComplianceData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={generateDODDReport} className="bg-blue-600 hover:bg-blue-700">
            <FileText className="w-4 h-4 mr-2" />
            Generate DODD Report
          </Button>
        </div>
      </div>

      {/* Compliance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
                <p className="text-2xl font-bold text-green-600">96.7%</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visits</p>
                <p className="text-2xl font-bold">2,847</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Violations</p>
                <p className="text-2xl font-bold text-red-600">94</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Level</p>
                <Badge className="bg-green-100 text-green-800">Low</Badge>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Trends</CardTitle>
          <CardDescription>Monthly EVV compliance rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="compliant" stackId="a" fill="#10b981" name="Compliant" />
                <Bar dataKey="nonCompliant" stackId="a" fill="#ef4444" name="Non-Compliant" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Violation Types */}
        <Card>
          <CardHeader>
            <CardTitle>Violation Types</CardTitle>
            <CardDescription>Breakdown of compliance violations</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={violationTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {violationTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {violationTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm">{type.name}</span>
                  </div>
                  <span className="text-sm font-medium">{type.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DODD Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>DODD EVV Requirements</CardTitle>
            <CardDescription>Ohio compliance checklist</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Service Provider Verification</span>
                <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Service Recipient Verification</span>
                <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Service Location Verification</span>
                <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Date/Time of Service</span>
                <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Type of Service Provided</span>
                <Badge className="bg-green-100 text-green-800">✓ Compliant</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">GPS Coordinates</span>
                <Badge className="bg-yellow-100 text-yellow-800">⚠ 96.7%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceReports;
