
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Bell, 
  BellOff, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Calendar,
  Mail,
  MessageSquare,
  Settings,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CredentialNotificationSettings {
  email: boolean;
  sms: boolean;
  inApp: boolean;
  reminderDays: number[];
}

interface EnhancedCredential {
  id: string;
  name: string;
  type: 'certification' | 'license' | 'training' | 'background_check';
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired' | 'renewal_pending';
  daysUntilExpiry: number;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  renewalUrl?: string;
  documentUrl?: string;
  notificationsSent: string[];
  autoRenewal: boolean;
  nextReminderDate?: string;
}

const CredentialTracker = () => {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<EnhancedCredential[]>([
    {
      id: '1',
      name: 'CPR Certification',
      type: 'certification',
      issuer: 'American Heart Association',
      issueDate: '2024-01-15',
      expiryDate: '2024-07-15',
      status: 'expiring_soon',
      daysUntilExpiry: 12,
      criticality: 'critical',
      renewalUrl: 'https://cpr.heart.org/renew',
      notificationsSent: ['30-day', '14-day'],
      autoRenewal: false
    },
    {
      id: '2',
      name: 'First Aid Certification',
      type: 'certification',
      issuer: 'Red Cross',
      issueDate: '2024-01-20',
      expiryDate: '2024-07-20',
      status: 'expiring_soon',
      daysUntilExpiry: 17,
      criticality: 'high',
      notificationsSent: ['30-day'],
      autoRenewal: true
    },
    {
      id: '3',
      name: 'Background Check',
      type: 'background_check',
      issuer: 'DOJ California',
      issueDate: '2023-05-01',
      expiryDate: '2024-05-01',
      status: 'expired',
      daysUntilExpiry: -54,
      criticality: 'critical',
      notificationsSent: ['30-day', '14-day', '7-day', 'expired'],
      autoRenewal: false
    },
    {
      id: '4',
      name: 'Medication Administration',
      type: 'training',
      issuer: 'State Training Center',
      issueDate: '2023-11-01',
      expiryDate: '2024-11-01',
      status: 'valid',
      daysUntilExpiry: 132,
      criticality: 'medium',
      notificationsSent: [],
      autoRenewal: true
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState<CredentialNotificationSettings>({
    email: true,
    sms: true,
    inApp: true,
    reminderDays: [90, 60, 30, 14, 7, 1]
  });

  const [showSettings, setShowSettings] = useState(false);

  // Calculate notification stats
  const stats = {
    total: credentials.length,
    valid: credentials.filter(c => c.status === 'valid').length,
    expiring: credentials.filter(c => c.status === 'expiring_soon').length,
    expired: credentials.filter(c => c.status === 'expired').length,
    critical: credentials.filter(c => c.criticality === 'critical' && c.status !== 'valid').length
  };

  // Auto-check for notifications that need to be sent
  useEffect(() => {
    const checkNotifications = () => {
      credentials.forEach(credential => {
        notificationSettings.reminderDays.forEach(days => {
          if (credential.daysUntilExpiry === days && 
              !credential.notificationsSent.includes(`${days}-day`)) {
            
            sendNotification(credential, days);
          }
        });
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [credentials, notificationSettings]);

  const sendNotification = (credential: EnhancedCredential, days: number) => {
    console.log(`Sending notification for ${credential.name} - ${days} days until expiry`);
    
    if (notificationSettings.inApp) {
      toast({
        title: "Credential Expiring Soon",
        description: `${credential.name} expires in ${days} day${days !== 1 ? 's' : ''}`,
        variant: credential.criticality === 'critical' ? 'destructive' : 'default'
      });
    }

    // Update notification history
    setCredentials(prev => prev.map(c => 
      c.id === credential.id 
        ? { ...c, notificationsSent: [...c.notificationsSent, `${days}-day`] }
        : c
    ));
  };

  const getCriticalityColor = (criticality: string) => {
    const colors = {
      low: 'bg-blue-500',
      medium: 'bg-yellow-500', 
      high: 'bg-orange-500',
      critical: 'bg-red-500'
    };
    return colors[criticality as keyof typeof colors] || colors.low;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expiring_soon':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getProgressValue = (daysUntilExpiry: number, issueDate: string, expiryDate: string) => {
    const totalDays = Math.abs(new Date(expiryDate).getTime() - new Date(issueDate).getTime()) / (1000 * 60 * 60 * 24);
    const daysElapsed = totalDays - daysUntilExpiry;
    return Math.max(0, Math.min(100, (daysElapsed / totalDays) * 100));
  };

  const toggleAutoRenewal = (credentialId: string) => {
    setCredentials(prev => prev.map(c => 
      c.id === credentialId 
        ? { ...c, autoRenewal: !c.autoRenewal }
        : c
    ));
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
            <div className="text-sm text-gray-600">Valid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.expiring}</div>
            <div className="text-sm text-gray-600">Expiring</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <div className="text-sm text-gray-600">Expired</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.critical}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {stats.critical > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span>Critical Credential Issues ({stats.critical})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {credentials
                .filter(c => c.criticality === 'critical' && c.status !== 'valid')
                .map(credential => (
                  <div key={credential.id} className="flex items-center justify-between bg-white p-3 rounded border">
                    <div>
                      <span className="font-medium">{credential.name}</span>
                      <div className="text-sm text-red-600">
                        {credential.status === 'expired' 
                          ? `Expired ${Math.abs(credential.daysUntilExpiry)} days ago`
                          : `Expires in ${credential.daysUntilExpiry} days`
                        }
                      </div>
                    </div>
                    <Button size="sm" variant="destructive">
                      Renew Now
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Credential List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Credential Tracking</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Credential
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Notification Settings */}
          {showSettings && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <h4 className="font-medium mb-4">Notification Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email Notifications</span>
                  <Switch
                    checked={notificationSettings.email}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, email: checked }))
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">SMS Notifications</span>
                  <Switch
                    checked={notificationSettings.sms}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, sms: checked }))
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm">In-App Notifications</span>
                  <Switch
                    checked={notificationSettings.inApp}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, inApp: checked }))
                    }
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium">Reminder Schedule (days before expiry)</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {notificationSettings.reminderDays.map(days => (
                    <Badge key={days} variant="outline">{days} days</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Credentials List */}
          <div className="space-y-4">
            {credentials.map((credential) => (
              <div key={credential.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(credential.status)}
                      <h4 className="font-medium">{credential.name}</h4>
                      <div className={`w-2 h-2 rounded-full ${getCriticalityColor(credential.criticality)}`} />
                      <Badge variant="outline" className="text-xs">
                        {credential.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Issuer: {credential.issuer}</div>
                      <div>Expires: {credential.expiryDate}</div>
                      <div className={
                        credential.daysUntilExpiry < 0 ? 'text-red-600 font-medium' :
                        credential.daysUntilExpiry <= 30 ? 'text-orange-600 font-medium' :
                        'text-gray-600'
                      }>
                        {credential.daysUntilExpiry < 0 
                          ? `Expired ${Math.abs(credential.daysUntilExpiry)} days ago`
                          : `${credential.daysUntilExpiry} days remaining`
                        }
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2">
                      <Progress 
                        value={getProgressValue(credential.daysUntilExpiry, credential.issueDate, credential.expiryDate)}
                        className="h-2"
                      />
                    </div>

                    {/* Notifications Sent */}
                    {credential.notificationsSent.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500">
                          Notifications sent: {credential.notificationsSent.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Auto-renew</span>
                      <Switch
                        checked={credential.autoRenewal}
                        onCheckedChange={() => toggleAutoRenewal(credential.id)}
                        size="sm"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      {credential.renewalUrl && (
                        <Button size="sm" variant="outline">
                          Renew
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialTracker;
