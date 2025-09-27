import React, { useState } from 'react';
import { Language } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { ArrowLeft, UserCheck, AlertTriangle, CheckCircle, Clock, Star } from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { storeMedicineFeedback, MedicineFeedback } from '../../utils/mockData';
import { toast } from 'sonner@2.0.3';

interface DoctorFeedbackProps {
  language: Language;
  prescription: {
    id: string;
    consultationId: string;
    patientId: string;
    patientName: string;
    doctorName: string;
    date: string;
    diagnosis: string;
    medicines: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }>;
  };
  onBack: () => void;
  onComplete: () => void;
}

export const MedicineFeedback: React.FC<DoctorFeedbackProps> = ({
  language,
  prescription,
  onBack,
  onComplete
}) => {
  const [step, setStep] = useState<'initial' | 'rating' | 'detailed_feedback'>('initial');
  const [overallRating, setOverallRating] = useState<number>(0);
  const [communicationRating, setCommunicationRating] = useState<number>(0);
  const [treatmentSatisfaction, setTreatmentSatisfaction] = useState<'very_satisfied' | 'satisfied' | 'neutral' | 'dissatisfied' | null>(null);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [additionalComments, setAdditionalComments] = useState('');

  const t = (key: string) => getTranslation(key, language);

  const handleStartRating = () => {
    setStep('rating');
  };

  const handleSubmitFeedback = () => {
    const feedback = {
      consultationId: prescription.consultationId,
      patientId: prescription.patientId,
      doctorName: prescription.doctorName,
      overallRating,
      communicationRating,
      treatmentSatisfaction,
      wouldRecommend,
      additionalComments: additionalComments || undefined,
      submissionDate: new Date().toISOString().split('T')[0]
    };

    // Store doctor feedback (you can create a new storage function)
    console.log('Doctor Feedback:', feedback);
    
    toast.success(
      language === 'hi' ? 'डॉक्टर की प्रतिक्रिया सफलतापूर्वक सहेजी गई' :
      language === 'mr' ? 'डॉक्टरांचा अभिप्राय यशस्वीरीत्या जतन झाला' :
      language === 'pa' ? 'ਡਾਕਟਰ ਦੀ ਪ੍ਰਤਿਕਿਰਿਆ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਹੋ ਗਈ' :
      'Doctor feedback has been saved successfully'
    );
    setTimeout(onComplete, 2000);
  };

  const renderInitialScreen = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            {language === 'hi' ? 'डॉक्टर फीडबैक' :
             language === 'mr' ? 'डॉक्टर फीडबॅक' :
             language === 'pa' ? 'ਡਾਕਟਰ ਫੀਡਬੈਕ' :
             'Doctor Feedback'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-gray-600 mb-4">
              {language === 'hi' ? `डॉ. ${prescription.doctorName} के साथ आपके परामर्श के बारे में बताएं` :
               language === 'mr' ? `डॉ. ${prescription.doctorName} यांच्या सल्ल्याबद्दल सांगा` :
               language === 'pa' ? `ਡਾ. ${prescription.doctorName} ਨਾਲ ਤੁਹਾਡੇ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਬਾਰੇ ਦੱਸੋ` :
               `Please share your experience with Dr. ${prescription.doctorName}`}
            </p>
            
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h4 className="text-sm text-teal-800 mb-2">
                {language === 'hi' ? 'परामर्श विवरण:' :
                 language === 'mr' ? 'सल्लामसलत तपशील:' :
                 language === 'pa' ? 'ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦਾ ਵੇਰਵਾ:' :
                 'Consultation Details:'}
              </h4>
              <div className="text-xs text-teal-700 space-y-1">
                <p><strong>Date:</strong> {prescription.date}</p>
                <p><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                <p><strong>Medicines Prescribed:</strong> {prescription.medicines.length} items</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4 text-sm text-gray-600">
              {language === 'hi' ? 'आपकी प्रतिक्रिया हमें बेहतर सेवा प्रदान करने में मदद करती है' :
               language === 'mr' ? 'तुमचा अभिप्राय आम्हाला चांगली सेवा देण्यास मदत करतो' :
               language === 'pa' ? 'ਤੁਹਾਡੀ ਪ੍ਰਤਿਕਿਰਿਆ ਸਾਨੂੰ ਬਿਹਤਰ ਸੇਵਾ ਪ੍ਰਦਾਨ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ' :
               'Your feedback helps us provide better healthcare services'}
            </p>
            
            <Button
              onClick={handleStartRating}
              className="w-full bg-teal-600 hover:bg-teal-700"
            >
              <Star className="w-4 h-4 mr-2" />
              {language === 'hi' ? 'फीडबैक देना शुरू करें' :
               language === 'mr' ? 'फीडबॅक देणे सुरू करा' :
               language === 'pa' ? 'ਫੀਡਬੈਕ ਦੇਣਾ ਸ਼ੁਰੂ ਕਰੋ' :
               'Start Feedback'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRatingScreen = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-600">
            <Star className="w-5 h-5" />
            {language === 'hi' ? 'डॉक्टर को रेटिंग दें' :
             language === 'mr' ? 'डॉक्टरला रेटिंग द्या' :
             language === 'pa' ? 'ਡਾਕਟਰ ਨੂੰ ਰੇਟਿੰਗ ਦਿਓ' :
             'Rate the Doctor'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Rating */}
          <div>
            <Label className="mb-3 block">
              {language === 'hi' ? `डॉ. ${prescription.doctorName} को समग्र रेटिंग:` :
               language === 'mr' ? `डॉ. ${prescription.doctorName} यांना एकूण रेटिंग:` :
               language === 'pa' ? `ਡਾ. ${prescription.doctorName} ਨੂੰ ਸਮੁੱਚੀ ਰੇਟਿੰਗ:` :
               `Overall rating for Dr. ${prescription.doctorName}:`}
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setOverallRating(rating)}
                  className={`p-2 rounded transition-colors ${
                    rating <= overallRating 
                      ? 'text-yellow-500' 
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Communication Rating */}
          <div>
            <Label className="mb-3 block">
              {language === 'hi' ? 'संवाद और समझाने की क्षमता:' :
               language === 'mr' ? 'संवाद आणि समजावणे:' :
               language === 'pa' ? 'ਸੰਚਾਰ ਅਤੇ ਸਮਝਾਉਣ ਦੀ ਸਮਰੱਥਾ:' :
               'Communication and explanation:'}
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setCommunicationRating(rating)}
                  className={`p-2 rounded transition-colors ${
                    rating <= communicationRating 
                      ? 'text-blue-500' 
                      : 'text-gray-300 hover:text-blue-400'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Treatment Satisfaction */}
          <div>
            <Label className="mb-3 block">
              {language === 'hi' ? 'इलाज से संतुष्टि:' :
               language === 'mr' ? 'उपचारावरील समाधान:' :
               language === 'pa' ? 'ਇਲਾਜ ਤੋਂ ਸੰਤੁਸ਼ਟੀ:' :
               'Satisfaction with treatment:'}
            </Label>
            <RadioGroup value={treatmentSatisfaction || ''} onValueChange={(value) => setTreatmentSatisfaction(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very_satisfied" id="very_satisfied" />
                <Label htmlFor="very_satisfied" className="text-green-600">
                  {language === 'hi' ? 'बहुत संतुष्ट' :
                   language === 'mr' ? 'खूप समाधानी' :
                   language === 'pa' ? 'ਬਹੁਤ ਸੰਤੁਸ਼ਟ' :
                   'Very Satisfied'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="satisfied" id="satisfied" />
                <Label htmlFor="satisfied" className="text-blue-600">
                  {language === 'hi' ? 'संतुष्ट' :
                   language === 'mr' ? 'समाधानी' :
                   language === 'pa' ? 'ਸੰਤੁਸ਼ਟ' :
                   'Satisfied'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="neutral" />
                <Label htmlFor="neutral" className="text-yellow-600">
                  {language === 'hi' ? 'तटस्थ' :
                   language === 'mr' ? 'तटस्थ' :
                   language === 'pa' ? 'ਤਟਸਥ' :
                   'Neutral'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dissatisfied" id="dissatisfied" />
                <Label htmlFor="dissatisfied" className="text-red-600">
                  {language === 'hi' ? 'असंतुष्ट' :
                   language === 'mr' ? 'असमाधानी' :
                   language === 'pa' ? 'ਅਸੰਤੁਸ਼ਟ' :
                   'Dissatisfied'}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={() => setStep('detailed_feedback')}
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={!overallRating || !communicationRating || !treatmentSatisfaction}
          >
            {language === 'hi' ? 'अगला' :
             language === 'mr' ? 'पुढे' :
             language === 'pa' ? 'ਅਗਲਾ' :
             'Next'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderDetailedFeedbackScreen = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-600">
            <CheckCircle className="w-5 h-5" />
            {language === 'hi' ? 'अतिरिक्त फीडबैक' :
             language === 'mr' ? 'अतिरिक्त फीडबॅक' :
             language === 'pa' ? 'ਵਾਧੂ ਫੀਡਬੈਕ' :
             'Additional Feedback'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-3 block">
              {language === 'hi' ? 'क्या आप इस डॉक्टर की सिफारिश करेंगे?' :
               language === 'mr' ? 'तुम्ही या डॉक्टरांची शिफारस कराल का?' :
               language === 'pa' ? 'ਕੀ ਤੁਸੀਂ ਇਸ ਡਾਕਟਰ ਦੀ ਸਿਫਾਰਸ਼ ਕਰੋਗੇ?' :
               'Would you recommend this doctor?'}
            </Label>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setWouldRecommend(true)}
                variant={wouldRecommend === true ? "default" : "outline"}
                className={`flex-1 ${wouldRecommend === true ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'हाँ' :
                 language === 'mr' ? 'होय' :
                 language === 'pa' ? 'ਹਾਂ' :
                 'Yes'}
              </Button>
              
              <Button
                onClick={() => setWouldRecommend(false)}
                variant={wouldRecommend === false ? "destructive" : "outline"}
                className={`flex-1`}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {language === 'hi' ? 'नहीं' :
                 language === 'mr' ? 'नाही' :
                 language === 'pa' ? 'ਨਹੀਂ' :
                 'No'}
              </Button>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">
              {language === 'hi' ? 'अपने अनुभव के बारे में बताएं:' :
               language === 'mr' ? 'तुमच्या अनुभवाबद्दल सांगा:' :
               language === 'pa' ? 'ਆਪਣੇ ਤਜਰਬੇ ਬਾਰੇ ਦੱਸੋ:' :
               'Share your experience:'}
            </Label>
            <Textarea
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
              placeholder={
                language === 'hi' ? 'डॉक्टर के व्यवहार, उपचार की गुणवत्ता, या कोई सुझाव...' :
                language === 'mr' ? 'डॉक्टरांचे वर्तन, उपचाराची गुणवत्ता, किंवा काही सूचना...' :
                language === 'pa' ? 'ਡਾਕਟਰ ਦਾ ਵਿਵਹਾਰ, ਇਲਾਜ ਦੀ ਗੁਣਵੱਤਾ, ਜਾਂ ਕੋਈ ਸੁਝਾਅ...' :
                "Doctor's behavior, treatment quality, or any suggestions..."
              }
              rows={4}
            />
          </div>

          <div className="bg-gray-50 border rounded-lg p-3">
            <h4 className="text-sm mb-2">
              {language === 'hi' ? 'आपकी रेटिंग का सारांश:' :
               language === 'mr' ? 'तुमच्या रेटिंगचा सारांश:' :
               language === 'pa' ? 'ਤੁਹਾਡੀ ਰੇਟਿੰਗ ਦਾ ਸਾਰ:' :
               'Your Rating Summary:'}
            </h4>
            <div className="text-xs space-y-1">
              <p><strong>Overall:</strong> {overallRating}/5 ⭐</p>
              <p><strong>Communication:</strong> {communicationRating}/5 ⭐</p>
              <p><strong>Treatment Satisfaction:</strong> {treatmentSatisfaction?.replace('_', ' ')}</p>
              <p><strong>Recommendation:</strong> {wouldRecommend === true ? 'Yes' : wouldRecommend === false ? 'No' : 'Not selected'}</p>
            </div>
          </div>

          <Button
            onClick={handleSubmitFeedback}
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={wouldRecommend === null}
          >
            {language === 'hi' ? 'फीडबैक सबमिट करें' :
             language === 'mr' ? 'फीडबॅक सबमिट करा' :
             language === 'pa' ? 'ਫੀਡਬੈਕ ਸਬਮਿਟ ਕਰੋ' :
             'Submit Feedback'}
          </Button>
        </CardContent>
      </Card>
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
          <h1 className="text-lg">
            {language === 'hi' ? 'डॉक्टर फीडबैक' :
             language === 'mr' ? 'डॉक्टर फीडबॅक' :
             language === 'pa' ? 'ਡਾਕਟਰ ਫੀਡਬੈਕ' :
             'Doctor Feedback'}
          </h1>
          <div></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {step === 'initial' && renderInitialScreen()}
        {step === 'rating' && renderRatingScreen()}
        {step === 'detailed_feedback' && renderDetailedFeedbackScreen()}
      </div>
    </div>
  );
};