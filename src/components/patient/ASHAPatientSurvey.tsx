import React, { useState } from 'react';
import { Language, Patient } from '../../types';
import { getTranslation } from '../../utils/translations';
import { mockPatients } from '../../utils/mockData';
import { User, MapPin, Phone, Calendar, Users } from 'lucide-react';
import { Card } from '../ui/card';

interface ASHAPatientSurveyProps {
  language: Language;
  onBack: () => void;
}

// Mock survey data for patients
const mockPatientSurvey = [
  {
    patientId: 'P001',
    lastVisit: '2024-09-20',
    healthStatus: 'Good',
    chronicConditions: ['Hypertension'],
    vaccinations: 'Up to date',
    familySize: 4,
    notes: 'Regular BP monitoring required'
  },
  {
    patientId: 'P002',
    lastVisit: '2024-09-18',
    healthStatus: 'Fair',
    chronicConditions: ['Diabetes'],
    vaccinations: 'Missing COVID booster',
    familySize: 6,
    notes: 'Blood sugar levels need monitoring'
  },
  {
    patientId: 'P003',
    lastVisit: '2024-09-15',
    healthStatus: 'Good',
    chronicConditions: [],
    vaccinations: 'Up to date',
    familySize: 3,
    notes: 'No health concerns'
  },
  {
    patientId: 'P004',
    lastVisit: '2024-09-22',
    healthStatus: 'Fair',
    chronicConditions: ['Anemia'],
    vaccinations: 'Up to date',
    familySize: 5,
    notes: 'Iron supplements prescribed'
  }
];

export const ASHAPatientSurvey: React.FC<ASHAPatientSurveyProps> = ({
  language,
  onBack
}) => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  const t = (key: string) => getTranslation(key, language);

  const getPatientInfo = (patientId: string) => {
    return mockPatients.find(p => p.patientId === patientId);
  };

  const getSurveyInfo = (patientId: string) => {
    return mockPatientSurvey.find(s => s.patientId === patientId);
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return 'text-green-600 bg-green-100';
      case 'Fair': return 'text-yellow-600 bg-yellow-100';
      case 'Poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700"
            >
              ← {t('back')}
            </button>
            <h1 className="text-lg text-gray-900">Patient Survey</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-semibold text-gray-900">{mockPatients.length}</div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </Card>
          <Card className="p-4 text-center">
            <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-semibold text-gray-900">
              {mockPatientSurvey.filter(s => s.healthStatus === 'Good').length}
            </div>
            <div className="text-sm text-gray-600">Good Health</div>
          </Card>
        </div>

        {/* Patient List */}
        <div className="space-y-4">
          <h2 className="text-lg text-gray-900 mb-4">Registered Patients</h2>
          
          {mockPatients.map((patient) => {
            const surveyData = getSurveyInfo(patient.patientId);
            const isSelected = selectedPatient === patient.patientId;
            
            return (
              <Card key={patient.id} className="overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedPatient(isSelected ? null : patient.patientId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{patient.fullName}</div>
                        <div className="text-sm text-gray-600">ID: {patient.patientId}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {surveyData && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(surveyData.healthStatus)}`}>
                          {surveyData.healthStatus}
                        </span>
                      )}
                      <span className="text-gray-400">
                        {isSelected ? '−' : '+'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isSelected && surveyData && (
                  <div className="px-4 pb-4 border-t bg-gray-50">
                    <div className="space-y-3 pt-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Age</div>
                          <div className="text-sm text-gray-900">{patient.age} years</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Gender</div>
                          <div className="text-sm text-gray-900 capitalize">{patient.gender}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Contact</div>
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Phone className="w-4 h-4" />
                          <span>{patient.phone}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Last Visit</div>
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Calendar className="w-4 h-4" />
                          <span>{surveyData.lastVisit}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Family Size</div>
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Users className="w-4 h-4" />
                          <span>{surveyData.familySize} members</span>
                        </div>
                      </div>

                      {surveyData.chronicConditions.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Chronic Conditions</div>
                          <div className="flex flex-wrap gap-1">
                            {surveyData.chronicConditions.map((condition, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                              >
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Vaccination Status</div>
                        <div className="text-sm text-gray-900">{surveyData.vaccinations}</div>
                      </div>

                      {surveyData.notes && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Notes</div>
                          <div className="text-sm text-gray-700 bg-white p-2 rounded border">
                            {surveyData.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {mockPatients.length === 0 && (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg text-gray-600 mb-2">No Patients Registered</h3>
            <p className="text-gray-500">Start by registering new patients in your area.</p>
          </div>
        )}
      </div>
    </div>
  );
};