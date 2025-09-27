import React, { useState, useEffect, useRef } from 'react';
import { Patient, ASHAWorker, Language, SeverityZone } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { VoiceInput } from '../ui/voice-input';
import { VoiceReader } from '../ui/voice-reader';
import { ArrowLeft, Send, Bot, AlertTriangle, Info, AlertCircle, Camera, Upload } from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { symptomCheckerData } from '../../utils/mockData';

interface SymptomCheckerProps {
  user: Patient | ASHAWorker;
  language: Language;
  onBack: () => void;
  onAnalysisComplete?: (result: AnalysisResult, symptoms: string) => void;
  showConsultationOption?: boolean;
}

interface ChatMessage {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AnalysisResult {
  condition: string;
  severity: SeverityZone;
  response: string;
  doctorType: string;
  recommendations: string[];
  emergencyWarning?: string;
}

export function SymptomChecker({ user, language, onBack, onAnalysisComplete, showConsultationOption = true }: SymptomCheckerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [currentQuestions, setCurrentQuestions] = useState<Array<{question: Record<Language, string>, options?: Record<Language, string[]>}>>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic question database based on symptoms
  const getQuestionsForSymptoms = (symptoms: string): Array<{question: Record<Language, string>, options?: Record<Language, string[]>}> => {
    const symptomLower = symptoms.toLowerCase();
    const baseQuestions = [
      {
        question: {
          hi: 'आपके मुख्य लक्षण क्या हैं? कृपया विस्तार से बताएं।',
          mr: 'तुमची मुख्य लक्षणे काय आहेत? कृपया तपशीलवार सांगा.',
          pa: 'ਤੁਹਾਡੇ ਮੁੱਖ ਲੱਛਣ ਕੀ ਹਨ? ਕਿਰਪਾ ਕਰਕੇ ਵਿਸਤਾਰ ਨਾਲ ਦੱਸੋ।',
          en: 'What are your main symptoms? Please describe in detail.'
        }
      }
    ];

    const questions: Array<{question: Record<Language, string>, options?: Record<Language, string[]>}> = [...baseQuestions];

    // Add specific questions based on symptoms mentioned
    if (symptomLower.includes('fever') || symptomLower.includes('बुखार') || symptomLower.includes('ताप') || symptomLower.includes('ਬੁਖ਼ਾਰ')) {
      questions.push({
        question: {
          hi: 'बुखार कितना है? क्या साथ में ठंड लग रही है?',
          mr: 'ताप किती आहे? सोबत थंडी वाजते का?',
          pa: 'ਬੁਖ਼ਾਰ ਕਿੰਨਾ ਹੈ? ਕੀ ਨਾਲ ਠੰਡ ਵੀ ਲਗਦੀ ਹੈ?',
          en: 'How high is the fever? Do you also have chills?'
        },
        options: {
          hi: ['हल्का बुखार (99-100°F)', 'मध्यम बुखार (100-102°F)', 'तेज बुखार (102°F+)', 'ठंड के साथ बुखार'],
          mr: ['हलका ताप (99-100°F)', 'मध्यम ताप (100-102°F)', 'जास्त ताप (102°F+)', 'थंडीसह ताप'],
          pa: ['ਹਲਕਾ ਬੁਖ਼ਾਰ (99-100°F)', 'ਦਰਮਿਆਨਾ ਬੁਖ਼ਾਰ (100-102°F)', 'ਤੇਜ਼ ਬੁਖ਼ਾਰ (102°F+)', 'ਠੰਡ ਦੇ ਨਾਲ ਬੁਖ਼ਾਰ'],
          en: ['Mild fever (99-100°F)', 'Moderate fever (100-102°F)', 'High fever (102°F+)', 'Fever with chills']
        }
      });
    }

    if (symptomLower.includes('pain') || symptomLower.includes('दर्द') || symptomLower.includes('दुखणे') || symptomLower.includes('ਦਰਦ')) {
      questions.push({
        question: {
          hi: 'दर्द कहाँ है और कितना तेज है? (1-10 पैमाने पर)',
          mr: 'दुखणे कुठे आहे आणि किती तीव्र आहे? (1-10 स्केलवर)',
          pa: 'ਦਰਦ ਕਿੱਥੇ ਹੈ ਅਤੇ ਕਿੰਨਾ ਤੇਜ਼ ਹੈ? (1-10 ਪੈਮਾਨੇ ਤੇ)',
          en: 'Where is the pain and how severe is it? (Scale 1-10)'
        },
        options: {
          hi: ['हल्का दर्द (1-3)', 'मध्यम दर्द (4-6)', 'तेज दर्द (7-8)', 'असहनीय दर्द (9-10)'],
          mr: ['हलके दुखणे (1-3)', 'मध्यम दुखणे (4-6)', 'तीव्र दुखणे (7-8)', 'असह्य दुखणे (9-10)'],
          pa: ['ਹਲਕਾ ਦਰਦ (1-3)', 'ਦਰਮਿਆਨਾ ਦਰਦ (4-6)', 'ਤੇਜ਼ ਦਰਦ (7-8)', 'ਅਸਹਿਣਯੋਗ ਦਰਦ (9-10)'],
          en: ['Mild pain (1-3)', 'Moderate pain (4-6)', 'Severe pain (7-8)', 'Unbearable pain (9-10)']
        }
      });
    }

    if (symptomLower.includes('breathing') || symptomLower.includes('सांस') || symptomLower.includes('श्वास') || symptomLower.includes('ਸਾਹ')) {
      questions.push({
        question: {
          hi: 'सांस लेने में कितनी परेशानी है? क्या आराम में भी सांस फूलती है?',
          mr: 'श्वास घेण्यात किती अडचण येते? विश्रांतीत सुद्धा श्वास लागते का?',
          pa: 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਕਿੰਨੀ ਮੁਸ਼ਕਲ ਹੈ? ਕੀ ਆਰਾਮ ਵਿੱਚ ਵੀ ਸਾਹ ਫੁੱਲਦਾ ਹੈ?',
          en: 'How much difficulty do you have breathing? Are you short of breath even at rest?'
        },
        options: {
          hi: ['केवल दौड़ने पर सांस फूलना', 'चलने पर सांस फूलना', 'हल्की गतिविधि पर सांस फूलना', 'आराम में भी सांस फूलना'],
          mr: ['फक्त धावताना श्वास लागणे', 'चालताना श्वास लागणे', 'हलक्या हालचालीवर श्वास लागणे', 'विश्रांतीत सुद्धा श्वास लागणे'],
          pa: ['ਕੇਵਲ ਦੌੜਨ ਤੇ ਸਾਹ ਫੁੱਲਣਾ', 'ਚਲਣ ਤੇ ਸਾਹ ਫੁੱਲਣਾ', 'ਹਲਕੀ ਗਤੀਵਿਧੀ ਤੇ ਸਾਹ ਫੁੱਲਣਾ', 'ਆਰਾਮ ਵਿੱਚ ਵੀ ਸਾਹ ਫੁੱਲਣਾ'],
          en: ['Only during running', 'While walking', 'With mild activity', 'Even at rest']
        }
      });
    }

    // Duration question
    questions.push({
      question: {
        hi: 'ये लक्षण कब से हैं? कैसे शुरू हुए?',
        mr: 'ही लक्षणे कधी पासून आहेत? कसे सुरू झाले?',
        pa: 'ਇਹ ਲੱਛਣ ਕਦੋਂ ਤੋਂ ਹਨ? ਕਿਵੇਂ ਸ਼ੁਰੂ ਹੋਏ?',
        en: 'How long have you had these symptoms? How did they start?'
      },
      options: {
        hi: ['कुछ घंटे पहले अचानक', 'पिछले 1-2 दिन से', 'पिछले हफ्ते से', 'कई हफ्तों से'],
        mr: ['काही तास पूर्वी अचानक', 'गेल्या 1-2 दिवसांपासून', 'गेल्या आठवड्यापासून', 'अनेक आठवड्यांपासून'],
        pa: ['ਕੁਝ ਘੰਟੇ ਪਹਿਲਾਂ ਅਚਾਨਕ', 'ਪਿਛਲੇ 1-2 ਦਿਨਾਂ ਤੋਂ', 'ਪਿਛਲੇ ਹਫ਼ਤੇ ਤੋਂ', 'ਕਈ ਹਫ਼ਤਿਆਂ ਤੋਂ'],
        en: ['Suddenly few hours ago', 'Past 1-2 days', 'Past week', 'Several weeks']
      }
    });

    // Associated symptoms
    questions.push({
      question: {
        hi: 'कोई और लक्षण भी हैं? जैसे उल्टी, चक्कर, कमजोरी?',
        mr: 'इतर काही लक्षणे आहेत का? जसे उलटी, चक्कर, अशक्तपणा?',
        pa: 'ਕੋਈ ਹੋਰ ਲੱਛਣ ਵੀ ਹਨ? ਜਿਵੇਂ ਉਲਟੀ, ਚੱਕਰ, ਕਮਜ਼ੋਰੀ?',
        en: 'Any other symptoms? Like vomiting, dizziness, weakness?'
      },
      options: {
        hi: ['नहीं, बस मुख्य लक्षण', 'हल्की कमजोरी', 'उल्टी या जी मिचलाना', 'चक्कर आना', 'तेज कमजोरी'],
        mr: ['नाही, फक्त मुख्य लक्षणे', 'हलकी अशक्तता', 'उलटी किंवा मळमळ', 'चक्कर येणे', 'तीव्र अशक्तता'],
        pa: ['ਨਹੀਂ, ਬਸ ਮੁੱਖ ਲੱਛਣ', 'ਹਲਕੀ ਕਮਜ਼ੋਰੀ', 'ਉਲਟੀ ਜਾਂ ਜੀ ਮਿਚਲਾਉਣਾ', 'ਚੱਕਰ ਆਉਣਾ', 'ਤੇਜ਼ ਕਮਜ਼ੋਰੀ'],
        en: ['No, just main symptoms', 'Mild weakness', 'Vomiting or nausea', 'Dizziness', 'Severe weakness']
      }
    });

    return questions.slice(0, 6); // Limit to 6 questions max
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start conversation
    if (messages.length === 0) {
      const initialMessage = {
        type: 'bot' as const,
        content: language === 'hi' ? 'नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। मैं आपके लक्षणों की जांच करके उचित सलाह दूंगा।' :
                 language === 'mr' ? 'नमस्कार! मी तुमचा AI आरोग्य सहायक आहे. मी तुमच्या लक्षणांची तपासणी करून योग्य सल्ला देईन.' :
                 language === 'pa' ? 'ਨਮਸਤੇ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਕਰਕੇ ਸਹੀ ਸਲਾਹ ਦਿਆਂਗਾ।' :
                 'Hello! I\'m your AI health assistant. I\'ll analyze your symptoms and provide appropriate guidance.',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      
      // Initialize with first question
      setTimeout(() => {
        const firstQuestions = getQuestionsForSymptoms('');
        setCurrentQuestions(firstQuestions);
        const firstQuestion = {
          type: 'bot' as const,
          content: firstQuestions[0].question[language],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, firstQuestion]);
      }, 1000);
    }
  }, [language]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 3 - uploadedImages.length);
      setUploadedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() && uploadedImages.length === 0) return;

    // Add user message
    const userMessage: ChatMessage = {
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Store the answer
    const userAnswers = [...selectedOptions, currentInput];
    setSelectedOptions(userAnswers);
    
    setCurrentInput('');
    setIsAnalyzing(true);

    // Clear uploaded images after sending
    setUploadedImages([]);

    // Simulate AI processing
    setTimeout(() => {
      // If first question (about main symptoms), generate dynamic questions
      if (conversationStep === 0) {
        const dynamicQuestions = getQuestionsForSymptoms(currentInput);
        setCurrentQuestions(dynamicQuestions);
      }

      if (conversationStep < Math.min(currentQuestions.length - 1, 5)) {
        // Continue conversation (max 6 questions including initial)
        const nextStep = conversationStep + 1;
        const botResponse: ChatMessage = {
          type: 'bot',
          content: currentQuestions[nextStep].question[language],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setConversationStep(nextStep);
      } else {
        // Final analysis after collecting enough information
        performAnalysis();
      }
      setIsAnalyzing(false);
    }, 1500);
  };

  // Comprehensive medical condition database with zoning
  const getConditionAnalysis = (symptoms: string, answers: string[]): AnalysisResult => {
    const allText = (symptoms + ' ' + answers.join(' ')).toLowerCase();
    
    // Red Zone - Emergency conditions
    const redZoneConditions = [
      {
        keywords: ['chest pain', 'heart attack', 'cardiac', 'छाती दर्द', 'दिल दर्द', 'हृदय', 'breathing difficulty', 'सांस', 'श्वास'],
        condition: {
          hi: 'हृदय संबंधी आपातकाल / सांस की गंभीर समस्या',
          mr: 'हृदयाशी संबंधित आपत्कालीन स्थिती / श्वासाची गंभीर समस्या',
          pa: 'ਦਿਲ ਸੰਬੰਧੀ ਐਮਰਜੈਂਸੀ / ਸਾਹ ਦੀ ਗੰਭੀਰ ਸਮੱਸਿਆ',
          en: 'Cardiac Emergency / Severe Respiratory Failure'
        },
        doctorType: 'emergency_doctor'
      },
      {
        keywords: ['unconscious', 'बेहोश', 'अचेत', 'shock', 'severe bleeding', 'बहुत खून', 'poisoning', 'विष'],
        condition: {
          hi: 'गंभीर चिकित्सा आपातकाल',
          mr: 'गंभीर वैद्यकीय आपत्काल',
          pa: 'ਗੰਭੀਰ ਮੈਡੀਕਲ ਐਮਰਜੈਂਸੀ',
          en: 'Severe Medical Emergency'
        },
        doctorType: 'emergency_doctor'
      },
      {
        keywords: ['stroke', 'paralysis', 'लकवा', 'brain', 'मस्तिष्क', 'severe headache', 'तेज सिरदर्द'],
        condition: {
          hi: 'संभावित स्ट्रोक / न्यूरोलॉजिकल इमरजेंसी',
          mr: 'संभाव्य स्ट्रोक / न्यूरोलॉजिकल आपत्काल',
          pa: 'ਸੰਭਾਵਿਤ ਸਟ੍ਰੋਕ / ਨਿਊਰੋਲੋਜੀਕਲ ਐਮਰਜੈਂਸੀ',
          en: 'Possible Stroke / Neurological Emergency'
        },
        doctorType: 'emergency_doctor'
      }
    ];

    // Orange Zone - Urgent conditions
    const orangeZoneConditions = [
      {
        keywords: ['severe fever', 'तेज बुखार', '102', 'high fever', 'dehydration', 'निर्जलीकरण', 'severe vomiting'],
        condition: {
          hi: 'गंभीर बुखार / संक्रमण',
          mr: 'गंभीर ताप / संसर्ग',
          pa: 'ਗੰਭੀਰ ਬੁਖ਼ਾਰ / ਇਨਫੈਕਸ਼ਨ',
          en: 'Severe Fever / Infection'
        },
        doctorType: 'mo'
      },
      {
        keywords: ['severe pain', 'तेज दर्द', 'असहनीय', 'unbearable', 'kidney stone', 'गुर्दे की पथरी'],
        condition: {
          hi: 'गंभीर दर्द सिंड्रोम / संभावित पथरी',
          mr: 'गंभीर वेदना सिंड्रोम / संभाव्य खडा',
          pa: 'ਗੰਭੀਰ ਦਰਦ ਸਿੰਡਰੋਮ / ਸੰਭਾਵਿਤ ਪਥਰੀ',
          en: 'Severe Pain Syndrome / Possible Stone'
        },
        doctorType: 'mo'
      },
      {
        keywords: ['severe asthma', 'दमा', 'breathing problem', 'wheeze', 'सांस फूलना'],
        condition: {
          hi: 'गंभीर दमा का दौरा',
          mr: 'गंभीर दम्याचा झटका',
          pa: 'ਗੰਭੀਰ ਦਮੇ ਦਾ ਦੌਰਾ',
          en: 'Severe Asthma Attack'
        },
        doctorType: 'mo'
      },
      {
        keywords: ['pregnancy', 'गर्भावस्था', 'bleeding', 'खून', 'complications', 'जटिलताएं'],
        condition: {
          hi: 'गर्भावस्था में जटिलताएं',
          mr: 'गर्भावस्थेतील गुंतागुंत',
          pa: 'ਗਰਭ ਅਵਸਥਾ ਵਿੱਚ ਮੁਸ਼ਕਲਾਂ',
          en: 'High-Risk Pregnancy Complications'
        },
        doctorType: 'mo'
      }
    ];

    // Yellow Zone - Moderate conditions
    const yellowZoneConditions = [
      {
        keywords: ['fever', 'बुखार', 'ताप', 'cold', 'सर्दी', 'cough', 'खांसी', 'flu'],
        condition: {
          hi: 'वायरल संक्रमण / सामान्य बुखार',
          mr: 'व्हायरल संसर्ग / सामान्य ताप',
          pa: 'ਵਾਇਰਲ ਇਨਫੈਕਸ਼ਨ / ਆਮ ਬੁਖ਼ਾਰ',
          en: 'Viral Infection / Common Fever'
        },
        doctorType: 'cho'
      },
      {
        keywords: ['uti', 'urinary', 'मूत्र', 'burning', 'जलन', 'infection'],
        condition: {
          hi: 'मूत्र मार्ग संक्रमण (UTI)',
          mr: 'मूत्रमार्गाचा संसर्ग (UTI)',
          pa: 'ਪੇਸ਼ਾਬ ਦੀ ਨਲੀ ਦਾ ਇਨਫੈਕਸ਼ਨ (UTI)',
          en: 'Urinary Tract Infection (UTI)'
        },
        doctorType: 'cho'
      },
      {
        keywords: ['joint pain', 'जोड़ों दर्द', 'arthritis', 'गठिया', 'knee pain', 'घुटने दर्द'],
        condition: {
          hi: 'जोड़ों में दर्द / गठिया',
          mr: 'सांध्यादुखणे / संधिवात',
          pa: 'ਜੋੜਾਂ ਵਿੱਚ ਦਰਦ / ਗਠੀਆ',
          en: 'Joint Pain / Arthritis'
        },
        doctorType: 'cho'
      },
      {
        keywords: ['eye', 'आंख', 'डोळे', 'ਅੱਖ', 'conjunctivitis', 'रेड आई', 'infection'],
        condition: {
          hi: 'आंख की समस्या / नेत्रश्लेष्मला शोथ',
          mr: 'डोळ्याची समस्या / नेत्रश्लेष्मलाशोथ',
          pa: 'ਅੱਖ ਦੀ ਸਮੱਸਿਆ / ਅੱਖ ਦਾ ਇਨਫੈਕਸ਼ਨ',
          en: 'Eye Problems / Conjunctivitis'
        },
        doctorType: 'cho'
      },
      {
        keywords: ['anemia', 'एनीमिया', 'weakness', 'कमजोरी', 'fatigue', 'थकान'],
        condition: {
          hi: 'एनीमिया / कमजोरी',
          mr: 'अॅनेमिया / अशक्तता',
          pa: 'ਅਨੀਮੀਆ / ਕਮਜ਼ੋਰੀ',
          en: 'Anemia / General Weakness'
        },
        doctorType: 'cho'
      }
    ];

    // Check for Red Zone conditions first
    for (const condition of redZoneConditions) {
      if (condition.keywords.some(keyword => allText.includes(keyword))) {
        return {
          condition: condition.condition[language],
          severity: 'red' as SeverityZone,
          response: language === 'hi' ? 'तुरंत आपातकालीन चिकित्सा सहायता लें।' :
                   language === 'mr' ? 'ताबडतोब आपत्कालीन वैद्यकीय मदत घ्या.' :
                   language === 'pa' ? 'ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਮੈਡੀਕਲ ਮਦਦ ਲਓ।' :
                   'Seek immediate emergency medical help.',
          doctorType: condition.doctorType,
          recommendations: [
            language === 'hi' ? 'तुरंत 102 पर कॉल करें' :
            language === 'mr' ? 'ताबडतोब 102 वर कॉल करा' :
            language === 'pa' ? 'ਤੁਰੰਤ 102 ਤੇ ਕਾਲ ਕਰੋ' :
            'Call 102 immediately',
            language === 'hi' ? 'निकटतम अस्पताल जाएं' :
            language === 'mr' ? 'जवळच्या रुग्णालयात जा' :
            language === 'pa' ? 'ਨੇੜਲੇ ਹਸਪਤਾਲ ਜਾਓ' :
            'Go to nearest hospital',
            language === 'hi' ? 'किसी को साथ रखें' :
            language === 'mr' ? 'कोणाला सोबत ठेवा' :
            language === 'pa' ? 'ਕਿਸੇ ਨੂੰ ਨਾਲ ਰੱਖੋ' :
            'Keep someone with you'
          ]
        };
      }
    }

    // Check for Orange Zone conditions
    for (const condition of orangeZoneConditions) {
      if (condition.keywords.some(keyword => allText.includes(keyword))) {
        return {
          condition: condition.condition[language],
          severity: 'orange' as SeverityZone,
          response: language === 'hi' ? '24 घंटे के भीतर डॉक्टर से मिलें।' :
                   language === 'mr' ? '24 तासांच्या आत डॉक्टरांना भेटा.' :
                   language === 'pa' ? '24 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' :
                   'See a doctor within 24 hours.',
          doctorType: condition.doctorType,
          recommendations: [
            language === 'hi' ? 'तुरंत डॉक्टर से संपर्क करें' :
            language === 'mr' ? 'ताबडतोब डॉक्टरांशी संपर्क करा' :
            language === 'pa' ? 'ਤੁਰੰਤ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ' :
            'Contact doctor immediately',
            language === 'hi' ? 'आराम करें और तरल पदार्थ लें' :
            language === 'mr' ? 'आराम करा आणि द्रव पदार्थ घ्या' :
            language === 'pa' ? 'ਆਰਾਮ ਕਰੋ ਅਤੇ ਤਰਲ ਪਦਾਰਥ ਲਓ' :
            'Rest and take fluids',
            language === 'hi' ? 'लक्षणों पर निगरानी रखें' :
            language === 'mr' ? 'लक्षणांवर निरीक्षण ठेवा' :
            language === 'pa' ? 'ਲੱਛਣਾਂ ਤੇ ਨਿਗਰਾਨੀ ਰੱਖੋ' :
            'Monitor symptoms closely'
          ]
        };
      }
    }

    // Check for Yellow Zone conditions
    for (const condition of yellowZoneConditions) {
      if (condition.keywords.some(keyword => allText.includes(keyword))) {
        return {
          condition: condition.condition[language],
          severity: 'yellow' as SeverityZone,
          response: language === 'hi' ? '2-3 दिन में डॉक्टर से मिलें।' :
                   language === 'mr' ? '2-3 दिवसांत डॉक्टरांना भेटा.' :
                   language === 'pa' ? '2-3 ਦਿਨਾਂ ਵਿੱਚ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' :
                   'See a doctor within 2-3 days.',
          doctorType: condition.doctorType,
          recommendations: [
            language === 'hi' ? 'पर्याप्त आराम करें' :
            language === 'mr' ? 'पुरेसा आराम करा' :
            language === 'pa' ? 'ਲੋੜੀਂਦਾ ਆਰਾਮ ਕਰੋ' :
            'Get adequate rest',
            language === 'hi' ? 'तरल पदार्थ अधिक लें' :
            language === 'mr' ? 'द्रव पदार्थ जास्त घ्या' :
            language === 'pa' ? 'ਤਰਲ ਪਦਾਰਥ ਜ਼ਿਆਦਾ ਲਓ' :
            'Increase fluid intake',
            language === 'hi' ? 'स्वच्छता बनाए रखें' :
            language === 'mr' ? 'स्वच्छता राखा' :
            language === 'pa' ? 'ਸਫ਼ਾਈ ਬਣਾਈ ਰੱਖੋ' :
            'Maintain hygiene'
          ]
        };
      }
    }

    // Default to Green Zone
    return {
      condition: language === 'hi' ? 'सामान्य स्वास्थ्य जांच आवश्यक' :
                 language === 'mr' ? 'सामान्य आरोग्य तपासणी आवश्यक' :
                 language === 'pa' ? 'ਆਮ ਸਿਹਤ ਜਾਂਚ ਲੋੜੀਂਦੀ' :
                 'General Health Check Required',
      severity: 'green' as SeverityZone,
      response: language === 'hi' ? 'घरेलू उपचार और आराम करें। आवश्यकता हो तो डॉक्टर से मिलें।' :
                language === 'mr' ? 'घरगुती उपचार आणि आराम करा. गरज भासल्यास डॉक्टरांना भेटा.' :
                language === 'pa' ? 'ਘਰੇਲੂ ਇਲਾਜ ਅਤੇ ਆਰਾਮ ਕਰੋ। ਲੋੜ ਹੋਵੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' :
                'Home care and rest. See doctor if needed.',
      doctorType: 'cho',
      recommendations: [
        language === 'hi' ? 'नियमित व्यायाम कर���ं' :
        language === 'mr' ? 'नियमित व्यायाम करा' :
        language === 'pa' ? 'ਨਿਯਮਿਤ ਕਸਰਤ ਕਰੋ' :
        'Regular exercise',
        language === 'hi' ? 'संतुलित आहार लें' :
        language === 'mr' ? 'संतुलित आहार घ्या' :
        language === 'pa' ? 'ਸੰਤੁਲਿਤ ਖੁਰਾਕ ਲਓ' :
        'Balanced diet',
        language === 'hi' ? 'तनाव कम करें' :
        language === 'mr' ? 'तणाव कमी करा' :
        language === 'pa' ? 'ਤਣਾਅ ਘੱਟ ਕਰੋ' :
        'Reduce stress'
      ]
    };
  };

  const performAnalysis = () => {
    // Collect all user responses
    const symptoms = messages
      .filter(m => m.type === 'user')
      .map(m => m.content)
      .join(' ');

    const result = getConditionAnalysis(symptoms, selectedOptions);
    setAnalysisResult(result);
    onAnalysisComplete?.(result, symptoms);
  };

  const getSeverityColor = (severity: SeverityZone) => {
    switch (severity) {
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityText = (severity: SeverityZone) => {
    const severityTexts = {
      red: {
        hi: 'अत्यधिक गंभीर - तुरंत सहायता',
        mr: 'अत्यंत गंभीर - ताबडतोब मदत',
        pa: 'ਬਹੁਤ ਗੰਭੀਰ - ਤੁਰੰਤ ਮਦਦ',
        en: 'Critical - Immediate Help'
      },
      orange: {
        hi: 'गंभीर - जल्दी सहायता',
        mr: 'गंभीर - लवकर मदत',
        pa: 'ਗੰਭੀਰ - ਜਲਦੀ ਮਦਦ',
        en: 'Urgent - Quick Help'
      },
      yellow: {
        hi: 'मध्यम - डॉक्टर से मिलें',
        mr: 'मध्यम - डॉक्टरांना भेटा',
        pa: 'ਦਰਮਿਆਨਾ - ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ',
        en: 'Moderate - See Doctor'
      },
      green: {
        hi: 'हल्का - सामान्य देखभाल',
        mr: 'हलका - सामान्य काळजी',
        pa: 'ਹਲਕਾ - ਆਮ ਦੇਖਭਾਲ',
        en: 'Mild - General Care'
      }
    };
    return severityTexts[severity][language];
  };

  const getDoctorTypeText = (doctorType: string) => {
    const doctorTypes = {
      emergency_doctor: {
        hi: 'आपातकालीन डॉक्टर',
        mr: 'आपत्कालीन डॉक्टर',
        pa: 'ਐਮਰਜੈਂਸੀ ਡਾਕਟਰ',
        en: 'Emergency Doctor'
      },
      mo: {
        hi: 'चिकित्सा अधिकारी (MO)',
        mr: 'वैद्यकीय अधिकारी (MO)',
        pa: 'ਮੈਡੀਕਲ ਅਫ਼ਸਰ (MO)',
        en: 'Medical Officer (MO)'
      },
      cho: {
        hi: 'मुख्य स्वास्थ्य अधिकारी (CHO)',
        mr: 'मुख्य आरोग्य अधिकारी (CHO)',
        pa: 'ਚੀਫ਼ ਹੈਲਥ ਅਫ਼ਸਰ (CHO)',
        en: 'Chief Health Officer (CHO)'
      },
      civil_doctor: {
        hi: 'सिविल डॉक्टर',
        mr: 'सिव्हिल डॉक्टर',
        pa: 'ਸਿਵਲ ਡਾਕਟਰ',
        en: 'Civil Doctor'
      }
    };
    return doctorTypes[doctorType as keyof typeof doctorTypes]?.[language] || doctorType;
  };

  const handleBookConsultation = () => {
    if (analysisResult && onAnalysisComplete) {
      onAnalysisComplete(analysisResult, messages
        .filter(m => m.type === 'user')
        .map(m => m.content)
        .join(' '));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-teal-600" />
              <h1 className="font-medium">
                {language === 'hi' ? 'AI लक्षण जांच' :
                 language === 'mr' ? 'AI लक्षण तपासणी' :
                 language === 'pa' ? 'AI ਲੱਛਣ ਜਾਂਚ' : 'AI Symptom Checker'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-32">
        {/* Messages */}
        <div className="space-y-4 mb-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 ${
                  message.type === 'user'
                    ? 'bg-teal-600 text-white rounded-br-lg'
                    : 'bg-gray-100 text-gray-800 rounded-bl-lg'
                }`}
              >
                {message.type === 'bot' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="w-4 h-4 text-teal-600" />
                    <span className="text-xs text-gray-500">AI Assistant</span>
                  </div>
                )}
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm leading-relaxed flex-1">{message.content}</p>
                  {message.type === 'bot' && (
                    <VoiceReader 
                      text={message.content}
                      size="sm"
                      className="flex-shrink-0 mt-1"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isAnalyzing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-lg p-3 max-w-[85%]">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-4 h-4 text-teal-600" />
                  <span className="text-xs text-gray-500">AI Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                  <span className="text-sm">
                    {language === 'hi' ? 'विश्लेषण कर रहा हूं...' :
                     language === 'mr' ? 'विश्लेषण करत आहे...' :
                     language === 'pa' ? 'ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹਾਂ...' : 'Analyzing...'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick response options */}
          {!analysisResult && !isAnalyzing && conversationStep > 0 && conversationStep < currentQuestions.length && currentQuestions[conversationStep]?.options && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-lg p-3 max-w-[85%]">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-teal-600" />
                  <span className="text-xs text-gray-500">
                    {language === 'hi' ? 'विकल्प चुनें:' :
                     language === 'mr' ? 'पर्याय निवडा:' :
                     language === 'pa' ? 'ਵਿਕਲਪ ਚੁਣੋ:' : 'Choose option:'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentQuestions[conversationStep].options![language].map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-2 px-3 text-left"
                      onClick={() => setCurrentInput(option)}
                      disabled={isAnalyzing}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Analysis Result */}
        {analysisResult && (
          <Card className="mb-6 border-l-4 border-l-teal-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-teal-600" />
                {language === 'hi' ? 'AI विश्लेषण परिणाम' :
                 language === 'mr' ? 'AI विश्लेषण परिसंवाद' :
                 language === 'pa' ? 'AI ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜੇ' : 'AI Analysis Result'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm mb-1">
                  {language === 'hi' ? 'संभावित स्थिति:' :
                   language === 'mr' ? 'संभाव्य स्थिती:' :
                   language === 'pa' ? 'ਸੰਭਾਵਿਤ ਸਥਿਤੀ:' : 'Possible Condition:'}
                </h4>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium flex-1">{analysisResult.condition}</p>
                  <VoiceReader 
                    text={analysisResult.condition}
                    size="sm"
                    className="flex-shrink-0 mt-1"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm mb-2">
                  {language === 'hi' ? 'गंभीरता स्तर:' :
                   language === 'mr' ? 'गंभीरता पातळी:' :
                   language === 'pa' ? 'ਗੰਭੀਰਤਾ ਪੱਧਰ:' : 'Severity Level:'}
                </h4>
                <Badge className={getSeverityColor(analysisResult.severity)}>
                  {getSeverityText(analysisResult.severity)}
                </Badge>
                
                {/* Severity explanation */}
                <div className="mt-2 p-3 rounded-lg text-sm" style={{
                  backgroundColor: analysisResult.severity === 'red' ? '#fef2f2' : 
                                   analysisResult.severity === 'orange' ? '#fff7ed' : '#fffbeb',
                  borderColor: analysisResult.severity === 'red' ? '#fecaca' : 
                               analysisResult.severity === 'orange' ? '#fed7aa' : '#fde68a',
                  border: '1px solid'
                }}>
                  {analysisResult.severity === 'red' && (
                    <div>
                      <p className="font-medium text-red-800 mb-1">
                        {language === 'hi' ? '🔴 लाल क्षेत्र - जीवन के लिए खतरनाक, तत्काल देखभाल आवश्यक' :
                         language === 'mr' ? '🔴 लाल झोन - जीवघेणी, तत्काळ काळजी आवश्यक' :
                         language === 'pa' ? '🔴 ਲਾਲ ਜ਼ੋਨ - ਜ਼ਿੰਦਗੀ ਲਈ ਖ਼ਤਰਨਾਕ, ਤੁਰੰਤ ਦੇਖਭਾਲ ਲੋੜੀਂਦੀ' :
                         '🔴 RED ZONE - Life threatening, Immediate care needed'}
                      </p>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200 mt-2">
                        <p className="text-red-700 text-sm mb-2">
                          {language === 'hi' ? 'इस स्थिति के उदाहरण:' :
                           language === 'mr' ? 'या स्थितीची उदाहरणे:' :
                           language === 'pa' ? 'ਇਸ ਸਥਿਤੀ ਦੀਆਂ ਉਦਾਹਰਣਾਂ:' :
                           'Examples of this condition:'}
                        </p>
                        <ul className="text-red-700 text-xs space-y-1">
                          <li>• {language === 'hi' ? 'हृदयाघात (दिल का दौरा)' : language === 'mr' ? 'हृदयविकाराचा झटका' : language === 'pa' ? 'ਦਿਲ ਦਾ ਦੌਰਾ' : 'Heart Attack / Cardiac Arrest'}</li>
                          <li>• {language === 'hi' ? 'सांस लेने में गंभीर समस्या' : language === 'mr' ? 'श्वास घेण्यात गंभीर अडचण' : language === 'pa' ? 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਗੰਭੀਰ ਸਮੱਸਿਆ' : 'Severe Breathing Difficulty'}</li>
                          <li>• {language === 'hi' ? 'गंभीर जलन / व्यापक आघात' : language === 'mr' ? 'गंभीर भाजणे / व्यापक दुखापती' : language === 'pa' ? 'ਗੰਭੀਰ ਸੜਨ / ਵਿਆਪਕ ਸੱਟ' : 'Severe Burns / Massive Trauma'}</li>
                          <li>• {language === 'hi' ? 'जहर / बेहोशी की हालत' : language === 'mr' ? 'विषबाधा / बेशुद्धी' : language === 'pa' ? 'ਜ਼ਹਿਰ / ਬੇਹੋਸ਼ੀ ਦੀ ਹਾਲਤ' : 'Poisoning / Unconsciousness'}</li>
                        </ul>
                      </div>
                      <p className="text-red-700 mt-2">
                        <strong>{language === 'hi' ? 'तुरंत करें:' : language === 'mr' ? 'ताबडतोब करा:' : language === 'pa' ? 'ਤੁਰੰਤ ਕਰੋ:' : 'Do immediately:'}</strong> {language === 'hi' ? '102 पर कॉल करें या निकटतम अस्पताल जाएं।' : language === 'mr' ? '102 वर कॉल करा किंवा जवळच्या रुग्णालयात जा.' : language === 'pa' ? '102 ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਨੇੜਲੇ ਹਸਪਤਾਲ ਜਾਓ।' : 'Call 102 or go to the nearest hospital.'}
                      </p>
                    </div>
                  )}
                  
                  {analysisResult.severity === 'orange' && (
                    <div>
                      <p className="font-medium text-orange-800 mb-1">
                        {language === 'hi' ? '🟠 नारंगी क्षेत्र - गंभीर, तत्काल चिकित्सा सहायता आवश्यक' :
                         language === 'mr' ? '🟠 नारिंगी झोन - गंभीर, तत्काळ वैद्यकीय मदत आवश्यक' :
                         language === 'pa' ? '🟠 ਸੰਤਰੀ ਜ਼ੋਨ - ਗੰਭੀਰ, ਤੁਰੰਤ ਮੈਡੀਕਲ ਮਦਦ ਲੋੜੀਂਦੀ' :
                         '🟠 ORANGE ZONE - Serious, Requires urgent medical attention'}
                      </p>
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mt-2">
                        <p className="text-orange-700 text-sm mb-2">
                          {language === 'hi' ? 'इस स्थिति के उदाहरण:' :
                           language === 'mr' ? 'या स्थितीची उदाहरणे:' :
                           language === 'pa' ? 'ਇਸ ਸਥਿਤੀ ਦੀਆਂ ਉਦਾਹਰਣਾਂ:' :
                           'Examples of this condition:'}
                        </p>
                        <ul className="text-orange-700 text-xs space-y-1">
                          <li>• {language === 'hi' ? 'गंभीर निमोनिया (सांस लेने में कठिनाई)' : language === 'mr' ? 'गंभीर निमोनिया (श्वास घेण्यात अडचण)' : language === 'pa' ? 'ਗੰਭੀਰ ਨਮੂਨੀਆ (ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ)' : 'Severe Pneumonia (breathing difficulty)'}</li>
                          <li>• {language === 'hi' ? 'गंभीर डेंगू (खून की कमी, होश में)' : language === 'mr' ? 'गंभीर डेंग्यू (रक्ताची कमी, भानावर)' : language === 'pa' ? 'ਗੰਭੀਰ ਡੈਂਗੂ (ਖੂਨ ਦੀ ਕਮੀ, ਹੋਸ਼ ਵਿੱਚ)' : 'Severe Dengue (bleeding, conscious)'}</li>
                          <li>• {language === 'hi' ? 'जटिल मलेरिया (तेज बुखार, ठंड)' : language === 'mr' ? 'गुंतागुंतीचा मलेरिया (तीव्र ताप, थंडी)' : language === 'pa' ? 'ਗੁੰਝਲਦਾਰ ਮਲੇਰੀਆ (ਤੇਜ਼ ਬੁਖ਼ਾਰ, ਠੰਡ)' : 'Complicated Malaria (high fever, chills)'}</li>
                          <li>• {language === 'hi' ? 'गुर्दे की पथरी (तेज दर्द)' : language === 'mr' ? 'मूत्रपिंडाचा खडा (तीव्र वेदना)' : language === 'pa' ? 'ਗੁਰਦੇ ਦੀ ਪਥਰੀ (ਤੇਜ਼ ਦਰਦ)' : 'Kidney Stone (severe pain)'}</li>
                        </ul>
                      </div>
                      <p className="text-orange-700 mt-2">
                        <strong>{language === 'hi' ? 'कार्य:' : language === 'mr' ? 'कार्य:' : language === 'pa' ? 'ਕਾਰਜ:' : 'Action:'}</strong> {language === 'hi' ? '24 घंटे के भीतर डॉक्टर से मिलें।' : language === 'mr' ? '24 तासांच्या आत डॉक्टरांना भेटा.' : language === 'pa' ? '24 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' : 'See a doctor within 24 hours.'}
                      </p>
                    </div>
                  )}
                  
                  {analysisResult.severity === 'yellow' && (
                    <div>
                      <p className="font-medium text-yellow-800 mb-1">
                        {language === 'hi' ? '🟡 पीला क्षेत्र - मध्यम, चिकित्सा सहायता आवश्यक' :
                         language === 'mr' ? '🟡 पिवळा झोन - मध्यम, वैद्यकीय मदत आवश्यक' :
                         language === 'pa' ? '🟡 ਪੀਲਾ ਜ਼ੋਨ - ਦਰਮਿਆਨਾ, ਮੈਡੀਕਲ ਮਦਦ ਲੋੜੀਂਦੀ' :
                         '🟡 YELLOW ZONE - Moderate, Needs medical attention'}
                      </p>
                      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mt-2">
                        <p className="text-yellow-700 text-sm mb-2">
                          {language === 'hi' ? 'इस स्थिति के उदाहरण:' :
                           language === 'mr' ? 'या स्थितीची उदाहरणे:' :
                           language === 'pa' ? 'ਇਸ ਸਥਿਤੀ ਦੀਆਂ ਉਦਾਹਰਣਾਂ:' :
                           'Examples of this condition:'}
                        </p>
                        <ul className="text-yellow-700 text-xs space-y-1">
                          <li>• {language === 'hi' ? 'टाइफाइड बुखार (जटिलताओं के बिना)' : language === 'mr' ? 'टायफॉइड ताप (गुंतागुंत नसलेला)' : language === 'pa' ? 'ਟਾਈਫਾਈਡ ਬੁਖ਼ਾਰ (ਜਟਿਲਤਾਵਾਂ ਤੋਂ ਬਿਨਾਂ)' : 'Typhoid Fever (without complications)'}</li>
                          <li>• {language === 'hi' ? 'हल्का डेंगू (खून बहने के बिना)' : language === 'mr' ? 'हलका डेंग्यू (रक्तस्त्राव नसलेला)' : language === 'pa' ? 'ਹਲਕਾ ਡੈਂਗੂ (ਖੂਨ ਵਗਣ ਤੋਂ ਬਿਨਾਂ)' : 'Mild Dengue (no bleeding)'}</li>
                          <li>• {language === 'hi' ? 'दमा (हल्का से मध्यम दौरा)' : language === 'mr' ? 'दमा (हलका ते मध्यम झटका)' : language === 'pa' ? 'ਦਮਾ (ਹਲਕਾ ਤੋਂ ਦਰਮਿਆਨਾ ਦੌਰਾ)' : 'Asthma (mild to moderate attack)'}</li>
                          <li>• {language === 'hi' ? 'मूत्र मार्ग संक्रमण (UTI)' : language === 'mr' ? 'मूत्रमार्गाचा संसर्ग (UTI)' : language === 'pa' ? 'ਪੇਸ਼ਾਬ ਦੀ ਨਲੀ ਦਾ ਇਨਫੈਕਸ਼ਨ (UTI)' : 'Urinary Tract Infection (UTI)'}</li>
                        </ul>
                      </div>
                      <p className="text-yellow-700 mt-2">
                        <strong>{language === 'hi' ? 'कार्���:' : language === 'mr' ? 'कार्य:' : language === 'pa' ? 'ਕਾਰਜ:' : 'Action:'}</strong> {language === 'hi' ? '2-3 दिन में डॉक्टर से मिलें।' : language === 'mr' ? '2-3 दिवसांत डॉक्टरांना भेटा.' : language === 'pa' ? '2-3 ਦਿਨਾਂ ਵਿੱਚ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' : 'See a doctor within 2-3 days.'}
                      </p>
                    </div>
                  )}
                  
                  {analysisResult.severity === 'green' && (
                    <div>
                      <p className="font-medium text-green-800 mb-1">
                        {language === 'hi' ? '🟢 हरा क्षेत्र - हल्का, सामान्य देखभाल' :
                         language === 'mr' ? '🟢 हिरवा झोन - हलका, सामान्य काळजी' :
                         language === 'pa' ? '🟢 ਹਰਾ ਜ਼ੋਨ - ਹਲਕਾ, ਆਮ ਦੇਖਭਾਲ' :
                         '🟢 GREEN ZONE - Mild, General care'}
                      </p>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200 mt-2">
                        <p className="text-green-700 text-sm mb-2">
                          {language === 'hi' ? 'इस स्थिति के उदाहरण:' :
                           language === 'mr' ? 'या स्थितीची उदाहरणे:' :
                           language === 'pa' ? 'ਇਸ ਸਥਿਤੀ ਦੀਆਂ ਉਦਾਹਰਣਾਂ:' :
                           'Examples of this condition:'}
                        </p>
                        <ul className="text-green-700 text-xs space-y-1">
                          <li>• {language === 'hi' ? 'सामान्य सर्दी-जुकाम' : language === 'mr' ? 'सामान्य सर्दी-खोकला' : language === 'pa' ? 'ਆਮ ਸਰਦੀ-ਖੰਘ' : 'Common Cold/Cough'}</li>
                          <li>• {language === 'hi' ? 'हल्का सिरदर्द या बुखार' : language === 'mr' ? 'हलके डोकेदुखी किंवा ताप' : language === 'pa' ? 'ਹਲਕਾ ਸਿਰ ਦਰਦ ਜਾਂ ਬੁਖ਼ਾਰ' : 'Mild headache or fever'}</li>
                          <li>• {language === 'hi' ? 'मांसपेशियों में खिंचाव' : language === 'mr' ? 'स्नायूंमध्ये ताणतणाव' : language === 'pa' ? 'ਮਾਂਸਪੇਸ਼ੀਆਂ ਵਿੱਚ ਖਿੱਚ' : 'Muscle strain'}</li>
                          <li>• {language === 'hi' ? 'सामान्य थकान' : language === 'mr' ? 'सामान्य थकवा' : language === 'pa' ? 'ਆਮ ਥਕਾਵਟ' : 'General fatigue'}</li>
                        </ul>
                      </div>
                      <p className="text-green-700 mt-2">
                        <strong>{language === 'hi' ? 'कार्य:' : language === 'mr' ? 'कार्य:' : language === 'pa' ? 'ਕਾਰਜ:' : 'Action:'}</strong> {language === 'hi' ? 'घरेलू उपचार और आराम करें। आवश्यकता हो तो डॉक्टर से मिलें।' : language === 'mr' ? 'घरगुती उपचार आणि आराम करा. गरज भासल्यास डॉक्टरांना भेटा.' : language === 'pa' ? 'ਘਰੇਲੂ ਇਲਾਜ ਅਤੇ ਆਰਾਮ ਕਰੋ। ਲੋੜ ਹੋਵੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' : 'Home care and rest. See doctor if needed.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm mb-2">
                  {language === 'hi' ? 'अनुशंसित डॉक्टर:' :
                   language === 'mr' ? 'शिफारशीत डॉक्टर:' :
                   language === 'pa' ? 'ਸਿਫ਼ਾਰਸ਼ੀ ਡਾਕਟਰ:' : 'Recommended Doctor:'}
                </h4>
                <div className="flex items-center gap-2 p-2 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                  <span className="text-sm font-medium text-teal-800">
                    {getDoctorTypeText(analysisResult.doctorType)}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-sm mb-2">
                  {language === 'hi' ? 'सुझाव:' :
                   language === 'mr' ? 'सूचना:' :
                   language === 'pa' ? 'ਸੁਝਾਅ:' : 'Recommendations:'}
                </h4>
                <ul className="space-y-1">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-teal-600 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {showConsultationOption && (
                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleBookConsultation}
                    className="w-full bg-teal-600 hover:bg-teal-700"
                  >
                    {language === 'hi' ? `${getDoctorTypeText(analysisResult.doctorType)} से सलाह लें` :
                     language === 'mr' ? `${getDoctorTypeText(analysisResult.doctorType)} चा सल्ला घ्या` :
                     language === 'pa' ? `${getDoctorTypeText(analysisResult.doctorType)} ਦੀ ਸਲਾਹ ਲਓ` : 
                     `Consult ${getDoctorTypeText(analysisResult.doctorType)}`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Input Section - Fixed at bottom */}
      {!analysisResult && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <Card>
            <CardContent className="p-4">
              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {language === 'hi' ? 'अपलोड की गई तस्वीरें:' :
                     language === 'mr' ? 'अपलोड केलेले फोटो:' :
                     language === 'pa' ? 'ਅਪਲੋਡ ਕੀਤੀਆਂ ਫੋਟੋਆਂ:' : 'Uploaded Images:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <VoiceInput
                  value={currentInput}
                  onChange={setCurrentInput}
                  placeholder={conversationStep === 0 ? 
                    (language === 'hi' ? 'अपने लक्षणों का वर्णन करें...' :
                     language === 'mr' ? 'तुमच्या लक्षणांचे वर्णन करा...' :
                     language === 'pa' ? 'ਆਪਣੇ ਲੱਛਣਾਂ ਦਾ ਵਰਣਨ ਕਰੋ...' : 'Describe your symptoms...') : 
                    (language === 'hi' ? 'आपका उत्तर...' :
                     language === 'mr' ? 'तुमचे उत्तर...' :
                     language === 'pa' ? 'ਤੁਹਾਡਾ ਜਵਾਬ...' : 'Your answer...')}
                  disabled={isAnalyzing}
                  multiline={true}
                  rows={2}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing || uploadedImages.length >= 3}
                  className="ml-2"
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={(!currentInput.trim() && uploadedImages.length === 0) || isAnalyzing}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {/* Progress indicator and examples */}
              <div className="mt-3">
                {conversationStep > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>
                        {language === 'hi' ? 'प्रगति:' :
                         language === 'mr' ? 'प्रगती:' :
                         language === 'pa' ? 'ਪ੍ਰਗਤੀ:' : 'Progress:'}
                      </span>
                      <span>
                        {conversationStep + 1} / {Math.min(currentQuestions.length, 6)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-teal-600 h-1 rounded-full transition-all duration-300" 
                        style={{ width: `${((conversationStep + 1) / Math.min(currentQuestions.length, 6)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {conversationStep === 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      {language === 'hi' ? 'उदाहरण:' :
                       language === 'mr' ? 'उदाहरणे:' :
                       language === 'pa' ? 'ਉਦਾਹਰਣਾਂ:' : 'Examples:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        language === 'hi' ? 'सिरदर्द और बुखार' : language === 'mr' ? 'डोकेदुखी आणि ताप' : language === 'pa' ? 'ਸਿਰ ਦਰਦ ਅਤੇ ਬੁਖ਼ਾਰ' : 'Headache and fever',
                        language === 'hi' ? 'पेट में दर्द' : language === 'mr' ? 'पोटात दुखणे' : language === 'pa' ? 'ਪੇਟ ਵਿਚ ਦਰਦ' : 'Stomach pain',
                        language === 'hi' ? 'खांसी और सर्दी' : language === 'mr' ? 'खोकला आणि सर्दी' : language === 'pa' ? 'ਖੰਘ ਅਤੇ ਸਰਦੀ' : 'Cough and cold',
                        language === 'hi' ? 'सांस लेने में कठिनाई' : language === 'mr' ? 'श्वास घेण्यात अडचण' : language === 'pa' ? 'ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ' : 'Difficulty breathing',
                        language === 'hi' ? 'छाती में दर्द' : language === 'mr' ? 'छातीत दुखणे' : language === 'pa' ? 'ਛਾਤੀ ਵਿੱਚ ਦਰਦ' : 'Chest pain'
                      ].map((example, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-auto py-1 px-2"
                          onClick={() => setCurrentInput(example)}
                          disabled={isAnalyzing}
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}