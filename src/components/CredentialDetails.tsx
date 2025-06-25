
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Building, Award, Clock, CheckCircle, AlertTriangle, Upload } from 'lucide-react';

interface CredentialItem {
  id: string;
  name: string;
  type: 'certification' | 'license' | 'training';
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expiring_soon' | 'expired' | 'pending_renewal';
  progress: number;
  attachments: number;
}

interface CredentialDetailsProps {
  credential: CredentialItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (credentialId: string) => void;
  onUploadDocument?: (credentialId: string) => void;
  onRenew?: (credentialId: string) => void;
}

const CredentialDetails = ({ 
  credential, 
  open, 
  onOpenChange, 
  onEdit, 
  onUploadDocument, 
  onRenew 
}: CredentialDetailsProps) => {
  if (!credential) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expiring_soon':
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'pending_renewal':
        return <Badge className="bg-blue-100 text-blue-800">Pending Renewal</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expiring_soon':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'pending_renewal':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getDaysUntilExpiry = () => {
    const today = new Date();
    const expiryDate = new Date(credential.expiryDate);
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const daysUntilExpiry = getDaysUntilExpiry();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getStatusIcon(credential.status)}
            <span>{credential.name}</span>
            {getStatusBadge(credential.status)}
          </DialogTitle>
          <DialogDescription>
            Detailed information about this credential
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Award className="w-4 h-4" />
                <span>Type</span>
              </div>
              <p className="text-sm capitalize">{credential.type.replace('_', ' ')}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Building className="w-4 h-4" />
                <span>Issuing Organization</span>
              </div>
              <p className="text-sm">{credential.issuer}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>Issue Date</span>
              </div>
              <p className="text-sm">{new Date(credential.issueDate).toLocaleDateString()}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>Expiry Date</span>
              </div>
              <p className="text-sm">{new Date(credential.expiryDate).toLocaleDateString()}</p>
              {daysUntilExpiry > 0 && daysUntilExpiry <= 30 && (
                <p className="text-xs text-yellow-600">
                  Expires in {daysUntilExpiry} days
                </p>
              )}
              {daysUntilExpiry <= 0 && (
                <p className="text-xs text-red-600">
                  Expired {Math.abs(daysUntilExpiry)} days ago
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Completion Status</span>
              <span>{credential.progress}%</span>
            </div>
            <Progress value={credential.progress} className="h-2" />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              <span>Documents</span>
            </div>
            <p className="text-sm">{credential.attachments} files attached</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(credential.id)}
              className="flex items-center space-x-2"
            >
              <span>Edit Details</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUploadDocument?.(credential.id)}
              className="flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </Button>

            {(credential.status === 'expired' || 
              credential.status === 'expiring_soon' || 
              credential.status === 'pending_renewal') && (
              <Button
                size="sm"
                onClick={() => onRenew?.(credential.id)}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Start Renewal</span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialDetails;
