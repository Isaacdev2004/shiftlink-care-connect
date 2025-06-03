
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react';

const ShiftAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30');

  const shiftTrendData = [
    { month: 'Jan', shifts: 245, coverage: 92 },
    { month: 'Feb', shifts: 268, coverage: 89 },
    { month: 'Mar', shifts: 289, coverage: 94 },
    { month: 'Apr', shifts: 312, coverage: 91 },
    { month: 'May', shifts: 298, coverage: 96 },
    { month: 'Jun', shifts: 334, coverage: 88 }
  ];

  const facilityCoverageData = [
    { facility: 'Sunrise Care', covered: 95, uncovered: 5 },
    { facility: 'Valley View', covered: 87, uncovered: 13 },
    { facility: 'Maple Heights', covered: 92, uncovered: 8 },
    { facility: 'Riverside Manor', covered: 89, uncovered: 11 },
    { facility: 'Oakwood Center', covered: 98, uncovered: 2 }
  ];

  const chartConfig = {
    shifts: {
      label: "Total Shifts",
      color: "#3b82f6",
    },
    coverage: {
      label: "Coverage %",
      color: "#10b981",
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Monthly Shifts</p>
                <p className="text-2xl font-bold">291</p>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% vs last period
                </div>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage Rate</p>
                <p className="text-2xl font-bold">92.1%</p>
                <div className="flex items-center text-red-600 text-sm">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -2.3% vs last period
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uncovered Shifts</p>
                <p className="text-2xl font-bold">23</p>
                <Badge variant="destructive" className="mt-1">High Priority</Badge>
              </div>
              <Calendar className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shift Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Trends & Coverage</CardTitle>
          <CardDescription>Monthly shift volume and coverage percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={shiftTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="shifts" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Total Shifts"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="coverage" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Coverage %"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Facility Coverage */}
      <Card>
        <CardHeader>
          <CardTitle>Facility Coverage Analysis</CardTitle>
          <CardDescription>Shift coverage by facility</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facilityCoverageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="facility" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="covered" stackId="a" fill="#10b981" name="Covered" />
                <Bar dataKey="uncovered" stackId="a" fill="#ef4444" name="Uncovered" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftAnalytics;
