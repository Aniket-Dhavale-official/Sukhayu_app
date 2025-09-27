import React, { useState } from 'react';
import { Doctor } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ArrowLeft, Camera, LogOut, Save } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DoctorProfileProps {
  user: Doctor;
  onBack: () => void;
  onLogout: () => void;
}

export const DoctorProfile: React.FC<DoctorProfileProps> = ({
  user,
  onBack,
  onLogout
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    phone: user.phone,
    department: user.department || '',
    profilePhoto: user.profilePhoto
  });

  const handleSave = () => {
    // In real app, this would update the doctor data
    toast.success('Profile updated successfully');
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
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg">Doctor Profile</h1>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="p-2 text-red-600"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
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
            <CardTitle className="mt-4">Doctor Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorId">Doctor ID</Label>
              <Input
                id="doctorId"
                value={user.doctorId}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={user.designation}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={user.role.toUpperCase().replace('_', ' ')}
                disabled
                className="bg-gray-50"
              />
            </div>

            {(user.role === 'civil_doctor' || user.role === 'emergency_doctor') && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="e.g., General Medicine, Emergency Medicine"
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
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <Button
              variant="destructive"
              onClick={onLogout}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Doctor Capabilities */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Doctor Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <h4>As a {user.designation}, you can:</h4>
              <ul className="space-y-2">
                {user.role === 'cho' && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Handle Yellow severity cases (primary care)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Escalate to Medical Officer for Orange cases
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Escalate to Emergency Doctor for Red cases
                    </li>
                  </>
                )}
                {user.role === 'mo' && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Handle Yellow and Orange severity cases
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Escalate to Civil Hospital for complex cases
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Escalate to Emergency Doctor for Red cases
                    </li>
                  </>
                )}
                {user.role === 'civil_doctor' && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Handle complex medical cases
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Receive escalations from Chief Health Officer and MO
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Escalate to Emergency for critical cases
                    </li>
                  </>
                )}
                {user.role === 'emergency_doctor' && (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      Handle all Red severity emergency cases
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      Receive escalations from all other doctors
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      Coordinate emergency medical responses
                    </li>
                  </>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  Access patient medical history
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  Record vitals and examination findings
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  Issue digital prescriptions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  View nearby pharmacy inventory
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};