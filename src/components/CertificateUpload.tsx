
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download } from 'lucide-react';

interface Certificate {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  expiryDate: string;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl: string;
  rejectionReason?: string;
}

const CertificateUpload = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      name: 'CPR Certification',
      type: 'CPR/First Aid',
      uploadDate: '2024-06-01',
      expiryDate: '2024-12-01',
      status: 'approved',
      fileUrl: '/certificates/cpr-cert.pdf'
    },
    {
      id: '2',
      name: 'Background Check',
      type: 'Background',
      uploadDate: '2024-06-02',
      expiryDate: '2025-06-02',
      status: 'pending',
      fileUrl: '/certificates/background-check.pdf'
    }
  ]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          
          // Add new certificate to the list
          const newCertificate: Certificate = {
            id: Date.now().toString(),
            name: file.name.replace(/\.[^/.]+$/, ""),
            type: 'Other',
            uploadDate: new Date().toISOString().split('T')[0],
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending',
            fileUrl: URL.createObjectURL(file)
          };
          
          setCertificates(prev => [...prev, newCertificate]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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

  const handleDelete = (certificateId: string) => {
    setCertificates(prev => prev.filter(cert => cert.id !== certificateId));
  };

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
            <div>
              <Label htmlFor="certificate-upload">Select Certificate File</Label>
              <Input
                id="certificate-upload"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="mt-1"
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
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
          <CardTitle>Your Certificates</CardTitle>
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
                      <h4 className="font-medium">{certificate.name}</h4>
                      <p className="text-sm text-gray-600">Type: {certificate.type}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>Uploaded: {certificate.uploadDate}</span>
                        <span>Expires: {certificate.expiryDate}</span>
                      </div>
                      {certificate.status === 'rejected' && certificate.rejectionReason && (
                        <p className="text-sm text-red-600 mt-1">
                          Reason: {certificate.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(certificate.status)}
                    <Button variant="ghost" size="sm">
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
