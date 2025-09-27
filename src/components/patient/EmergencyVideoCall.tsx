import React, { useState, useEffect } from 'react';
import { Patient, ASHAWorker, Language } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  ArrowLeft, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  AlertTriangle,
  Clock,
  Users
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';

interface EmergencyVideoCallProps {
  user: Patient | ASHAWorker;
  language: Language;
  symptomAnalysis?: {
    condition: string;
    symptoms: string;
  };
  onBack: () => void;
  onCallComplete: () => void;
}

type CallStatus = 'connecting' | 'connected' | 'ended';

export const EmergencyVideoCall: React.FC<EmergencyVideoCallProps> = ({
  user,
  language,
  symptomAnalysis,
  onBack,
  onCallComplete
}) => {
  const [callStatus, setCallStatus] = useState<CallStatus>('connecting');
  const [connectionTime, setConnectionTime] = useState(0);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [doctorInfo] = useState({
    name: language === 'hi' ? 'डॉ. राज शर्मा' :
          language === 'mr' ? 'डॉ. राज शर्मा' :
          language === 'pa' ? 'ਡਾ. ਰਾਜ ਸ਼ਰਮਾ' : 'Dr. Raj Sharma',
    designation: language === 'hi' ? 'आपातकालीन चिकित्सक' :
                 language === 'mr' ? 'आपत्कालीन डॉक्टर' :
                 language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਡਾਕਟਰ' : 'Emergency Doctor',
    hospital: language === 'hi' ? 'सिविल अस्पताल' :
              language === 'mr' ? 'नागरी रुग्णालय' :
              language === 'pa' ? 'ਸਿਵਲ ਹਸਪਤਾਲ' : 'Civil Hospital'
  });

  const t = (key: string) => getTranslation(key, language);

  useEffect(() => {
    // Simulate connection process
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    // Timer for call duration
    if (callStatus === 'connected') {
      const timer = setInterval(() => {
        setConnectionTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [callStatus]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onCallComplete();
    }, 2000);
  };

  const getStatusText = (): string => {
    switch (callStatus) {
      case 'connecting':
        return language === 'hi' ? 'आपातकालीन डॉक्टर से जुड़ रहे हैं...' :
               language === 'mr' ? 'आपत्कालीन डॉक्टरांशी जोडत आहे...' :
               language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਡਾਕਟਰ ਨਾਲ ਜੁੜ ਰਹੇ ਹਾਂ...' :
               'Connecting to Emergency Doctor...';
      case 'connected':
        return language === 'hi' ? 'कॉल जारी है' :
               language === 'mr' ? 'कॉल सुरू आहे' :
               language === 'pa' ? 'ਕਾਲ ਜਾਰੀ ਹੈ' :
               'Call in Progress';
      case 'ended':
        return language === 'hi' ? 'कॉल समाप्त हुआ' :
               language === 'mr' ? 'कॉल संपला' :
               language === 'pa' ? 'ਕਾਲ ਖਤਮ ਹੋਇਆ' :
               'Call Ended';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button 
            variant="ghost" 
            onClick={callStatus === 'ended' ? onBack : handleEndCall}
            className="text-white hover:bg-gray-700 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <Badge className="bg-red-600 text-white border-red-600">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {language === 'hi' ? 'आपातकाल' :
               language === 'mr' ? 'आपत्काल' :
               language === 'pa' ? 'ਐਮਰਜੈਂਸੀ' : 'EMERGENCY'}
            </Badge>
          </div>
          <div></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Emergency Alert */}
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-medium text-red-800">
                  {language === 'hi' ? 'तत्काल चिकित्सा सहायता' :
                   language === 'mr' ? 'तातडीची वैद्यकीय मदत' :
                   language === 'pa' ? 'ਤੁਰੰਤ ਮੈਡੀਕਲ ਸਹਾਇਤਾ' :
                   'Immediate Medical Assistance'}
                </h3>
                <p className="text-sm text-red-600">
                  {symptomAnalysis?.condition || 
                   (language === 'hi' ? 'गंभीर लक्षण का पता चला' :
                    language === 'mr' ? 'गंभीर लक्षणे आढळली' :
                    language === 'pa' ? 'ਗੰਭੀਰ ਲੱਛਣ ਦਾ ਪਤਾ ਲਗਾ' :
                    'Critical symptoms detected')}
                </p>
              </div>
            </div>
            
            {symptomAnalysis?.symptoms && (
              <div className="bg-white rounded-lg p-3 mt-3">
                <p className="text-sm">
                  <span className="font-medium">
                    {language === 'hi' ? 'लक्षण: ' :
                     language === 'mr' ? 'लक्षणे: ' :
                     language === 'pa' ? 'ਲੱਛਣ: ' : 'Symptoms: '}
                  </span>
                  {symptomAnalysis.symptoms}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Call Interface */}
        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            {/* Doctor Video Area */}
            <div className="relative bg-gray-900 aspect-video rounded-t-lg overflow-hidden">
              {callStatus === 'connecting' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm">{getStatusText()}</p>
                  </div>
                </div>
              )}
              
              {callStatus === 'connected' && (
                <>
                  {/* Simulated doctor video */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                    <Avatar className="w-20 h-20 border-4 border-white">
                      <AvatarFallback className="bg-blue-600 text-white text-xl">
                        {doctorInfo.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Doctor info overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
                      <h4 className="font-medium">{doctorInfo.name}</h4>
                      <p className="text-sm text-gray-300">{doctorInfo.designation}</p>
                      <p className="text-xs text-gray-400">{doctorInfo.hospital}</p>
                    </div>
                  </div>
                  
                  {/* Call duration */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(connectionTime)}
                    </div>
                  </div>
                </>
              )}
              
              {callStatus === 'ended' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <PhoneOff className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <p className="text-lg mb-2">{getStatusText()}</p>
                    <p className="text-sm text-gray-300">
                      {language === 'hi' ? 'कुल समय: ' :
                       language === 'mr' ? 'एकूण वेळ: ' :
                       language === 'pa' ? 'ਕੁੱਲ ਸਮਾਂ: ' : 'Total duration: '}
                      {formatTime(connectionTime)}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Patient video (small overlay) */}
              {callStatus === 'connected' && (
                <div className="absolute top-4 left-4 w-24 h-32 bg-gray-700 rounded-lg border-2 border-white overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-teal-600 text-white text-sm">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 bg-black flex items-center justify-center">
                      <VideoOff className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Call Controls */}
            {callStatus !== 'ended' && (
              <div className="p-4 bg-gray-800">
                <div className="flex justify-center items-center gap-4">
                  {/* Audio toggle */}
                  <Button
                    variant={isAudioEnabled ? "secondary" : "destructive"}
                    size="lg"
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className="w-12 h-12 rounded-full p-0"
                  >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>
                  
                  {/* Video toggle */}
                  <Button
                    variant={isVideoEnabled ? "secondary" : "destructive"}
                    size="lg"
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className="w-12 h-12 rounded-full p-0"
                  >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                  
                  {/* End call */}
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleEndCall}
                    className="w-16 h-16 rounded-full p-0 bg-red-600 hover:bg-red-700"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </Button>
                </div>
                
                <p className="text-center text-sm text-gray-400 mt-3">
                  {getStatusText()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Instructions */}
        {callStatus === 'connected' && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <h4 className="font-medium text-yellow-800 mb-2">
                {language === 'hi' ? 'महत्वपूर्ण निर्देश:' :
                 language === 'mr' ? 'महत्त्वाच्या सूचना:' :
                 language === 'pa' ? 'ਮਹੱਤਵਪੂਰਨ ਨਿਰਦੇਸ਼:' :
                 'Important Instructions:'}
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• {language === 'hi' ? 'शांत रहें और डॉक्टर की बात सुनें' :
                        language === 'mr' ? 'शांत राहा आणि डॉक्टरांचे ऐका' :
                        language === 'pa' ? 'ਸ਼ਾਂਤ ਰਹੋ ਅਤੇ ਡਾਕਟਰ ਦੀ ਗੱਲ ਸੁਣੋ' :
                        'Stay calm and listen to the doctor'}</li>
                <li>• {language === 'hi' ? 'स्पष्ट रूप से अपने लक्षण बताएं' :
                        language === 'mr' ? 'स्पष्टपणे तुमची लक्षणे सांगा' :
                        language === 'pa' ? 'ਸਪਸ਼ਟ ਰੂਪ ਵਿੱਚ ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ' :
                        'Clearly describe your symptoms'}</li>
                <li>• {language === 'hi' ? 'दिए गए निर्देshों का पालन करें' :
                        language === 'mr' ? 'दिलेल्या सूचनांचे पालन करा' :
                        language === 'pa' ? 'ਦਿੱਤੇ ਗਏ ਨਿਰਦੇਸ਼ਾਂ ਦਾ ਪਾਲਣ ਕਰੋ' :
                        'Follow the given instructions'}</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Call ended actions */}
        {callStatus === 'ended' && (
          <div className="space-y-3">
            <Button 
              onClick={onCallComplete}
              className="w-full bg-teal-600 hover:bg-teal-700"
            >
              {language === 'hi' ? 'होम पर वापस जाएं' :
               language === 'mr' ? 'होमवर परत जा' :
               language === 'pa' ? 'ਘਰ ਵਾਪਸ ਜਾਓ' :
               'Return to Home'}
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              {language === 'hi' ? 'आपातकालीन सेवाएं आपसे संपर्क कर सकती हैं।' :
               language === 'mr' ? 'आपत्कालीन सेवा तुमच्याशी संपर्क करू शकतात।' :
               language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰ ਸਕਦੀਆਂ ਹਨ।' :
               'Emergency services may contact you for follow-up.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};