// Core types for the Sukhayu telemedicine application

export type UserRole = 'patient' | 'asha' | 'cho' | 'mo' | 'civil_doctor' | 'emergency_doctor' | 'pharmacist';

export type Language = 'en' | 'hi' | 'mr' | 'pa';

export type SeverityZone = 'yellow' | 'orange' | 'red';

export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  phone: string;
  profilePhoto?: string;
  isActive: boolean;
}

export interface Patient extends User {
  role: 'patient';
  patientId: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface ASHAWorker extends User {
  role: 'asha';
  ashaWorkerId: string;
  area: string;
}

export interface Doctor extends User {
  role: 'cho' | 'mo' | 'civil_doctor' | 'emergency_doctor';
  doctorId: string;
  designation: string;
  department?: string;
  status: 'available' | 'busy';
}

export interface Pharmacist extends User {
  role: 'pharmacist';
  licenseNumber: string;
  pharmacyName: string;
  location: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  doctorDesignation: string;
  date: string;
  symptoms: string[];
  diagnosis?: string;
  prescriptionId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'escalated';
  severity: SeverityZone;
  vitals?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    weight?: string;
    height?: string;
  };
}

export interface Prescription {
  id: string;
  consultationId: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  symptoms: string[];
  diagnosis: string;
  medicines: Medicine[];
  vitals?: any;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface InventoryItem {
  medicineId: string;
  medicineName: string;
  availableQuantity: number;
  soldQuantity: number;
  minStockLevel: number;
}

export interface PharmacyInventory {
  pharmacyId: string;
  items: InventoryItem[];
  lastUpdated: string;
}

export interface EmergencyAlert {
  id: string;
  patientId: string;
  patientName: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp: string;
  status: 'active' | 'responded' | 'resolved';
}

export interface ExternalConsultation {
  id: string;
  patientId: string;
  doctorName: string;
  date: string;
  pdfUrl: string;
  uploadDate: string;
}

export interface SymptomCheckerSession {
  id: string;
  patientId: string;
  symptoms: string[];
  questions: Array<{
    question: string;
    answer: string;
  }>;
  suggestedCondition?: string;
  precautions?: string[];
  recommendedDoctorType?: UserRole;
  severity?: SeverityZone;
  createdAt: string;
}

export interface QueueItem {
  id: string;
  consultationId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  symptoms: string[];
  severity: SeverityZone;
  queueTime: string;
  estimatedWaitTime: number;
  position: number;
}

export interface DoctorQueue {
  doctorId: string;
  doctorName: string;
  doctorRole: UserRole;
  currentConsultation?: string;
  queue: QueueItem[];
  averageConsultationTime: number;
}