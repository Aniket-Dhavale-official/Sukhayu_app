import React, { useState } from 'react';
import { Doctor } from '../../types';
import { DoctorHomepage } from './DoctorHomepage';
import { DoctorProfile } from './DoctorProfile';
import { DoctorQueue } from './DoctorQueue';
import { DoctorConsultation } from './DoctorConsultation';
import { EmergencyNotification } from './EmergencyNotification';
import { RedirectionNotificationDemo } from './RedirectionNotification';
import sukhayuLogo from 'figma:asset/d04331b26d9697b77a11d091903e7e7f2fc132f0.png';

interface DoctorAppProps {
  user: Doctor;
  onLogout: () => void;
}

type Screen = 'home' | 'profile' | 'queue' | 'consultation' | 'redirection-demo';

export const DoctorApp: React.FC<DoctorAppProps> = ({
  user,
  onLogout
}) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentPatient, setCurrentPatient] = useState<any>(null);

  const handleStartConsultation = (patient: any) => {
    setCurrentPatient(patient);
    setCurrentScreen('consultation');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'profile':
        return (
          <DoctorProfile
            user={user}
            onBack={() => setCurrentScreen('home')}
            onLogout={onLogout}
          />
        );
      case 'queue':
        return (
          <DoctorQueue
            user={user}
            onBack={() => setCurrentScreen('home')}
            onStartConsultation={handleStartConsultation}
          />
        );
      case 'consultation':
        return (
          <DoctorConsultation
            user={user}
            patient={currentPatient}
            onBack={() => setCurrentScreen('queue')}
            onComplete={() => setCurrentScreen('home')}
          />
        );
      case 'redirection-demo':
        return (
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="text-blue-600 hover:text-blue-800 mb-4"
                >
                  ← Back to Home
                </button>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Redirection Notification Demo
                </h2>
                <p className="text-gray-600">
                  Sample notifications for patient redirection between Chief Health Officer, Medical Officer, and Civil Hospital Doctor
                </p>
              </div>
              <RedirectionNotificationDemo />
            </div>
          </div>
        );
      default:
        return (
          <DoctorHomepage
            user={user}
            onNavigate={setCurrentScreen}
            onStartConsultation={handleStartConsultation}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'home' && (
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <img src={sukhayuLogo} alt="Sukhayu Logo" className="w-8 h-8" />
              <h1 className="text-xl text-blue-900">Sukhayu Doctor</h1>
            </div>
            <div className="text-sm text-gray-600">
              {user.designation}
            </div>
          </div>
        </div>
      )}
      {renderScreen()}
      
      {/* Emergency Notification System - Only for Emergency Doctors */}
      <EmergencyNotification 
        doctor={user} 
        onStartConsultation={handleStartConsultation}
      />
    </div>
  );
};