
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface UploadedCertificate {
  id: string;
  certificate_name: string;
  certificate_type: string;
  file_url: string;
  upload_date: string;
  expiry_date: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  verified_at: string | null;
}

const CertificateUpload = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<UploadedCertificate[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [certificateName, setCertificateName] = useState('');
  const [certificateType, setCertificateType] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      console.log('Fetching uploaded certificates for user:', user?.id);

      const { data, error } = await supabase
        .from('uploaded_certificates')
        .select('*')
        .eq('student_id', user?.id)
        .order('upload_date', { ascending: false });

      if (error) throw error;

      setCertificates(data || []);
      console.log('Uploaded certificates loaded:', data);

    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Error",
        description: "Failed to load certificates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, JPG, or PNG file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    setCertificateName(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleUpload = async () => {
    if (!selectedFile || !certificateName || !certificateType || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create file path with user ID folder structure
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log('Uploading file to:', filePath);

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(filePath, selectedFile, {
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setUploadProgress(percentage);
          }
        });

      if (uploadError) throw uploadError;

      console.log('File uploaded successfully:', uploadData);

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath);

      console.log('File public URL:', publicUrl);

      // Save certificate record to database
      const { data: dbData, error: dbError } = await supabase
        .from('uploaded_certificates')
        .insert({
          student_id: user.id,
          certificate_name: certificateName,
          certificate_type: certificateType,
          file_url: publicUrl,
          expiry_date: expiryDate || null
        })
        .select()
        .single();

      if (dbError) throw dbError;

      console.log('Certificate record created:', dbData);

      // Update local state
      setCertificates(prev => [dbData, ...prev]);

      // Reset form
      setSelectedFile(null);
      setCertificateName('');
      setCertificateType('');
      setExpiryDate('');
      
      // Reset file input
      const fileInput = document.getElementById('certificate-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      toast({
        title: "Upload Successful",
        description: "Your certificate has been uploaded and is pending review",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your certificate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleDownload = (certificate: UploadedCertificate) => {
    window.open(certificate.file_url, '_blank');
  };

  const handleDelete = async (certificateId: string) => {
    try {
      const { error } = await supabase
        .from('uploaded_certificates')
        .delete()
        .eq('id', certificateId)
        .eq('student_id', user?.id); // Ensure user can only delete their own certificates

      if (error) throw error;

      setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
      
      toast({
        title: "Certificate Deleted",
        description: "The certificate has been removed successfully",
      });

    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the certificate. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Certificate Management</h3>
        <p className="text-gray-600">Upload and manage your professional certificates and credentials</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload New Certificate</span>
          </CardTitle>
          <CardDescription>
            Upload certificates in PDF, JPG, or PNG format (max 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="certificate-name">Certificate Name</Label>
                <Input
                  id="certificate-name"
                  type="text"
                  value={certificateName}
                  onChange={(e) => setCertificateName(e.target.value)}
                  placeholder="e.g., CPR Certification"
                  disabled={isUploading}
                />
              </div>
              
              <div>
                <Label htmlFor="certificate-type">Certificate Type</Label>
                <Select 
                  value={certificateType} 
                  onValueChange={setCertificateType}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CPR/First Aid">CPR/First Aid</SelectItem>
                    <SelectItem value="Background Check">Background Check</SelectItem>
                    <SelectItem value="Training Certificate">Training Certificate</SelectItem>
                    <SelectItem value="License">License</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
              <Input
                id="expiry-date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                disabled={isUploading}
              />
            </div>

            <div>
              <Label htmlFor="certificate-upload">Select Certificate File</Label>
              <Input
                id="certificate-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="mt-1"
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || !certificateName || !certificateType || isUploading}
              className="w-full md:w-auto"
            >
              {isUploading ? 'Uploading...' : 'Upload Certificate'}
            </Button>
            
            <div className="text-sm text-gray-600">
              <p>Supported formats: PDF, JPG, PNG</p>
              <p>Maximum file size: 10MB</p>
              <p>Certificates will be reviewed within 2-3 business days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Uploaded Certificates</CardTitle>
          <CardDescription>View and manage your uploaded certificates</CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No certificates uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {certificates.map((certificate) => (
                <div key={certificate.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(certificate.status)}
                    <div>
                      <h4 className="font-medium">{certificate.certificate_name}</h4>
                      <p className="text-sm text-gray-600">Type: {certificate.certificate_type}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Uploaded: {formatDate(certificate.upload_date)}</span>
                        </div>
                        {certificate.expiry_date && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Expires: {formatDate(certificate.expiry_date)}</span>
                          </div>
                        )}
                      </div>
                      {certificate.status === 'rejected' && certificate.rejection_reason && (
                        <p className="text-sm text-red-600 mt-1">
                          Reason: {certificate.rejection_reason}
                        </p>
                      )}
                      {certificate.verified_at && (
                        <p className="text-xs text-green-600 mt-1">
                          Verified on {formatDate(certificate.verified_at)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(certificate.status)}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownload(certificate)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(certificate.id)}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateUpload;
