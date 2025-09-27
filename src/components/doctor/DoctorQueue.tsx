import React, { useState, useEffect } from 'react';
import { Doctor, SeverityZone, QueueItem as QueueItemType, DoctorQueue as DoctorQueueType } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { ArrowLeft, Clock, User, AlertTriangle, Activity, Users } from 'lucide-react';
import { getQueueForDoctor, getQueueStats, mockPatients } from '../../utils/mockData';
import { toast } from 'sonner@2.0.3';


interface DoctorQueueProps {
  user: Doctor;
  onBack: () => void;
  onStartConsultation: (patient: any) => void;
}

export const DoctorQueue: React.FC<DoctorQueueProps> = ({
  user,
  onBack,
  onStartConsultation
}) => {
  const [doctorQueue, setDoctorQueue] = useState<DoctorQueueType | null>(null);
  const [queueStats, setQueueStats] = useState({
    totalWaiting: 0,
    inConsultation: 0,
    severityCounts: { yellow: 0, orange: 0, red: 0 },
    averageWaitTime: 0
  });

  useEffect(() => {
    // Get queue for current doctor
    const queue = getQueueForDoctor(user.doctorId);
    setDoctorQueue(queue);

    // Get overall queue statistics
    const stats = getQueueStats();
    setQueueStats(stats);
  }, [user.doctorId]);

  const shouldReceiveConsultation = (severity: SeverityZone, doctorRole: string): boolean => {
    // Emergency patients (red severity) bypass queue system entirely
    if (severity === 'red') return false;
    
    switch (doctorRole) {
      case 'cho':
        return severity === 'yellow'; // Only yellow zone patients
      case 'mo':
        return severity === 'orange'; // Only orange zone patients
      case 'civil_doctor':
        return severity === 'orange'; // Only orange cases escalated from MO
      case 'emergency_doctor':
        return false; // Emergency doctors handle emergency cases immediately without queue
      default:
        return false;
    }
  };

  const getSeverityPriority = (severity: SeverityZone): number => {
    switch (severity) {
      case 'red': return 3;
      case 'orange': return 2;
      case 'yellow': return 1;
      default: return 0;
    }
  };

  const getSeverityColor = (severity: SeverityZone) => {
    return severity === 'red' ? 'bg-red-100 text-red-800' :
           severity === 'orange' ? 'bg-orange-100 text-orange-800' :
           'bg-yellow-100 text-yellow-800';
  };

  const handleStartConsultation = (queueItem: QueueItemType) => {
    const patient = mockPatients.find(p => p.patientId === queueItem.patientId);
    if (patient) {
      onStartConsultation({
        ...patient,
        consultation: {
          id: queueItem.consultationId,
          symptoms: queueItem.symptoms,
          severity: queueItem.severity
        }
      });
    }
  };





  const handleTagAsEmergency = (queueItem: QueueItemType) => {
    // Mock emergency tagging logic
    toast.error(`🚨 Patient ${queueItem.patientName} tagged as EMERGENCY - Immediate response required!`);
    
    // In a real app, this would update patient severity to red and notify emergency doctors
    // For now, we'll just remove from current queue
    if (doctorQueue) {
      const updatedQueue = doctorQueue.queue.filter(item => item.id !== queueItem.id);
      setDoctorQueue({ ...doctorQueue, queue: updatedQueue });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg">Patient Queue</h1>
          <div className="text-sm text-gray-600">
            {user.designation}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Queue Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl">{doctorQueue?.queue.length || 0}</div>
              <p className="text-sm text-gray-600">Your Queue</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl">{queueStats.severityCounts.orange}</div>
              <p className="text-sm text-gray-600">Orange Cases</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl">{Math.round(queueStats.averageWaitTime)}m</div>
              <p className="text-sm text-gray-600">Avg Wait Time</p>
            </CardContent>
          </Card>
        </div>

        {/* Doctor Status */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Doctor Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700">Available for Consultations</span>
              </div>
              <Badge className="bg-green-600">ONLINE</Badge>
            </div>
            <p className="text-sm text-green-600 mt-2">
              Ready to accept new patients • Average consultation: {doctorQueue?.averageConsultationTime || 15} minutes
            </p>
          </CardContent>
        </Card>

        {/* Queue List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Patient Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!doctorQueue || doctorQueue.queue.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg mb-2">No patients in queue</h3>
                <p>You're all caught up! New patients will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {doctorQueue.queue.map((queueItem, index) => {
                  const patient = mockPatients.find(p => p.patientId === queueItem.patientId);
                  return (
                    <div 
                      key={queueItem.id} 
                      className={`border rounded-lg p-4 ${
                        queueItem.severity === 'red' ? 'border-red-200 bg-red-50' :
                        queueItem.severity === 'orange' ? 'border-orange-200 bg-orange-50' :
                        'border-gray-200'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Patient Information Row */}
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-mono text-gray-400">
                            #{String(queueItem.position).padStart(2, '0')}
                          </div>
                          
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {queueItem.patientName?.split(' ').map((n: string) => n[0]).join('') || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3>{queueItem.patientName}</h3>
                              <Badge className={getSeverityColor(queueItem.severity)}>
                                {queueItem.severity.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Patient ID: {queueItem.patientId}</p>
                              <p>Age: {queueItem.patientAge}, Gender: {patient?.gender}</p>
                              <p>Symptoms: {queueItem.symptoms.join(', ')}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-4 h-4" />
                                <span>Est. Wait: {queueItem.estimatedWaitTime} minutes</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                In queue since: {new Date(queueItem.queueTime).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons Row */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gray-200">
                          <Button
                            onClick={() => handleStartConsultation(queueItem)}
                            size="sm"
                            className="flex-1"
                          >
                            <Activity className="w-4 h-4 mr-2" />
                            Start Consultation
                          </Button>

                          {/* Tag as Emergency - Available for all doctors except emergency doctors */}
                          {user.role !== 'emergency_doctor' && (
                            <Button
                              onClick={() => handleTagAsEmergency(queueItem)}
                              variant="destructive"
                              size="sm"
                              className="flex-1"
                            >
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Tag as Emergency
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Doctor Role Info */}
        <Card>
          <CardHeader>
            <CardTitle>Your Queue Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p>As a <strong>{user.designation}</strong>, you handle:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                {user.role === 'cho' && (
                  <div className="space-y-1">
                    <Badge className="bg-yellow-100 text-yellow-800">YELLOW</Badge>
                    <p className="text-xs text-gray-600">Primary care cases</p>
                  </div>
                )}
                {user.role === 'mo' && (
                  <div className="space-y-1">
                    <Badge className="bg-orange-100 text-orange-800">ORANGE</Badge>
                    <p className="text-xs text-gray-600">Moderate severity cases</p>
                  </div>
                )}
                {user.role === 'civil_doctor' && (
                  <div className="space-y-1">
                    <Badge className="bg-orange-100 text-orange-800">ORANGE</Badge>
                    <p className="text-xs text-gray-600">Escalated cases only</p>
                  </div>
                )}
                {user.role === 'emergency_doctor' && (
                  <div className="space-y-1">
                    <Badge className="bg-red-100 text-red-800">EMERGENCY</Badge>
                    <p className="text-xs text-gray-600">Handle emergency cases immediately (no queue)</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};