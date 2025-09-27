import React, { useState } from 'react';
import { Language, Patient, ASHAWorker } from '../../types';
import { getTranslation } from '../../utils/translations';
import { mockPatients, mockConsultations } from '../../utils/mockData';
import { 
  Users, 
  UserPlus, 
  LogIn, 
  Calendar, 
  Activity, 
  MapPin,
  Phone,
  AlertTriangle,
  TrendingUp,
  FileText,
  Bot,
  Stethoscope,
  Pill,
  Languages
} from 'lucide-react';
import { LanguageSelector } from '../LanguageSelector';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ASHADashboardProps {
  user: ASHAWorker;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export const ASHADashboard: React.FC<ASHADashboardProps> = ({
  user,
  language,
  onLanguageChange,
  onNavigate,
  onLogout
}) => {
  const t = (key: string) => getTranslation(key, language);

  // Mock statistics for ASHA worker
  const stats = {
    totalPatients: mockPatients.length,
    activeConsultations: mockConsultations.filter(c => c.status === 'pending' || c.status === 'in_progress').length,
    completedToday: mockConsultations.filter(c => c.date === '2024-09-25' && c.status === 'completed').length,
    emergencyCases: mockConsultations.filter(c => c.severity === 'red').length
  };

  const recentActivity = [
    { action: t('patientRegistered'), patient: 'राम शर्मा', time: t('hoursAgo', '2'), type: 'success' },
    { action: t('consultationCompleted'), patient: 'सीता देवी', time: t('hoursAgo', '4'), type: 'info' },
    { action: t('emergencyCaseReferred'), patient: 'मोहन गुप्ता', time: t('hoursAgo', '6'), type: 'warning' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg text-gray-900">{t('ashaDashboard')}</h1>
              <p className="text-sm text-gray-600">{user.fullName}</p>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={onLanguageChange}
              />
              <button
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-semibold text-gray-900">{stats.totalPatients}</div>
            <div className="text-xs text-gray-600">{t('totalPatients')}</div>
          </Card>
          
          <Card className="p-4 text-center">
            <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-semibold text-gray-900">{stats.activeConsultations}</div>
            <div className="text-xs text-gray-600">{t('activeCases')}</div>
          </Card>
          
          <Card className="p-4 text-center">
            <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-semibold text-gray-900">{stats.completedToday}</div>
            <div className="text-xs text-gray-600">{t('completedToday')}</div>
          </Card>
          
          <Card className="p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-semibold text-gray-900">{stats.emergencyCases}</div>
            <div className="text-xs text-gray-600">{t('emergencyCases')}</div>
          </Card>
        </div>

        {/* ASHA Specific Actions */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg text-gray-900 mb-4">{t('quickActions')}</h3>
          <div className="space-y-3">
            <Button
              onClick={() => onNavigate('patient-survey')}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Users className="w-5 h-5 mr-3" />
              {t('viewPatientSurvey')}
            </Button>
            
            <Button
              onClick={() => onNavigate('register-patient')}
              className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
            >
              <UserPlus className="w-5 h-5 mr-3" />
              {t('registerNewPatient')}
            </Button>
            
            <Button
              onClick={() => onNavigate('patient-login')}
              className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white"
            >
              <LogIn className="w-5 h-5 mr-3" />
              {t('helpPatientLogin')}
            </Button>
          </div>
        </Card>

        {/* Patient Services - All Patient Dashboard Options */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg text-gray-900 mb-4">{t('patientServices')}</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              onClick={() => onNavigate('symptom-checker')}
              variant="outline"
              className="h-20 flex-col border-blue-200 hover:bg-blue-50"
            >
              <Bot className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-xs text-center">{t('aiSymptomChecker')}</span>
            </Button>
            
            <Button
              onClick={() => onNavigate('consultation-flow')}
              variant="outline"
              className="h-20 flex-col border-green-200 hover:bg-green-50"
            >
              <Stethoscope className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-xs text-center">{t('consultDoctor')}</span>
            </Button>
            
            <Button
              onClick={() => onNavigate('history')}
              variant="outline"
              className="h-20 flex-col border-purple-200 hover:bg-purple-50"
            >
              <FileText className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-xs text-center">{t('pastConsultations')}</span>
            </Button>
            
            <Button
              onClick={() => onNavigate('medicine-check')}
              variant="outline"
              className="h-20 flex-col border-teal-200 hover:bg-teal-50"
            >
              <Pill className="w-6 h-6 text-teal-600 mb-2" />
              <span className="text-xs text-center">{t('checkMedicineAvailability')}</span>
            </Button>
          </div>
          
          {/* Emergency Button */}
          <Button
            onClick={() => onNavigate('emergency')}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4"
            size="lg"
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            {t('emergency')}
          </Button>
        </Card>

        {/* Area Information */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            {t('myArea')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t('coverageArea')}</span>
              <span className="text-gray-900">{user.area}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t('ashaWorkerId')}</span>
              <span className="text-gray-900">{user.ashaWorkerId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t('phone')}</span>
              <span className="text-gray-900">{user.phone}</span>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            {t('recentActivity')}
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{activity.action}</div>
                  <div className="text-xs text-gray-600">{activity.patient} • {activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Health Tips for Community */}
        <Card className="p-6">
          <h3 className="text-lg text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-orange-600" />
            {t('communityHealthTips')}
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm text-blue-900 mb-1">{t('monsoonHealth')}</h4>
              <p className="text-xs text-blue-700">
                {t('monsoonHealthTip')}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="text-sm text-green-900 mb-1">{t('vaccinationDrive')}</h4>
              <p className="text-xs text-green-700">
                {t('vaccinationDriveTip')}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="text-sm text-orange-900 mb-1">{t('diabetesAwareness')}</h4>
              <p className="text-xs text-orange-700">
                {t('diabetesAwarenessTip')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};