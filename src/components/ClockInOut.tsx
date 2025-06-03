
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, MapPin, Play, Square, Navigation, AlertCircle } from 'lucide-react';

interface ClockInOutProps {
  currentShift: any;
  setCurrentShift: (shift: any) => void;
}

const ClockInOut = ({ currentShift, setCurrentShift }: ClockInOutProps) => {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationError(null);
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleClockIn = () => {
    if (!location) {
      getCurrentLocation();
      return;
    }

    const newShift = {
      id: Date.now().toString(),
      startTime: new Date(),
      location: location,
      facility: 'Sunrise Care Center',
      client: 'John Smith',
      status: 'active'
    };

    setCurrentShift(newShift);
    console.log('Clocked in:', newShift);
  };

  const handleClockOut = () => {
    if (currentShift && location) {
      const updatedShift = {
        ...currentShift,
        endTime: new Date(),
        endLocation: location,
        status: 'completed'
      };

      console.log('Clocked out:', updatedShift);
      setCurrentShift(null);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-lg text-gray-600">
            {currentTime.toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Location Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locationError ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          ) : location ? (
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <Navigation className="w-3 h-3 mr-1" />
                GPS Located
              </Badge>
              <span className="text-sm text-gray-600">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Navigation className="w-3 h-3 mr-1" />
                Getting Location...
              </Badge>
              <Button variant="outline" size="sm" onClick={getCurrentLocation}>
                Retry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Shift Status */}
      {currentShift && (
        <Card>
          <CardHeader>
            <CardTitle>Current Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Facility:</span>
                <span>{currentShift.facility}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Client:</span>
                <span>{currentShift.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Start Time:</span>
                <span>{currentShift.startTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>
                  {Math.floor((currentTime.getTime() - currentShift.startTime.getTime()) / 60000)} minutes
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clock In/Out Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Time Clock</CardTitle>
          <CardDescription>
            GPS verification required for EVV compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!currentShift ? (
            <Button 
              onClick={handleClockIn}
              disabled={!location}
              className="w-full h-16 text-lg bg-green-600 hover:bg-green-700"
            >
              <Play className="w-6 h-6 mr-2" />
              Clock In
            </Button>
          ) : (
            <Button 
              onClick={handleClockOut}
              disabled={!location}
              className="w-full h-16 text-lg bg-red-600 hover:bg-red-700"
            >
              <Square className="w-6 h-6 mr-2" />
              Clock Out
            </Button>
          )}
          
          {!location && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                GPS location is required for EVV compliance. Please enable location services.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClockInOut;
