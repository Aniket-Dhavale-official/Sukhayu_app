import React, { useState, useEffect } from 'react';
import { QueueItem, Doctor } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Phone, 
  Activity, 
  Stethoscope,
  Bell
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EmergencyNotificationProps {
  doctor: Doctor;
  onStartConsultation: (patient: any) => void;
}

interface EmergencyCase {
  id: string;
  patientName: string;
  patientId: string;
  patientAge: number;
  symptoms: string[];
  severity: 'red';
  estimatedWaitTime: number;
  queueTime: string;
  criticalScore: number;
  location?: string;
}

export const EmergencyNotification: React.FC<EmergencyNotificationProps> = ({
  doctor,
  onStartConsultation
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const [currentEmergencyCase, setCurrentEmergencyCase] = useState<EmergencyCase | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);

  // Simulate emergency cases arriving
  useEffect(() => {
    if (doctor.role !== 'emergency_doctor') return;

    const mockEmergencyCases: EmergencyCase[] = [
      {
        id: 'EM001',
        patientName: 'अनिल कुमार',
        patientId: 'P010',
        patientAge: 52,
        symptoms: ['chest pain', 'difficulty breathing', 'sweating'],
        severity: 'red',
        estimatedWaitTime: 0,
        queueTime: new Date().toISOString(),
        criticalScore: 9.2,
        location: 'Village: रामपुर, Tehsil: बरेली'
      },
      {
        id: 'EM002',
        patientName: 'सुनीता देवी',
        patientId: 'P011',
        patientAge: 38,
        symptoms: ['severe abdominal pain', 'vomiting', 'fever'],
        severity: 'red',
        estimatedWaitTime: 0,
        queueTime: new Date().toISOString(),
        criticalScore: 8.7,
        location: 'Village: गोपालपुर, Tehsil: सहारनपुर'
      },
      {
        id: 'EM003',
        patientName: 'राज सिंह',
        patientId: 'P012',
        patientAge: 45,
        symptoms: ['accident injury', 'bleeding', 'unconsciousness'],
        severity: 'red',
        estimatedWaitTime: 0,
        queueTime: new Date().toISOString(),
        criticalScore: 9.8,
        location: 'Village: मोहनपुर, Tehsil: मेरठ'
      }
    ];

    // Simulate new emergency cases arriving every 2-4 minutes
    const intervals = [120000, 180000, 240000]; // 2, 3, 4 minutes
    let currentIndex = 0;

    const simulateEmergency = () => {
      if (currentIndex < mockEmergencyCases.length) {
        const emergencyCase = mockEmergencyCases[currentIndex];
        setCurrentEmergencyCase(emergencyCase);
        setShowNotification(true);
        setNotificationCount(prev => prev + 1);
        
        // Show toast notification
        toast.error('🚨 URGENT: New Emergency Case!', {
          description: `Patient: ${emergencyCase.patientName} - Critical Score: ${emergencyCase.criticalScore}`,
          duration: 8000,
        });
        
        // Play notification sound effect (simulated)
        console.log('🔊 Emergency notification sound played');
        
        currentIndex++;
        
        // Schedule next emergency if available
        if (currentIndex < mockEmergencyCases.length) {
          const nextInterval = intervals[Math.floor(Math.random() * intervals.length)];
          setTimeout(simulateEmergency, nextInterval);
        }
      }
    };

    // Start first emergency after 30 seconds
    const initialTimeout = setTimeout(simulateEmergency, 30000);

    return () => {
      clearTimeout(initialTimeout);
    };
  }, [doctor.role]);

  const handleAcceptEmergency = () => {
    if (currentEmergencyCase) {
      // Convert emergency case to consultation format
      const consultationData = {
        id: currentEmergencyCase.patientId,
        role: 'patient',
        fullName: currentEmergencyCase.patientName,
        patientId: currentEmergencyCase.patientId,
        age: currentEmergencyCase.patientAge,
        gender: 'male', // Default for mock
        isActive: true,
        consultation: {
          id: currentEmergencyCase.id,
          symptoms: currentEmergencyCase.symptoms,
          severity: currentEmergencyCase.severity,
          criticalScore: currentEmergencyCase.criticalScore,
          location: currentEmergencyCase.location
        }
      };

      onStartConsultation(consultationData);
      setShowNotification(false);
      setCurrentEmergencyCase(null);
      
      toast.success(`Emergency consultation started with ${currentEmergencyCase.patientName}`);
    }
  };

  // Removed dismiss functionality - emergency cases must be handled immediately

  if (doctor.role !== 'emergency_doctor' || !showNotification || !currentEmergencyCase) {
    return null;
  }

  return (
    <Dialog open={showNotification} onOpenChange={() => {}}>
      <DialogContent className="max-w-md border-red-500 border-2 bg-red-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-800">
            <div className="flex items-center gap-2">
              <div className="relative">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              </div>
              <span>🚨 EMERGENCY ALERT</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Critical Score Banner */}
          <div className="bg-red-600 text-white p-3 rounded-lg text-center">
            <div className="text-2xl font-bold">Critical Score: {currentEmergencyCase.criticalScore}/10</div>
            <div className="text-sm opacity-90">IMMEDIATE ATTENTION REQUIRED</div>
          </div>

          {/* Patient Info */}
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12 border-2 border-red-200">
                <AvatarFallback className="bg-red-100 text-red-700">
                  {currentEmergencyCase.patientName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{currentEmergencyCase.patientName}</h3>
                <p className="text-sm text-gray-600">ID: {currentEmergencyCase.patientId}</p>
                <p className="text-sm text-gray-600">Age: {currentEmergencyCase.patientAge} years</p>
              </div>
            </div>

            {/* Location */}
            {currentEmergencyCase.location && (
              <div className="mb-3 p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">{currentEmergencyCase.location}</span>
                </div>
              </div>
            )}

            {/* Critical Symptoms */}
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-800 mb-2">🩺 Emergency Symptoms:</h4>
              <div className="flex flex-wrap gap-1">
                {currentEmergencyCase.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Timing Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Queue Time: {new Date(currentEmergencyCase.queueTime).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleAcceptEmergency}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Accept Emergency
            </Button>
          </div>

          {/* Emergency Protocol Note */}
          <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-200">
            <strong>⚠️ Emergency Protocol:</strong> Emergency cases require immediate medical attention. 
            You must accept this case to proceed with emergency consultation.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};