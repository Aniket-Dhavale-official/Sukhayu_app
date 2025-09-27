import React, { useState } from 'react';
import { Patient, ASHAWorker, Language, SeverityZone } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Stethoscope, Bot, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { SymptomChecker } from './SymptomChecker';
import { EmergencyVideoCall } from './EmergencyVideoCall';

interface ConsultationFlowProps {
  user: Patient | ASHAWorker;
  language: Language;
  onBack: () => void;
  onStartConsultation: (data: any) => void;
}

interface AnalysisResult {
  condition: string;
  severity: SeverityZone;
  response: string;
  doctorType: string;
  recommendations: string[];
  emergencyWarning?: string;
}

type FlowStep = 'symptom-check' | 'analysis-review' | 'doctor-selection' | 'emergency-video-call';

export const ConsultationFlow: React.FC<ConsultationFlowProps> = ({
  user,
  language,
  onBack,
  onStartConsultation
}) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('symptom-check');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [userSymptoms, setUserSymptoms] = useState<string>('');

  const t = (key: string) => getTranslation(key, language);

  const handleSymptomAnalysisComplete = (result: AnalysisResult, symptoms: string) => {
    setAnalysisResult(result);
    setUserSymptoms(symptoms);
    
    // For critical emergency cases, go directly to video call
    if (result.severity === 'red' && result.doctorType === 'emergency_doctor') {
      setCurrentStep('emergency-video-call');
    } else {
      setCurrentStep('analysis-review');
    }
  };

  const handleProceedToConsultation = () => {
    if (analysisResult) {
      // For emergency cases, directly escalate
      if (analysisResult.severity === 'red') {
        onStartConsultation({
          symptoms: [userSymptoms],
          severity: analysisResult.severity,
          recommendedDoctor: 'emergency_doctor',
          source: 'emergency-consultation-flow',
          analysis: analysisResult,
          urgent: true
        });
        return;
      }

      // For non-emergency cases, proceed with consultation
      onStartConsultation({
        symptoms: [userSymptoms],
        severity: analysisResult.severity,
        recommendedDoctor: analysisResult.doctorType,
        source: 'consultation-flow',
        analysis: analysisResult
      });
    }
  };

  const getDoctorName = (doctorType: string): string => {
    const doctorNames = {
      cho: language === 'hi' ? 'मुख्य स्वास्थ्य अधिकारी (CHO)' : 
           language === 'mr' ? 'मुख्य आरोग्य अधिकारी (CHO)' :
           language === 'pa' ? 'ਚੀਫ਼ ਹੈਲਥ ਅਫ਼ਸਰ (CHO)' : 'Chief Health Officer (CHO)',
      mo: language === 'hi' ? 'चिकित्सा अधिकारी (MO)' : 
          language === 'mr' ? 'वैद्यकीय अधिकारी (MO)' :
          language === 'pa' ? 'ਮੈਡੀਕਲ ਅਫ਼ਸਰ (MO)' : 'Medical Officer (MO)',
      emergency_doctor: language === 'hi' ? 'आपातकालीन डॉक्टर' : 
                       language === 'mr' ? 'आपत्कालीन डॉक्टर' :
                       language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਡਾਕਟਰ' : 'Emergency Doctor',
      civil_doctor: language === 'hi' ? 'सिविल डॉक्टर' : 
                   language === 'mr' ? 'सिव्हिल डॉक्टर' :
                   language === 'pa' ? 'ਸਿਵਲ ਡਾਕਟਰ' : 'Civil Doctor'
    };
    return doctorNames[doctorType as keyof typeof doctorNames] || doctorType;
  };

  const getSeverityIcon = (severity: SeverityZone) => {
    switch (severity) {
      case 'red':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'orange':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'yellow':
        return <Info className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: SeverityZone) => {
    switch (severity) {
      case 'red':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'orange':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getSeverityText = (severity: SeverityZone): string => {
    const severityTexts = {
      red: language === 'hi' ? '🔴 लाल क्षेत्र - जीवन के लिए खतरनाक' : 
           language === 'mr' ? '🔴 लाल झोन - जीवघेणी' :
           language === 'pa' ? '🔴 ਲਾਲ ਜ਼ੋਨ - ਜ਼ਿੰਦਗੀ ਲਈ ਖ਼ਤਰਨਾਕ' : '🔴 RED ZONE - Life threatening',
      orange: language === 'hi' ? '🟠 नारंगी क्षेत्र - गंभीर, जल्दी सहायता' : 
              language === 'mr' ? '🟠 नारिंगी झोन - गंभीर, लवकर मदत' :
              language === 'pa' ? '🟠 ਸੰਤਰੀ ਜ਼ੋਨ - ਗੰਭੀਰ, ਜਲਦੀ ਮਦਦ' : '🟠 ORANGE ZONE - Serious, urgent care',
      yellow: language === 'hi' ? '🟡 पीला क्षेत्र - मध्यम, चिकित्सा सहायता' : 
              language === 'mr' ? '🟡 पिवळा झोन - मध्यम, वैद्यकीय मदत' :
              language === 'pa' ? '🟡 ਪੀਲਾ ਜ਼ੋਨ - ਦਰਮਿਆਨਾ, ਮੈਡੀਕਲ ਮਦਦ' : '🟡 YELLOW ZONE - Moderate, medical attention',
      green: language === 'hi' ? '🟢 हरा क्षेत्र - हल्का, सामान्य देखभाल' : 
             language === 'mr' ? '🟢 हिरवा झोन - हलका, सामान्य काळजी' :
             language === 'pa' ? '🟢 ਹਰਾ ਜ਼ੋਨ - ਹਲਕਾ, ਆਮ ਦੇਖਭਾਲ' : '🟢 GREEN ZONE - Mild, general care'
    };
    return severityTexts[severity] || severityTexts.yellow;
  };

  if (currentStep === 'symptom-check') {
    return (
      <SymptomChecker
        user={user}
        language={language}
        onBack={onBack}
        onAnalysisComplete={handleSymptomAnalysisComplete}
        showConsultationOption={false}
      />
    );
  }

  if (currentStep === 'emergency-video-call') {
    return (
      <EmergencyVideoCall
        user={user}
        language={language}
        symptomAnalysis={{
          condition: analysisResult?.condition || '',
          symptoms: userSymptoms
        }}
        onBack={onBack}
        onCallComplete={onBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            {t('consultDoctor')}
          </h1>
          <div></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Analysis Summary */}
        {analysisResult && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-teal-600" />
                {language === 'hi' ? 'AI विश्लेषण' : 
                 language === 'mr' ? 'AI विश्लेषण' :
                 language === 'pa' ? 'AI ਵਿਸ਼ਲੇਸ਼ਣ' : 'AI Analysis'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm mb-1">
                  {language === 'hi' ? 'स्थिति का आकलन:' : 
                   language === 'mr' ? 'परिस्थितीचे मूल्यांकन:' :
                   language === 'pa' ? 'ਸਥਿਤੀ ਦਾ ਮੁਲਾਂਕਣ:' : 'Condition Assessment:'}
                </h4>
                <p className="font-medium">{analysisResult.condition}</p>
              </div>
              
              <div>
                <h4 className="text-sm mb-2">
                  {language === 'hi' ? 'गंभीरता स्तर और क्षेत्र:' : 
                   language === 'mr' ? 'गंभीरता पातळी आणि झोन:' :
                   language === 'pa' ? 'ਗੰਭੀਰਤਾ ਪੱਧਰ ਅਤੇ ਜ਼ੋਨ:' : 'Severity Level & Zone:'}
                </h4>
                <div className={`p-3 rounded-lg ${getSeverityColor(analysisResult.severity)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getSeverityIcon(analysisResult.severity)}
                    <span className="font-medium text-sm">
                      {getSeverityText(analysisResult.severity)}
                    </span>
                  </div>
                  
                  {/* Zone-specific information */}
                  <div className="text-xs space-y-1">
                    {analysisResult.severity === 'red' && (
                      <div>
                        <p className="font-medium mb-1">
                          {language === 'hi' ? 'तुरंत कार्य आवश्यक:' :
                           language === 'mr' ? 'तत्काळ कृती आवश्यक:' :
                           language === 'pa' ? 'ਤੁਰੰਤ ਕਾਰਵਾਈ ਲੋੜੀਂਦੀ:' : 'Immediate Action Required:'}
                        </p>
                        <p>
                          {language === 'hi' ? '• तुरंत 102 पर कॉल करें या निकटतम अस्पताल जाएं' :
                           language === 'mr' ? '• ताबडतोब 102 वर कॉल करा किंवा जवळच्या रुग्णालयात जा' :
                           language === 'pa' ? '• ਤੁਰੰਤ 102 ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਨੇੜਲੇ ਹਸਪਤਾਲ ਜਾਓ' : '• Call 102 immediately or go to nearest hospital'}
                        </p>
                      </div>
                    )}
                    
                    {analysisResult.severity === 'orange' && (
                      <div>
                        <p className="font-medium mb-1">
                          {language === 'hi' ? 'जल्दी कार्य आवश्यक:' :
                           language === 'mr' ? 'लवकर कृती आवश्यक:' :
                           language === 'pa' ? 'ਜਲਦੀ ਕਾਰਵਾਈ ਲੋੜੀਂਦੀ:' : 'Urgent Action Required:'}
                        </p>
                        <p>
                          {language === 'hi' ? '• 24 घंटे के भीतर चिकित्सा अधिकारी से मिलें' :
                           language === 'mr' ? '• 24 तासांच्या आत वैद्यकीय अधिकाऱ्यांना भेटा' :
                           language === 'pa' ? '• 24 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਮੈਡੀਕਲ ਅਫ਼ਸਰ ਨੂੰ ਮਿਲੋ' : '• See Medical Officer within 24 hours'}
                        </p>
                      </div>
                    )}
                    
                    {analysisResult.severity === 'yellow' && (
                      <div>
                        <p className="font-medium mb-1">
                          {language === 'hi' ? 'अनुशंसित कार्य:' :
                           language === 'mr' ? 'शिफारशीत कृती:' :
                           language === 'pa' ? 'ਸਿਫ਼ਾਰਸ਼ੀ ਕਾਰਵਾਈ:' : 'Recommended Action:'}
                        </p>
                        <p>
                          {language === 'hi' ? '• 2-3 दिन में मुख्य स्वास्थ्य अधिकारी से मिलें' :
                           language === 'mr' ? '• 2-3 दिवसांत मुख्य आरोग्य अधिकाऱ्यांना भेटा' :
                           language === 'pa' ? '• 2-3 ਦਿਨਾਂ ਵਿੱਚ ਚੀਫ਼ ਹੈਲਥ ਅਫ਼ਸਰ ਨੂੰ ਮਿਲੋ' : '• See Chief Health Officer within 2-3 days'}
                        </p>
                      </div>
                    )}
                    
                    {analysisResult.severity === 'green' && (
                      <div>
                        <p className="font-medium mb-1">
                          {language === 'hi' ? 'सामान्य देखभाल:' :
                           language === 'mr' ? 'सामान्य काळजी:' :
                           language === 'pa' ? 'ਆਮ ਦੇਖਭਾਲ:' : 'General Care:'}
                        </p>
                        <p>
                          {language === 'hi' ? '• घरेलू उपचार, आवश्यक हो तो CHO से मिलें' :
                           language === 'mr' ? '• घरगुती उपचार, गरज भासल्यास CHO ना भेटा' :
                           language === 'pa' ? '• ਘਰੇਲੂ ਇਲਾਜ, ਲੋੜ ਹੋਵੇ ਤਾਂ CHO ਨੂੰ ਮਿਲੋ' : '• Home care, see CHO if needed'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm mb-2">
                  {language === 'hi' ? 'अनुशंसित डॉक्टर:' : 
                   language === 'mr' ? 'शिफारशीत डॉक्टर:' :
                   language === 'pa' ? 'ਸਿਫ਼ਾਰਸ਼ੀ ਡਾਕਟਰ:' : 'Recommended Doctor:'}
                </h4>
                <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <span className="font-medium text-teal-800">
                    {getDoctorName(analysisResult.doctorType)}
                  </span>
                </div>
                
                {/* Doctor assignment explanation */}
                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700">
                    {analysisResult.severity === 'red' && (
                      language === 'hi' ? 'लाल क्षेत्र के मामलों के लिए आपातकालीन डॉक्टर आवंटित' :
                      language === 'mr' ? 'लाल झोनच्या प्रकरणांसाठी आपत्कालीन डॉक्टर नियुक्त' :
                      language === 'pa' ? 'ਲਾਲ ਜ਼ੋਨ ਦੇ ਮਾਮਲਿਆਂ ਲਈ ਐਮਰਜੈਂਸੀ ਡਾਕਟਰ ਨਿਯੁਕਤ' :
                      'Emergency Doctor assigned for Red Zone cases'
                    )}
                    {analysisResult.severity === 'orange' && (
                      language === 'hi' ? 'नारंगी क्षेत्र के मामलों के लिए चिकित्सा अधिकारी आवंटित' :
                      language === 'mr' ? 'नारिंगी झोनच्या प्रकरणांसाठी वैद्यकीय अधिकारी नियुक्त' :
                      language === 'pa' ? 'ਸੰਤਰੀ ਜ਼ੋਨ ਦੇ ਮਾਮਲਿਆਂ ਲਈ ਮੈਡੀਕਲ ਅਫ਼ਸਰ ਨਿਯੁਕਤ' :
                      'Medical Officer assigned for Orange Zone cases'
                    )}
                    {(analysisResult.severity === 'yellow' || analysisResult.severity === 'green') && (
                      language === 'hi' ? 'पीले/हरे क्षेत्र के मामलों के लिए मुख्य स्वास्थ्य अधिकारी आवंटित' :
                      language === 'mr' ? 'पिवळ्या/हिरव्या झोनच्या प्रकरणांसाठी मुख्य आरोग्य अधिकारी नियुक्त' :
                      language === 'pa' ? 'ਪੀਲੇ/ਹਰੇ ਜ਼ੋਨ ਦੇ ਮਾਮਲਿਆਂ ਲਈ ਚੀਫ਼ ਹੈਲਥ ਅਫ਼ਸਰ ਨਿਯੁਕਤ' :
                      'Chief Health Officer assigned for Yellow/Green Zone cases'
                    )}
                  </p>
                </div>
              </div>

              {/* AI Recommendations */}
              {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm mb-2">
                    {language === 'hi' ? 'AI सुझाव:' :
                     language === 'mr' ? 'AI सूचना:' :
                     language === 'pa' ? 'AI ਸੁਝਾਅ:' : 'AI Recommendations:'}
                  </h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <ul className="space-y-1">
                      {analysisResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Emergency Alert */}
              {analysisResult.severity === 'red' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-800">
                      {language === 'hi' ? 'आपातकालीन स्थिति' : 
                       language === 'mr' ? 'आपत्कालीन परिस्थिती' :
                       language === 'pa' ? 'ਐਮਰਜੈਂਸੀ ਸਥਿਤੀ' : 'Emergency Situation'}
                    </span>
                  </div>
                  <p className="text-xs text-red-700">
                    {language === 'hi' ? 'तुरंत आपातकालीन डॉक्टर से संपर्क करना आवश्यक है।' : 
                     language === 'mr' ? 'ताबडतोब आपत्कालीन डॉक्टरांशी संपर्क करणे आवश्यक आहे।' :
                     language === 'pa' ? 'ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰਨਾ ਜ਼ਰੂਰੀ ਹੈ।' : 'Immediate contact with emergency doctor is required.'}
                  </p>
                </div>
              )}

              {/* Consultation Button */}
              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'hi' ? 'AI विश्लेषण के आधार पर, हम निम्नलिखित डॉक्टर के साथ परामर्श की सिफारिश करते हैं।' : 
                   language === 'mr' ? 'AI विश्लेषणाच्या आधारे, आम्ही खालील डॉक्टरांसह सल्लामसलत करण्याची शिफारस करतो।' :
                   language === 'pa' ? 'AI ਵਿਸ਼ਲੇਸ਼ਣ ਦੇ ਆਧਾਰ ਤੇ, ਅਸੀਂ ਹੇਠਾਂ ਦਿੱਤੇ ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਮਸ਼ਵਰਾ ਕਰਨ ਦੀ ਸਿਫਾਰਸ਼ ਕਰਦੇ ਹਾਂ।' : 'Based on AI analysis, we recommend consultation with the following doctor.'}
                </p>
                <Button
                  onClick={handleProceedToConsultation}
                  className={`w-full ${
                    analysisResult.severity === 'red' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : analysisResult.severity === 'orange'
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : 'bg-teal-600 hover:bg-teal-700'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  {analysisResult.severity === 'red' 
                    ? (language === 'hi' ? `${getDoctorName(analysisResult.doctorType)} से आपातकालीन सलाह` : 
                       language === 'mr' ? `${getDoctorName(analysisResult.doctorType)} चा आपत्कालीन सल्ला` :
                       language === 'pa' ? `${getDoctorName(analysisResult.doctorType)} ਤੋਂ ਐਮਰਜੈਂਸੀ ਸਲਾਹ` : `Emergency Consultation with ${getDoctorName(analysisResult.doctorType)}`)
                    : (language === 'hi' ? `${getDoctorName(analysisResult.doctorType)} से परामर्श शुरू करें` : 
                       language === 'mr' ? `${getDoctorName(analysisResult.doctorType)} सह सल्लामसलत सुरू करा` :
                       language === 'pa' ? `${getDoctorName(analysisResult.doctorType)} ਨਾਲ ਸਲਾਹ ਮਸ਼ਵਰਾ ਸ਼ੁਰੂ ਕਰੋ` : `Start Consultation with ${getDoctorName(analysisResult.doctorType)}`)
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};