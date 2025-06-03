
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, Users, Search, Filter, Download, Eye, Edit } from 'lucide-react';

interface Transaction {
  id: string;
  trainerName: string;
  courseName: string;
  studentName: string;
  coursePrice: number;
  commissionRate: number;
  commissionAmount: number;
  platformFee: number;
  trainerEarnings: number;
  date: string;
  status: 'pending' | 'processed' | 'paid';
}

interface TrainerCommission {
  trainerId: string;
  trainerName: string;
  totalEarnings: number;
  totalCommission: number;
  pendingAmount: number;
  coursesCompleted: number;
  averageRating: number;
  commissionRate: number;
}

const AdminCommissionManager = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      trainerName: 'Dr. Sarah Johnson',
      courseName: 'CPR & First Aid Certification',
      studentName: 'John Smith',
      coursePrice: 99.99,
      commissionRate: 10,
      commissionAmount: 10.00,
      platformFee: 10.00,
      trainerEarnings: 89.99,
      date: '2024-06-01',
      status: 'paid'
    },
    {
      id: '2',
      trainerName: 'Nurse Patricia Williams',
      courseName: 'Medication Administration',
      studentName: 'Mary Johnson',
      coursePrice: 149.99,
      commissionRate: 15,
      commissionAmount: 22.50,
      platformFee: 22.50,
      trainerEarnings: 127.49,
      date: '2024-06-02',
      status: 'pending'
    },
    {
      id: '3',
      trainerName: 'Dr. Michael Chen',
      courseName: 'Mental Health First Aid',
      studentName: 'David Wilson',
      coursePrice: 119.99,
      commissionRate: 12,
      commissionAmount: 14.40,
      platformFee: 14.40,
      trainerEarnings: 105.59,
      date: '2024-06-03',
      status: 'processed'
    }
  ]);

  const [trainersCommission] = useState<TrainerCommission[]>([
    {
      trainerId: '1',
      trainerName: 'Dr. Sarah Johnson',
      totalEarnings: 4750.25,
      totalCommission: 475.25,
      pendingAmount: 125.00,
      coursesCompleted: 23,
      averageRating: 4.8,
      commissionRate: 10
    },
    {
      trainerId: '2',
      trainerName: 'Nurse Patricia Williams',
      totalEarnings: 3200.50,
      totalCommission: 480.08,
      pendingAmount: 225.00,
      coursesCompleted: 18,
      averageRating: 4.7,
      commissionRate: 15
    }
  ]);

  const totalRevenue = transactions.reduce((sum, t) => sum + t.coursePrice, 0);
  const totalCommission = transactions.reduce((sum, t) => sum + t.commissionAmount, 0);
  const pendingCommission = transactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.commissionAmount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'processed':
        return <Badge className="bg-blue-100 text-blue-800">Processed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.trainerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCommissionRateChange = (trainerId: string, newRate: number) => {
    console.log(`Updating commission rate for trainer ${trainerId} to ${newRate}%`);
    // This would update the trainer's commission rate in the database
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Commission Management</h3>
          <p className="text-gray-600">Monitor and manage platform commission rates (10-20%)</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-medical-blue hover:bg-blue-800">
            Process Payments
          </Button>
        </div>
      </div>

      {/* Commission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Commission</p>
                <p className="text-2xl font-bold text-blue-600">${totalCommission.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-orange-600">${pendingCommission.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trainers</p>
                <p className="text-2xl font-bold text-purple-600">{trainersCommission.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Transactions</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by trainer, course, or student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="period">Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="year-to-date">Year to Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trainer Commission Rates */}
      <Card>
        <CardHeader>
          <CardTitle>Trainer Commission Rates</CardTitle>
          <CardDescription>Manage individual trainer commission rates (10-20%)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainersCommission.map((trainer) => (
              <div key={trainer.trainerId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{trainer.trainerName}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                    <div>Total Earnings: ${trainer.totalEarnings.toFixed(2)}</div>
                    <div>Commission: ${trainer.totalCommission.toFixed(2)}</div>
                    <div>Courses: {trainer.coursesCompleted}</div>
                    <div>Rating: {trainer.averageRating} ⭐</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Commission Rate</p>
                    <p className="text-lg font-bold">{trainer.commissionRate}%</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Rate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View detailed commission breakdown for all transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-medium">{transaction.courseName}</p>
                      <p className="text-sm text-gray-600">Trainer: {transaction.trainerName}</p>
                      <p className="text-sm text-gray-600">Student: {transaction.studentName}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Course Price: ${transaction.coursePrice}</p>
                      <p>Commission ({transaction.commissionRate}%): ${transaction.commissionAmount}</p>
                      <p>Trainer Earnings: ${transaction.trainerEarnings}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Date: {transaction.date}</p>
                      <p>Status: {getStatusBadge(transaction.status)}</p>
                    </div>
                  </div>
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

export default AdminCommissionManager;
