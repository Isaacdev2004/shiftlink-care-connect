
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, Users, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JobFairManager = () => {
  const { toast } = useToast();
  const [jobFairs, setJobFairs] = useState([
    {
      id: 1,
      title: 'Spring Healthcare Job Fair',
      date: '2024-06-15',
      time: '10:00 AM - 4:00 PM',
      location: 'County Convention Center',
      description: 'Annual spring job fair focusing on healthcare positions including DSP roles.',
      registeredEmployers: 12,
      expectedAttendees: 250,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Direct Support Professional Expo',
      date: '2024-07-20',
      time: '9:00 AM - 3:00 PM',
      location: 'Community College Main Campus',
      description: 'Specialized job fair dedicated to DSP positions across the county.',
      registeredEmployers: 8,
      expectedAttendees: 150,
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Fall Career Connect',
      date: '2024-04-10',
      time: '11:00 AM - 5:00 PM',
      location: 'Downtown Event Center',
      description: 'Past job fair that connected many DSPs with local facilities.',
      registeredEmployers: 15,
      expectedAttendees: 300,
      status: 'completed'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJobFair, setSelectedJobFair] = useState<any>(null);
  const [editingJobFair, setEditingJobFair] = useState<any>(null);
  const [newJobFair, setNewJobFair] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    expectedAttendees: ''
  });

  const handleCreateJobFair = () => {
    const jobFair = {
      id: jobFairs.length + 1,
      ...newJobFair,
      registeredEmployers: 0,
      expectedAttendees: parseInt(newJobFair.expectedAttendees) || 0,
      status: 'upcoming'
    };
    setJobFairs([...jobFairs, jobFair]);
    setNewJobFair({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      expectedAttendees: ''
    });
    setIsCreateDialogOpen(false);
    toast({
      title: "Job Fair Created",
      description: "New job fair has been successfully created.",
    });
  };

  const handleViewJobFair = (jobFair: any) => {
    setSelectedJobFair(jobFair);
    setIsViewDialogOpen(true);
  };

  const handleEditJobFair = (jobFair: any) => {
    setEditingJobFair({
      ...jobFair,
      expectedAttendees: jobFair.expectedAttendees.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateJobFair = () => {
    const updatedJobFairs = jobFairs.map(jf => 
      jf.id === editingJobFair.id 
        ? { ...editingJobFair, expectedAttendees: parseInt(editingJobFair.expectedAttendees) || 0 }
        : jf
    );
    setJobFairs(updatedJobFairs);
    setIsEditDialogOpen(false);
    setEditingJobFair(null);
    toast({
      title: "Job Fair Updated",
      description: "Job fair details have been successfully updated.",
    });
  };

  const getStatusBadge = (status: string, date: string) => {
    const eventDate = new Date(date);
    const today = new Date();
    
    if (status === 'completed' || eventDate < today) {
      return <Badge variant="outline">Completed</Badge>;
    }
    
    const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 7) {
      return <Badge className="bg-orange-500">This Week</Badge>;
    }
    
    return <Badge className="bg-blue-500">Upcoming</Badge>;
  };

  const upcomingJobFairs = jobFairs.filter(jf => {
    const eventDate = new Date(jf.date);
    const today = new Date();
    return eventDate >= today;
  });

  const completedJobFairs = jobFairs.filter(jf => {
    const eventDate = new Date(jf.date);
    const today = new Date();
    return eventDate < today;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingJobFairs.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employers</p>
                <p className="text-2xl font-bold text-green-600">
                  {jobFairs.reduce((sum, jf) => sum + jf.registeredEmployers, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expected Attendees</p>
                <p className="text-2xl font-bold text-purple-600">
                  {upcomingJobFairs.reduce((sum, jf) => sum + jf.expectedAttendees, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Fair Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Job Fair Management</CardTitle>
              <CardDescription>Create and manage county job fair events</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job Fair
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Job Fair</DialogTitle>
                  <DialogDescription>
                    Add a new job fair event for the county
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      value={newJobFair.title}
                      onChange={(e) => setNewJobFair({...newJobFair, title: e.target.value})}
                      placeholder="e.g., Summer Healthcare Job Fair"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newJobFair.date}
                        onChange={(e) => setNewJobFair({...newJobFair, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        value={newJobFair.time}
                        onChange={(e) => setNewJobFair({...newJobFair, time: e.target.value})}
                        placeholder="e.g., 10:00 AM - 4:00 PM"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newJobFair.location}
                      onChange={(e) => setNewJobFair({...newJobFair, location: e.target.value})}
                      placeholder="e.g., County Convention Center"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedAttendees">Expected Attendees</Label>
                    <Input
                      id="expectedAttendees"
                      type="number"
                      value={newJobFair.expectedAttendees}
                      onChange={(e) => setNewJobFair({...newJobFair, expectedAttendees: e.target.value})}
                      placeholder="e.g., 200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newJobFair.description}
                      onChange={(e) => setNewJobFair({...newJobFair, description: e.target.value})}
                      placeholder="Brief description of the event..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateJobFair} className="flex-1">
                      Create Event
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Job Fairs Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Event Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Employers</TableHead>
                  <TableHead>Expected Attendees</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobFairs.map((jobFair) => (
                  <TableRow key={jobFair.id}>
                    <TableCell>
                      {getStatusBadge(jobFair.status, jobFair.date)}
                    </TableCell>
                    <TableCell className="font-medium">{jobFair.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" />
                        {jobFair.date} at {jobFair.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {jobFair.location}
                      </div>
                    </TableCell>
                    <TableCell>{jobFair.registeredEmployers}</TableCell>
                    <TableCell>{jobFair.expectedAttendees}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewJobFair(jobFair)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditJobFair(jobFair)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Job Fair Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Fair Details</DialogTitle>
            <DialogDescription>
              View complete information about this job fair event
            </DialogDescription>
          </DialogHeader>
          {selectedJobFair && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{selectedJobFair.title}</h3>
                {getStatusBadge(selectedJobFair.status, selectedJobFair.date)}
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-gray-600">{selectedJobFair.date} at {selectedJobFair.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{selectedJobFair.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">Registered Employers</p>
                      <p className="text-gray-600">{selectedJobFair.registeredEmployers} companies</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Expected Attendees</p>
                      <p className="text-gray-600">{selectedJobFair.expectedAttendees} people</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-2">Description</p>
                <p className="text-gray-600 leading-relaxed">{selectedJobFair.description}</p>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Job Fair Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Job Fair</DialogTitle>
            <DialogDescription>
              Update job fair event details
            </DialogDescription>
          </DialogHeader>
          {editingJobFair && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Event Title</Label>
                <Input
                  id="edit-title"
                  value={editingJobFair.title}
                  onChange={(e) => setEditingJobFair({...editingJobFair, title: e.target.value})}
                  placeholder="e.g., Summer Healthcare Job Fair"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editingJobFair.date}
                    onChange={(e) => setEditingJobFair({...editingJobFair, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    value={editingJobFair.time}
                    onChange={(e) => setEditingJobFair({...editingJobFair, time: e.target.value})}
                    placeholder="e.g., 10:00 AM - 4:00 PM"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingJobFair.location}
                  onChange={(e) => setEditingJobFair({...editingJobFair, location: e.target.value})}
                  placeholder="e.g., County Convention Center"
                />
              </div>
              <div>
                <Label htmlFor="edit-expectedAttendees">Expected Attendees</Label>
                <Input
                  id="edit-expectedAttendees"
                  type="number"
                  value={editingJobFair.expectedAttendees}
                  onChange={(e) => setEditingJobFair({...editingJobFair, expectedAttendees: e.target.value})}
                  placeholder="e.g., 200"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingJobFair.description}
                  onChange={(e) => setEditingJobFair({...editingJobFair, description: e.target.value})}
                  placeholder="Brief description of the event..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdateJobFair} className="flex-1">
                  Update Event
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobFairManager;
