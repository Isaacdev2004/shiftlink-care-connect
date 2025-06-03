
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User, Star, MapPin, Phone, Mail, Award } from 'lucide-react';

const TrainerProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'Columbus, OH',
    bio: 'Certified healthcare instructor with over 10 years of experience in emergency medicine and training. Specialized in CPR, First Aid, and medication administration.',
    certifications: ['AHA CPR Instructor', 'First Aid Certified', 'ACLS Provider', 'Medication Administration'],
    experience: '10+ years',
    rating: 4.8,
    totalStudents: 156,
    coursesCompleted: 23
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Trainer Profile</h3>
          <p className="text-gray-600">Manage your professional information and credentials</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Update your professional details and credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <Label>Certifications</Label>
                <div className="flex flex-wrap gap-2">
                  {profile.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      <Award className="w-3 h-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                  {isEditing && (
                    <Button variant="ghost" size="sm" className="border-2 border-dashed">
                      + Add Certification
                    </Button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleSave} className="bg-medical-blue hover:bg-blue-800">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          {/* Avatar & Basic Info */}
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-lg">SJ</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-2">{profile.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{profile.rating} rating</span>
                </div>
              </div>
              {isEditing && (
                <Button variant="outline" size="sm" className="mt-4">
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Training Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Students</span>
                <span className="font-semibold">{profile.totalStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Courses Completed</span>
                <span className="font-semibold">{profile.coursesCompleted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-semibold">{profile.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{profile.rating}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
