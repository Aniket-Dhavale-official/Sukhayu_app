import React, { useState } from 'react';
import { Patient, ASHAWorker, Language } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ArrowLeft, Camera, LogOut, Save } from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { toast } from 'sonner@2.0.3';

interface PatientProfileProps {
  user: Patient | ASHAWorker;
  language: Language;
  onBack: () => void;
  onLogout: () => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  user,
  language,
  onBack,
  onLogout
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    age: user.role === 'patient' ? (user as Patient).age : 25,
    gender: user.role === 'patient' ? (user as Patient).gender : 'female' as const,
    phone: user.phone,
    profilePhoto: user.profilePhoto
  });

  const t = (key: string) => getTranslation(key, language);

  const handleSave = () => {
    // In real app, this would update the user data
    toast.success(t('success'));
    setIsEditing(false);
  };

  const handlePhotoUpload = () => {
    // Mock photo upload
    const mockPhotoUrl = `https://i.pravatar.cc/150?u=${user.id}`;
    setFormData(prev => ({ ...prev, profilePhoto: mockPhotoUrl }));
    toast.success('Profile photo updated');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg">{t('profile')}</h1>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="p-2 text-red-600"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <Card>
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={formData.profilePhoto} />
                <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                  {formData.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                onClick={handlePhotoUpload}
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <CardTitle className="mt-4">{t('profile')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('fullName')}</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            {user.role === 'patient' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="age">{t('age')}</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">{t('gender')}</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as any }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('male')}</SelectItem>
                      <SelectItem value="female">{t('female')}</SelectItem>
                      <SelectItem value="other">{t('other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">{t('phone')}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userId">
                {user.role === 'patient' ? t('patientId') : t('ashaWorkerId')}
              </Label>
              <Input
                id="userId"
                value={user.role === 'patient' ? (user as Patient).patientId : (user as ASHAWorker).ashaWorkerId}
                disabled
                className="bg-gray-50"
              />
            </div>

            {user.role === 'asha' && (
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={(user as ASHAWorker).area}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t('save')}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full"
                >
                  {t('edit')}
                </Button>
              )}
            </div>

            <Button
              variant="destructive"
              onClick={onLogout}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};