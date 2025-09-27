import React from 'react';
import { Language } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { VoiceReader } from '../ui/voice-reader';
import { Video, Phone, Shield, Check, X } from 'lucide-react';

interface VideoCallConsentProps {
  language: Language;
  doctorName: string;
  onVideoConsent: () => void;
  onVoiceConsent: () => void;
  onDecline: () => void;
}

export const VideoCallConsent: React.FC<VideoCallConsentProps> = ({
  language,
  doctorName,
  onVideoConsent,
  onVoiceConsent,
  onDecline
}) => {
  const getConsentText = () => {
    return language === 'hi' ? `डॉ. ${doctorName} आपसे वीडियो या वॉइस कॉल करना चाहते हैं। आप अपनी सुविधा के अनुसार कॉल का प्रकार चुन सकते हैं।` :
           language === 'mr' ? `डॉ. ${doctorName} तुमच्याशी व्हिडिओ किंवा व्हॉईस कॉल करू इच्छितात. तुम्ही तुमच्या सोयीनुसार कॉलचा प्रकार निवडू शकता.` :
           language === 'pa' ? `ਡਾ. ${doctorName} ਤੁਹਾਡੇ ਨਾਲ ਵੀਡੀਓ ਜਾਂ ਵੌਇਸ ਕਾਲ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹਨ। ਤੁਸੀਂ ਆਪਣੀ ਸਹੂਲਤ ਅਨੁਸਾਰ ਕਾਲ ਦਾ ਕਿਸਮ ਚੁਣ ਸਕਦੇ ਹੋ।` :
           `Dr. ${doctorName} wants to connect with you via video or voice call. You can choose the type of call based on your preference.`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-teal-600" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="text-xl">
              {language === 'hi' ? 'कॉल की अनुमति' :
               language === 'mr' ? 'कॉल परवानगी' :
               language === 'pa' ? 'ਕਾਲ ਦੀ ਇਜਾਜ਼ਤ' :
               'Call Permission'}
            </CardTitle>
            <VoiceReader 
              text={language === 'hi' ? 'कॉल की अनुमति' :
                    language === 'mr' ? 'कॉल परवानगी' :
                    language === 'pa' ? 'ਕਾਲ ਦੀ ਇਜਾਜ਼ਤ' :
                    'Call Permission'}
              size="md"
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex items-start gap-2 mb-4">
              <p className="text-gray-600 flex-1">
                {language === 'hi' ? `डॉ. ${doctorName} आपसे वीडियो या वॉइस कॉल करना चाहते हैं।` :
                 language === 'mr' ? `डॉ. ${doctorName} तुमच्याशी व्हिडिओ किंवा व्हॉईस कॉल करू इच्छितात.` :
                 language === 'pa' ? `ਡਾ. ${doctorName} ਤੁਹਾਡੇ ਨਾਲ ਵੀਡੀਓ ਜਾਂ ਵੌਇਸ ਕਾਲ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹਨ।` :
                 `Dr. ${doctorName} wants to connect with you via video or voice call.`}
              </p>
              <VoiceReader 
                text={getConsentText()}
                size="sm"
              />
            </div>
            
            <div className="flex items-start gap-2">
              <p className="text-sm text-gray-500 flex-1">
                {language === 'hi' ? 'आप अपनी सुविधा के अनुसार कॉल का प्रकार चुन सकते हैं।' :
                 language === 'mr' ? 'तुम्ही तुमच्या सोयीनुसार कॉलचा प्रकार निवडू शकता.' :
                 language === 'pa' ? 'ਤੁਸੀਂ ਆਪਣੀ ਸਹੂਲਤ ਅਨੁਸਾਰ ਕਾਲ ਦਾ ਕਿਸਮ ਚੁਣ ਸਕਦੇ ਹੋ।' :
                 'You can choose the type of call based on your preference.'}
              </p>
              <VoiceReader 
                text={language === 'hi' ? 'आप अपनी सुविधा के अनुसार कॉल का प्रकार चुन सकते हैं।' :
                      language === 'mr' ? 'तुम्ही तुमच्या सोयीनुसार कॉलचा प्रकार निवडू शकता.' :
                      language === 'pa' ? 'ਤੁਸੀਂ ਆਪਣੀ ਸਹੂਲਤ ਅਨੁਸਾਰ ਕਾਲ ਦਾ ਕਿਸਮ ਚੁਣ ਸਕਦੇ ਹੋ।' :
                      'You can choose the type of call based on your preference.'}
                size="sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            {/* Video Call Option */}
            <Button
              onClick={onVideoConsent}
              className="w-full h-16 bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-3"
            >
              <Video className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">
                  {language === 'hi' ? 'वीडियो कॉल' :
                   language === 'mr' ? 'व्हिडिओ कॉल' :
                   language === 'pa' ? 'ਵੀਡੀਓ ਕਾਲ' :
                   'Video Call'}
                </div>
                <div className="text-xs text-teal-100">
                  {language === 'hi' ? 'डॉक्टर आपको देख सकेंगे' :
                   language === 'mr' ? 'डॉक्टर तुम्हाला पाहू शकतील' :
                   language === 'pa' ? 'ਡਾਕਟਰ ਤੁਹਾਨੂੰ ਦੇਖ ਸਕਣਗੇ' :
                   'Doctor can see you'}
                </div>
              </div>
            </Button>

            {/* Voice Call Option */}
            <Button
              onClick={onVoiceConsent}
              variant="outline"
              className="w-full h-16 border-2 border-blue-300 hover:bg-blue-50 flex items-center justify-center gap-3"
            >
              <Phone className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-blue-700">
                  {language === 'hi' ? 'वॉइस कॉल' :
                   language === 'mr' ? 'व्हॉईस कॉल' :
                   language === 'pa' ? 'ਵੌਇਸ ਕਾਲ' :
                   'Voice Call'}
                </div>
                <div className="text-xs text-blue-600">
                  {language === 'hi' ? 'केवल आवाज़' :
                   language === 'mr' ? 'फक्त आवाज' :
                   language === 'pa' ? 'ਸਿਰਫ਼ ਆਵਾਜ਼' :
                   'Audio only'}
                </div>
              </div>
            </Button>
          </div>

          <div className="border-t pt-4">
            <Button
              onClick={onDecline}
              variant="ghost"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'कॉल अस्वीकार करें' :
               language === 'mr' ? 'कॉल नाकारा' :
               language === 'pa' ? 'ਕਾਲ ਇਨਕਾਰ ਕਰੋ' :
               'Decline Call'}
            </Button>
          </div>

          <div className="text-xs text-gray-400 text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <p>
                {language === 'hi' ? '🔒 आपकी निजता सुरक्षित है' :
                 language === 'mr' ? '🔒 तुमची गोपनीयता सुरक्षित आहे' :
                 language === 'pa' ? '🔒 ਤੁਹਾਡੀ ਗੋਪਨੀਯਤਾ ਸੁਰੱਖਿਤ ਹੈ' :
                 '🔒 Your privacy is protected'}
              </p>
              <VoiceReader 
                text={language === 'hi' ? 'आपकी निजता सुरक्षित है। यह कॉल रिकॉर्ड नहीं होगी।' :
                      language === 'mr' ? 'तुमची गोपनीयता सुरक्षित आहे. हा कॉल रेकॉर्ड होणार नाही.' :
                      language === 'pa' ? 'ਤੁਹਾਡੀ ਗੋਪਨੀਯਤਾ ਸੁਰੱਖਿਤ ਹੈ। ਇਹ ਕਾਲ ਰਿਕਾਰਡ ਨਹੀਂ ਹੋਵੇਗੀ।' :
                      'Your privacy is protected. This call will not be recorded.'}
                size="sm"
              />
            </div>
            <p>
              {language === 'hi' ? 'यह कॉल रिकॉर्ड नहीं होगी' :
               language === 'mr' ? 'हा कॉल रेकॉर्ड होणार नाही' :
               language === 'pa' ? 'ਇਹ ਕਾਲ ਰਿਕਾਰਡ ਨਹੀਂ ਹੋਵੇਗੀ' :
               'This call will not be recorded'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};