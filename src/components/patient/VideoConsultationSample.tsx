import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  MessageCircle,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Settings,
  Maximize,
  Minimize,
  Clock,
  Signal
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';

interface VideoConsultationSampleProps {
  language: Language;
  doctorName: string;
  doctorRole: string;
  consultationTime: number;
  onEndCall: () => void;
  onSwitchToChat: () => void;
  onSwitchToVoice: () => void;
}

export const VideoConsultationSample: React.FC<VideoConsultationSampleProps> = ({
  language,
  doctorName,
  doctorRole,
  consultationTime,
  onEndCall,
  onSwitchToChat,
  onSwitchToVoice
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [isConnected, setIsConnected] = useState(true);

  const t = (key: string) => getTranslation(key, language);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionText = () => {
    const quality = connectionQuality;
    if (language === 'hi') {
      return quality === 'excellent' ? 'उत्कृष्ट' : 
             quality === 'good' ? 'अच्छा' : 'कमजोर';
    } else if (language === 'mr') {
      return quality === 'excellent' ? 'उत्कृष्ट' : 
             quality === 'good' ? 'चांगला' : 'कमकुवत';
    } else if (language === 'pa') {
      return quality === 'excellent' ? 'ਬਹੁਤ ਵਧੀਆ' : 
             quality === 'good' ? 'ਚੰਗਾ' : 'ਕਮਜ਼ੋਰ';
    }
    return quality === 'excellent' ? 'Excellent' : 
           quality === 'good' ? 'Good' : 'Poor';
  };

  const getDoctorRoleText = (role: string) => {
    const roleMap = {
      'cho': language === 'hi' ? 'मुख्य स्वास्थ्य अधिकारी' :
             language === 'mr' ? 'मुख्य आरोग्य अधिकारी' :
             language === 'pa' ? 'ਮੁੱਖ ਸਿਹਤ ਅਧਿਕਾਰੀ' : 'Chief Health Officer',
      'mo': language === 'hi' ? 'चिकित्सा अधिकारी' :
            language === 'mr' ? 'वैद्यकीय अधिकारी' :
            language === 'pa' ? 'ਮੈਡੀਕਲ ਅਫਸਰ' : 'Medical Officer',
      'civil_doctor': language === 'hi' ? 'नागरिक अस्पताल डॉक्टर' :
                      language === 'mr' ? 'नागरी रुग्णालय डॉक्टर' :
                      language === 'pa' ? 'ਸਿਵਲ ਹਸਪਤਾਲ ਡਾਕਟਰ' : 'Civil Hospital Doctor',
      'emergency_doctor': language === 'hi' ? 'आपातकालीन डॉक्टर' :
                          language === 'mr' ? 'आपत्कालीन डॉक्टर' :
                          language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਡਾਕਟਰ' : 'Emergency Doctor'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'relative'} bg-gray-900`}>
      <Card className="h-full border-0 rounded-none bg-gray-900 text-white">
        {/* Header */}
        <CardHeader className="pb-4 bg-black/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {doctorName.charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-medium">{doctorName}</h3>
                <p className="text-sm text-gray-300">{getDoctorRoleText(doctorRole)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatTime(consultationTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Signal className={`w-4 h-4 ${getConnectionColor()}`} />
                <span className={`text-sm ${getConnectionColor()}`}>
                  {getConnectionText()}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 relative">
          {/* Doctor Video */}
          <div className="relative h-96 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            {isConnected ? (
              <div className="relative w-full h-full">
                {/* Simulated doctor video */}
                <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl font-medium">
                        {doctorName.charAt(0)}
                      </span>
                    </div>
                    <p className="text-white text-lg">{doctorName}</p>
                    <p className="text-gray-300 text-sm">{getDoctorRoleText(doctorRole)}</p>
                  </div>
                </div>
                
                {/* Patient video (small overlay) */}
                <div className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg border-2 border-white/20 overflow-hidden">
                  {isVideoOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-teal-600 to-green-600 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <CameraOff className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <VideoOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">
                  {language === 'hi' ? 'कनेक्शन फिर से स्थापित कर रहे हैं...' :
                   language === 'mr' ? 'कनेक्शन पुन्हा स्थापित करत आहे...' :
                   language === 'pa' ? 'ਕਨੈਕਸ਼ਨ ਮੁੜ ਸਥਾਪਿਤ ਕਰ ਰਹੇ ਹਾਂ...' :
                   'Reconnecting...'}
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="lg"
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-full w-14 h-14"
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>

              <Button
                variant={isVideoOn ? "secondary" : "destructive"}
                size="lg"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="rounded-full w-14 h-14"
              >
                {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={onEndCall}
                className="rounded-full w-14 h-14"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>

              <Button
                variant={isSpeakerOn ? "secondary" : "outline"}
                size="lg"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className="rounded-full w-14 h-14"
              >
                {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onSwitchToChat}
                className="rounded-full w-14 h-14"
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
            </div>

            {/* Connection fallback options */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-sm text-gray-300">
                {language === 'hi' ? 'कनेक्शन की समस्या?' :
                 language === 'mr' ? 'कनेक्शनची समस्या?' :
                 language === 'pa' ? 'ਕਨੈਕਸ਼ਨ ਦੀ ਸਮੱਸਿਆ?' :
                 'Connection issues?'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSwitchToVoice}
                className="text-teal-400 hover:text-teal-300"
              >
                {language === 'hi' ? 'वॉयस कॉल पर स्विच करें' :
                 language === 'mr' ? 'व्हॉइस कॉलवर स्विच करा' :
                 language === 'pa' ? 'ਵਾਇਸ ਕਾਲ ਤੇ ਸਵਿੱਚ ਕਰੋ' :
                 'Switch to Voice Call'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating chat notification (if needed) */}
      <div className="absolute top-20 right-4 bg-teal-600 text-white px-3 py-2 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">
            {language === 'hi' ? 'चैट उपलब्ध' :
             language === 'mr' ? 'चॅट उपलब्ध' :
             language === 'pa' ? 'ਚੈਟ ਉਪਲਬਧ' :
             'Chat available'}
          </span>
        </div>
      </div>
    </div>
  );
};