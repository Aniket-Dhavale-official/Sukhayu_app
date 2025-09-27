import React, { useState } from 'react';
import { UserRole } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { User, Stethoscope, Pill } from 'lucide-react';
import sukhayuLogo from 'figma:asset/d04331b26d9697b77a11d091903e7e7f2fc132f0.png';

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

const roleGroups = [
  {
    id: 'patient',
    icon: User,
    title: 'Patient & ASHA',
    color: 'bg-[#007C91] hover:bg-[#006076] text-white',
    roles: ['patient', 'asha']
  },
  {
    id: 'doctor',
    icon: Stethoscope,
    title: 'Doctors',
    color: 'bg-[#8E7CC3] hover:bg-[#7B6AB8] text-white',
    roles: ['cho', 'mo', 'civil_doctor', 'emergency_doctor']
  },
  {
    id: 'pharmacist',
    icon: Pill,
    title: 'Pharmacist',
    color: 'bg-[#2ECC71] hover:bg-[#27AE60] text-white',
    roles: ['pharmacist']
  }
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const handleGroupSelect = (groupId: string) => {
    const group = roleGroups.find(g => g.id === groupId);
    if (group?.roles.length === 1) {
      onRoleSelect(group.roles[0] as UserRole);
    } else {
      setSelectedGroup(groupId);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    onRoleSelect(role);
  };

  if (selectedGroup) {
    const group = roleGroups.find(g => g.id === selectedGroup);
    const specificRoles = {
      patient: { title: 'Patient', description: 'Book consultations and track health' },
      asha: { title: 'ASHA Worker', description: 'Help patients with consultations' },
      cho: { title: 'Chief Health Officer', description: 'Primary healthcare management' },
      mo: { title: 'Medical Officer', description: 'Advanced medical consultations' },
      civil_doctor: { title: 'Civil Hospital Doctor', description: 'Hospital-based consultations' },
      emergency_doctor: { title: 'Emergency Doctor', description: 'Emergency medical care' }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-2xl mx-auto pt-16">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src={sukhayuLogo} alt="Sukhayu Logo" className="w-20 h-20" />
            </div>
            <h1 className="text-3xl mb-2 text-blue-900">Sukhayu</h1>
            <p className="text-lg text-gray-600">Select your specific role</p>
          </div>

          <div className="space-y-4">
            {group?.roles.map((role) => {
              const roleInfo = specificRoles[role as keyof typeof specificRoles];
              return (
                <Card 
                  key={role}
                  className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2"
                  onClick={() => handleRoleSelect(role as UserRole)}
                >
                  <CardHeader className="text-center py-6">
                    <CardTitle className="text-xl">{roleInfo.title}</CardTitle>
                    <p className="text-gray-600">{roleInfo.description}</p>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedGroup(null)}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto pt-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src={sukhayuLogo} alt="Sukhayu Logo" className="w-32 h-32" />
          </div>
          <h1 className="text-4xl mb-4 text-blue-900">
            Sukhayu
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Telemedicine for Rural Healthcare
          </p>
        </div>

        <div className="space-y-6">
          {roleGroups.map((group) => {
            const Icon = group.icon;
            return (
              <Card 
                key={group.id}
                className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2"
                onClick={() => handleGroupSelect(group.id)}
              >
                <CardHeader className="text-center py-8">
                  <Icon className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                  <CardTitle className="text-2xl">{group.title}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Secure • HIPAA Compliant • Government Approved</p>
        </div>
      </div>
    </div>
  );
};