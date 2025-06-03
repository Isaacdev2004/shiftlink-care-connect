
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, MapPin, Clock, User, FileText } from 'lucide-react';

const EVVLogs = () => {
  const [dateRange, setDateRange] = useState('7');
  const [filterStatus, setFilterStatus] = useState('all');

  const evvLogs = [
    {
      id: '1',
      dsp: 'Sarah Johnson',
      client: 'Mary Wilson',
      facility: 'Sunrise Care Center',
      clockIn: '2024-06-15 08:00:00',
      clockOut: '2024-06-15 16:00:00',
      duration: '8h 0m',
      location: '40.7128, -74.0060',
      status: 'verified',
      medicaidId: 'MED-2024-001'
    },
    {
      id: '2',
      dsp: 'Michael Chen',
      client: 'Robert Davis',
      facility: 'Valley View Manor',
      clockIn: '2024-06-15 07:30:00',
      clockOut: '2024-06-15 15:30:00',
      duration: '8h 0m',
      location: '40.7589, -73.9851',
      status: 'verified',
      medicaidId: 'MED-2024-002'
    },
    {
      id: '3',
      dsp: 'Jennifer Brown',
      client: 'Linda Garcia',
      facility: 'Oakwood Center',
      clockIn: '2024-06-14 09:00:00',
      clockOut: '2024-06-14 17:00:00',
      duration: '8h 0m',
      location: '40.6782, -73.9442',
      status: 'pending',
      medicaidId: 'MED-2024-003'
    },
    {
      id: '4',
      dsp: 'David Rodriguez',
      client: 'Patricia Jones',
      facility: 'Maple Heights',
      clockIn: '2024-06-14 08:15:00',
      clockOut: '2024-06-14 16:15:00',
      duration: '8h 0m',
      location: '40.7505, -73.9934',
      status: 'flagged',
      medicaidId: 'MED-2024-004'
    }
  ];

  const filteredLogs = evvLogs.filter(log => {
    if (filterStatus === 'all') return true;
    return log.status === filterStatus;
  });

  const exportToCSV = () => {
    const headers = ['DSP Name', 'Client', 'Facility', 'Clock In', 'Clock Out', 'Duration', 'GPS Location', 'Status', 'Medicaid ID'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.dsp,
        log.client,
        log.facility,
        log.clockIn,
        log.clockOut,
        log.duration,
        log.location,
        log.status,
        log.medicaidId
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evv-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={exportToCSV} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Export EVV Logs
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold">{filteredLogs.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredLogs.filter(log => log.status === 'verified').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredLogs.filter(log => log.status === 'pending').length}
                </p>
              </div>
              <User className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EVV Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Electronic Visit Verification Logs</CardTitle>
          <CardDescription>
            Medicaid-compliant visit verification with GPS tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DSP</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>GPS Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Medicaid ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.dsp}</TableCell>
                    <TableCell>{log.client}</TableCell>
                    <TableCell>{log.facility}</TableCell>
                    <TableCell>{new Date(log.clockIn).toLocaleString()}</TableCell>
                    <TableCell>{new Date(log.clockOut).toLocaleString()}</TableCell>
                    <TableCell>{log.duration}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="text-sm">{log.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.medicaidId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EVVLogs;
