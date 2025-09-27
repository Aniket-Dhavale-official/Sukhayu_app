import React, { useState } from 'react';
import { Patient, ASHAWorker, Language } from '../../types';
import { PatientHomepage } from './PatientHomepage';
import { PatientProfile } from './PatientProfile';
import { ConsultationHistory } from './ConsultationHistory';
import { SymptomChecker } from './SymptomChecker';
import { ConsultationFlow } from './ConsultationFlow';
import { DoctorConsultation } from './DoctorConsultation';
import { EmergencyScreen } from './EmergencyScreen';
import { EmergencyVideoCall } from './EmergencyVideoCall';
import { MedicineAvailabilityCheck } from './MedicineAvailabilityCheck';
import { DiseaseOutbreakAnalytics } from './DiseaseOutbreakAnalytics';
import { LiveChat } from './LiveChat';
import { VideoCallConsent } from './VideoCallConsent';
import { ASHADashboard } from './ASHADashboard';
import { ASHAPatientSurvey } from './ASHAPatientSurvey';
import { ASHAPatientRegistration } from './ASHAPatientRegistration';
import { ASHAPatientLogin } from './ASHAPatientLogin';
import { LanguageSelector } from '../LanguageSelector';
import { getTranslation } from '../../utils/translations';
import sukhayuLogo from 'figma:asset/d04331b26d9697b77a11d091903e7e7f2fc132f0.png';

interface PatientAppProps {
  user: Patient | ASHAWorker;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onLogout: () => void;
}

type Screen = 'home' | 'profile' | 'history' | 'symptom-checker' | 'consultation-flow' | 'consultation' | 'emergency' | 'emergency-video-call' | 'medicine-check' | 'disease-analytics' | 'live-chat' | 'asha-dashboard' | 'patient-survey' | 'register-patient' | 'patient-login';

export const PatientApp: React.FC<PatientAppProps> = ({
  user,
  language,
  onLanguageChange,
  onLogout
}) => {
  // ASHA workers should see the dashboard first, patients see home
  const [currentScreen, setCurrentScreen] = useState<Screen>(user.role === 'asha' ? 'asha-dashboard' : 'home');
  const [consultationData, setConsultationData] = useState<any>(null);
  const [showVideoConsent, setShowVideoConsent] = useState(false);
  // Track when ASHA worker is helping a patient
  const [assistedPatient, setAssistedPatient] = useState<Patient | null>(null);

  const t = (key: string) => getTranslation(key, language);

  const handleStartConsultation = (data: any) => {
    setConsultationData(data);
    setCurrentScreen('consultation');
  };

  const handleVideoCall = () => {
    setShowVideoConsent(true);
  };

  const handleVideoConsent = (accepted: boolean) => {
    setShowVideoConsent(false);
    if (accepted) {
      // Start video call logic here
      console.log('Starting video call...');
    }
  };

  const handlePatientRegistered = (patient: Patient) => {
    // In real app, this would update the backend
    console.log('Patient registered:', patient);
    setCurrentScreen('asha-dashboard');
  };

  const handlePatientLogin = (patient: Patient) => {
    // Switch to patient view for the logged-in patient
    console.log('Patient logged in:', patient);
    setAssistedPatient(patient);
    setCurrentScreen('home');
  };

  const handleBackToASHA = () => {
    setAssistedPatient(null);
    setCurrentScreen('asha-dashboard');
  };

  const getHomeScreen = () => {
    if (user.role === 'asha' && !assistedPatient) {
      return 'asha-dashboard';
    }
    return 'home';
  };

  // Get the current active user (either the original user or the assisted patient)
  const getCurrentUser = () => {
    return assistedPatient || user;
  };

  // Check if we're in ASHA assistance mode
  const isASHAAssisting = () => {
    return user.role === 'asha' && assistedPatient !== null;
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'profile':
        return (
          <PatientProfile
            user={getCurrentUser()}
            language={language}
            onBack={() => setCurrentScreen(getHomeScreen())}
            onLogout={isASHAAssisting() ? handleBackToASHA : onLogout}
          />
        );
      case 'history':
        return (
          <ConsultationHistory
            user={getCurrentUser()}
            language={language}
            onBack={() => setCurrentScreen(getHomeScreen())}
          />
        );
      case 'symptom-checker':
        return (
          <SymptomChecker
            user={getCurrentUser()}
            language={language}
            onBack={() => setCurrentScreen(getHomeScreen())}
            showConsultationOption={false}
          />
        );
      case 'consultation-flow':
        return (
          <ConsultationFlow
            user={getCurrentUser()}
            language={language}
            onBack={() => setCurrentScreen(getHomeScreen())}
            onStartConsultation={handleStartConsultation}
          />
        );
      case 'consultation':
        return (
          <DoctorConsultation
            user={getCurrentUser()}
            language={language}
            consultationData={consultationData}
            onBack={() => setCurrentScreen(getHomeScreen())}
          />
        );
      case 'emergency':
        return (
          <EmergencyScreen
            user={getCurrentUser()}
            language={language}
            onBack={() => setCurrentScreen(getHomeScreen())}
          />
        );
      case 'emergency-video-call':
        return (
          <EmergencyVideoCall
            user={getCurrentUser()}
            language={language}
            onBack={() => setCurrentScreen(getHomeScreen())}
            onCallComplete={() => setCurrentScreen(getHomeScreen())}
          />
        );
      case 'medicine-check':
        return (
          <MedicineAvailabilityCheck
            language={language}
            onBack={() => setCurrentScreen(getHomeScreen())}
          />
        );
      case 'disease-analytics':
        return (
          <DiseaseOutbreakAnalytics
            user={getCurrentUser()}
            language={language}
            onBack={() => setCurrentScreen(getHomeScreen())}
          />
        );
      case 'live-chat':
        return (
          <LiveChat
            language={language}
            doctorName="Dr. अमित कुमार"
            onBack={() => setCurrentScreen(getHomeScreen())}
            onVideoCall={handleVideoCall}
          />
        );
      case 'asha-dashboard':
        return (
          <ASHADashboard
            user={user as ASHAWorker}
            language={language}
            onLanguageChange={onLanguageChange}
            onNavigate={setCurrentScreen}
            onLogout={onLogout}
          />
        );
      case 'patient-survey':
        return (
          <ASHAPatientSurvey
            language={language}
            onBack={() => setCurrentScreen('asha-dashboard')}
          />
        );
      case 'register-patient':
        return (
          <ASHAPatientRegistration
            language={language}
            onBack={() => setCurrentScreen('asha-dashboard')}
            onPatientRegistered={handlePatientRegistered}
          />
        );
      case 'patient-login':
        return (
          <ASHAPatientLogin
            language={language}
            onBack={() => setCurrentScreen('asha-dashboard')}
            onPatientLogin={handlePatientLogin}
          />
        );
      default:
        return (
          <PatientHomepage
            user={getCurrentUser()}
            language={language}
            onNavigate={setCurrentScreen}
            onStartConsultation={handleStartConsultation}
            onLogout={isASHAAssisting() ? handleBackToASHA : onLogout}
            isASHAAssisting={isASHAAssisting()}
            onBackToASHA={handleBackToASHA}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'home' && (
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <img src={sukhayuLogo} alt="Sukhayu Logo" className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-medium text-blue-900">Sukhayu</h1>
                {isASHAAssisting() && assistedPatient && (
                  <p className="text-xs text-purple-600">
                    Assisting: {assistedPatient.fullName}
                  </p>
                )}
              </div>
            </div>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>
      )}
      {renderScreen()}
    </div>
  );
};