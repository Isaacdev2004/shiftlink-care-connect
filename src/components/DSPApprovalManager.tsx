
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Flag, AlertTriangle, Eye, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DSP {
  id: number;
  name: string;
  email: string;
  facility: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  experience: string;
  certifications: string[];
  background: string;
  flagged: boolean;
  flagReason: string | null;
}

const DSPApprovalManager = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDSP, setSelectedDSP] = useState<DSP | null>(null);
  const [flagReason, setFlagReason] = useState('');
  const [showFlagDialog, setShowFlagDialog] = useState(false);

  const [dsps, setDSPs] = useState<DSP[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      facility: 'Sunrise Care',
      applicationDate: '2024-05-28',
      status: 'pending',
      experience: '2 years',
      certifications: ['CPR/First Aid', 'Basic DSP Training'],
      background: 'clear',
      flagged: false,
      flagReason: null
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      facility: 'Valley View',
      applicationDate: '2024-05-25',
      status: 'approved',
      experience: '5 years',
      certifications: ['CPR/First Aid', 'Medication Administration', 'Crisis Intervention'],
      background: 'clear',
      flagged: false,
      flagReason: null
    },
    {
      id: 3,
      name: 'Robert Smith',
      email: 'robert.smith@email.com',
      facility: 'Maple Heights',
      applicationDate: '2024-05-20',
      status: 'pending',
      experience: '1 year',
      certifications: ['Basic DSP Training'],
      background: 'pending',
      flagged: true,
      flagReason: 'Incomplete background check'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      facility: 'Riverside Manor',
      applicationDate: '2024-05-30',
      status: 'pending',
      experience: '3 years',
      certifications: ['CPR/First Aid', 'Basic DSP Training', 'Behavioral Support'],
      background: 'clear',
      flagged: false,
      flagReason: null
    }
  ]);

  const getStatusBadge = (status: string, flagged: boolean) => {
    if (flagged) {
      return <Badge variant="destructive"><Flag className="w-3 h-3 mr-1" />Flagged</Badge>;
    }
    
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500">Pending Review</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredDSPs = dsps.filter(dsp => {
    const matchesSearch = dsp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dsp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dsp.facility.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'flagged') return matchesSearch && dsp.flagged;
    return matchesSearch && dsp.status === statusFilter;
  });

  const handleApprove = (dspId: number) => {
    setDSPs(prev => prev.map(dsp => 
      dsp.id === dspId 
        ? { ...dsp, status: 'approved' as const, flagged: false, flagReason: null }
        : dsp
    ));

    const dsp = dsps.find(d => d.id === dspId);
    toast({
      title: "DSP Approved",
      description: `${dsp?.name} has been approved successfully.`,
      className: "bg-green-50 border-green-200",
    });

    setSelectedDSP(null);
  };

  const handleReject = (dspId: number) => {
    setDSPs(prev => prev.map(dsp => 
      dsp.id === dspId 
        ? { ...dsp, status: 'rejected' as const, flagged: false, flagReason: null }
        : dsp
    ));

    const dsp = dsps.find(d => d.id === dspId);
    toast({
      title: "DSP Rejected",
      description: `${dsp?.name}'s application has been rejected.`,
      variant: "destructive",
    });

    setSelectedDSP(null);
  };

  const handleFlag = (dspId: number, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Flag Reason Required",
        description: "Please provide a reason for flagging this DSP.",
        variant: "destructive",
      });
      return;
    }

    setDSPs(prev => prev.map(dsp => 
      dsp.id === dspId 
        ? { ...dsp, flagged: true, flagReason: reason }
        : dsp
    ));

    const dsp = dsps.find(d => d.id === dspId);
    toast({
      title: "DSP Flagged",
      description: `${dsp?.name} has been flagged for review.`,
      className: "bg-yellow-50 border-yellow-200",
    });

    setFlagReason('');
    setShowFlagDialog(false);
    setSelectedDSP(null);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total DSPs</p>
                <p className="text-2xl font-bold">{dsps.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {dsps.filter(d => d.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600">
                  {dsps.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-red-600">
                  {dsps.filter(d => d.flagged).length}
                </p>
              </div>
              <Flag className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DSP Management */}
      <Card>
        <CardHeader>
          <CardTitle>DSP Approval & Management</CardTitle>
          <CardDescription>Review, approve, and manage DSP applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or facility..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* DSPs Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Application Date</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDSPs.map((dsp) => (
                  <TableRow key={dsp.id}>
                    <TableCell>
                      {getStatusBadge(dsp.status, dsp.flagged)}
                    </TableCell>
                    <TableCell className="font-medium">{dsp.name}</TableCell>
                    <TableCell>{dsp.email}</TableCell>
                    <TableCell>{dsp.facility}</TableCell>
                    <TableCell>{dsp.applicationDate}</TableCell>
                    <TableCell>{dsp.experience}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedDSP(dsp)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>DSP Application Details</DialogTitle>
                              <DialogDescription>
                                Review application for {selectedDSP?.name}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedDSP && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Name</label>
                                    <p className="text-sm text-gray-600">{selectedDSP.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-gray-600">{selectedDSP.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Facility</label>
                                    <p className="text-sm text-gray-600">{selectedDSP.facility}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Experience</label>
                                    <p className="text-sm text-gray-600">{selectedDSP.experience}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Certifications</label>
                                  <div className="flex gap-2 mt-1">
                                    {selectedDSP.certifications.map((cert: string, index: number) => (
                                      <Badge key={index} variant="outline">{cert}</Badge>
                                    ))}
                                  </div>
                                </div>
                                {selectedDSP.flagged && selectedDSP.flagReason && (
                                  <div>
                                    <label className="text-sm font-medium text-red-600">Flag Reason</label>
                                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{selectedDSP.flagReason}</p>
                                  </div>
                                )}
                                <div className="flex gap-2 pt-4">
                                  {selectedDSP.status !== 'approved' && (
                                    <Button 
                                      onClick={() => handleApprove(selectedDSP.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Approve
                                    </Button>
                                  )}
                                  {selectedDSP.status !== 'rejected' && (
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleReject(selectedDSP.id)}
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Reject
                                    </Button>
                                  )}
                                  <Dialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
                                    <DialogTrigger asChild>
                                      <Button variant="outline">
                                        <Flag className="w-4 h-4 mr-2" />
                                        Flag
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Flag DSP Application</DialogTitle>
                                        <DialogDescription>
                                          Provide a reason for flagging {selectedDSP.name}'s application
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div>
                                          <label className="text-sm font-medium">Flag Reason</label>
                                          <Textarea
                                            placeholder="Enter reason for flagging this application..."
                                            value={flagReason}
                                            onChange={(e) => setFlagReason(e.target.value)}
                                            rows={3}
                                          />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                          <Button 
                                            variant="outline" 
                                            onClick={() => {
                                              setShowFlagDialog(false);
                                              setFlagReason('');
                                            }}
                                          >
                                            Cancel
                                          </Button>
                                          <Button 
                                            variant="destructive"
                                            onClick={() => handleFlag(selectedDSP.id, flagReason)}
                                          >
                                            Flag Application
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
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

export default DSPApprovalManager;
