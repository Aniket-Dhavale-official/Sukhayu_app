import { Patient, ASHAWorker, Doctor, Pharmacist, Consultation, Medicine, InventoryItem, PharmacyInventory, ExternalConsultation, SeverityZone, QueueItem, DoctorQueue } from '../types';

// Mock users for different roles
export const mockPatients: Patient[] = [
  {
    id: '1',
    role: 'patient',
    fullName: 'राम शर्मा',
    phone: '+91-9876543210',
    patientId: 'P001',
    age: 45,
    gender: 'male',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1595956481935-a9e254951d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMGZhcm1lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODgxODYyN3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '2',
    role: 'patient',
    fullName: 'सीता देवी',
    phone: '+91-9876543211',
    patientId: 'P002',
    age: 32,
    gender: 'female',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1624214390234-2849d6a888c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4ODE5ODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '3',
    role: 'patient',
    fullName: 'मोहन गुप्ता',
    phone: '+91-9876543220',
    patientId: 'P003',
    age: 55,
    gender: 'male',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1595956481935-a9e254951d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMGZhcm1lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODgxODYyN3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '4',
    role: 'patient',
    fullName: 'प्रिया शर्मा',
    phone: '+91-9876543221',
    patientId: 'P004',
    age: 28,
    gender: 'female',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1624214390234-2849d6a888c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4ODE5ODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '5',
    role: 'patient',
    fullName: 'रमेश कुमार',
    phone: '+91-9876543222',
    patientId: 'P005',
    age: 62,
    gender: 'male',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1595956481935-a9e254951d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMGZhcm1lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODgxODYyN3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '6',
    role: 'patient',
    fullName: 'सुनीता पटेल',
    phone: '+91-9876543223',
    patientId: 'P006',
    age: 35,
    gender: 'female',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1624214390234-2849d6a888c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4ODE5ODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '7',
    role: 'patient',
    fullName: 'अनिल वर्मा',
    phone: '+91-9876543224',
    patientId: 'P007',
    age: 40,
    gender: 'male',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1595956481935-a9e254951d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMGZhcm1lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODgxODYyN3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '8',
    role: 'patient',
    fullName: 'मीरा देवी',
    phone: '+91-9876543225',
    patientId: 'P008',
    age: 50,
    gender: 'female',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1624214390234-2849d6a888c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4ODE5ODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '10',
    role: 'patient',
    fullName: 'अजय कुमार',
    phone: '+91-9876543226',
    patientId: 'P010',
    age: 38,
    gender: 'male',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1595956481935-a9e254951d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMGZhcm1lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODgxODYyN3ww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: '11',
    role: 'patient',
    fullName: 'गीता देवी',
    phone: '+91-9876543227',
    patientId: 'P011',
    age: 67,
    gender: 'female',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1624214390234-2849d6a888c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4ODE5ODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '12',
    role: 'patient',
    fullName: 'कमला देवी',
    phone: '+91-9876543228',
    patientId: 'P012',
    age: 58,
    gender: 'female',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1624214390234-2849d6a888c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4ODE5ODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '13',
    role: 'patient',
    fullName: 'विकास सिंह',
    phone: '+91-9876543229',
    patientId: 'P013',
    age: 33,
    gender: 'male',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1595956481935-a9e254951d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMGZhcm1lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODgxODYyN3ww&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export const mockASHAWorkers: ASHAWorker[] = [
  {
    id: '3',
    role: 'asha',
    fullName: 'प्रिया पटेल',
    phone: '+91-9876543212',
    ashaWorkerId: 'A001',
    area: 'Village Block 1',
    isActive: true,
    profilePhoto: 'https://images.unsplash.com/photo-1595956481935-a9e254951d49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydXJhbCUyMGluZGlhbiUyMGZhcm1lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODgxODYyN3ww&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: '4',
    role: 'cho',
    fullName: 'Dr. अमित कुमार',
    phone: '+91-9876543213',
    doctorId: 'CHO001',
    designation: 'Chief Health Officer',
    status: 'available',
    isActive: true
  },
  {
    id: '5',
    role: 'mo',
    fullName: 'Dr. सुनीता रानी',
    phone: '+91-9876543214',
    doctorId: 'MO001',
    designation: 'Medical Officer',
    status: 'available',
    isActive: true
  },
  {
    id: '6',
    role: 'civil_doctor',
    fullName: 'Dr. राज गुप्ता',
    phone: '+91-9876543215',
    doctorId: 'CD001',
    designation: 'Civil Hospital Doctor',
    department: 'General Medicine',
    status: 'available',
    isActive: true
  },
  {
    id: '7',
    role: 'emergency_doctor',
    fullName: 'Dr. नीरज सिंह',
    phone: '+91-9876543216',
    doctorId: 'ED001',
    designation: 'Emergency Doctor',
    department: 'Emergency Medicine',
    status: 'available',
    isActive: true
  }
];

export const mockPharmacists: Pharmacist[] = [
  {
    id: '8',
    role: 'pharmacist',
    fullName: 'महेश अग्रवाल',
    phone: '+91-9876543217',
    licenseNumber: 'PH001',
    pharmacyName: 'श्री राम मेडिकल',
    location: 'Main Market, Block 1',
    isActive: true
  },
  {
    id: '9',
    role: 'pharmacist',
    fullName: 'सुरेश वर्मा',
    phone: '+91-9876543218',
    licenseNumber: 'PH002',
    pharmacyName: 'जन औषधि केंद्र',
    location: 'Near PHC, Block 2',
    isActive: true
  }
];

export const mockMedicines: Medicine[] = [
  { id: 'M001', name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '3 days' },
  { id: 'M002', name: 'Amoxicillin 250mg', dosage: '250mg', frequency: 'Thrice daily', duration: '7 days' },
  { id: 'M003', name: 'Omeprazole 20mg', dosage: '20mg', frequency: 'Once daily', duration: '14 days' },
  { id: 'M004', name: 'Cetirizine 10mg', dosage: '10mg', frequency: 'Once daily', duration: '5 days' },
  { id: 'M005', name: 'Ibuprofen 400mg', dosage: '400mg', frequency: 'Twice daily', duration: '5 days' },
  { id: 'M006', name: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
  { id: 'M007', name: 'Amlodipine 5mg', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
  { id: 'M008', name: 'Azithromycin 500mg', dosage: '500mg', frequency: 'Once daily', duration: '3 days' }
];

export const mockConsultations: Consultation[] = [
  {
    id: 'C001',
    patientId: 'P001',
    doctorId: 'CHO001',
    doctorName: 'Dr. अमित कुमार',
    doctorDesignation: 'Chief Health Officer',
    date: '2024-09-20',
    symptoms: ['fever', 'headache', 'body ache'],
    diagnosis: 'Viral Fever',
    prescriptionId: 'PR001',
    status: 'completed',
    severity: 'yellow',
    vitals: {
      temperature: '101°F',
      bloodPressure: '120/80',
      heartRate: '85 bpm'
    }
  },
  {
    id: 'C002',
    patientId: 'P001',
    doctorId: 'MO001',
    doctorName: 'Dr. सुनीता रानी',
    doctorDesignation: 'Medical Officer',
    date: '2024-09-15',
    symptoms: ['chest pain', 'shortness of breath'],
    diagnosis: 'Hypertension',
    prescriptionId: 'PR002',
    status: 'completed',
    severity: 'orange'
  },
  // Current active consultations in queue
  {
    id: 'C003',
    patientId: 'P003',
    doctorId: 'CHO001',
    doctorName: 'Dr. अमित कुमार',
    doctorDesignation: 'Chief Health Officer',
    date: '2024-09-25',
    symptoms: ['cold', 'cough', 'sore throat'],
    diagnosis: '',
    status: 'pending',
    severity: 'yellow',
    vitals: {}
  },
  {
    id: 'C004',
    patientId: 'P004',
    doctorId: 'CHO001',
    doctorName: 'Dr. अमित कुमार',
    doctorDesignation: 'Chief Health Officer',
    date: '2024-09-25',
    symptoms: ['headache', 'fever', 'fatigue'],
    diagnosis: '',
    status: 'pending',
    severity: 'yellow',
    vitals: {}
  },
  {
    id: 'C005',
    patientId: 'P005',
    doctorId: 'MO001',
    doctorName: 'Dr. सुनीता रानी',
    doctorDesignation: 'Medical Officer',
    date: '2024-09-25',
    symptoms: ['chest pain', 'dizziness', 'high blood pressure'],
    diagnosis: '',
    status: 'pending',
    severity: 'orange',
    vitals: {}
  },
  {
    id: 'C006',
    patientId: 'P006',
    doctorId: 'MO001',
    doctorName: 'Dr. सुनीता रानी',
    doctorDesignation: 'Medical Officer',
    date: '2024-09-25',
    symptoms: ['stomach pain', 'nausea', 'vomiting'],
    diagnosis: '',
    status: 'pending',
    severity: 'orange',
    vitals: {}
  },
  {
    id: 'C007',
    patientId: 'P007',
    doctorId: 'ED001',
    doctorName: 'Dr. नीरज सिंह',
    doctorDesignation: 'Emergency Doctor',
    date: '2024-09-25',
    symptoms: ['severe chest pain', 'shortness of breath', 'dizziness'],
    diagnosis: '',
    status: 'in_progress',
    severity: 'red',
    vitals: {}
  },
  {
    id: 'C008',
    patientId: 'P008',
    doctorId: 'ED001',
    doctorName: 'Dr. नीरज सिंह',
    doctorDesignation: 'Emergency Doctor',
    date: '2024-09-25',
    symptoms: ['severe headache', 'vision problems', 'high fever'],
    diagnosis: '',
    status: 'pending',
    severity: 'red',
    vitals: {}
  },
  {
    id: 'C009',
    patientId: 'P002',
    doctorId: 'CHO001',
    doctorName: 'Dr. अमित कुमार',
    doctorDesignation: 'Chief Health Officer',
    date: '2024-09-25',
    symptoms: ['mild fever', 'runny nose'],
    diagnosis: '',
    status: 'pending',
    severity: 'yellow',
    vitals: {}
  }
];

export const mockExternalConsultations: ExternalConsultation[] = [
  {
    id: 'EC001',
    patientId: 'P001',
    doctorName: 'Dr. विकास शर्मा',
    date: '2024-09-10',
    pdfUrl: '/mock-prescription.pdf',
    uploadDate: '2024-09-12'
  }
];

export const mockInventory: PharmacyInventory[] = [
  {
    pharmacyId: 'PH001',
    lastUpdated: '2024-09-25',
    items: [
      { medicineId: 'M001', medicineName: 'Paracetamol 500mg', availableQuantity: 100, soldQuantity: 25, minStockLevel: 20 },
      { medicineId: 'M002', medicineName: 'Amoxicillin 250mg', availableQuantity: 50, soldQuantity: 10, minStockLevel: 15 },
      { medicineId: 'M003', medicineName: 'Omeprazole 20mg', availableQuantity: 75, soldQuantity: 5, minStockLevel: 10 },
      { medicineId: 'M004', medicineName: 'Cetirizine 10mg', availableQuantity: 8, soldQuantity: 12, minStockLevel: 10 }, // Low stock
      { medicineId: 'M005', medicineName: 'Ibuprofen 400mg', availableQuantity: 60, soldQuantity: 15, minStockLevel: 20 },
      { medicineId: 'M009', medicineName: 'Aspirin 75mg', availableQuantity: 45, soldQuantity: 8, minStockLevel: 15 },
      { medicineId: 'M010', medicineName: 'Salbutamol Inhaler', availableQuantity: 20, soldQuantity: 5, minStockLevel: 8 },
      { medicineId: 'M011', medicineName: 'ORS Packets', availableQuantity: 200, soldQuantity: 50, minStockLevel: 25 },
      { medicineId: 'M012', medicineName: 'Dextromethorphan Syrup', availableQuantity: 30, soldQuantity: 10, minStockLevel: 10 }
    ]
  },
  {
    pharmacyId: 'PH002',
    lastUpdated: '2024-09-25',
    items: [
      { medicineId: 'M001', medicineName: 'Paracetamol 500mg', availableQuantity: 80, soldQuantity: 20, minStockLevel: 20 },
      { medicineId: 'M002', medicineName: 'Amoxicillin 250mg', availableQuantity: 30, soldQuantity: 8, minStockLevel: 15 },
      { medicineId: 'M006', medicineName: 'Metformin 500mg', availableQuantity: 90, soldQuantity: 10, minStockLevel: 25 },
      { medicineId: 'M007', medicineName: 'Amlodipine 5mg', availableQuantity: 5, soldQuantity: 15, minStockLevel: 10 }, // Low stock
      { medicineId: 'M008', medicineName: 'Azithromycin 500mg', availableQuantity: 40, soldQuantity: 5, minStockLevel: 15 },
      { medicineId: 'M009', medicineName: 'Aspirin 75mg', availableQuantity: 35, soldQuantity: 10, minStockLevel: 15 },
      { medicineId: 'M010', medicineName: 'Salbutamol Inhaler', availableQuantity: 15, soldQuantity: 3, minStockLevel: 8 },
      { medicineId: 'M011', medicineName: 'ORS Packets', availableQuantity: 150, soldQuantity: 30, minStockLevel: 25 },
      { medicineId: 'M013', medicineName: 'Betadine Solution', availableQuantity: 25, soldQuantity: 5, minStockLevel: 10 }
    ]
  }
];

// Medicine Prescription Database - Maps diseases to recommended medicines
export const medicinePrescriptionDatabase = {
  // Fever and Viral Infections
  'viral fever': [
    { medicineId: 'M001', name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Every 6 hours', duration: '5 days', instructions: 'Take after meals when fever occurs' },
    { medicineId: 'M011', name: 'ORS Packets', dosage: '1 packet', frequency: '3 times daily', duration: '3 days', instructions: 'Mix with 200ml clean water' }
  ],
  
  'fever': [
    { medicineId: 'M001', name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Every 6 hours', duration: '3 days', instructions: 'Take after meals when fever occurs' }
  ],

  // Respiratory Conditions
  'mild respiratory infection': [
    { medicineId: 'M001', name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '5 days', instructions: 'Take after meals' },
    { medicineId: 'M012', name: 'Dextromethorphan Syrup', dosage: '10ml', frequency: '3 times daily', duration: '7 days', instructions: 'Take after meals for cough relief' },
    { medicineId: 'M002', name: 'Amoxicillin 250mg', dosage: '250mg', frequency: 'Three times daily', duration: '7 days', instructions: 'Complete full course even if feeling better' }
  ],

  'asthma': [
    { medicineId: 'M010', name: 'Salbutamol Inhaler', dosage: '2 puffs', frequency: 'As needed', duration: '30 days', instructions: 'Use during breathing difficulty, maximum 8 puffs per day' },
    { medicineId: 'M004', name: 'Cetirizine 10mg', dosage: '10mg', frequency: 'Once daily', duration: '10 days', instructions: 'Take in evening to reduce allergic reactions' }
  ],

  // Gastrointestinal Issues
  'digestive issues': [
    { medicineId: 'M003', name: 'Omeprazole 20mg', dosage: '20mg', frequency: 'Once daily', duration: '14 days', instructions: 'Take 30 minutes before breakfast' },
    { medicineId: 'M011', name: 'ORS Packets', dosage: '1 packet', frequency: '3 times daily', duration: '3 days', instructions: 'Mix with 200ml clean water' }
  ],

  'severe dehydration': [
    { medicineId: 'M011', name: 'ORS Packets', dosage: '2 packets', frequency: '4 times daily', duration: '5 days', instructions: 'Mix each packet with 200ml clean water' },
    { medicineId: 'M003', name: 'Omeprazole 20mg', dosage: '20mg', frequency: 'Once daily', duration: '7 days', instructions: 'Take before breakfast if stomach pain present' }
  ],

  // Cardiovascular Issues
  'moderate hypertension': [
    { medicineId: 'M007', name: 'Amlodipine 5mg', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in morning with water' },
    { medicineId: 'M009', name: 'Aspirin 75mg', dosage: '75mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take after dinner with water' }
  ],

  'heart attack': [
    { medicineId: 'M009', name: 'Aspirin 75mg', dosage: '300mg', frequency: 'Immediately', duration: '1 dose', instructions: 'Chew tablet immediately, then seek emergency care' }
  ],

  // Pain and Inflammation
  'general fatigue': [
    { medicineId: 'M001', name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '3 days', instructions: 'Take after meals if body ache present' },
    { medicineId: 'M005', name: 'Ibuprofen 400mg', dosage: '400mg', frequency: 'Twice daily', duration: '5 days', instructions: 'Take after meals, avoid if stomach problems' }
  ],

  'mild injury': [
    { medicineId: 'M013', name: 'Betadine Solution', dosage: 'Apply topically', frequency: 'Twice daily', duration: '7 days', instructions: 'Clean wound, apply solution, cover with sterile dressing' },
    { medicineId: 'M001', name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'As needed', duration: '5 days', instructions: 'Take for pain relief after meals' }
  ],

  // Skin Conditions
  'skin condition': [
    { medicineId: 'M004', name: 'Cetirizine 10mg', dosage: '10mg', frequency: 'Once daily', duration: '7 days', instructions: 'Take in evening for allergy relief' },
    { medicineId: 'M013', name: 'Betadine Solution', dosage: 'Apply topically', frequency: 'Twice daily', duration: '10 days', instructions: 'Clean area gently, apply thin layer' }
  ],

  // Default for unspecified conditions
  'general consultation': [
    { medicineId: 'M001', name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'As needed', duration: '3 days', instructions: 'Take for pain or fever relief after meals' }
  ]
};

// Function to get medicine prescription based on diagnosed condition
export const getMedicinePrescription = (diagnosis: string): any[] => {
  const normalizedDiagnosis = diagnosis.toLowerCase().trim();
  
  // Check exact matches first
  if (medicinePrescriptionDatabase[normalizedDiagnosis]) {
    return medicinePrescriptionDatabase[normalizedDiagnosis];
  }
  
  // Check for partial matches
  for (const [condition, medicines] of Object.entries(medicinePrescriptionDatabase)) {
    if (normalizedDiagnosis.includes(condition) || condition.includes(normalizedDiagnosis)) {
      return medicines;
    }
  }
  
  // Default prescription for general consultation
  return medicinePrescriptionDatabase['general consultation'];
};

// Feedback types for medicine compliance
export interface MedicineFeedback {
  consultationId: string;
  patientId: string;
  medicinesTaken: boolean;
  reasonForNotTaking?: string;
  sideEffects?: string;
  improvementLevel: 'much_better' | 'better' | 'same' | 'worse';
  followUpNeeded: boolean;
  additionalComments?: string;
  submissionDate: string;
}

// Mock feedback data
export const mockMedicineFeedback: MedicineFeedback[] = [
  {
    consultationId: 'C001',
    patientId: 'P001',
    medicinesTaken: true,
    improvementLevel: 'better',
    followUpNeeded: false,
    submissionDate: '2024-09-20',
    additionalComments: 'Fever reduced after 2 days'
  }
];

// Function to store medicine feedback
export const storeMedicineFeedback = (feedback: MedicineFeedback): void => {
  mockMedicineFeedback.push(feedback);
  console.log('Medicine feedback stored:', feedback);
};

// Mock OTP validation
export const validateOTP = (userId: string, otp: string): boolean => {
  // Simple mock validation - in real app this would be server-side
  return otp === '123456';
};

// Enhanced AI Symptom Checker Data with Comprehensive Severity Classifications
export const symptomCheckerData = {
  // Keywords for symptom detection across multiple languages
  keywords: {
    // Red Zone - Emergency Symptoms
    chest_pain: ['chest pain', 'heart pain', 'cardiac pain', 'सीने में दर्द', 'छातीत दुखी', 'ਸੀਨੇ ਵਿੱਚ ਦਰਦ'],
    breathing: ['breathing problem', 'shortness of breath', 'can\'t breathe', 'suffocating', 'सांस की समस्या', 'श्वासाची समस्या', 'ਸਾਹ ਦੀ ਸਮੱਸਿਆ'],
    unconscious: ['unconscious', 'fainted', 'collapsed', 'passed out', 'बेहोश', 'बेशुद्ध', 'ਬੇਹੋਸ਼'],
    severe_bleeding: ['severe bleeding', 'heavy bleeding', 'blood loss', 'तेज खून बहना', 'जास्त रक्तस्राव', 'ਤੇਜ਼ ਖੂਨ ਵਗਣਾ'],
    stroke: ['stroke', 'paralysis', 'speech problem', 'weakness one side', 'लकवा', 'अर्धांगवायू', 'ਸਟਰੋਕ'],
    
    // Orange Zone - Serious Symptoms  
    high_fever: ['high fever', 'fever 102', 'fever 103', 'fever 104', 'तेज बुखार', 'तीव्र ताप', 'ਤੇਜ਼ ਬੁਖਾਰ'],
    severe_pain: ['severe pain', 'extreme pain', 'unbearable pain', 'तेज दर्द', 'गंभीर वेदना', 'ਗੰਭੀਰ ਦਰਦ'],
    dehydration: ['dehydration', 'very weak', 'dizzy', 'dry mouth', 'पानी की कमी', 'निर्जलीकरण', 'ਪਾਣੀ ਦੀ ਕਮੀ'],
    blood_pressure: ['high blood pressure', 'bp high', 'hypertension', 'headache severe', 'उच्च रक्तचाप', 'उच्च रक्तदाब', 'ਉੱਚ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ'],
    diabetes: ['diabetes', 'sugar high', 'blood sugar', 'मधुमेह', 'साखरेचा आजार', 'ਸ਼ੂਗਰ'],
    asthma: ['asthma', 'wheezing', 'breathing difficulty', 'दमा', 'श्वासोच्छवास', 'ਦਮਾ'],
    
    // Yellow Zone - Moderate Symptoms
    fever: ['fever', 'temperature', 'cold', 'flu', 'बुखार', 'ताप', 'ਬੁਖਾਰ'],
    cough: ['cough', 'cold', 'throat pain', 'खांसी', 'खोकला', 'ਖਾਂਸੀ'],
    headache: ['headache', 'head pain', 'सिरदर्द', 'डोकेदुखी', 'ਸਿਰ ਦਰਦ'],
    stomach: ['stomach pain', 'abdominal pain', 'belly pain', 'पेट दर्द', 'पोटदुखी', 'ਪੇਟ ਦਰਦ'],
    nausea: ['nausea', 'vomiting', 'feel sick', 'मतली', 'उलटी', 'ਮਤਲੀ'],
    diarrhea: ['diarrhea', 'loose motion', 'stomach upset', 'दस्त', 'अतिसार', 'ਦਸਤ'],
    body_ache: ['body ache', 'joint pain', 'muscle pain', 'शरीर में दर्द', 'अंगदुखी', 'ਸਰੀਰ ਦਰਦ'],
    injury: ['injury', 'wound', 'cut', 'bruise', 'चोट', 'जखम', 'ਸੱਟ'],
    skin: ['rash', 'itching', 'skin problem', 'खुजली', 'सुराख', 'ਖਾਰਿਸ਼'],
    fatigue: ['tired', 'weakness', 'fatigue', 'थकान', 'अशक्तपणा', 'ਥਕਾਵਟ']
  },
  
  // Classification rules with comprehensive conditions
  classificationRules: {
    // RED ZONE - CRITICAL EMERGENCY (Immediate Medical Attention)
    red: [
      {
        condition: 'Heart Attack',
        triggers: [
          ['chest_pain', 'breathing'],
          ['chest_pain', 'severe_pain'],
          ['chest_pain', 'unconscious']
        ],
        response: 'Critical heart condition detected. Immediate emergency care required.',
        precautions: [
          'Stay calm and sit down immediately',
          'Do not move unless absolutely necessary',
          'Loosen tight clothing',
          'If unconscious, place in recovery position'
        ]
      },
      {
        condition: 'Stroke',
        triggers: [
          ['stroke'],
          ['unconscious', 'severe_pain'],
          ['breathing', 'unconscious']
        ],
        response: 'Possible stroke detected. Critical emergency - immediate medical intervention needed.',
        precautions: [
          'Do not give food or water',
          'Note time of symptom onset',
          'Keep patient calm and still',
          'Monitor breathing continuously'
        ]
      },
      {
        condition: 'Severe Trauma',
        triggers: [
          ['severe_bleeding'],
          ['unconscious', 'injury'],
          ['breathing', 'injury']
        ],
        response: 'Severe trauma detected. Emergency medical care required immediately.',
        precautions: [
          'Control bleeding with direct pressure',
          'Do not move patient unless in danger',
          'Keep patient warm',
          'Monitor vital signs'
        ]
      },
      {
        condition: 'Respiratory Failure',
        triggers: [
          ['breathing', 'unconscious'],
          ['breathing', 'severe_pain'],
          ['asthma', 'breathing']
        ],
        response: 'Severe breathing difficulty detected. Immediate emergency intervention required.',
        precautions: [
          'Keep patient upright if conscious',
          'Ensure airway is clear',
          'Do not leave patient alone',
          'Be ready to perform CPR if needed'
        ]
      },
      {
        condition: 'Unconsciousness',
        triggers: [
          ['unconscious'],
          ['unconscious', 'fever'],
          ['unconscious', 'injury']
        ],
        response: 'Loss of consciousness detected. Critical emergency requiring immediate medical attention.',
        precautions: [
          'Check for breathing and pulse',
          'Place in recovery position if breathing',
          'Do not give anything by mouth',
          'Protect from injury'
        ]
      }
    ],
    
    // ORANGE ZONE - SERIOUS CONDITION (Medical Officer Required)
    orange: [
      {
        condition: 'Severe Dehydration',
        triggers: [
          ['dehydration', 'high_fever'],
          ['dehydration', 'severe_pain'],
          ['diarrhea', 'high_fever'],
          ['nausea', 'dehydration']
        ],
        response: 'Severe dehydration detected. Immediate medical officer consultation required.',
        precautions: [
          'Give small sips of ORS solution if conscious',
          'Avoid solid food',
          'Rest in cool environment',
          'Monitor for worsening symptoms'
        ]
      },
      {
        condition: 'Severe Asthma/COPD Exacerbation',
        triggers: [
          ['asthma', 'severe_pain'],
          ['breathing', 'high_fever'],
          ['asthma', 'dehydration']
        ],
        response: 'Severe respiratory condition. Medical officer intervention needed urgently.',
        precautions: [
          'Use rescue inhaler if available',
          'Sit upright, lean forward slightly',
          'Stay calm and breathe slowly',
          'Avoid triggers like smoke or dust'
        ]
      },
      {
        condition: 'High Fever with Warning Signs',
        triggers: [
          ['high_fever', 'severe_pain'],
          ['high_fever', 'dehydration'],
          ['high_fever', 'breathing'],
          ['fever', 'severe_bleeding']
        ],
        response: 'High fever with concerning symptoms. Medical officer consultation required.',
        precautions: [
          'Apply cool compresses to forehead',
          'Take paracetamol as per age-appropriate dose',
          'Maintain fluid intake',
          'Monitor temperature regularly'
        ]
      },
      {
        condition: 'Uncontrolled Diabetes',
        triggers: [
          ['diabetes', 'dehydration'],
          ['diabetes', 'unconscious'],
          ['diabetes', 'breathing']
        ],
        response: 'Serious diabetic condition. Immediate medical officer evaluation needed.',
        precautions: [
          'Check blood sugar if meter available',
          'If conscious and sugar is low, give glucose',
          'Monitor consciousness level',
          'Prepare list of current medications'
        ]
      },
      {
        condition: 'Severe Hypertension',
        triggers: [
          ['blood_pressure', 'severe_pain'],
          ['blood_pressure', 'breathing'],
          ['headache', 'blood_pressure']
        ],
        response: 'Severe high blood pressure detected. Medical officer consultation urgently needed.',
        precautions: [
          'Rest in quiet environment',
          'Avoid sudden movements',
          'Take prescribed BP medication if available',
          'Monitor for chest pain or vision changes'
        ]
      },
      {
        condition: 'Severe Gastroenteritis',
        triggers: [
          ['diarrhea', 'dehydration'],
          ['nausea', 'severe_pain'],
          ['stomach', 'high_fever']
        ],
        response: 'Severe stomach condition. Medical officer evaluation required.',
        precautions: [
          'Start ORS solution immediately',
          'Avoid solid food temporarily',
          'Maintain electrolyte balance',
          'Monitor for blood in stool'
        ]
      },
      {
        condition: 'Moderate Respiratory Infection',
        triggers: [
          ['cough', 'high_fever'],
          ['breathing', 'fever'],
          ['chest_pain', 'cough']
        ],
        response: 'Serious respiratory infection. Medical officer consultation needed.',
        precautions: [
          'Rest and avoid strenuous activity',
          'Use steam inhalation',
          'Maintain adequate fluid intake',
          'Cover mouth when coughing'
        ]
      },
      {
        condition: 'Severe Injury with Complications',
        triggers: [
          ['injury', 'severe_pain'],
          ['injury', 'high_fever'],
          ['injury', 'dehydration']
        ],
        response: 'Injury with complications. Medical officer assessment required.',
        precautions: [
          'Keep wound clean and covered',
          'Apply ice for swelling',
          'Elevate injured area if possible',
          'Watch for signs of infection'
        ]
      }
    ],
    
    // YELLOW ZONE - MODERATE CONDITION (Chief Health Officer Consultation)
    yellow: [
      {
        condition: 'Viral Fever',
        triggers: [
          ['fever'],
          ['fever', 'headache'],
          ['fever', 'body_ache'],
          ['fever', 'fatigue']
        ],
        response: 'Viral fever detected. Chief Health Officer consultation recommended.',
        precautions: [
          'Rest and stay hydrated',
          'Take paracetamol for fever',
          'Use light, breathable clothing',
          'Monitor temperature regularly'
        ]
      },
      {
        condition: 'Mild Respiratory Infection',
        triggers: [
          ['cough'],
          ['cough', 'headache'],
          ['cough', 'fatigue'],
          ['fever', 'cough']
        ],
        response: 'Respiratory infection detected. Chief Health Officer consultation recommended.',
        precautions: [
          'Rest and increase fluid intake',
          'Use honey for cough relief',
          'Avoid cold foods and drinks',
          'Practice good hygiene'
        ]
      },
      {
        condition: 'Mild Injury',
        triggers: [
          ['injury'],
          ['injury', 'headache'],
          ['skin', 'injury']
        ],
        response: 'Minor injury detected. Chief Health Officer evaluation recommended.',
        precautions: [
          'Clean wound with antiseptic',
          'Apply sterile bandage',
          'Keep wound dry and clean',
          'Watch for signs of infection'
        ]
      },
      {
        condition: 'Moderate Hypertension',
        triggers: [
          ['blood_pressure'],
          ['headache', 'fatigue'],
          ['headache', 'body_ache']
        ],
        response: 'Blood pressure concern detected. Chief Health Officer consultation recommended.',
        precautions: [
          'Reduce salt intake',
          'Gentle exercise as tolerated',
          'Monitor BP regularly',
          'Maintain healthy weight'
        ]
      },
      {
        condition: 'Digestive Issues',
        triggers: [
          ['stomach'],
          ['nausea'],
          ['diarrhea'],
          ['stomach', 'nausea']
        ],
        response: 'Digestive system concern. Chief Health Officer consultation recommended.',
        precautions: [
          'Eat light, easily digestible food',
          'Stay hydrated with clear fluids',
          'Avoid spicy and oily foods',
          'Rest and avoid stress'
        ]
      },
      {
        condition: 'General Fatigue',
        triggers: [
          ['fatigue'],
          ['body_ache'],
          ['headache'],
          ['fatigue', 'headache']
        ],
        response: 'General health concern detected. Chief Health Officer consultation recommended.',
        precautions: [
          'Ensure adequate sleep',
          'Maintain balanced diet',
          'Stay hydrated',
          'Gentle exercise as tolerated'
        ]
      },
      {
        condition: 'Skin Condition',
        triggers: [
          ['skin'],
          ['skin', 'fever'],
          ['skin', 'body_ache']
        ],
        response: 'Skin condition detected. Chief Health Officer evaluation recommended.',
        precautions: [
          'Keep affected area clean and dry',
          'Avoid scratching',
          'Use mild, unscented soap',
          'Wear loose, breathable clothing'
        ]
      }
    ]
  }
};

export const getCurrentUser = (): any => {
  const stored = localStorage.getItem('sukhayu_current_user');
  return stored ? JSON.parse(stored) : null;
};

export const setCurrentUser = (user: any) => {
  localStorage.setItem('sukhayu_current_user', JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem('sukhayu_current_user');
};

// Queue Management System
export const mockDoctorQueues: DoctorQueue[] = [
  {
    doctorId: 'CHO001',
    doctorName: 'Dr. अमित कुमार',
    doctorRole: 'cho',
    currentConsultation: undefined,
    averageConsultationTime: 15,
    queue: [
      {
        id: 'Q001',
        consultationId: 'C003',
        patientId: 'P003',
        patientName: 'मोहन गुप्ता',
        patientAge: 55,
        symptoms: ['cold', 'cough', 'sore throat'],
        severity: 'yellow',
        queueTime: '2024-09-25T09:30:00Z',
        estimatedWaitTime: 15,
        position: 1
      },
      {
        id: 'Q002',
        consultationId: 'C004',
        patientId: 'P004',
        patientName: 'प्रिया शर्मा',
        patientAge: 28,
        symptoms: ['headache', 'fever', 'fatigue'],
        severity: 'yellow',
        queueTime: '2024-09-25T09:45:00Z',
        estimatedWaitTime: 30,
        position: 2
      },
      {
        id: 'Q003',
        consultationId: 'C009',
        patientId: 'P002',
        patientName: 'सीता देवी',
        patientAge: 32,
        symptoms: ['mild fever', 'runny nose'],
        severity: 'yellow',
        queueTime: '2024-09-25T10:15:00Z',
        estimatedWaitTime: 45,
        position: 3
      },
      {
        id: 'Q010', 
        consultationId: 'C013',
        patientId: 'P007',
        patientName: 'अनिल वर्मा',
        patientAge: 40,
        symptoms: ['minor headache', 'mild fatigue'],
        severity: 'yellow',
        queueTime: '2024-09-25T10:30:00Z',
        estimatedWaitTime: 60,
        position: 4
      }
    ]
  },
  {
    doctorId: 'MO001',
    doctorName: 'Dr. सुनीता रानी',
    doctorRole: 'mo',
    currentConsultation: undefined,
    averageConsultationTime: 20,
    queue: [
      {
        id: 'Q004',
        consultationId: 'C005',
        patientId: 'P005',
        patientName: 'रमेश कुमार',
        patientAge: 62,
        symptoms: ['chest pain', 'dizziness', 'high blood pressure'],
        severity: 'orange',
        queueTime: '2024-09-25T09:20:00Z',
        estimatedWaitTime: 20,
        position: 1
      },
      {
        id: 'Q005',
        consultationId: 'C006',
        patientId: 'P006',
        patientName: 'सुनीता पटेल',
        patientAge: 35,
        symptoms: ['stomach pain', 'nausea', 'vomiting'],
        severity: 'orange',
        queueTime: '2024-09-25T09:40:00Z',
        estimatedWaitTime: 40,
        position: 2
      }
    ]
  },
  {
    doctorId: 'CD001',
    doctorName: 'Dr. राज गुप्ता',
    doctorRole: 'civil_doctor',
    currentConsultation: undefined,
    averageConsultationTime: 25,
    queue: [
      {
        id: 'Q007',
        consultationId: 'C010',
        patientId: 'P001',
        patientName: 'राम शर्मा',
        patientAge: 45,
        symptoms: ['persistent cough', 'chest discomfort'],
        severity: 'orange',
        queueTime: '2024-09-25T10:00:00Z',
        estimatedWaitTime: 25,
        position: 1
      },
      {
        id: 'Q011',
        consultationId: 'C014',
        patientId: 'P012',
        patientName: 'कमला देवी',
        patientAge: 58,
        symptoms: ['severe back pain', 'numbness in legs'],
        severity: 'orange',
        queueTime: '2024-09-25T10:15:00Z',
        estimatedWaitTime: 50,
        position: 2
      },
      {
        id: 'Q012',
        consultationId: 'C015',
        patientId: 'P013',
        patientName: 'विकास सिंह',
        patientAge: 33,
        symptoms: ['high fever', 'severe body ache', 'dehydration'],
        severity: 'orange',
        queueTime: '2024-09-25T10:30:00Z',
        estimatedWaitTime: 75,
        position: 3
      }
    ]
  },
  {
    doctorId: 'ED001',
    doctorName: 'Dr. नीरज सिंह',
    doctorRole: 'emergency_doctor',
    currentConsultation: undefined,
    averageConsultationTime: 30,
    queue: [
      // Emergency doctors handle emergency patients immediately - no queue for red severity cases
    ]
  }
];

// Helper functions for queue management
export const getQueueForDoctor = (doctorId: string): DoctorQueue | undefined => {
  const queue = mockDoctorQueues.find(queue => queue.doctorId === doctorId);
  if (!queue) return undefined;

  // Apply role-based filtering to ensure proper queue segregation
  const shouldReceiveCase = (severity: SeverityZone, doctorRole: string): boolean => {
    // Emergency/urgent patients (red severity) are never queued - they go directly to emergency doctors
    if (severity === 'red') return false;
    
    switch (doctorRole) {
      case 'cho':
        return severity === 'yellow'; // Only yellow zone patients
      case 'mo':
        return severity === 'orange'; // Only orange zone patients  
      case 'civil_doctor':
        return severity === 'orange'; // Only orange cases escalated from MO
      case 'emergency_doctor':
        return false; // Emergency doctors don't have queues - handle emergency cases immediately
      default:
        return true;
    }
  };

  // Filter queue items based on doctor role and exclude emergency cases
  const filteredQueue = queue.queue.filter(item => 
    shouldReceiveCase(item.severity, queue.doctorRole)
  );

  return {
    ...queue,
    queue: filteredQueue
  };
};

export const getPatientQueuePosition = (patientId: string): { queue: DoctorQueue | null; position: number } => {
  for (const queue of mockDoctorQueues) {
    const queueItem = queue.queue.find(item => item.patientId === patientId);
    if (queueItem) {
      return { queue, position: queueItem.position };
    }
  }
  return { queue: null, position: -1 };
};

export const getAllActiveQueues = (): DoctorQueue[] => {
  return mockDoctorQueues;
};

export const getPatientsBySeverity = (severity: SeverityZone): Patient[] => {
  const activeConsultations = mockConsultations.filter(
    consultation => consultation.severity === severity && consultation.status === 'pending'
  );
  return mockPatients.filter(patient => 
    activeConsultations.some(consultation => consultation.patientId === patient.patientId)
  );
};

// Get recommended doctor type based on severity
export const getRecommendedDoctorType = (severity: SeverityZone): UserRole => {
  switch (severity) {
    case 'yellow':
      return 'cho';
    case 'orange':
      return 'mo';
    case 'red':
      return 'emergency_doctor';
    default:
      return 'cho';
  }
};

// Queue statistics
export const getQueueStats = () => {
  // Only count non-emergency patients in queues
  const queuedPatients = mockDoctorQueues.reduce((sum, queue) => {
    const nonEmergencyQueue = queue.queue.filter(item => item.severity !== 'red');
    return sum + nonEmergencyQueue.length;
  }, 0);
  
  const patientsInConsultation = mockDoctorQueues.filter(queue => queue.currentConsultation).length;
  
  const severityCounts = {
    yellow: 0,
    orange: 0,
    red: 0 // Always 0 since red patients aren't queued
  };

  mockDoctorQueues.forEach(queue => {
    queue.queue.forEach(item => {
      // Only count non-emergency patients in queue stats
      if (item.severity !== 'red') {
        severityCounts[item.severity]++;
      }
    });
  });

  const nonEmergencyQueues = mockDoctorQueues.filter(queue => 
    queue.queue.some(item => item.severity !== 'red')
  );

  return {
    totalWaiting: queuedPatients,
    inConsultation: patientsInConsultation,
    severityCounts,
    averageWaitTime: nonEmergencyQueues.length > 0 ? 
      nonEmergencyQueues.reduce((sum, queue) => {
        const nonEmergencyItems = queue.queue.filter(item => item.severity !== 'red');
        const avgQueueWait = nonEmergencyItems.length > 0 ? 
          nonEmergencyItems.reduce((qSum, item) => qSum + item.estimatedWaitTime, 0) / nonEmergencyItems.length : 0;
        return sum + avgQueueWait;
      }, 0) / nonEmergencyQueues.length : 0
  };
};

