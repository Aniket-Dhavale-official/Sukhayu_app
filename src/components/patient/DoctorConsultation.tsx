import React, { useState, useEffect } from 'react';
import { Patient, ASHAWorker, Language, SeverityZone } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Video, Phone, MessageCircle, Clock, User, Download, AlertTriangle } from 'lucide-react';
import { VideoConsultationSample } from './VideoConsultationSample';
import { LiveChat } from './LiveChat';
import { MedicineFeedback } from './MedicineFeedback';
import { getTranslation } from '../../utils/translations';
import { mockDoctors, mockInventory, mockPharmacists, getMedicinePrescription } from '../../utils/mockData';
import { toast } from 'sonner@2.0.3';

interface DoctorConsultationProps {
  user: Patient | ASHAWorker;
  language: Language;
  consultationData: {
    symptoms: string[];
    severity: SeverityZone;
    recommendedDoctor?: string;
    source: string;
    analysis?: any;
  };
  onBack: () => void;
}

type ConsultationStep = 'queue' | 'connecting' | 'consultation' | 'prescription' | 'pharmacy' | 'feedback';

export const DoctorConsultation: React.FC<DoctorConsultationProps> = ({
  user,
  language,
  consultationData,
  onBack
}) => {
  const [step, setStep] = useState<ConsultationStep>('queue');
  const [queuePosition, setQueuePosition] = useState(3);
  const [estimatedWait, setEstimatedWait] = useState(15);
  const [assignedDoctor, setAssignedDoctor] = useState<any>(null);
  const [connectionType, setConnectionType] = useState<'video' | 'voice' | 'chat'>('video');
  const [consultationTime, setConsultationTime] = useState(0);
  const [prescription, setPrescription] = useState<any>(null);
  const [needMedicine, setNeedMedicine] = useState<boolean | null>(null);

  const t = (key: string) => getTranslation(key, language);

  useEffect(() => {
    // Assign doctor based on severity and recommendation
    const doctorRole = consultationData.recommendedDoctor || getDoctorBySeverity(consultationData.severity);
    const availableDoctor = mockDoctors.find(d => d.role === doctorRole && d.status === 'available');
    
    if (availableDoctor) {
      setAssignedDoctor(availableDoctor);
    } else {
      // Fallback to any available doctor
      const fallbackDoctor = mockDoctors.find(d => d.status === 'available');
      setAssignedDoctor(fallbackDoctor);
    }

    // For emergency cases (red zone), skip queue and go directly to connecting
    if (consultationData.severity === 'red' || consultationData.source === 'emergency-consultation-flow') {
      setStep('connecting');
      // Auto-start consultation after brief connection delay for emergency cases
      const emergencyTimer = setTimeout(() => {
        setStep('consultation');
        toast.success('Emergency consultation started immediately');
      }, 2000);
      return () => clearTimeout(emergencyTimer);
    }

    // For non-emergency cases, simulate queue progression
    const queueTimer = setInterval(() => {
      setQueuePosition(prev => {
        if (prev <= 1) {
          clearInterval(queueTimer);
          setStep('connecting');
          return 0;
        }
        return prev - 1;
      });
      setEstimatedWait(prev => Math.max(0, prev - 5));
    }, 3000);

    return () => clearInterval(queueTimer);
  }, [consultationData]);

  useEffect(() => {
    // Start consultation timer when connecting
    if (step === 'consultation') {
      const timer = setInterval(() => {
        setConsultationTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const getDoctorBySeverity = (severity: SeverityZone): string => {
    switch (severity) {
      case 'red': return 'emergency_doctor';
      case 'orange': return 'mo';
      default: return 'cho';
    }
  };

  const getSeverityColor = (severity: SeverityZone) => {
    return severity === 'red' ? 'bg-red-100 text-red-800' :
           severity === 'orange' ? 'bg-orange-100 text-orange-800' :
           'bg-yellow-100 text-yellow-800';
  };

  const handleConnectionFallback = () => {
    if (connectionType === 'video') {
      setConnectionType('voice');
      toast.info('Switched to voice call due to connectivity');
    } else if (connectionType === 'voice') {
      setConnectionType('chat');
      toast.info('Switched to chat due to connectivity');
    }
  };

  const handleStartConsultation = () => {
    setStep('consultation');
    toast.success('Connected to doctor');
  };

  const handleEndConsultation = () => {
    const diagnosisCondition = consultationData.analysis?.condition || 'General consultation';
    
    // Get medicines based on diagnosed condition
    const recommendedMedicines = getMedicinePrescription(diagnosisCondition);
    
    // Mock prescription generation with auto-prescribed medicines
    const mockPrescription = {
      id: 'PR' + Date.now(),
      consultationId: 'C' + Date.now(),
      patientName: user.fullName,
      patientId: user.role === 'patient' ? (user as Patient).patientId : 'ASHA-PATIENT',
      doctorName: assignedDoctor.fullName,
      date: new Date().toISOString().split('T')[0],
      symptoms: consultationData.symptoms,
      diagnosis: diagnosisCondition,
      medicines: recommendedMedicines.map(med => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions
      }))
    };
    
    setPrescription(mockPrescription);
    setStep('prescription');
    toast.success('Consultation completed and medicines prescribed based on diagnosis');
  };

  const handleDownloadPrescription = () => {
    toast.success('Prescription downloaded');
  };

  const handleNeedMedicine = (need: boolean) => {
    setNeedMedicine(need);
    if (need) {
      setStep('pharmacy');
    } else {
      // Ask for feedback and return to home
      toast.info('Thank you for your feedback');
      setTimeout(onBack, 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQueueScreen = () => {
    const isEmergency = consultationData.severity === 'red' || consultationData.source === 'emergency-consultation-flow';
    
    return (
      <div className="space-y-6">
        {isEmergency && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="text-center py-4">
              <div className="flex items-center justify-center gap-2 text-red-700 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">
                  {language === 'hi' ? 'आपातकालीन मामला - तुरंत प्राथमिकता' :
                   language === 'mr' ? 'आपत्कालीन प्रकरण - तत्काळ प्राधान्य' :
                   language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਕੇਸ - ਤੁਰੰਤ ਤਰਜੀਹ' :
                   'EMERGENCY CASE - IMMEDIATE PRIORITY'}
                </span>
              </div>
              <p className="text-sm text-red-600">
                {language === 'hi' ? 'आपको तुरंत डॉक्टर से जोड़ा जा रहा है' :
                 language === 'mr' ? 'तुम्हाला ताबडतोब डॉक्टरांशी जोडले जात आहे' :
                 language === 'pa' ? 'ਤੁਹਾਨੂੰ ਤੁਰੰਤ ਡਾਕਟਰ ਨਾਲ ਜੋੜਿਆ ਜਾ ਰਿਹਾ ਹੈ' :
                 'You are being connected to doctor immediately'}
              </p>
            </CardContent>
          </Card>
        )}
        
        <Card className={isEmergency ? 'opacity-50' : ''}>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              {isEmergency 
                ? (language === 'hi' ? 'आपातकालीन कनेक्शन' :
                   language === 'mr' ? 'आपत्कालीन कनेक्शन' :
                   language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਕਨੈਕਸ਼ਨ' :
                   'Emergency Connection')
                : (language === 'hi' ? 'कतार में' :
                   language === 'mr' ? 'रांगेत' :
                   language === 'pa' ? 'ਕਤਾਰ ਵਿੱਚ' :
                   'In Queue')
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {!isEmergency && (
              <>
                <div>
                  <div className="text-3xl mb-2">{queuePosition}</div>
                  <p className="text-gray-600">
                    {language === 'hi' ? 'आपसे पहले मरीज़' :
                     language === 'mr' ? 'तुमच्या आधी रुग्ण' :
                     language === 'pa' ? 'ਤੁਹਾਡੇ ਤੋਂ ਪਹਿਲਾਂ ਮਰੀਜ਼' :
                     'patients ahead of you'}
                  </p>
                </div>
                
                <div>
                  <div className="text-xl mb-2">{estimatedWait} mins</div>
                  <p className="text-gray-600">
                    {language === 'hi' ? 'अनुमानित प्रतीक्षा समय' :
                     language === 'mr' ? 'अंदाजे प्रतीक्षा वेळ' :
                     language === 'pa' ? 'ਅੰਦਾਜ਼ੇ ਦਾ ਇੰਤਜ਼ਾਰ ਸਮਾਂ' :
                     'estimated wait time'}
                  </p>
                </div>
              </>
            )}

            {isEmergency && (
              <div className="py-4">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-red-700 font-medium">
                  {language === 'hi' ? 'आपातकालीन कनेक्शन स्थापित हो रहा है...' :
                   language === 'mr' ? 'आपत्कालीन कनेक्शन स्थापित होत आहे...' :
                   language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਕਨੈਕਸ਼ਨ ਸਥਾਪਿਤ ਹੋ ਰਿਹਾ ਹੈ...' :
                   'Emergency connection being established...'}
                </p>
              </div>
            )}

            <Badge className={getSeverityColor(consultationData.severity)}>
              {language === 'hi' ? 'प्राथमिकता: ' :
               language === 'mr' ? 'प्राधान्य: ' :
               language === 'pa' ? 'ਤਰਜੀਹ: ' :
               'Priority: '} 
              {consultationData.severity.toUpperCase()}
            </Badge>
          </CardContent>
        </Card>

        {assignedDoctor && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === 'hi' ? 'निर्धारित डॉक्टर' :
                 language === 'mr' ? 'नियुक्त डॉक्टर' :
                 language === 'pa' ? 'ਨਿਯੁਕਤ ਡਾਕਟਰ' :
                 'Assigned Doctor'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3>{assignedDoctor.fullName}</h3>
                  <p className="text-sm text-gray-600">{assignedDoctor.designation}</p>
                  <Badge variant="outline" className="mt-1">
                    {assignedDoctor.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {language === 'hi' ? 'परामर्श विवरण' :
               language === 'mr' ? 'सल्लामसलत तपशील' :
               language === 'pa' ? 'ਸਲਾਹ ਮਸ਼ਵਰਾ ਵੇਰਵਾ' :
               'Consultation Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">
                  {language === 'hi' ? 'लक्षण:' :
                   language === 'mr' ? 'लक्षणे:' :
                   language === 'pa' ? 'ਲੱਛਣ:' :
                   'Symptoms:'}
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {consultationData.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
              {consultationData.analysis && (
                <div>
                  <span className="text-sm text-gray-600">
                    {language === 'hi' ? 'प्राथमिक विश्लेषण:' :
                     language === 'mr' ? 'प्राथमिक विश्लेषण:' :
                     language === 'pa' ? 'ਪ੍ਰਾਥਮਿਕ ਵਿਸ਼ਲੇਸ਼ਣ:' :
                     'Preliminary Analysis:'}
                  </span>
                  <p className="text-sm capitalize">{consultationData.analysis.condition}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderConnectingScreen = () => {
    const isEmergency = consultationData.severity === 'red' || consultationData.source === 'emergency-consultation-flow';
    
    return (
      <Card className={isEmergency ? 'border-red-200 bg-red-50' : ''}>
        <CardContent className="text-center py-12">
          <div className={`w-16 h-16 ${isEmergency ? 'bg-red-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Video className={`w-8 h-8 ${isEmergency ? 'text-red-600' : 'text-blue-600'} animate-pulse`} />
          </div>
          <h3 className="text-lg mb-2">
            {isEmergency 
              ? (language === 'hi' ? 'आपातकालीन डॉक्टर से जुड़ रहे हैं' :
                 language === 'mr' ? 'आपत्कालीन डॉक्टरांशी जोडत आहे' :
                 language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਡਾਕਟਰ ਨਾਲ ਜੁੜ ਰਹੇ ਹਾਂ' :
                 'Connecting to Emergency Doctor')
              : (language === 'hi' ? 'डॉक्टर से जुड़ रहे हैं' :
                 language === 'mr' ? 'डॉक्टरांशी जोडत आहे' :
                 language === 'pa' ? 'ਡਾਕਟਰ ਨਾਲ ਜੁੜ ਰਹੇ ਹਾਂ' :
                 'Connecting to Doctor')
            }
          </h3>
          <p className={`${isEmergency ? 'text-red-700' : 'text-gray-600'} mb-6`}>
            {isEmergency 
              ? (language === 'hi' ? 'आपातकालीन प्राथमिकता - तुरंत जुड़ाव' :
                 language === 'mr' ? 'आपत्कालीन प्राधान्य - ताबडतोब जोडणी' :
                 language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਤਰਜੀਹ - ਤੁਰੰਤ ਕਨੈਕਸ਼ਨ' :
                 'Emergency Priority - Immediate Connection')
              : (language === 'hi' ? 'कृपया प्रतीक्षा करें...' :
                 language === 'mr' ? 'कृपया प्रतीक्षा करा...' :
                 language === 'pa' ? 'ਕਿਰਪਾ ਕਰਕੇ ਇੰਤਜ਼ਾਰ ਕਰੋ...' :
                 'Please wait while we connect you...')
            }
          </p>
          {!isEmergency && (
            <Button onClick={handleStartConsultation} className="w-full">
              {language === 'hi' ? 'परामर्श शुरू करें' :
               language === 'mr' ? 'सल्लामसलत सुरू करा' :
               language === 'pa' ? 'ਸਲਾਹ ਮਸ਼ਵਰਾ ਸ਼ੁਰੂ ਕਰੋ' :
               'Start Consultation'}
            </Button>
          )}
          {isEmergency && (
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-red-700">
                {language === 'hi' ? 'स्वचालित कनेक्शन...' :
                 language === 'mr' ? 'स्वयंचलित कनेक्शन...' :
                 language === 'pa' ? 'ਆਟੋਮੈਟਿਕ ਕਨੈਕਸ਼ਨ...' :
                 'Auto-connecting...'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderConsultationScreen = () => {
    if (connectionType === 'video') {
      return (
        <VideoConsultationSample
          language={language}
          doctorName={assignedDoctor?.fullName || 'Dr. Kumar'}
          doctorRole={assignedDoctor?.role || 'cho'}
          consultationTime={consultationTime}
          onEndCall={handleEndConsultation}
          onSwitchToChat={() => setConnectionType('chat')}
          onSwitchToVoice={() => setConnectionType('voice')}
        />
      );
    }

    if (connectionType === 'chat') {
      return (
        <LiveChat
          language={language}
          doctorName={assignedDoctor?.fullName || 'Dr. Kumar'}
          onBack={() => setConnectionType('video')}
          onVideoCall={() => setConnectionType('video')}
        />
      );
    }

    // Voice call interface
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {assignedDoctor?.fullName}
              </CardTitle>
              <div className="text-sm text-gray-600">
                {formatTime(consultationTime)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center mb-4">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-lg mb-2">{assignedDoctor?.fullName}</h3>
              <p className="text-gray-600 mb-4">
                {language === 'hi' ? 'वॉयस कॉल चल रहा है' :
                 language === 'mr' ? 'व्हॉइस कॉल चालू आहे' :
                 language === 'pa' ? 'ਵਾਇਸ ਕਾਲ ਚੱਲ ਰਿਹਾ ਹੈ' :
                 'Voice call in progress'}
              </p>
              
              <div className="flex justify-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setConnectionType('video')}
                  className="rounded-full"
                >
                  <Video className="w-5 h-5 mr-2" />
                  {language === 'hi' ? 'वीडियो चालू करें' :
                   language === 'mr' ? 'व्हिडिओ चालू करा' :
                   language === 'pa' ? 'ਵੀਡੀਓ ਚਾਲੂ ਕਰੋ' :
                   'Turn on Video'}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setConnectionType('chat')}
                  className="rounded-full"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {language === 'hi' ? 'चैट' :
                   language === 'mr' ? 'चॅट' :
                   language === 'pa' ? 'ਚੈਟ' :
                   'Chat'}
                </Button>
              </div>

              <Button
                variant="destructive"
                size="lg"
                onClick={handleEndConsultation}
                className="rounded-full w-16 h-16"
              >
                <Phone className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-600 py-2">
              {language === 'hi' ? 'डॉक्टर द्वारा परामर्श समाप्त होने की प्रतीक्षा करें' :
               language === 'mr' ? 'डॉक्टरांकडून सल्लामसलत संपण्याची प्रतीक्षा करा' :
               language === 'pa' ? 'ਡਾਕਟਰ ਵੱਲੋਂ ਸਲਾਹ ਖਤਮ ਹੋਣ ਦਾ ਇੰਤਜ਼ਾਰ ਕਰੋ' :
               'Waiting for doctor to end consultation'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPrescriptionScreen = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Consultation Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Your consultation with {assignedDoctor?.fullName} has been completed.
          </p>
          
          {prescription && (
            <div className="space-y-3">
              <div>
                <h4 className="text-sm">Diagnosis:</h4>
                <p className="capitalize">{prescription.diagnosis}</p>
              </div>
              
              <div>
                <h4 className="text-sm">Prescribed Medicines:</h4>
                <div className="space-y-2 mt-2">
                  {prescription.medicines.map((medicine: any, index: number) => (
                    <div key={index} className="border rounded p-3">
                      <div className="text-sm">{medicine.name}</div>
                      <div className="text-xs text-gray-600">
                        {medicine.frequency} • {medicine.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <Button
            onClick={handleDownloadPrescription}
            className="w-full mt-4"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Prescription
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('needMedicines')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              onClick={() => handleNeedMedicine(true)}
              className="flex-1"
              variant="default"
            >
              Yes
            </Button>
            <Button
              onClick={() => handleNeedMedicine(false)}
              className="flex-1"
              variant="outline"
            >
              No
            </Button>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">
              {language === 'hi' ? 'दवा लेने के बाद फीडबैक दें:' :
               language === 'mr' ? 'औषध घेतल्यानंतर फीडबॅक द्या:' :
               language === 'pa' ? 'ਦਵਾਈ ਲੈਣ ਤੋਂ ਬਾਅਦ ਫੀਡਬੈਕ ਦਿਓ:' :
               'Provide feedback after taking medicines:'}
            </p>
            <Button 
              onClick={() => setStep('feedback')} 
              variant="outline" 
              className="w-full"
            >
              {language === 'hi' ? 'डॉक्टर फीडबैक दें' :
               language === 'mr' ? 'डॉक्टर फीडबॅक द्या' :
               language === 'pa' ? 'ਡਾਕਟਰ ਫੀਡਬੈਕ ਦਿਓ' :
               "Doctor's Feedback"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPharmacyScreen = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('nearbyPharmacies')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPharmacists.map((pharmacy) => {
              const inventory = mockInventory.find(inv => inv.pharmacyId === pharmacy.licenseNumber);
              const hasStock = inventory?.items.some(item => 
                prescription?.medicines.some((med: any) => 
                  item.medicineName.toLowerCase().includes(med.name.toLowerCase().split(' ')[0])
                )
              );
              
              return (
                <div key={pharmacy.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4>{pharmacy.pharmacyName}</h4>
                      <p className="text-sm text-gray-600">{pharmacy.location}</p>
                      <p className="text-sm text-gray-600">{pharmacy.phone}</p>
                    </div>
                    <Badge 
                      variant={hasStock ? "default" : "destructive"}
                      className={hasStock ? "bg-green-100 text-green-800" : ""}
                    >
                      {hasStock ? t('available') : t('unavailable')}
                    </Badge>
                  </div>
                  
                  {!hasStock && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => toast.success('Pharmacy notified')}
                    >
                      {t('notifyPharmacies')}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={onBack} className="flex-1">
          Return to Home
        </Button>
        
        <Button 
          onClick={() => setStep('feedback')} 
          variant="outline" 
          className="flex-1"
        >
          {t('provideFeedback')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg">{t('consultDoctor')}</h1>
          <div></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {step === 'queue' && renderQueueScreen()}
        {step === 'connecting' && renderConnectingScreen()}
        {step === 'consultation' && renderConsultationScreen()}
        {step === 'prescription' && renderPrescriptionScreen()}
        {step === 'pharmacy' && renderPharmacyScreen()}
        {step === 'feedback' && prescription && (
          <MedicineFeedback
            language={language}
            prescription={prescription}
            onBack={() => setStep('prescription')}
            onComplete={onBack}
          />
        )}
      </div>
    </div>
  );
};