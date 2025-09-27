import React from 'react';
import { Patient, ASHAWorker, Language } from '../../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  User, 
  Calendar, 
  Bot, 
  Stethoscope, 
  AlertTriangle,
  FileText,
  Clock,
  Users,
  Activity,
  LogOut,
  Pill
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { mockConsultations, mockExternalConsultations, getPatientQueuePosition, getQueueStats } from '../../utils/mockData';

interface PatientHomepageProps {
  user: Patient | ASHAWorker;
  language: Language;
  onNavigate: (screen: string) => void;
  onStartConsultation: (data: any) => void;
  onLogout: () => void;
  isASHAAssisting?: boolean;
  onBackToASHA?: () => void;
}

export const PatientHomepage: React.FC<PatientHomepageProps> = ({
  user,
  language,
  onNavigate,
  onStartConsultation,
  onLogout,
  isASHAAssisting = false,
  onBackToASHA
}) => {
  const t = (key: string) => getTranslation(key, language);

  const patientConsultations = user.role === 'patient' 
    ? mockConsultations.filter(c => c.patientId === (user as Patient).patientId)
    : [];

  const externalConsultations = user.role === 'patient'
    ? mockExternalConsultations.filter(c => c.patientId === (user as Patient).patientId)
    : [];

  // Get queue position if patient is in queue
  const queueInfo = user.role === 'patient' 
    ? getPatientQueuePosition((user as Patient).patientId)
    : { queue: null, position: -1 };

  const queueStats = getQueueStats();

  const handleQuickConsultation = () => {
    onNavigate('consultation-flow');
  };

  const getSeverityColor = (severity: string) => {
    return severity === 'red' ? 'bg-red-100 text-red-800' :
           severity === 'orange' ? 'bg-orange-100 text-orange-800' :
           'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* User Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-white">
              <AvatarImage src={user.profilePhoto} />
              <AvatarFallback className="bg-white text-blue-600">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg">{user.fullName}</h2>
              <p className="text-blue-100">
                {user.role === 'patient' 
                  ? `${t('patientId')}: ${(user as Patient).patientId}`
                  : `${t('ashaWorkerId')}: ${(user as ASHAWorker).ashaWorkerId}`
                }
              </p>
              <div className="flex gap-2 mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('profile')}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <User className="w-4 h-4 mr-1" />
                  {t('profile')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-white hover:bg-white/20 p-1"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  {t('logout')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ASHA Assistance Indicator */}
      {isASHAAssisting && onBackToASHA && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm text-purple-900">ASHA Worker Assistance</h4>
                  <p className="text-xs text-purple-700">You are helping this patient</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onBackToASHA}
                className="border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue Status */}
      {queueInfo.queue && queueInfo.position > 1 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t('yourStatus')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-green-700">{t('queuePosition')}:</span>
              <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                #{queueInfo.position}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-700">{t('estimatedWait')}:</span>
              <span className="font-medium text-green-800">{queueInfo.position * 8} {t('minutes')}</span>
            </div>
            <div className="text-sm text-green-600">
              <p>• You will be called when it's your turn</p>
              <p>• Please keep your phone nearby</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('symptom-checker')}
        >
          <CardContent className="p-4 text-center">
            <Bot className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h3 className="text-sm">{t('aiSymptomChecker')}</h3>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={handleQuickConsultation}
        >
          <CardContent className="p-4 text-center">
            <Stethoscope className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h3 className="text-sm">{t('consultDoctor')}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Past Consultations */}
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onNavigate('history')}
      >
        <CardContent className="p-4 text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <h3 className="text-sm">{t('pastConsultations')}</h3>
        </CardContent>
      </Card>

      {/* Secondary Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Medicine Availability Check */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('medicine-check')}
        >
          <CardContent className="p-4 text-center">
            <Pill className="w-8 h-8 mx-auto mb-2 text-teal-600" />
            <h3 className="text-sm">{t('checkMedicineAvailability')}</h3>
          </CardContent>
        </Card>

        {/* Disease Outbreak Analytics */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow relative"
          onClick={() => onNavigate('disease-analytics')}
        >
          <CardContent className="p-4 text-center">
            <div className="relative">
              <Activity className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">!</span>
              </div>
            </div>
            <h3 className="text-xs leading-tight">
              {language === 'hi' ? 'रोग विकास विश्लेषण' :
               language === 'mr' ? 'रोग विकास विश्लेषण' :
               language === 'pa' ? 'ਰੋਗ ਵਿਕਾਸ ਵਿਸ਼ਲੇਸ਼ਣ' :
               'Disease Outbreak Analytics'}
            </h3>
            <div className="mt-1">
              <Badge variant="outline" className="text-xs px-1 py-0 bg-amber-50 text-amber-700 border-amber-300">
                {language === 'hi' ? 'प्रीमियम' :
                 language === 'mr' ? 'प्रीमियम' :
                 language === 'pa' ? 'ਪ੍ਰੀਮੀਅਮ' :
                 'Premium'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Button */}
      <Button
        onClick={() => onNavigate('emergency')}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
        size="lg"
      >
        <AlertTriangle className="w-6 h-6 mr-2" />
        {t('emergency')}
      </Button>
    </div>
  );
};