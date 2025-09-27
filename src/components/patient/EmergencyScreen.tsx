import React, { useState, useEffect } from 'react';
import { Patient, ASHAWorker, Language } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, AlertTriangle, MapPin } from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { DoctorConsultation } from './DoctorConsultation';
import { toast } from 'sonner@2.0.3';

interface EmergencyScreenProps {
  user: Patient | ASHAWorker;
  language: Language;
  onBack: () => void;
}

type EmergencyStep = 'warning' | 'countdown' | 'consultation';

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  user,
  language,
  onBack
}) => {
  const [step, setStep] = useState<EmergencyStep>('warning');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [emergencyId, setEmergencyId] = useState<string>('');
  const [consultationData, setConsultationData] = useState<any>(null);
  const [countdown, setCountdown] = useState<number>(5);

  const t = (key: string) => getTranslation(key, language);

  useEffect(() => {
    // Get user location when emergency is activated
    if (step === 'consultation') {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'Village Health Center Road, Block 1' // Mock address
          });
        },
        () => {
          // Fallback to mock location
          setLocation({
            latitude: 28.6139,
            longitude: 77.2090,
            address: 'Village Health Center Road, Block 1'
          });
        }
      );
    }
  }, [step]);

  // Countdown timer effect
  useEffect(() => {
    if (step === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (step === 'countdown' && countdown === 0) {
      // Start consultation after countdown
      setStep('consultation');
      toast.success('Emergency services activated - Connecting to Emergency Doctor');
    }
  }, [step, countdown]);

  const handleConfirmEmergency = () => {
    // Set emergency ID and location sharing
    setEmergencyId('EMG' + Date.now());
    
    // Set up emergency consultation data immediately
    const consultationData = {
      symptoms: ['emergency', 'severe_pain', 'breathing_difficulty'],
      severity: 'red' as const,
      recommendedDoctor: 'emergency_doctor',
      source: 'emergency',
      analysis: {
        condition: 'Emergency Response',
        severity: 'red',
        recommendation: 'Immediate emergency medical attention required'
      }
    };
    
    setConsultationData(consultationData);
    setCountdown(5); // Reset countdown
    setStep('countdown');
    toast.info('Emergency countdown started');
  };

  const handleCancelEmergency = () => {
    onBack();
  };

  const handleCancelCountdown = () => {
    setStep('warning');
    setCountdown(5);
    setConsultationData(null);
    toast.info('Emergency cancelled');
  };

  const renderWarningScreen = () => (
    <Card className="border-red-200">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <CardTitle className="text-red-700">{t('emergency')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-center">
            {t('emergencyWarning')}
          </p>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <h4 className="font-medium text-gray-800">This will:</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-red-600">•</span>
              Connect you directly to Emergency Doctor
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600">•</span>
              Start comprehensive medical consultation
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600">•</span>
              Send your location to ambulance services
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600">•</span>
              Notify nearby medical facilities
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600">•</span>
              Alert your emergency contacts
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleConfirmEmergency}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {t('confirm')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCountdownScreen = () => (
    <Card className="border-red-200">
      <CardContent className="pt-8 space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="text-4xl font-bold text-red-600">{countdown}</div>
          </div>
          
          <h2 className="text-xl mb-4 text-red-700">
            {t('emergencyCountdown')}
          </h2>
          
          <div className="text-lg text-red-600 mb-2">
            <span className="font-bold">{countdown}</span> {t('seconds')}
          </div>
          
          <div className="text-sm text-gray-600 mb-6">
            {countdown === 0 ? t('startingEmergencyCall') : t('cancelBeforeStart')}
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-red-800 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency ID: {emergencyId}</span>
          </div>
          <p className="text-xs text-red-600">
            Your location and emergency details are being prepared for emergency services.
          </p>
        </div>

        {countdown > 0 && (
          <Button
            variant="outline"
            onClick={handleCancelCountdown}
            className="w-full border-red-300 text-red-700 hover:bg-red-50"
          >
            {t('cancel')} {t('emergency')}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // If we're in consultation step, show the full consultation interface
  if (step === 'consultation' && consultationData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Emergency Header */}
        <div className="bg-red-600 text-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => {
                setStep('warning');
                setConsultationData(null);
              }}
              className="p-2 text-white hover:bg-red-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-medium">🚨 Emergency Consultation</h1>
              {emergencyId && (
                <p className="text-xs text-red-100">ID: {emergencyId}</p>
              )}
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Emergency Status Banner */}
        {location && (
          <div className="bg-red-50 border-b border-red-200 p-3">
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-2 text-sm text-red-800">
                <MapPin className="w-4 h-4" />
                <span>Emergency services have been notified</span>
              </div>
              <p className="text-xs text-red-600 mt-1">{location.address}</p>
            </div>
          </div>
        )}

        {/* Doctor Consultation Interface */}
        <div className="max-w-md mx-auto">
          <DoctorConsultation
            user={user}
            language={language}
            consultationData={consultationData}
            onBack={() => {
              setStep('warning');
              setConsultationData(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => {
              if (step === 'countdown') {
                handleCancelCountdown();
              } else {
                onBack();
              }
            }} 
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg text-red-700">
            {step === 'countdown' ? `${t('emergency')} ${t('countdown')}` : t('emergency')}
          </h1>
          <div></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {step === 'warning' && renderWarningScreen()}
        {step === 'countdown' && renderCountdownScreen()}
      </div>
    </div>
  );
};