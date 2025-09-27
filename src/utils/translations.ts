import { Language } from '../types';

export const translations = {
  en: {
    // Common
    login: 'Login',
    logout: 'Logout',
    profile: 'Profile',
    back: 'Back',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    upload: 'Upload',
    download: 'Download',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    
    // Auth
    enterOtp: 'Enter OTP',
    otpSent: 'OTP sent to your phone',
    invalidOtp: 'Invalid OTP',
    patientId: 'Patient ID',
    ashaWorkerId: 'ASHA Worker ID',
    
    // Profile
    fullName: 'Full Name',
    age: 'Age',
    gender: 'Gender',
    
    // Queue & Status
    yourQueueStatus: 'Your Queue Status',
    hospitalStatus: 'Hospital Status',
    phone: 'Phone Number',
    uploadPhoto: 'Upload Profile Photo',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    
    // Homepage
    pastConsultations: 'Past Consultations',
    uploadExternal: 'Upload External Consultation',
    uploadConsultation: 'Upload Consultation',
    aiSymptomChecker: 'AI Symptom Checker',
    consultDoctor: 'Consult Doctor',
    emergency: 'Emergency',
    
    // Consultations
    doctorName: 'Doctor Name',
    designation: 'Designation',
    date: 'Date',
    prescription: 'Prescription',
    symptoms: 'Symptoms',
    diagnosis: 'Diagnosis',
    
    // Emergency
    emergencyWarning: 'This will immediately connect you to emergency services. Continue?',
    emergencyActivated: 'Emergency services notified. Help is on the way.',
    
    // Symptom Checker
    tellSymptoms: 'Tell me about your symptoms',
    askingQuestions: 'Let me ask you a few questions...',
    precautions: 'Precautions',
    recommendConsultation: 'I recommend consulting with',
    
    // Doctor types
    cho: 'Chief Health Officer',
    mo: 'Medical Officer',
    civil_doctor: 'Civil Hospital Doctor',
    emergency_doctor: 'Emergency Doctor',
    
    // Medicine
    needMedicines: 'Do you need medicines?',
    nearbyPharmacies: 'Nearby Pharmacies',
    available: 'Available',
    unavailable: 'Unavailable',
    notifyPharmacies: 'Notify nearby pharmacies',
    
    // Language
    language: 'Language',
    translate: 'Translate',
    ruralTelemedicine: 'Rural Telemedicine App',
    
    // Role Selection
    selectRole: 'Select your role to continue',
    patientAndAsha: 'Patient & ASHA',
    doctors: 'Doctors',
    specificRole: 'Select your specific role',
    patient: 'Patient',
    ashaWorker: 'ASHA Worker',
    bookConsultations: 'Book consultations and track health',
    helpPatients: 'Help patients with consultations',
    communityHealthOfficer: 'Chief Health Officer',
    medicalOfficer: 'Medical Officer',
    advancedConsultations: 'Advanced medical consultations',
    civilHospitalDoctor: 'Civil Hospital Doctor',
    hospitalConsultations: 'Hospital-based consultations',
    emergencyDoctor: 'Emergency Doctor',
    emergencyMedicalCare: 'Emergency medical care',
    pharmacist: 'Pharmacist',
    
    // ASHA Worker
    ashaDashboard: 'ASHA Dashboard',
    viewPatientSurvey: 'View Patient Survey',
    registerNewPatient: 'Register New Patient',
    helpPatientLogin: 'Help Patient Login',
    patientSurvey: 'Patient Survey',
    totalPatients: 'Total Patients',
    registeredPatients: 'Registered Patients',
    goodHealth: 'Good Health',
    activeCases: 'Active Cases',
    completedToday: 'Completed Today',
    emergencyCases: 'Emergency Cases',
    myArea: 'My Area',
    coverageArea: 'Coverage Area',
    recentActivity: 'Recent Activity',
    communityHealthTips: 'Community Health Tips',
    quickActions: 'Quick Actions',
    telemedicine: 'Telemedicine for Rural Healthcare',
    secure: 'Secure • HIPAA Compliant • Government Approved',
    userNotFound: 'User not found. Please check your ID.',
    
    // Status
    queuePosition: 'Queue Position',
    estimatedWait: 'Estimated Wait Time',
    minutes: 'minutes',
    yourStatus: 'Your Status',
    connecting: 'Connecting to Emergency Services',
    emergencyCall: 'Emergency Video Call',
    emergencyCountdown: 'Emergency services will be contacted in',
    cancelBeforeStart: 'Press cancel to stop',
    startingEmergencyCall: 'Starting emergency consultation...',
    seconds: 'seconds',
    
    // New features
    checkMedicineAvailability: 'Check Medicine Availability',
    addNewMedicine: 'Add New Medicine',
    liveChatWithDoctor: 'Live Chat with Doctor',
    videoCallConsent: 'Video Call Consent',
    videoCallConsentMessage: 'Starting video call. Please note: Network bandwidth may be lower, fallback system will be applied.',
    emergencyPatientAlert: 'Emergency Patient Alert',
    newEmergencyPatient: 'New Emergency Patient',
    hospitalQueue: 'Hospital Queue',
    currentlyInQueue: 'Currently in queue',
    patients: 'patients',
    sendMessage: 'Send Message',
    typeMessage: 'Type your message...',
    medicineName: 'Medicine Name',
    medicineAvailable: 'Medicine Available',
    medicineUnavailable: 'Medicine Unavailable',
    checkAvailability: 'Check Availability',
    noMedicinesFound: 'No medicines found',
    enterMedicineName: 'Enter medicine name',
    searchMedicine: 'Search Medicine',
    addMedicine: 'Add Medicine',
    quantity: 'Quantity',
    enterQuantity: 'Enter quantity',
    updateConsultation: 'Update Consultation',
    provideFeedback: 'Provide Feedback',
    
    // Patient Services
    patientServices: 'Patient Services',
    monsoonHealth: 'Monsoon Health',
    monsoonHealthTip: 'Ensure clean drinking water and prevent waterborne diseases.',
    vaccinationDrive: 'Vaccination Drive',
    vaccinationDriveTip: 'Remind families about upcoming vaccination schedules.',
    diabetesAwareness: 'Diabetes Awareness',
    diabetesAwarenessTip: 'Regular screening for diabetes in adults above 30 years.',
    
    // Recent Activity
    patientRegistered: 'Patient registered',
    consultationCompleted: 'Consultation completed',
    emergencyCaseReferred: 'Emergency case referred',
    hoursAgo: 'hours ago'
  },
  
  hi: {
    // Common
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    profile: 'प्रोफाइल',
    back: 'वापस',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    save: 'सेव करें',
    edit: 'संपादित करें',
    upload: 'अपलोड',
    download: 'डाउनलोड',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    warning: 'चेतावनी',
    
    // Auth
    enterOtp: 'OTP दर्ज करें',
    otpSent: 'आपके फोन पर OTP भेजा गया',
    invalidOtp: 'गलत OTP',
    patientId: 'मरीज़ ID',
    ashaWorkerId: 'आशा कार्यकर्ता ID',
    
    // Profile
    fullName: 'पूरा नाम',
    age: 'उम्र',
    gender: 'लिंग',
    phone: 'फोन नंबर',
    uploadPhoto: 'प्रोफाइल फोटो अपलोड करें',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    
    // Homepage
    pastConsultations: 'पिछली सलाह',
    uploadExternal: 'बाहरी सलाह अपलोड करें',
    uploadConsultation: 'सलाह अपलोड करें',
    aiSymptomChecker: 'AI लक्षण जांच',
    consultDoctor: 'डॉक्टर से सलाह लें',
    emergency: 'आपातकाल',
    
    // Consultations
    doctorName: 'डॉक्टर का नाम',
    designation: 'पदनाम',
    date: 'तारीख',
    prescription: 'नुस्खा',
    symptoms: 'लक्षण',
    diagnosis: 'निदान',
    
    // Emergency
    emergencyWarning: 'यह तुरंत आपको आपातकालीन सेवाओं से जोड़ देगा। जारी रखें?',
    emergencyActivated: 'आपातकालीन सेवाओं को सूचित कर दिया गया। मदद आ रही है।',
    
    // Symptom Checker
    tellSymptoms: 'अपने लक्षणों के बारे में बताएं',
    askingQuestions: 'मुझे कुछ सवाल पूछने दें...',
    precautions: 'सावधानियां',
    recommendConsultation: 'मैं सलाह देता हूं',
    
    // Doctor types
    cho: 'मुख्य स्वास्थ्य अधिकारी',
    mo: 'चिकित्सा अधिकारी',
    civil_doctor: 'सिविल अस्पताल डॉक्टर',
    emergency_doctor: 'आपातकालीन डॉक्टर',
    
    // Medicine
    needMedicines: 'क्या आपको दवाएं चाहिए?',
    nearbyPharmacies: 'नजदीकी दवा की दुकान',
    available: 'उपलब्ध',
    unavailable: 'अनुपलब्ध',
    notifyPharmacies: 'नजदीकी दवा की दुकानों को सूचित करें',
    
    // Language
    language: 'भाषा',
    translate: 'अनुवाद',
    
    // Role Selection
    selectRole: 'जारी रखने के लिए अपनी भूमिका चुनें',
    patientAndAsha: 'मरीज़ और आशा',
    doctors: 'डॉक्टर',
    specificRole: 'अपनी विशिष्ट भूमिका चुनें',
    patient: 'मरीज़',
    ashaWorker: 'आशा कार्यकर्ता',
    bookConsultations: 'सलाह बुक करें और स्वास्थ्य को ट्रैक करें',
    helpPatients: 'मरीजों को सलाह में मदद करें',
    communityHealthOfficer: 'सामुदायिक स्वास्थ्य अधिकारी',
    medicalOfficer: 'चिकित्सा अधिकारी',
    advancedConsultations: 'उन्नत चिकित्सा सलाह',
    civilHospitalDoctor: 'सिविल अस्पताल डॉक्टर',
    hospitalConsultations: 'अस्पताल आधारित सलाह',
    emergencyDoctor: 'आपातकालीन डॉक्टर',
    emergencyMedicalCare: 'आपातकालीन चिकित्सा देखभाल',
    pharmacist: 'फार्मासिस्ट',
    telemedicine: 'ग्रामीण स्वास्थ्य सेवा के लिए टेलीमेडिसिन',
    secure: 'सुरक्षित • HIPAA अनुपालित • सरकार द्वारा अनुमोदित',
    userNotFound: 'उपयोगकर्ता नहीं मिला। कृपया अपना ID जांचें।',
    
    // Status
    queuePosition: 'कतार की स्थिति',
    estimatedWait: 'अनुमानित प्रतीक्षा समय',
    minutes: 'मिनट',
    yourStatus: 'आपकी स्थिति',
    connecting: 'आपातकालीन सेवाओं से जुड़ रहे हैं',
    emergencyCall: 'आपातकालीन वीडियो कॉल',
    emergencyCountdown: 'आपातकालीन सेवाओं से संपर्क करने में',
    cancelBeforeStart: 'रोकने के लिए रद्द करें दबाएं',
    startingEmergencyCall: 'आपातकालीन परामर्श शुरू हो रहा है...',
    seconds: 'सेकंड',
    
    // New features
    checkMedicineAvailability: 'दवा की उपलब्धता जांचें',
    addNewMedicine: 'नई दवा जोड़ें',
    liveChatWithDoctor: 'डॉक्टर के साथ लाइव चैट',
    videoCallConsent: 'वीडियो कॉल सहमति',
    videoCallConsentMessage: 'वीडियो कॉल शुरू हो रही है। कृपया ध्यान दें: नेटवर्क बैंडविड्थ कम हो सकती है, फॉलबैक सिस्टम लागू होगा।',
    emergencyPatientAlert: 'आपातकालीन मरीज़ अलर्ट',
    newEmergencyPatient: 'नया आपातकालीन मरीज़',
    hospitalQueue: 'अस्पताल की कतार',
    currentlyInQueue: 'वर्तमान में कतार में',
    patients: 'मरीज़',
    sendMessage: 'संदेश भेजें',
    typeMessage: 'अपना संदेश टाइप करें...',
    medicineName: 'दवा का नाम',
    medicineAvailable: 'दवा उपलब्ध',
    medicineUnavailable: 'दवा अनुपलब्ध',
    checkAvailability: 'उपलब्धता जांचें',
    noMedicinesFound: 'कोई दवा नहीं मिली',
    enterMedicineName: 'दवा का नाम दर्ज करें',
    searchMedicine: 'दवा खोजें',
    addMedicine: 'दवा जोड़ें',
    quantity: 'मात्रा',
    enterQuantity: 'मात्रा दर्ज करें',
    updateConsultation: 'सलाह अपडेट करें',
    provideFeedback: 'फीडबैक दें',
    
    // ASHA Worker
    ashaDashboard: 'आशा डैशबोर्ड',
    viewPatientSurvey: 'मरीज़ सर्वेक्षण देखें',
    registerNewPatient: 'नया मरीज़ पंजीकृत करें',
    helpPatientLogin: 'मरीज़ लॉगिन में मदद करें',
    patientSurvey: 'मरीज़ सर्वेक्षण',
    totalPatients: 'कुल मरीज़',
    registeredPatients: 'पंजीकृत मरीज़',
    goodHealth: 'अच्छी सेहत',
    activeCases: 'सक्रिय मामले',
    completedToday: 'आज पूरे हुए',
    emergencyCases: 'आपातकालीन मामले',
    myArea: 'मेरा क्षेत्र',
    coverageArea: 'कवरेज एरिया',
    recentActivity: 'हाल की गतिविधि',
    communityHealthTips: 'सामुदायिक स्वास्थ्य सुझाव',
    quickActions: 'त्वरित कार्य',
    patientServices: 'मरीज़ सेवाएं',
    monsoonHealth: 'मानसून स्वास्थ्य',
    monsoonHealthTip: 'स्वच्छ पीने का पानी सुनिश्चित करें और जल जनित बीमारियों से बचें।',
    vaccinationDrive: 'टीकाकरण अभियान',
    vaccinationDriveTip: 'परिवारों को आगामी टीकाकरण कार्यक्रम की याद दिलाएं।',
    diabetesAwareness: 'मधुमेह जागरूकता',
    diabetesAwarenessTip: '30 वर्ष से अधिक उम्र के वयस्कों में मधुमेह की नियमित जांच।',
    
    // Recent Activity
    patientRegistered: 'मरीज़ पंजीकृत',
    consultationCompleted: 'सलाह पूरी हुई',
    emergencyCaseReferred: 'आपातकालीन मामला भेजा गया',
    hoursAgo: 'घंटे पहले'
  },
  
  mr: {
    // Common
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    profile: 'प्रोफाइल',
    back: 'मागे',
    cancel: 'रद्द करा',
    confirm: 'पुष्टी करा',
    save: 'सेव्ह करा',
    edit: 'संपादित करा',
    upload: 'अपलोड',
    download: 'डाउनलोड',
    loading: 'लोड होत आहे...',
    error: 'त्रुटी',
    success: 'यश',
    warning: 'चेतावणी',
    
    // Auth
    enterOtp: 'OTP टाका',
    otpSent: 'तुमच्या फोनवर OTP पाठवला',
    invalidOtp: 'चुकीचा OTP',
    patientId: 'रुग्ण ID',
    ashaWorkerId: 'आशा कार्यकर्ता ID',
    
    // Profile
    fullName: 'पूर्ण नाव',
    age: 'वय',
    gender: 'लिंग',
    phone: 'फोन नंबर',
    uploadPhoto: 'प्रोफाइल फोटो अपलोड करा',
    male: 'पुरुष',
    female: 'महिला',
    other: 'इतर',
    
    // Homepage
    pastConsultations: 'मागील सल्लामसलत',
    uploadExternal: 'बाह्य सल्लामसलत अपलोड करा',
    uploadConsultation: 'सल्लामसलत अपलोड करा',
    aiSymptomChecker: 'AI लक्षण तपासणी',
    consultDoctor: 'डॉक्टरांचा सल्ला घ्या',
    emergency: 'आणीबाणी',
    
    // Consultations
    doctorName: 'डॉक्टरांचे नाव',
    designation: 'पदनाम',
    date: 'तारीख',
    prescription: 'प्रिस्क्रिप्शन',
    symptoms: 'लक्षणे',
    diagnosis: 'निदान',
    
    // Emergency
    emergencyWarning: 'हे तुम्हाला लगेच आणीबाणी सेवांशी जोडेल. सुरू ठेवा?',
    emergencyActivated: 'आणीबाणी सेवांना कळवले. मदत येत आहे.',
    
    // Symptom Checker
    tellSymptoms: 'तुमच्या लक्षणांबद्दल सांगा',
    askingQuestions: 'मला काही प्रश्न विचारू द्या...',
    precautions: 'खबरदारी',
    recommendConsultation: 'मी सल्ला देतो',
    
    // Doctor types
    cho: 'मुख्य आरोग्य अधिकारी',
    mo: 'वैद्यकीय अधिकारी',
    civil_doctor: 'सिव्हिल हॉस्पिटल डॉक्टर',
    emergency_doctor: 'आणीबाणी डॉक्टर',
    
    // Medicine
    needMedicines: 'तुम्हाला औषधे हवीत का?',
    nearbyPharmacies: 'जवळची औषधालये',
    available: 'उपलब्ध',
    unavailable: 'अनुपलब्ध',
    notifyPharmacies: 'जवळच्या औषधालयांना कळवा',
    
    // Language
    language: 'भाषा',
    translate: 'भाषांतर',
    
    // Role Selection
    selectRole: 'सुरू ठेवण्यासाठी तुमची भूमिका निवडा',
    patientAndAsha: 'रुग्ण आणि आशा',
    doctors: 'डॉक्टर',
    specificRole: 'तुमची विशिष्ट भूमिका निवडा',
    patient: 'रुग्ण',
    ashaWorker: 'आशा कार्यकर्ता',
    bookConsultations: 'सल्लामसलत बुक करा आणि आरोग्य ट्रॅक करा',
    helpPatients: 'रुग्णांना सल्लामसलतीत मदत करा',
    communityHealthOfficer: 'सामुदायिक आरोग्य अधिकारी',
    medicalOfficer: 'वैद्यकीय अधिकारी',
    advancedConsultations: 'प्रगत वैद्यकीय सल्लामसलत',
    civilHospitalDoctor: 'सिव्हिल हॉस्पिटल डॉक्टर',
    hospitalConsultations: 'हॉस्पिटल आधारित सल्लामसलत',
    emergencyDoctor: 'आणीबाणी डॉक्टर',
    emergencyMedicalCare: 'आणीबाणी वैद्यकीय काळजी',
    pharmacist: 'फार्मासिस्ट',
    telemedicine: 'ग्रामीण आरोग्य सेवेसाठी टेलीमेडिसिन',
    secure: 'सुरक्षित • HIPAA अनुपालन • सरकार मान्यताप्राप्त',
    userNotFound: 'वापरकर्ता सापडला नाही. कृपया तुमचा ID तपासा.',
    
    // Status
    queuePosition: 'रांगेतील स्थान',
    estimatedWait: 'अंदाजित प्रतीक्षा वेळ',
    minutes: 'मिनिटे',
    yourStatus: 'तुमची स्थिती',
    connecting: 'आणीबाणी सेवांशी कनेक्ट होत आहे',
    emergencyCall: 'आणीबाणी व्हिडिओ कॉल',
    emergencyCountdown: 'आणीबाणी सेवांशी संपर्क करण्यात',
    cancelBeforeStart: 'थांबवण्यासाठी रद्द करा दाबा',
    startingEmergencyCall: 'आणीबाणी सल्लामसलत सुरू होत आहे...',
    seconds: 'सेकंद',
    
    // New features
    checkMedicineAvailability: 'औषध उपलब्धता तपासा',
    addNewMedicine: 'नवीन औषध जोडा',
    liveChatWithDoctor: 'डॉक्टरांसोबत लाइव्ह चॅट',
    videoCallConsent: 'व्हिडिओ कॉल संमती',
    videoCallConsentMessage: 'व्हिडिओ कॉल सुरू होत आहे. कृपया लक्षात घ्या: नेटवर्क बॅंडविड्थ कमी असू शकते, फॉलबॅक सिस्टम लागू होईल.',
    emergencyPatientAlert: 'आणीबाणी रुग्ण अलर्ट',
    newEmergencyPatient: 'नवीन आणीबाणी रुग्ण',
    hospitalQueue: 'हॉस्पिटलची रांग',
    currentlyInQueue: 'सध्या रांगेत',
    patients: 'रुग्ण',
    sendMessage: 'संदेश पाठवा',
    typeMessage: 'तुमचा संदेश टाइप करा...',
    medicineName: 'औषधाचे नाव',
    medicineAvailable: 'औषध उपलब्ध',
    medicineUnavailable: 'औषध अनुपलब्ध',
    checkAvailability: 'उपलब्धता तपासा',
    noMedicinesFound: 'कोणतीही औषधे सापडली नाहीत',
    enterMedicineName: 'औषधाचे नाव प्रविष्ट करा',
    searchMedicine: 'औषध शोधा',
    addMedicine: 'औषध जोडा',
    quantity: 'प्रमाण',
    enterQuantity: 'प्रमाण प्रविष्ट करा',
    updateConsultation: 'सल्लामसलत अपडेट करा',
    provideFeedback: 'अभिप्राय द्या',
    
    // ASHA Worker - Additional translations
    ashaDashboard: 'आशा डॅशबोर्ड',
    viewPatientSurvey: 'रुग्ण सर्वेक्षण पहा',
    registerNewPatient: 'नवीन रुग्ण नोंदणी करा',
    helpPatientLogin: 'रुग्ण लॉगिनमध्ये मदत करा',
    patientServices: 'रुग्ण सेवा',
    monsoonHealth: 'पावसाळी आरोग्य',
    monsoonHealthTip: 'स्वच्छ पिण्याचे पाणी सुनिश्चित करा आणि पाण्यातून होणारे आजार टाळा.',
    vaccinationDrive: 'लसीकरण मोहीम',
    vaccinationDriveTip: 'कुटुंबांना आगामी लसीकरण वेळापत्रकाची आठवण करून द्या.',
    diabetesAwareness: 'मधुमेह चेतना',
    diabetesAwarenessTip: '30 वर्षांपेक्षा जास्त वयाच्या प्रौढांमध्ये मधुमेहाची नियमित तपासणी.',
    
    // Recent Activity
    patientRegistered: 'रुग्ण नोंदणीकृत',
    consultationCompleted: 'सल्लामसलत पूर्ण',
    emergencyCaseReferred: 'आणीबाणी प्रकरण पाठवले',
    hoursAgo: 'तासांपूर्वी'
  },
  
  pa: {
    // Common
    login: 'ਲਾਗਇਨ',
    logout: 'ਲਾਗਆਊਟ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    back: 'ਵਾਪਸ',
    cancel: 'ਰੱਦ ਕਰੋ',
    confirm: 'ਪੁਸ਼ਟੀ ਕਰੋ',
    save: 'ਸੇਵ ਕਰੋ',
    edit: 'ਸੰਪਾਦਿਤ ਕਰੋ',
    upload: 'ਅੱਪਲੋਡ',
    download: 'ਡਾਉਨਲੋਡ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    error: 'ਗਲਤੀ',
    success: 'ਸਫਲਤਾ',
    warning: 'ਚੇਤਾਵਨੀ',
    
    // Auth
    enterOtp: 'OTP ਦਾਖਲ ਕਰੋ',
    otpSent: 'ਤੁਹਾਡੇ ਫੋਨ ਤੇ OTP ਭੇਜਿਆ ਗਿਆ',
    invalidOtp: 'ਗਲਤ OTP',
    patientId: 'ਮਰੀਜ਼ ID',
    ashaWorkerId: 'ਆਸ਼ਾ ਵਰਕਰ ID',
    
    // Profile
    fullName: 'ਪੂਰਾ ਨਾਮ',
    age: 'ਉਮਰ',
    gender: 'ਲਿੰਗ',
    phone: 'ਫੋਨ ���ੰਬਰ',
    uploadPhoto: 'ਪ੍ਰੋਫਾਈਲ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
    male: 'ਮਰਦ',
    female: 'ਔਰਤ',
    other: 'ਹੋਰ',
    
    // Homepage
    pastConsultations: 'ਪਿਛਲੀਆਂ ਸਲਾਹਾਂ',
    uploadExternal: 'ਬਾਹਰੀ ਸਲਾਹ ਅੱਪਲੋਡ ��ਰੋ',
    uploadConsultation: 'ਸਲਾਹ ਅੱਪਲੋਡ ਕਰੋ',
    aiSymptomChecker: 'AI ਲੱਛਣ ਜਾਂਚ',
    consultDoctor: 'ਡਾਕਟਰ ਨਾਲ ਸਲਾਹ ਲਓ',
    emergency: 'ਐਮਰਜੈਂਸੀ',
    
    // Consultations
    doctorName: 'ਡਾਕਟਰ ਦਾ ਨਾਮ',
    designation: 'ਅਹੁਦਾ',
    date: 'ਤਾਰੀਖ',
    prescription: 'ਨੁਸਖਾ',
    symptoms: 'ਲੱਛਣ',
    diagnosis: 'ਨਿਦਾਨ',
    
    // Emergency
    emergencyWarning: 'ਇਹ ਤੁਹਾਨੂੰ ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਜੋੜੇਗਾ। ਜਾਰੀ ਰੱਖੋ?',
    emergencyActivated: 'ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨੂੰ ਸੂਚਿਤ ਕੀਤਾ ਗਿਆ। ਮਦਦ ਆ ਰਹੀ ਹੈ।',
    
    // Symptom Checker
    tellSymptoms: 'ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਦੱਸੋ',
    askingQuestions: 'ਮੈਨੂੰ ਕੁਝ ਸਵਾਲ ਪੁੱਛਣ ਦਿਓ...',
    precautions: 'ਸਾਵਧਾਨੀਆਂ',
    recommendConsultation: 'ਮੈਂ ਸਲਾਹ ਦਿੰਦਾ ਹਾਂ',
    
    // Doctor types
    cho: 'ਮੁੱਖ ਸਿਹਤ ਅਫਸਰ',
    mo: 'ਮੈਡੀਕਲ ਅਫਸਰ',
    civil_doctor: 'ਸਿਵਲ ਹਸਪਤਾਲ ਡਾਕਟਰ',
    emergency_doctor: 'ਐਮਰਜੈਂਸੀ ਡਾਕਟਰ',
    
    // Medicine
    needMedicines: 'ਕੀ ਤੁਹਾਨੂੰ ਦਵਾਈਆਂ ਚਾਹੀਦੀਆਂ ਹਨ?',
    nearbyPharmacies: 'ਨੇੜਲੀਆਂ ਦਵਾਈ ਦੀਆਂ ਦੁਕਾਨਾਂ',
    available: 'ਉਪਲਬਧ',
    unavailable: 'ਅਣਉਪਲਬਧ',
    notifyPharmacies: 'ਨੇੜਲੀਆਂ ਦਵਾਈ ਦੀਆਂ ਦੁਕਾਨਾਂ ਨੂੰ ਸੂਚਿਤ ਕਰੋ',
    
    // Language
    language: 'ਭਾਸ਼ਾ',
    translate: 'ਅਨੁਵਾਦ',
    
    // Role Selection
    selectRole: 'ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ',
    patientAndAsha: 'ਮਰੀਜ਼ ਅਤੇ ਆਸ਼ਾ',
    doctors: 'ਡਾਕਟਰ',
    specificRole: 'ਆਪਣੀ ਖਾਸ ਭੂਮਿਕਾ ਚੁਣੋ',
    patient: 'ਮਰੀਜ਼',
    ashaWorker: 'ਆਸ਼ਾ ਵਰਕਰ',
    bookConsultations: 'ਸਲਾਹ ਬੁੱਕ ਕਰੋ ਅਤੇ ਸਿਹਤ ਨੂੰ ਟਰੈਕ ਕਰੋ',
    helpPatients: 'ਮਰੀਜ਼ਾਂ ਦੀ ਸਲਾਹ ਵਿੱਚ ਮਦਦ ਕਰੋ',
    communityHealthOfficer: 'ਕਮਿਊਨਿਟੀ ਹੈਲਥ ਅਫਸਰ',
    medicalOfficer: 'ਮੈਡੀਕਲ ਅਫਸਰ',
    advancedConsultations: 'ਉੱਨਤ ਮੈਡੀਕਲ ਸਲਾਹ',
    civilHospitalDoctor: 'ਸਿਵਲ ਹਸਪਤਾਲ ਡਾਕਟਰ',
    hospitalConsultations: 'ਹਸਪਤਾਲ ਅਧਾਰਿਤ ਸਲਾਹ',
    emergencyDoctor: 'ਐਮਰਜੈਂਸੀ ਡਾਕਟਰ',
    emergencyMedicalCare: 'ਐਮਰਜੈਂਸੀ ਮੈਡੀਕਲ ਦੇਖਭਾਲ',
    pharmacist: 'ਫਾਰਮਾਸਿਸਟ',
    telemedicine: 'ਪੇਂਡੂ ਸਿਹਤ ਸੇਵਾ ਲਈ ਟੈਲੀਮੈਡੀਸਿਨ',
    secure: 'ਸੁਰੱਖਿਅਤ • HIPAA ਅਨੁਪਾਲਨ • ਸਰਕਾਰ ਮਨਜ਼ੂਰ',
    userNotFound: 'ਯੂਜ਼ਰ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ID ਚੈੱਕ ਕਰੋ।',
    
    // Status
    queuePosition: 'ਕਤਾਰ ਦੀ ਸਥਿਤੀ',
    estimatedWait: 'ਅਨੁਮਾਨਿਤ ਉਡੀਕ ਸਮਾਂ',
    minutes: 'ਮਿੰਟ',
    yourStatus: 'ਤੁਹਾਡੀ ਸਥਿਤੀ',
    connecting: 'ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਜੁੜ ਰਹੇ ਹਾਂ',
    emergencyCall: 'ਐਮਰਜੈਂਸੀ ਵੀਡੀਓ ਕਾਲ',
    emergencyCountdown: 'ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰਨ ਵਿੱਚ',
    cancelBeforeStart: 'ਰੋਕਣ ਲਈ ਰੱਦ ਕਰੋ ਦਬਾਓ',
    startingEmergencyCall: 'ਐਮਰਜੈਂਸੀ ਸਲਾਹ ਸ਼ੁਰੂ ਹੋ ਰਹੀ ਹੈ...',
    seconds: 'ਸਕਿੰਟ',
    
    // New features
    checkMedicineAvailability: 'ਦਵਾਈ ਦੀ ਉਪਲਬਧਤਾ ਦੇਖੋ',
    addNewMedicine: 'ਨਵੀਂ ਦਵਾਈ ਜੋੜੋ',
    liveChatWithDoctor: 'ਡਾਕਟਰ ਨਾਲ ਲਾਈਵ ਚੈਟ',
    videoCallConsent: 'ਵੀਡੀਓ ਕਾਲ ਸਹਿਮਤੀ',
    videoCallConsentMessage: 'ਵੀਡੀਓ ਕਾਲ ਸ਼ੁਰੂ ਹੋ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਨੋਟ ਕਰੋ: ਨੈੱਟਵਰਕ ਬੈਂਡਵਿਡਥ ਘੱਟ ਹੋ ਸਕਦੀ ਹੈ, ਫਾਲਬੈਕ ਸਿਸਟਮ ਲਾਗੂ ਹੋਵੇਗਾ।',
    emergencyPatientAlert: 'ਐਮਰਜੈਂਸੀ ਮਰੀਜ਼ ਅਲਰਟ',
    newEmergencyPatient: 'ਨਵਾਂ ਐਮਰਜੈਂਸੀ ਮਰੀਜ਼',
    hospitalQueue: 'ਹਸਪਤਾਲ ਦੀ ਕਤਾਰ',
    currentlyInQueue: 'ਫਿਲਹਾਲ ਕਤਾਰ ਵਿੱਚ',
    patients: 'ਮਰੀਜ਼',
    sendMessage: 'ਮੈਸੇਜ ਭੇਜੋ',
    typeMessage: 'ਆਪਣਾ ਮੈਸੇ��� ਟਾਈਪ ਕਰੋ...',
    medicineName: 'ਦਵਾਈ ਦਾ ਨਾਮ',
    medicineAvailable: 'ਦਵਾਈ ਉਪਲਬਧ',
    medicineUnavailable: 'ਦਵਾਈ ਅਣਉਪਲਬਧ',
    checkAvailability: 'ਉਪਲਬਧਤਾ ਜਾਂਚੋ',
    noMedicinesFound: 'ਕੋਈ ਦਵਾਈਆਂ ਨਹੀਂ ਮਿਲ���ਆਂ',
    enterMedicineName: 'ਦਵਾਈ ਦਾ ਨਾਮ ਦਾਖਲ ਕਰੋ',
    searchMedicine: 'ਦਵਾਈ ਖੋਜੋ',
    addMedicine: 'ਦਵਾਈ ਜੋੜੋ',
    quantity: 'ਮਾਤਰਾ',
    enterQuantity: 'ਮਾਤਰਾ ਦਾਖਲ ਕਰੋ',
    updateConsultation: 'ਸਲਾਹ ਅਪਡੇਟ ਕਰੋ',
    provideFeedback: 'ਫੀਡਬੈਕ ਦਿਓ',
    
    // ASHA Worker - Additional translations
    ashaDashboard: 'ਆਸ਼ਾ ਡੈਸ਼ਬੋਰਡ',
    viewPatientSurvey: 'ਮਰੀਜ਼ ਸਰਵੇਖਣ ਵੇਖੋ',
    registerNewPatient: 'ਨਵਾਂ ਮਰੀਜ਼ ਰਜਿਸਟਰ ਕਰੋ',
    helpPatientLogin: 'ਮਰੀਜ਼ ਲਾਗਇਨ ਵਿੱਚ ਮਦਦ ਕਰੋ',
    patientServices: 'ਮਰੀਜ਼ ਸੇਵਾਵਾਂ',
    monsoonHealth: 'ਮਾਨਸੂਨ ਸਿਹਤ',
    monsoonHealthTip: 'ਸਾਫ਼ ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਸੁਨਿਸ਼ਚਿਤ ਕਰੋ ਅਤੇ ਪਾਣੀ ਰਾਹੀਂ ਹੋਣ ਵਾਲੀਆਂ ਬਿਮਾਰੀਆਂ ਤੋਂ ਬਚਾਓ।',
    vaccinationDrive: 'ਟੀਕਾਕਰਣ ਮੁਹਿੰਮ',
    vaccinationDriveTip: 'ਪਰਿਵਾਰਾਂ ਨੂੰ ਆਉਣ ਵਾਲੇ ਟੀਕਾਕਰਣ ਸਮਾਂ-ਸਾਰਣੀ ਬਾਰੇ ਯਾਦ ਦਿਵਾਓ।',
    diabetesAwareness: 'ਸ਼ੂਗਰ ਜਾਗਰੂਕਤਾ',
    diabetesAwarenessTip: '30 ਸਾਲ ਤੋਂ ਉੱਪਰ ਦੇ ਬਾਲਗਾਂ ਵਿੱਚ ਸ਼ੂਗਰ ਦੀ ਨਿਯਮਿਤ ਜਾਂਚ।',
    
    // Recent Activity
    patientRegistered: 'ਮਰੀਜ਼ ਰਜਿਸਟਰ ਹੋਇਆ',
    consultationCompleted: 'ਸਲਾਹ ਪੂਰੀ ਹੋਈ',
    emergencyCaseReferred: 'ਐਮਰਜੈਂਸੀ ਕੇਸ ਭੇਜਿਆ ਗਿਆ',
    hoursAgo: 'ਘੰਟੇ ਪਹਿਲਾਂ'
  }
};

export const getTranslation = (key: string, language: Language = 'en'): string => {
  const langTranslations = translations[language];
  return langTranslations?.[key as keyof typeof langTranslations] || translations.en[key as keyof typeof translations.en] || key;
};