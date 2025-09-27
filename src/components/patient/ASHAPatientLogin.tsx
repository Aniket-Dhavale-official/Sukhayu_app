import React, { useState } from 'react';
import { Language, Patient } from '../../types';
import { getTranslation } from '../../utils/translations';
import { mockPatients } from '../../utils/mockData';
import { User, Search, CheckCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner@2.0.3';

interface ASHAPatientLoginProps {
  language: Language;
  onBack: () => void;
  onPatientLogin: (patient: Patient) => void;
}

export const ASHAPatientLogin: React.FC<ASHAPatientLoginProps> = ({
  language,
  onBack,
  onPatientLogin
}) => {
  const [patientId, setPatientId] = useState('');
  const [searchedPatient, setSearchedPatient] = useState<Patient | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const t = (key: string) => getTranslation(key, language);

  const handleSearch = async () => {
    if (!patientId.trim()) {
      toast.error('Please enter a Patient ID');
      return;
    }

    setIsSearching(true);
    setSearchedPatient(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const patient = mockPatients.find(p => p.patientId === patientId.trim());
      
      if (patient) {
        setSearchedPatient(patient);
        toast.success('Patient found!');
      } else {
        toast.error('Patient not found. Please check the Patient ID.');
      }
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogin = async () => {
    if (!searchedPatient) return;

    setIsLoggingIn(true);

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onPatientLogin(searchedPatient);
      toast.success(`Logged in as ${searchedPatient.fullName}`);
      
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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
            <h1 className="text-lg text-gray-900">Patient Login</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Search Section */}
        <Card className="p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-lg text-gray-900 mb-2">Find Patient</h2>
            <p className="text-sm text-gray-600">
              Enter the Patient ID to search and login
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Patient ID
              </label>
              <Input
                type="text"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Patient ID (e.g., P001)"
                className="text-center text-lg"
              />
            </div>

            <Button
              onClick={handleSearch}
              disabled={isSearching || !patientId.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSearching ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Search className="w-4 h-4 mr-2" />
                  Search Patient
                </div>
              )}
            </Button>
          </div>
        </Card>

        {/* Patient Found */}
        {searchedPatient && (
          <Card className="p-6 mb-6 border-green-200 bg-green-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-gray-900">Patient Found</h3>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{searchedPatient.fullName}</div>
                  <div className="text-sm text-gray-600">Patient ID: {searchedPatient.patientId}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Age:</span>
                  <span className="ml-2 text-gray-900">{searchedPatient.age} years</span>
                </div>
                <div>
                  <span className="text-gray-500">Gender:</span>
                  <span className="ml-2 text-gray-900 capitalize">{searchedPatient.gender}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2 text-gray-900">{searchedPatient.phone}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login as Patient'
              )}
            </Button>
          </Card>
        )}

        {/* Quick Access */}
        <Card className="p-4 bg-blue-50">
          <h4 className="text-sm text-blue-900 mb-2">Quick Access</h4>
          <div className="space-y-2">
            {mockPatients.slice(0, 3).map((patient) => (
              <button
                key={patient.id}
                onClick={() => {
                  setPatientId(patient.patientId);
                  setSearchedPatient(patient);
                }}
                className="w-full text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{patient.fullName}</span>
                  <span className="text-xs text-gray-500">{patient.patientId}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Info */}
        <Card className="mt-4 p-4 bg-gray-50">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm">i</span>
            </div>
            <div>
              <h4 className="text-sm text-gray-900 mb-1">Patient Login</h4>
              <p className="text-xs text-gray-600">
                Use this feature to help patients access their dashboard and medical services. 
                The Patient ID is provided during registration.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};