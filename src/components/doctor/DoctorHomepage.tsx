import React, { useState, useEffect } from 'react';
import { Doctor } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Switch } from '../ui/switch';
import { 
  User, 
  Clock, 
  Users, 
  Calendar, 
  AlertTriangle,
  Activity,
  CheckCircle,
  UserCheck
} from 'lucide-react';
import { getQueueForDoctor, getQueueStats, mockConsultations, mockPatients } from '../../utils/mockData';

interface DoctorHomepageProps {
  user: Doctor;
  onNavigate: (screen: string) => void;
  onStartConsultation: (patient: any) => void;
}

export const DoctorHomepage: React.FC<DoctorHomepageProps> = ({
  user,
  onNavigate,
  onStartConsultation
}) => {
  const [isAvailable, setIsAvailable] = useState(user.status === 'available');
  const [doctorQueue, setDoctorQueue] = useState<any>(null);
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

  const getTodayConsultationsCount = () => {
    const today = new Date().toISOString().split('T')[0];
    return mockConsultations.filter(c => 
      c.doctorId === user.doctorId && 
      c.date === today && 
      c.status === 'completed'
    ).length;
  };

  const handleStatusToggle = (available: boolean) => {
    setIsAvailable(available);
    // In real app, this would update the doctor's status in the backend
  };

  const handleQuickConsultation = () => {
    // Get next patient from doctor's queue
    if (doctorQueue && doctorQueue.queue.length > 0) {
      const nextQueueItem = doctorQueue.queue[0]; // Queue is already sorted by priority
      const patient = mockPatients.find(p => p.patientId === nextQueueItem.patientId);
      
      if (patient) {
        onStartConsultation({
          ...patient,
          consultation: {
            id: nextQueueItem.consultationId,
            symptoms: nextQueueItem.symptoms,
            severity: nextQueueItem.severity
          }
        });
      }
    }
  };

  const getStatusColor = () => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Doctor Info Card */}
      <Card className={`${user.role === 'emergency_doctor' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-green-500'} text-white`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-white">
                <AvatarImage src={user.profilePhoto} />
                <AvatarFallback className="bg-white text-blue-600">
                  {user.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl">{user.fullName}</h2>
                <p className={`${user.role === 'emergency_doctor' ? 'text-red-100' : 'text-blue-100'}`}>{user.designation}</p>
                <p className={`${user.role === 'emergency_doctor' ? 'text-red-100' : 'text-blue-100'} text-sm`}>{user.doctorId}</p>
                {user.department && (
                  <p className={`${user.role === 'emergency_doctor' ? 'text-red-100' : 'text-blue-100'} text-sm`}>{user.department}</p>
                )}
                {user.role === 'emergency_doctor' && (
                  <div className="flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm text-yellow-300 font-medium">EMERGENCY SPECIALIST</span>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('profile')}
              className="text-white hover:bg-white/20"
            >
              <User className="w-4 h-4 mr-1" />
              Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg">Status</h3>
              <p className="text-sm text-gray-600">
                {isAvailable ? 'You are available for consultations' : 'You are currently busy'}
              </p>
              {user.role === 'emergency_doctor' && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-600 font-medium">🚨 Emergency Alert System Active</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor()}>
                {isAvailable ? 'Available' : 'Busy'}
              </Badge>
              <Switch
                checked={isAvailable}
                onCheckedChange={handleStatusToggle}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Consultation Status */}
      {doctorQueue?.currentConsultation && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Currently Consulting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">Consultation ID: {doctorQueue.currentConsultation}</p>
            <p className="text-sm text-green-600 mt-1">Patient is in consultation with you</p>
            <Button className="mt-3 bg-green-600 hover:bg-green-700" size="sm">
              <Activity className="w-4 h-4 mr-2" />
              Continue Consultation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistics Grid */}
      <div className={`grid gap-4 ${user.role === 'emergency_doctor' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-3'}`}>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl">{getTodayConsultationsCount()}</div>
            <p className="text-sm text-gray-600">Today's Consultations</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl">{doctorQueue?.queue.length || 0}</div>
            <p className="text-sm text-gray-600">Your Queue</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl">{queueStats.totalWaiting}</div>
            <p className="text-sm text-gray-600">Total Waiting</p>
          </CardContent>
        </Card>

        {/* Emergency doctors handle cases immediately - no queue count needed */}
        {user.role === 'emergency_doctor' && (
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl">Ready</div>
              <p className="text-sm text-gray-600">Emergency Response</p>
            </CardContent>
          </Card>
        )}
      </div>



      {/* Emergency Doctor Special Section */}
      {user.role === 'emergency_doctor' && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Emergency Protocol Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-red-700">
                🚨 You handle <strong>RED priority emergency cases immediately</strong> without queueing. 
                Emergency notifications will appear automatically when critical patients need urgent attention.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700">Immediate emergency response</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span className="text-red-700">24/7 Shift Available</span>
                </div>
              </div>
              <div className="pt-2 border-t border-red-200">
                <div className="text-xs text-red-600">
                  <strong>Shift Time:</strong> Emergency doctors are available 24/7 for immediate response. 
                  Current shift: Day (8:00 AM - 8:00 PM)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className={`grid gap-4 ${user.role === 'cho' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('queue')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Patient Queue
            </CardTitle>
            <CardDescription>
              Manage patient queue and start consultations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {user.role === 'emergency_doctor' ? 'Ready for emergency response' : `${doctorQueue?.queue.length || 0} patients waiting`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-shadow ${
            isAvailable && (doctorQueue?.queue.length || 0) > 0 
              ? 'hover:shadow-md' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={isAvailable && (doctorQueue?.queue.length || 0) > 0 ? handleQuickConsultation : undefined}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Quick Consultation
            </CardTitle>
            <CardDescription>
              Start next consultation immediately
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {isAvailable 
                  ? (doctorQueue?.queue.length || 0) > 0 
                    ? 'Ready to start' 
                    : 'No patients waiting'
                  : 'Set status to available'
                }
              </span>
              {isAvailable && (doctorQueue?.queue.length || 0) > 0 && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Redirection Demo - Only for CHO */}
        {user.role === 'cho' && (
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-teal-200 bg-teal-50"
            onClick={() => onNavigate('redirection-demo')}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <UserCheck className="w-5 h-5" />
                Redirection Demo
              </CardTitle>
              <CardDescription className="text-teal-600">
                View sample patient redirection notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-teal-600">
                  Sample CHO → MO/Civil Hospital notifications
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          {getTodayConsultationsCount() === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No consultations today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockConsultations
                .filter(c => c.doctorId === user.doctorId)
                .slice(0, 3)
                .map((consultation) => {
                  const patient = mockPatients.find(p => p.patientId === consultation.patientId);
                  return (
                    <div key={consultation.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {patient?.fullName.split(' ').map(n => n[0]).join('') || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">{patient?.fullName || 'Unknown Patient'}</p>
                        <p className="text-xs text-gray-500">
                          {consultation.diagnosis || consultation.symptoms.join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline"
                          className={consultation.status === 'completed' ? 'text-green-600' : ''}
                        >
                          {consultation.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{consultation.date}</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};