import React, { useState } from 'react';
import { Language, Patient } from '../../types';
import { getTranslation } from '../../utils/translations';
import { User, Phone, Calendar, MapPin, Users } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';

interface ASHAPatientRegistrationProps {
  language: Language;
  onBack: () => void;
  onPatientRegistered: (patient: Patient) => void;
}

export const ASHAPatientRegistration: React.FC<ASHAPatientRegistrationProps> = ({
  language,
  onBack,
  onPatientRegistered
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    emergencyContact: '',
    familySize: '',
    chronicConditions: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (key: string) => getTranslation(key, language);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePatientId = () => {
    // Generate a unique patient ID - in real app, this would be server-side
    const timestamp = Date.now().toString().slice(-6);
    return `P${timestamp}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.age || !formData.gender || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^\+91-\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid phone number in format +91-XXXXXXXXXX');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newPatient: Patient = {
        id: Date.now().toString(),
        role: 'patient',
        fullName: formData.fullName,
        phone: formData.phone,
        patientId: generatePatientId(),
        age: parseInt(formData.age),
        gender: formData.gender as 'male' | 'female' | 'other',
        isActive: true
      };

      // In real app, this would be saved to backend
      console.log('New patient registered:', newPatient);
      
      onPatientRegistered(newPatient);
      toast.success(`Patient registered successfully! Patient ID: ${newPatient.patientId}`);
      
      // Reset form
      setFormData({
        fullName: '',
        age: '',
        gender: '',
        phone: '',
        address: '',
        emergencyContact: '',
        familySize: '',
        chronicConditions: '',
        notes: ''
      });
      
    } catch (error) {
      toast.error('Failed to register patient. Please try again.');
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-lg text-gray-900">Register New Patient</h1>
            <div className="w-8"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter patient's full name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Age *
                    </label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Age"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Gender *
                    </label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-green-600" />
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Address
                  </label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Village, District"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <Input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div>
              <h3 className="text-lg text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-red-600" />
                Health Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Family Size
                  </label>
                  <Input
                    type="number"
                    value={formData.familySize}
                    onChange={(e) => handleInputChange('familySize', e.target.value)}
                    placeholder="Number of family members"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Known Chronic Conditions
                  </label>
                  <Input
                    type="text"
                    value={formData.chronicConditions}
                    onChange={(e) => handleInputChange('chronicConditions', e.target.value)}
                    placeholder="e.g., Diabetes, Hypertension (if any)"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <Input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional health information"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Registering...
                </div>
              ) : (
                'Register Patient'
              )}
            </Button>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="mt-4 p-4 bg-blue-50">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm">i</span>
            </div>
            <div>
              <h4 className="text-sm text-blue-900 mb-1">Registration Information</h4>
              <p className="text-xs text-blue-700">
                After registration, a unique Patient ID will be generated. 
                Share this ID with the patient for future logins and consultations.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};