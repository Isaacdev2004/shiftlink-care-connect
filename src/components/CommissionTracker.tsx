
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, Calendar, Download, Eye } from 'lucide-react';

interface CommissionStats {
  totalEarnings: number;
  totalStudents: number;
  activeCourses: number;
  averageRating: number;
  pendingCommission: number;
  completedCourses: number;
}

interface CommissionTrackerProps {
  stats: CommissionStats;
}

const CommissionTracker = ({ stats }: CommissionTrackerProps) => {
  const [transactions] = useState([
    {
      id: '1',
      date: '2024-06-01',
      course: 'CPR & First Aid Certification',
      student: 'John Smith',
      amount: 99.99,
      commission: 10.00,
      status: 'paid'
    },
    {
      id: '2',
      date: '2024-06-02',
      course: 'Medication Administration Training',
      student: 'Mary Johnson',
      amount: 149.99,
      commission: 15.00,
      status: 'pending'
    },
    {
      id: '3',
      date: '2024-06-03',
      course: 'CPR & First Aid Certification',
      student: 'David Wilson',
      amount: 99.99,
      commission: 10.00,
      status: 'paid'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">Processing</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalCommissionEarned = transactions
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + t.commission, 0);

  const pendingCommissionAmount = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.commission, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Earnings & Commission</h3>
          <p className="text-gray-600">Track your earnings and commission payments (10% platform fee)</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-medical-blue hover:bg-blue-800">
            Request Payout
          </Button>
        </div>
      </div>

      {/* Commission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalEarnings.toLocaleString()}</p>
                <p className="text-xs text-gray-500">After 10% platform fee</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Paid</p>
                <p className="text-2xl font-bold text-blue-600">${totalCommissionEarned.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Platform commission (10%)</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Commission</p>
                <p className="text-2xl font-bold text-orange-600">${pendingCommissionAmount.toFixed(2)}</p>
                <p className="text-xs text-gray-500">To be processed</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings Progress</CardTitle>
          <CardDescription>Track your progress towards monthly earnings goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">June 2024 Goal: $5,000</span>
              <span className="text-sm text-gray-600">${stats.totalEarnings.toLocaleString()} / $5,000</span>
            </div>
            <Progress value={(stats.totalEarnings / 5000) * 100} className="h-3" />
            <p className="text-sm text-gray-600">
              You're {((stats.totalEarnings / 5000) * 100).toFixed(1)}% towards your monthly goal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>View your recent course enrollments and commission details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{transaction.course}</p>
                      <p className="text-sm text-gray-600">Student: {transaction.student}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-semibold">${transaction.amount}</p>
                  <p className="text-sm text-gray-600">Commission: ${transaction.commission}</p>
                  {getStatusBadge(transaction.status)}
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionTracker;
