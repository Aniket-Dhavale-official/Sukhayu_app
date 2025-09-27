import React, { useState, useEffect } from 'react';
import { Doctor } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  ArrowLeft, 
  User, 
  Heart, 
  Thermometer, 
  Activity, 
  Weight,
  Ruler,
  FileText,
  Plus,
  Trash2,
  Save,
  Send,
  Video,
  AlertTriangle,
  Clock,
  Phone,
  MessageSquare,
  Stethoscope,
  Calendar,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { mockConsultations, mockMedicines, mockInventory, getMedicinePrescription, mockDoctorQueues } from '../../utils/mockData';
import { toast } from 'sonner@2.0.3';
import { VideoCallInterface } from './VideoCallInterface';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface DoctorConsultationProps {
  user: Doctor;
  patient: any;
  onBack: () => void;
  onComplete: () => void;
}

interface Vitals {
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  weight: string;
  height: string;
  oxygenSaturation: string;
  respiratoryRate: string;
}

interface PrescribedMedicine {
  medicineId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export const DoctorConsultation: React.FC<DoctorConsultationProps> = ({
  user,
  patient,
  onBack,
  onComplete
}) => {
  const [activeTab, setActiveTab] = useState('history');
  const [consultationTime, setConsultationTime] = useState(0);
  const [vitals, setVitals] = useState<Vitals>({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: '',
    respiratoryRate: ''
  });
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [prescribedMedicines, setPrescribedMedicines] = useState<PrescribedMedicine[]>([]);
  const [availableMedicines, setAvailableMedicines] = useState<any[]>([]);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [videoCallMinimized, setVideoCallMinimized] = useState(false);
  const [isEmergency, setIsEmergency] = useState(patient.consultation?.severity === 'red');
  const [consultationType, setConsultationType] = useState<'video' | 'voice' | 'chat'>('video');
  const [showRedirectDialog, setShowRedirectDialog] = useState(false);

  useEffect(() => {
    // Start consultation timer
    const timer = setInterval(() => {
      setConsultationTime(prev => prev + 1);
    }, 1000);

    // Load available medicines from nearby pharmacies
    const medicines = mockInventory.flatMap(inventory => 
      inventory.items.filter(item => item.availableQuantity > 0)
    );
    setAvailableMedicines(medicines);

    return () => clearInterval(timer);
  }, []);

  const patientHistory = mockConsultations.filter(
    c => c.patientId === patient.patientId && c.status === 'completed'
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVitalChange = (field: keyof Vitals, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const addMedicine = () => {
    setPrescribedMedicines(prev => [...prev, {
      medicineId: '',
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }]);
  };

  const updateMedicine = (index: number, field: keyof PrescribedMedicine, value: string) => {
    setPrescribedMedicines(prev => 
      prev.map((med, i) => i === index ? { ...med, [field]: value } : med)
    );
  };

  const removeMedicine = (index: number) => {
    setPrescribedMedicines(prev => prev.filter((_, i) => i !== index));
  };

  const selectAvailableMedicine = (index: number, medicine: any) => {
    setPrescribedMedicines(prev => 
      prev.map((med, i) => i === index ? {
        ...med,
        medicineId: medicine.medicineId,
        name: medicine.medicineName,
        dosage: medicine.medicineName.includes('mg') ? medicine.medicineName.split(' ')[1] : '500mg'
      } : med)
    );
  };

  const handleSaveDraft = () => {
    toast.success('Consultation saved as draft');
  };

  const handleCompleteConsultation = () => {
    if (!diagnosis.trim()) {
      toast.error('Please enter a diagnosis');
      return;
    }

    // Auto-generate medicines based on diagnosis if none prescribed manually
    let finalMedicines = prescribedMedicines.filter(med => med.name.trim());
    
    if (finalMedicines.length === 0) {
      // Get recommended medicines for the diagnosis
      const recommendedMedicines = getMedicinePrescription(diagnosis);
      finalMedicines = recommendedMedicines.map(med => ({
        medicineId: med.medicineId,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions
      }));
      
      // Update prescribed medicines state for display
      setPrescribedMedicines(finalMedicines);
      
      toast.info(`Auto-prescribed ${finalMedicines.length} medicines based on diagnosis`);
    }

    // Mock prescription generation
    const prescription = {
      id: 'PR' + Date.now(),
      consultationId: patient.consultation?.id || 'C' + Date.now(),
      patientName: patient.fullName,
      patientId: patient.patientId,
      doctorName: user.fullName,
      date: new Date().toISOString().split('T')[0],
      symptoms: patient.consultation?.symptoms || [],
      diagnosis,
      medicines: finalMedicines,
      vitals,
      notes,
      followUpRequired: finalMedicines.length > 0 // Require follow-up if medicines prescribed
    };

    // Remove patient from queue after consultation completion
    const doctorQueue = mockDoctorQueues.find(queue => queue.doctorId === user.doctorId);
    if (doctorQueue) {
      // Remove the patient from the queue
      const queueIndex = doctorQueue.queue.findIndex(item => item.patientId === patient.patientId);
      if (queueIndex !== -1) {
        doctorQueue.queue.splice(queueIndex, 1);
        // Update positions for remaining patients
        doctorQueue.queue.forEach((item, index) => {
          item.position = index + 1;
        });
      }
      // Clear current consultation
      doctorQueue.currentConsultation = undefined;
    }

    // Store the completed consultation (in a real app, this would be an API call)
    console.log('Consultation completed:', prescription);
    
    toast.success('Consultation completed and prescription generated');
    
    // End video call if active
    if (showVideoCall) {
      setShowVideoCall(false);
    }
    
    // Navigate back to the queue
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const getRedirectionOptions = () => {
    if (user.role === 'cho') {
      return [
        { 
          target: 'Medical Officer', 
          targetRole: 'mo',
          newTag: 'yellow', 
          label: 'Redirect to Medical Officer', 
          description: 'For moderate cases requiring specialized care',
          icon: '🩺',
          doctorName: 'Dr. Rajesh Kumar',
          estimatedWaitTime: '15-20 mins'
        },
        { 
          target: 'Civil Hospital Doctor', 
          targetRole: 'civil_doctor',
          newTag: 'orange', 
          label: 'Redirect to Civil Hospital', 
          description: 'For complex cases requiring hospital facilities',
          icon: '🏥',
          doctorName: 'Dr. Priya Sharma',
          estimatedWaitTime: '30-45 mins'
        }
      ];
    }
    
    if (user.role === 'mo') {
      return [
        { 
          target: 'Civil Hospital Doctor', 
          targetRole: 'civil_doctor',
          newTag: 'orange', 
          label: 'Redirect to Civil Hospital', 
          description: 'For complex cases requiring hospital facilities and advanced care',
          icon: '🏥',
          doctorName: 'Dr. Priya Sharma',
          estimatedWaitTime: '30-45 mins'
        }
      ];
    }
    
    return [];
  };

  const handleRedirection = (redirectionOption: any) => {
    // Close the dialog first
    setShowRedirectDialog(false);
    
    // Update patient severity/tag
    if (patient.consultation) {
      patient.consultation.severity = redirectionOption.newTag;
    }
    
    // Remove patient from current doctor's queue
    const doctorQueue = mockDoctorQueues.find(queue => queue.doctorId === user.doctorId);
    if (doctorQueue) {
      const queueIndex = doctorQueue.queue.findIndex(item => item.patientId === patient.patientId);
      if (queueIndex !== -1) {
        doctorQueue.queue.splice(queueIndex, 1);
        // Update positions for remaining patients
        doctorQueue.queue.forEach((item, index) => {
          item.position = index + 1;
        });
      }
    }
    
    // Show detailed redirection notification
    const redirectionId = 'RD' + Date.now();
    const timestamp = new Date().toLocaleString();
    
    // First notification - Immediate confirmation
    toast.success(
      `Patient ${patient.fullName} has been redirected to ${redirectionOption.target}`,
      {
        description: `Priority: ${redirectionOption.newTag.toUpperCase()} | Assigned to: ${redirectionOption.doctorName}`,
        duration: 4000,
      }
    );
    
    // Second notification - Detailed redirection info (delayed)
    setTimeout(() => {
      toast.info(
        `Redirection Complete - Case #${redirectionId}`,
        {
          description: `${patient.fullName} is now in ${redirectionOption.doctorName}'s queue. Estimated wait time: ${redirectionOption.estimatedWaitTime}`,
          duration: 5000,
        }
      );
    }, 2000);
    
    // Third notification - System confirmation (more delayed)
    setTimeout(() => {
      toast.success(
        `System Update: Patient Transfer Successful`,
        {
          description: `${patient.fullName} (ID: ${patient.patientId}) transferred from CHO to ${redirectionOption.target} at ${timestamp}`,
          duration: 6000,
        }
      );
    }, 4000);
    
    setTimeout(() => {
      onBack();
    }, 1500);
  };

  const handleTagAsEmergency = () => {
    setIsEmergency(true);
    // Update patient severity to red
    if (patient.consultation) {
      patient.consultation.severity = 'red';
    }
    
    // Remove from current queue and escalate to Emergency Doctor
    const doctorQueue = mockDoctorQueues.find(queue => queue.doctorId === user.doctorId);
    if (doctorQueue) {
      const queueIndex = doctorQueue.queue.findIndex(item => item.patientId === patient.patientId);
      if (queueIndex !== -1) {
        doctorQueue.queue.splice(queueIndex, 1);
        // Update positions for remaining patients
        doctorQueue.queue.forEach((item, index) => {
          item.position = index + 1;
        });
      }
    }
    
    // Emergency patients bypass queue system and go directly to emergency doctor
    // In real app, this would trigger immediate notification to emergency doctor
    
    toast.success('Patient tagged as EMERGENCY - Emergency doctor will be notified immediately');
    
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const startVideoCall = () => {
    setShowVideoCall(true);
    setConsultationType('video');
    toast.success('Video call started with patient');
  };

  const endVideoCall = () => {
    setShowVideoCall(false);
    setVideoCallMinimized(false);
    toast.info('Video call ended');
  };

  const getSeverityColor = (severity: string) => {
    return severity === 'red' ? 'bg-red-100 text-red-800' :
           severity === 'orange' ? 'bg-orange-100 text-orange-800' :
           'bg-yellow-100 text-yellow-800';
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-lg">Consultation</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Duration: {formatTime(consultationTime)}</span>
                {consultationType === 'video' && showVideoCall && (
                  <Badge className="bg-blue-600">Video Active</Badge>
                )}
                {consultationType === 'voice' && (
                  <Badge className="bg-green-600">Voice Call</Badge>
                )}
                {consultationType === 'chat' && (
                  <Badge className="bg-purple-600">Text Chat</Badge>
                )}
                {isEmergency && (
                  <Badge className="bg-red-600 animate-pulse">EMERGENCY</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveDraft} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
        </div>

        {/* Emergency Alert */}
        {isEmergency && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="max-w-6xl mx-auto">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>EMERGENCY CASE:</strong> This patient has been tagged as emergency. 
                  Prioritize immediate care and consider escalation to emergency services if needed.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {patient.fullName.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3>{patient.fullName}</h3>
                    <p className="text-sm text-gray-600">{patient.patientId}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span>{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="capitalize">{patient.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{patient.phone}</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm mb-2">Current Symptoms:</h4>
                  <div className="flex flex-wrap gap-1">
                    {patient.consultation.symptoms.map((symptom: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2 space-y-2">
                  <Badge className={getSeverityColor(patient.consultation.severity)}>
                    {patient.consultation.severity.toUpperCase()} Priority
                  </Badge>
                  {isEmergency && (
                    <Badge className="bg-red-600 text-white">
                      EMERGENCY CASE
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Communication Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {!showVideoCall ? (
                  <>
                    <Button
                      onClick={startVideoCall}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Start Video Call
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setConsultationType('voice');
                        toast.success('Voice call started');
                      }}
                      className="w-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Voice Call
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setConsultationType('chat');
                        toast.success('Chat consultation started');
                      }}
                      className="w-full"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Text Chat
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={endVideoCall}
                    variant="destructive"
                    className="w-full"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    End Video Call
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={handleCompleteConsultation}
                  className="w-full"
                  disabled={!diagnosis.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Complete Consultation
                </Button>
                
                {!isEmergency && (
                  <Button
                    onClick={handleTagAsEmergency}
                    variant="destructive"
                    className="w-full"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Tag as Emergency
                  </Button>
                )}

                {/* Redirect Option - For CHO and MO */}
                {(user.role === 'cho' || user.role === 'mo') && !isEmergency && (
                  <Dialog open={showRedirectDialog} onOpenChange={setShowRedirectDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <MapPin className="w-4 h-4 mr-2" />
                        Redirect Patient
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          Redirect Patient to Specialist
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="text-center pb-4 border-b">
                          <h3 className="font-medium text-gray-900">Choose the appropriate care level for:</h3>
                          <p className="text-sm text-gray-600 mt-1">{patient.fullName} ({patient.patientId})</p>
                          <div className="flex justify-center mt-2">
                            <Badge className={getSeverityColor(patient.consultation.severity)}>
                              Current Priority: {patient.consultation.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {getRedirectionOptions().map((option, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleRedirection(option)}
                              className="p-4 border rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group"
                            >
                              <div className="flex items-start gap-4">
                                <div className="text-2xl">{option.icon}</div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                      option.newTag === 'yellow' ? 'bg-yellow-500' : 'bg-orange-500'
                                    }`}></div>
                                    <span className="font-medium text-gray-900 group-hover:text-blue-700">
                                      {option.label}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">
                                    {option.description}
                                  </p>
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1 text-gray-500">
                                      <span>👨‍⚕️</span>
                                      <span>{option.doctorName}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500">
                                      <Clock className="w-3 h-3" />
                                      <span>{option.estimatedWaitTime}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-4 border-t">
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => setShowRedirectDialog(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="examination">Examination</TabsTrigger>
                <TabsTrigger value="prescription">Prescription</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="space-y-4">
                {/* Patient Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Patient Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">First Registration:</span>
                        <p className="font-medium">March 15, 2024</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Consultations:</span>
                        <p className="font-medium">{patientHistory.length + 1}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Visit:</span>
                        <p className="font-medium">{patientHistory.length > 0 ? patientHistory[0].date : 'First visit'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Emergency Visits:</span>
                        <p className="font-medium">{patientHistory.filter(c => c.severity === 'red').length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Consultation Context */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Stethoscope className="w-5 h-5" />
                      Today's Consultation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Duration: {formatTime(consultationTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Priority: {patient.consultation?.severity?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 mb-2">Current Symptoms:</p>
                        <div className="flex flex-wrap gap-1">
                          {patient.consultation?.symptoms?.map((symptom: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Previous Consultations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {patientHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No previous consultations</p>
                        <p className="text-sm mt-2">This is the patient's first visit</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {patientHistory.map((consultation, index) => (
                          <div key={consultation.id} className={`border rounded-lg p-4 ${
                            consultation.severity === 'red' ? 'border-red-200 bg-red-50' :
                            consultation.severity === 'orange' ? 'border-orange-200 bg-orange-50' :
                            'border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-medium">{consultation.doctorName}</h4>
                                  <p className="text-sm text-gray-600">{consultation.doctorDesignation}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-medium">{consultation.date}</span>
                                <Badge className={`ml-2 ${
                                  consultation.severity === 'red' ? 'bg-red-100 text-red-800' :
                                  consultation.severity === 'orange' ? 'bg-orange-100 text-orange-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {consultation.severity?.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-1">Presenting Symptoms:</h5>
                                <div className="flex flex-wrap gap-1">
                                  {consultation.symptoms.map((symptom, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {symptom}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              {consultation.diagnosis && (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Diagnosis:</h5>
                                  <p className="text-sm bg-gray-50 p-2 rounded border">{consultation.diagnosis}</p>
                                </div>
                              )}
                              
                              {consultation.vitals && Object.keys(consultation.vitals).length > 0 && (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Recorded Vitals:</h5>
                                  <div className="grid grid-cols-3 gap-3 text-xs">
                                    {consultation.vitals.bloodPressure && (
                                      <div className="flex items-center gap-1">
                                        <Activity className="w-3 h-3 text-red-500" />
                                        <span>BP: {consultation.vitals.bloodPressure}</span>
                                      </div>
                                    )}
                                    {consultation.vitals.heartRate && (
                                      <div className="flex items-center gap-1">
                                        <Heart className="w-3 h-3 text-red-500" />
                                        <span>HR: {consultation.vitals.heartRate}</span>
                                      </div>
                                    )}
                                    {consultation.vitals.temperature && (
                                      <div className="flex items-center gap-1">
                                        <Thermometer className="w-3 h-3 text-orange-500" />
                                        <span>Temp: {consultation.vitals.temperature}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Health Trends (Mock Data) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Health Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <h5 className="font-medium">Common Symptoms</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Fever</span>
                            <span className="text-gray-500">3 occurrences</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Headache</span>
                            <span className="text-gray-500">2 occurrences</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cough</span>
                            <span className="text-gray-500">2 occurrences</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium">Visit Pattern</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span>Average Gap</span>
                            <span className="text-gray-500">45 days</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Seasonal Visits</span>
                            <span className="text-gray-500">Winter: High</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Follow-up Rate</span>
                            <span className="text-gray-500">80%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vitals" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Vital Signs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Blood Pressure (mmHg)
                        </label>
                        <Input
                          value={vitals.bloodPressure}
                          onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
                          placeholder="120/80"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Heart Rate (bpm)
                        </label>
                        <Input
                          value={vitals.heartRate}
                          onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                          placeholder="72"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm flex items-center gap-2">
                          <Thermometer className="w-4 h-4" />
                          Temperature (°F)
                        </label>
                        <Input
                          value={vitals.temperature}
                          onChange={(e) => handleVitalChange('temperature', e.target.value)}
                          placeholder="98.6"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm flex items-center gap-2">
                          <Weight className="w-4 h-4" />
                          Weight (kg)
                        </label>
                        <Input
                          value={vitals.weight}
                          onChange={(e) => handleVitalChange('weight', e.target.value)}
                          placeholder="70"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm flex items-center gap-2">
                          <Ruler className="w-4 h-4" />
                          Height (cm)
                        </label>
                        <Input
                          value={vitals.height}
                          onChange={(e) => handleVitalChange('height', e.target.value)}
                          placeholder="170"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">Oxygen Saturation (%)</label>
                        <Input
                          value={vitals.oxygenSaturation}
                          onChange={(e) => handleVitalChange('oxygenSaturation', e.target.value)}
                          placeholder="98"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="examination" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinical Examination</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm mb-2 block">Diagnosis</label>
                      <Input
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Enter primary diagnosis"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm mb-2 block">Clinical Notes</label>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter examination findings, treatment plan, follow-up instructions..."
                        rows={6}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prescription" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Prescription</CardTitle>
                      <Button onClick={addMedicine} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Medicine
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {prescribedMedicines.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No medicines prescribed yet</p>
                        <Button onClick={addMedicine} className="mt-4">
                          Add First Medicine
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {prescribedMedicines.map((medicine, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm">Medicine {index + 1}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMedicine(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-600">Medicine Name</label>
                                <Input
                                  value={medicine.name}
                                  onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                                  placeholder="Select or type medicine name"
                                />
                                {availableMedicines.length > 0 && (
                                  <div className="mt-1">
                                    <select
                                      className="text-xs w-full p-1 border rounded"
                                      onChange={(e) => {
                                        const selectedMedicine = availableMedicines.find(
                                          med => med.medicineName === e.target.value
                                        );
                                        if (selectedMedicine) {
                                          selectAvailableMedicine(index, selectedMedicine);
                                        }
                                      }}
                                    >
                                      <option value="">Select from available medicines</option>
                                      {availableMedicines.map((med, i) => (
                                        <option key={i} value={med.medicineName}>
                                          {med.medicineName} (Available: {med.availableQuantity})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <label className="text-xs text-gray-600">Dosage</label>
                                <Input
                                  value={medicine.dosage}
                                  onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                                  placeholder="500mg"
                                />
                              </div>
                              
                              <div>
                                <label className="text-xs text-gray-600">Frequency</label>
                                <Input
                                  value={medicine.frequency}
                                  onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                                  placeholder="Twice daily"
                                />
                              </div>
                              
                              <div>
                                <label className="text-xs text-gray-600">Duration</label>
                                <Input
                                  value={medicine.duration}
                                  onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                                  placeholder="7 days"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-xs text-gray-600">Instructions</label>
                              <Input
                                value={medicine.instructions}
                                onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                                placeholder="Take after meals"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      </div>

      {/* Video Call Interface */}
      {showVideoCall && (
        <VideoCallInterface
          patient={patient}
          doctor={user}
          isMinimized={videoCallMinimized}
          onToggleMinimize={() => setVideoCallMinimized(!videoCallMinimized)}
          onEndCall={endVideoCall}
        />
      )}
    </>
  );
};