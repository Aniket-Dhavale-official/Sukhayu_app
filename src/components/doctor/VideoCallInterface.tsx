import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  MessageSquare,
  Maximize2,
  Minimize2,
  Settings,
  Camera,
  CameraOff,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VideoCallInterfaceProps {
  patient: any;
  doctor: any;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onEndCall: () => void;
}

export const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  patient,
  doctor,
  isMinimized,
  onToggleMinimize,
  onEndCall
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'fair' | 'poor'>('good');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [showNetworkAlert, setShowNetworkAlert] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Simulate connection quality changes
    const qualityTimer = setInterval(() => {
      const qualities: Array<'good' | 'fair' | 'poor'> = ['good', 'fair', 'poor'];
      const newQuality = qualities[Math.floor(Math.random() * qualities.length)];
      setConnectionQuality(newQuality);
      
      // Auto-switch to voice mode if connection is poor
      if (newQuality === 'poor' && !isVoiceMode) {
        setIsVoiceMode(true);
        setIsVideoOn(false);
        setIsCameraOn(false);
        setShowNetworkAlert(true);
        toast.warning('🔊 Switched to voice-only mode due to poor network connection');
        
        // Hide alert after 5 seconds
        setTimeout(() => setShowNetworkAlert(false), 5000);
      }
      
      // Auto-switch back to video if connection improves
      if (newQuality === 'good' && isVoiceMode) {
        setIsVoiceMode(false);
        setIsVideoOn(true);
        setIsCameraOn(true);
        toast.success('📹 Switched back to video mode - connection improved');
      }
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(qualityTimer);
    };
  }, []);

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'text-green-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-2 right-2 md:bottom-4 md:right-4 z-50">
        <Card className="w-72 md:w-80 bg-white shadow-lg border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs md:text-sm">On Call - {formatCallDuration(callDuration)}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="p-1 h-6 w-6"
              >
                <Maximize2 className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 md:gap-3">
              <Avatar className="w-8 h-8 md:w-10 md:h-10">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs md:text-sm">
                  {patient.fullName.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium truncate">{patient.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{patient.patientId}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={isAudioOn ? "default" : "destructive"}
                  size="sm"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className="h-7 w-7 md:h-8 md:w-8 p-0"
                >
                  {isAudioOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onEndCall}
                  className="h-7 w-7 md:h-8 md:w-8 p-0"
                >
                  <PhoneOff className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-2 md:p-4">
      <Card className="w-full max-w-7xl h-full max-h-[95vh] bg-gray-900 text-white border-0 flex flex-col">
        <CardHeader className="bg-gray-800 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm md:text-base">{isVoiceMode ? 'Voice Call' : 'Video Consultation'} - {formatCallDuration(callDuration)}</span>
                {isVoiceMode && (
                  <Badge className="bg-blue-600 text-white ml-1 md:ml-2 text-xs md:text-sm">
                    <Phone className="w-3 h-3 mr-1" />
                    Voice Mode
                  </Badge>
                )}
              </div>
              <Badge className={`${getConnectionColor(connectionQuality)} bg-transparent border text-xs md:text-sm`}>
                {connectionQuality.toUpperCase()} Connection
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-white hover:bg-gray-700 p-1 md:p-2"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-gray-700 p-1 md:p-2">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col lg:flex-row overflow-hidden">
          {/* Main Video Area */}
          <div className="flex-1 relative bg-gray-800 min-h-0">
            {/* Patient Video */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
              {isVideoOn ? (
                <div className="text-center p-4">
                  <Avatar className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4">
                    <AvatarFallback className="bg-blue-600 text-white text-lg md:text-2xl">
                      {patient.fullName.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-lg md:text-xl font-medium">{patient.fullName}</p>
                  <p className="text-xs md:text-sm text-gray-300">{patient.patientId}</p>
                  <Badge className="mt-2 bg-blue-600 text-xs md:text-sm">Patient Video Feed</Badge>
                </div>
              ) : (
                <div className="text-center text-gray-400 p-4">
                  <VideoOff className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
                  <p className="text-sm md:text-base">Patient video is off</p>
                </div>
              )}
            </div>

            {/* Doctor Video (Picture-in-Picture) */}
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-32 h-24 md:w-48 md:h-36 bg-gradient-to-br from-teal-900 to-green-900 rounded-lg border-2 border-white">
              {isCameraOn ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Avatar className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-1 md:mb-2">
                      <AvatarFallback className="bg-teal-600 text-white text-xs md:text-sm">
                        {doctor.fullName.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-white truncate px-1">{doctor.fullName}</p>
                    <Badge className="mt-1 bg-teal-600 text-xs hidden md:inline-block">Your Video</Badge>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <CameraOff className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 md:mb-2" />
                    <p className="text-xs">Camera Off</p>
                  </div>
                </div>
              )}
            </div>

            {/* Patient Info Overlay */}
            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black bg-opacity-50 rounded-lg p-2 md:p-3">
              <div className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs md:text-sm truncate">{patient.fullName}</span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Age: {patient.age} • {patient.gender?.charAt(0).toUpperCase()} • {patient.consultation?.severity?.toUpperCase()} Priority
              </p>
            </div>
          </div>

          {/* Side Panel */}
          <div className="w-full lg:w-80 bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-700 flex flex-col min-h-0 max-h-96 lg:max-h-none overflow-hidden">
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              {/* Patient Details */}
              <div className="p-3 md:p-4 border-b border-gray-700">
                <h3 className="font-medium mb-3 text-sm md:text-base">Patient Information</h3>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Patient ID:</span>
                    <span className="truncate ml-2">{patient.patientId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Age:</span>
                    <span>{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gender:</span>
                    <span className="capitalize">{patient.gender}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Priority:</span>
                    <Badge className={
                      patient.consultation?.severity === 'red' ? 'bg-red-600' :
                      patient.consultation?.severity === 'orange' ? 'bg-orange-600' :
                      'bg-yellow-600'
                    }>
                      {patient.consultation?.severity?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Current Symptoms */}
              <div className="p-3 md:p-4 border-b border-gray-700">
                <h3 className="font-medium mb-3 text-sm md:text-base">Current Symptoms</h3>
                <div className="flex flex-wrap gap-1">
                  {patient.consultation?.symptoms?.map((symptom: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs text-gray-300 border-gray-600">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Call Quality Info */}
              <div className="p-3 md:p-4 border-b border-gray-700">
                <h3 className="font-medium mb-3 text-sm md:text-base">Call Quality</h3>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Connection:</span>
                    <span className={getConnectionColor(connectionQuality)}>
                      {connectionQuality.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span>{formatCallDuration(callDuration)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Notes */}
              <div className="p-3 md:p-4">
                <h3 className="font-medium mb-3 text-sm md:text-base">Quick Notes</h3>
                <textarea
                  className="w-full h-20 md:h-32 bg-gray-700 border border-gray-600 rounded p-2 text-xs md:text-sm text-white placeholder-gray-400 resize-none"
                  placeholder="Type quick notes during the call..."
                />
              </div>
            </div>
          </div>
        </CardContent>

        {/* Call Controls */}
        <div className="bg-gray-800 border-t border-gray-700 p-2 md:p-4 flex-shrink-0">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <Button
              variant={isAudioOn ? "secondary" : "destructive"}
              size="lg"
              onClick={() => setIsAudioOn(!isAudioOn)}
              className="rounded-full w-10 h-10 md:w-12 md:h-12 p-0"
            >
              {isAudioOn ? <Mic className="w-4 h-4 md:w-5 md:h-5" /> : <MicOff className="w-4 h-4 md:w-5 md:h-5" />}
            </Button>

            <Button
              variant={isCameraOn ? "secondary" : "destructive"}
              size="lg"
              onClick={() => setIsCameraOn(!isCameraOn)}
              className="rounded-full w-10 h-10 md:w-12 md:h-12 p-0"
            >
              {isCameraOn ? <Camera className="w-4 h-4 md:w-5 md:h-5" /> : <CameraOff className="w-4 h-4 md:w-5 md:h-5" />}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-10 h-10 md:w-12 md:h-12 p-0"
            >
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
            </Button>

            <Button
              variant="destructive"
              size="lg"
              onClick={onEndCall}
              className="rounded-full w-12 h-12 md:w-14 md:h-14 p-0"
            >
              <PhoneOff className="w-5 h-5 md:w-6 md:h-6" />
            </Button>

            <Button
              variant={isVideoOn ? "secondary" : "destructive"}
              size="lg"
              onClick={() => setIsVideoOn(!isVideoOn)}
              className="rounded-full w-10 h-10 md:w-12 md:h-12 p-0"
            >
              {isVideoOn ? <Video className="w-4 h-4 md:w-5 md:h-5" /> : <VideoOff className="w-4 h-4 md:w-5 md:h-5" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};