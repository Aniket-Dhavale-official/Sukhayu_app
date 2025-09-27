import React, { useState } from 'react';
import { UserRole, Language } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { getTranslation } from '../utils/translations';
import { validateOTP, mockPatients, mockASHAWorkers, mockDoctors, mockPharmacists } from '../utils/mockData';
import { toast } from 'sonner@2.0.3';
import sukhayuLogo from 'figma:asset/d04331b26d9697b77a11d091903e7e7f2fc132f0.png';

interface OTPLoginProps {
  role: UserRole;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onBack: () => void;
  onLogin: (user: any) => void;
}

export const OTPLogin: React.FC<OTPLoginProps> = ({
  role,
  language,
  onLanguageChange,
  onBack,
  onLogin
}) => {
  const [step, setStep] = useState<'id' | 'otp'>('id');
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const t = (key: string) => getTranslation(key, language);

  const roleConfig = {
    patient: { 
      idLabel: t('patientId'), 
      placeholder: 'P001', 
      users: mockPatients,
      idField: 'patientId'
    },
    asha: { 
      idLabel: t('ashaWorkerId'), 
      placeholder: 'A001', 
      users: mockASHAWorkers,
      idField: 'ashaWorkerId'
    },
    cho: { 
      idLabel: 'CHO ID', 
      placeholder: 'CHO001', 
      users: mockDoctors.filter(d => d.role === 'cho'),
      idField: 'doctorId'
    },
    mo: { 
      idLabel: 'MO ID', 
      placeholder: 'MO001', 
      users: mockDoctors.filter(d => d.role === 'mo'),
      idField: 'doctorId'
    },
    civil_doctor: { 
      idLabel: 'Doctor ID', 
      placeholder: 'CD001', 
      users: mockDoctors.filter(d => d.role === 'civil_doctor'),
      idField: 'doctorId'
    },
    emergency_doctor: { 
      idLabel: 'Emergency Doctor ID', 
      placeholder: 'ED001', 
      users: mockDoctors.filter(d => d.role === 'emergency_doctor'),
      idField: 'doctorId'
    },
    pharmacist: { 
      idLabel: 'License Number', 
      placeholder: 'PH001', 
      users: mockPharmacists,
      idField: 'licenseNumber'
    }
  };

  const config = roleConfig[role];

  const handleSendOTP = async () => {
    if (!userId.trim()) return;
    
    setLoading(true);
    
    // Check if user exists first
    setTimeout(() => {
      const user = config.users.find(u => 
        u[config.idField as keyof typeof u] === userId
      );
      
      if (!user) {
        toast.error(t('userNotFound'));
        setLoading(false);
        return;
      }
      
      setStep('otp');
      setLoading(false);
      toast.success(t('otpSent'));
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) return;
    
    setLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      if (validateOTP(userId, otp)) {
        // Find user by ID
        const user = config.users.find(u => 
          u[config.idField as keyof typeof u] === userId
        );
        
        if (user) {
          onLogin(user);
          toast.success(t('success'));
        } else {
          toast.error('User not found');
        }
      } else {
        toast.error(t('invalidOtp'));
      }
      setLoading(false);
    }, 1000);
  };

  const showLanguageSelector = role === 'patient' || role === 'asha';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-md mx-auto pt-16">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {showLanguageSelector && (
            <LanguageSelector 
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
          )}
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={sukhayuLogo} alt="Sukhayu Logo" className="w-20 h-20" />
            </div>
            <CardTitle>{t('login')}</CardTitle>
            <CardDescription>
              {step === 'id' ? `Enter your ${config.idLabel}` : t('enterOtp')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'id' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="userId">{config.idLabel}</Label>
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder={config.placeholder}
                    className="text-center"
                  />
                </div>
                <Button 
                  onClick={handleSendOTP}
                  disabled={!userId.trim() || loading}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">{t('enterOtp')}</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="text-center tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Use 123456 for demo
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('id')}
                    className="flex-1"
                  >
                    {t('back')}
                  </Button>
                  <Button 
                    onClick={handleVerifyOTP}
                    disabled={otp.length !== 6 || loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {t('login')}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Available demo IDs:</p>
          <p>{config.users.map(u => u[config.idField as keyof typeof u]).join(', ')}</p>
        </div>
      </div>
    </div>
  );
};