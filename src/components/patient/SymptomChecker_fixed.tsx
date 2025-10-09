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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock AI Conversation Flow
  const conversationFlow = [
    {
      question: {
        hi: 'मुझे बताएं कि आप कैसा महसूस कर रहे हैं? आपके मुख्य लक्षण क्या हैं?',
        mr: 'तुम्हाला कसे वाटते? तुमची मुख्य लक्षणे काय आहेत?',
        pa: 'ਮੈਨੂੰ ਦੱਸੋ ਕਿ ਤੁਸੀਂ ਕਿਵੇਂ ਮਹਿਸੂਸ ਕਰ ਰਹੇ ਹੋ? ਤੁਹਾਡੇ ਮੁੱਖ ਲੱਛਣ ਕੀ ਹਨ?',
        en: 'Tell me how you are feeling? What are your main symptoms?'
      }
    },
    {
      question: {
        hi: 'ये लक्षण कब से हैं? क्या यह अचानक शुरू हुआ या धीरे-धीरे?',
        mr: 'ही लक्षणे कधी पासून आहेत? हे अचानक सुरू झाले की हळूहळू?',
        pa: 'ਇਹ ਲੱਛਣ ਕਦੋਂ ਤੋਂ ਹਨ? ਕੀ ਇਹ ਅਚਾਨਕ ਸ਼ੁਰੂ ਹੋਏ ਜਾਂ ਹੌਲੀ-ਹੌਲੀ?',
        en: 'How long have you had these symptoms? Did they start suddenly or gradually?'
      }
    },
    {
      question: {
        hi: 'क्या आपको बुखार है? दर्द का स्तर 1-10 में कितना है?',
        mr: 'तुम्हाला ताप आहे का? वेदना पातळी 1-10 मध्ये किती आहे?',
        pa: 'ਕੀ ਤੁਹਾਨੂੰ ਬੁਖ਼ਾਰ ਹੈ? ਦਰਦ ਦਾ ਪੱਧਰ 1-10 ਵਿੱਚ ਕਿੰਨਾ ਹੈ?',
        en: 'Do you have fever? What is your pain level on a scale of 1-10?'
      }
    }
  ];

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
        content: language === 'hi' ? 'नमस्ते! मैं आपका AI सहायक हूं। आइए आपके लक्षणों की जांच करें।' :
          language === 'mr' ? 'नमस्कार! मी तुमचा AI सहायक आहे. चला तुमच्या लक्षणांची तपासणी करूया.' :
            language === 'pa' ? 'ਨਮਸਤੇ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਹਾਇਕ ਹਾਂ। ਆਓ ਤੁਹਾਡੇ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਕਰੀਏ।' :
              'Hello! I\'m your AI assistant. Let\'s check your symptoms.',
        timestamp: new Date()
      };
      setMessages([initialMessage]);

      setTimeout(() => {
        const firstQuestion = {
          type: 'bot' as const,
          content: conversationFlow[0].question[language],
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
    setCurrentInput('');
    setIsAnalyzing(true);

    // Clear uploaded images after sending
    setUploadedImages([]);

    // Simulate AI processing
    setTimeout(() => {
      if (conversationStep < conversationFlow.length - 1) {
        // Continue conversation
        const nextStep = conversationStep + 1;
        const botResponse: ChatMessage = {
          type: 'bot',
          content: conversationFlow[nextStep].question[language],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setConversationStep(nextStep);
      } else {
        // Final analysis
        performAnalysis();
      }
      setIsAnalyzing(false);
    }, 1500);
  };

  const performAnalysis = () => {
    // Mock analysis based on symptoms
    const symptoms = messages
      .filter(m => m.type === 'user')
      .map(m => m.content)
      .join(' ')
      .toLowerCase();

    let result: AnalysisResult;

    // Simple keyword-based analysis
    if (symptoms.includes('chest pain') || symptoms.includes('breathing') || symptoms.includes('heart')) {
      result = {
        condition: language === 'hi' ? 'संभावित हृदय संबंधी समस्या' :
          language === 'mr' ? 'संभाव्य हृदयाशी संबंधित समस्या' :
            language === 'pa' ? 'ਸੰਭਾਵਿਤ ਦਿਲ ਸੰਬੰਧੀ ਸਮੱਸਿਆ' :
              'Possible Heart-related Issue',
        severity: 'red' as SeverityZone,
        response: language === 'hi' ? 'तुरंत आपातकालीन चिकित्सा सहायता लें।' :
          language === 'mr' ? 'ताबडतोब आपत्कालीन वैद्यकीय मदत घ्या.' :
            language === 'pa' ? 'ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਮੈਡੀਕਲ ਮਦਦ ਲਓ।' :
              'Seek immediate emergency medical help.',
        doctorType: 'Emergency Doctor',
        recommendations: [
          language === 'hi' ? 'तुरंत 102 पर कॉल करें' :
            language === 'mr' ? 'ताबडतोब 102 वर कॉल करा' :
              language === 'pa' ? 'ਤੁਰੰਤ 102 ਤੇ ਕਾਲ ਕਰੋ' :
                'Call 102 immediately',
          language === 'hi' ? 'निकटतम अस्पताल जाएं' :
            language === 'mr' ? 'जवळच्या रुग्णालयात जा' :
              language === 'pa' ? 'ਨੇੜਲੇ ਹਸਪਤਾਲ ਜਾਓ' :
                'Go to nearest hospital'
        ]
      };
    } else if (symptoms.includes('fever') || symptoms.includes('cold') || symptoms.includes('cough')) {
      result = {
        condition: language === 'hi' ? 'सामान्य सर्दी-जुकाम/वायरल संक्रमण' :
          language === 'mr' ? 'सामान्य सर्दी-खोकला/व्हायरल संसर्ग' :
            language === 'pa' ? 'ਆਮ ਸਰਦੀ-ਖੰਘ/ਵਾਇਰਲ ਇਨਫੈਕਸ਼ਨ' :
              'Common Cold/Viral Infection',
        severity: 'yellow' as SeverityZone,
        response: language === 'hi' ? 'आराम करें और डॉक्टर से सलाह लें।' :
          language === 'mr' ? 'आराम करा आणि डॉक्टरांचा सल्ला घ्या.' :
            language === 'pa' ? 'ਆਰਾਮ ਕਰੋ ਅਤੇ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਓ।' :
              'Rest and consult with a doctor.',
        doctorType: 'General Physician',
        recommendations: [
          language === 'hi' ? 'पर्याप्त आराम करें' :
            language === 'mr' ? 'पुरेसा आराम करा' :
              language === 'pa' ? 'ਲੋੜੀਂਦਾ ਆਰਾਮ ਕਰੋ' :
                'Get adequate rest',
          language === 'hi' ? 'तरल पदार्थ अधिक लें' :
            language === 'mr' ? 'द्रव पदार्थ जास्त घ्या' :
              language === 'pa' ? 'ਤਰਲ ਪਦਾਰਥ ਜ਼ਿਆਦਾ ਲਓ' :
                'Increase fluid intake'
        ]
      };
    } else {
      result = {
        condition: language === 'hi' ? 'सामान्य स्वास्थ्य जांच आवश्यक' :
          language === 'mr' ? 'सामान्य आरोग्य तपासणी आवश्यक' :
            language === 'pa' ? 'ਆਮ ਸੁਆਸਥ ਜਾਂਚ ਲੋੜੀਂਦੀ' :
              'General Health Check Required',
        severity: 'green' as SeverityZone,
        response: language === 'hi' ? 'सामान्य चेकअप के लिए डॉक्टर से मिलें।' :
          language === 'mr' ? 'सामान्य चेकअपसाठी डॉक्टरांना भेटा.' :
            language === 'pa' ? 'ਆਮ ਚੈਕਅਪ ਲਈ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' :
              'Visit doctor for general checkup.',
        doctorType: 'General Physician',
        recommendations: [
          language === 'hi' ? 'नियमित व्यायाम करें' :
            language === 'mr' ? 'नियमित व्यायाम करा' :
              language === 'pa' ? 'ਨਿਯਮਿਤ ਕਸਰਤ ਕਰੋ' :
                'Regular exercise',
          language === 'hi' ? 'संतुलित आहार लें' :
            language === 'mr' ? 'संतुलित आहार घ्या' :
              language === 'pa' ? 'ਸੰਤੁਲਿਤ ਖੁਰਾਕ ਲਓ' :
                'Balanced diet'
        ]
      };
    }

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
                className={`max-w-[85%] rounded-2xl p-3 ${message.type === 'user'
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
                        {language === 'hi' ? '🚨 लाल क्षेत्र - तुरंत आपातकालीन सहायता' :
                          language === 'mr' ? '🚨 लाल झोन - ताबडतोब आपत्कालीन मदत' :
                            language === 'pa' ? '🚨 ਲਾਲ ਜ਼ੋਨ - ਤੁਰੰਤ ਐਮਰਜੈਂਸੀ ਮਦਦ' :
                              '🚨 RED ZONE - Immediate Emergency Help'}
                      </p>
                      <p className="text-red-700">
                        {language === 'hi' ? 'तुरंत 102 पर कॉल करें या निकटतम अस्पताल जाएं।' :
                          language === 'mr' ? 'ताबडतोब 102 वर कॉल करा किंवा जवळच्या रुग्णालयात जा.' :
                            language === 'pa' ? 'ਤੁਰੰਤ 102 ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਨੇੜਲੇ ਹਸਪਤਾਲ ਜਾਓ।' :
                              'Call 102 immediately or go to the nearest hospital.'}
                      </p>
                    </div>
                  )}

                  {analysisResult.severity === 'orange' && (
                    <div>
                      <p className="font-medium text-orange-800 mb-1">
                        {language === 'hi' ? '🟠 नारंगी क्षेत्र - जल्दी चिकित्सा सहायता' :
                          language === 'mr' ? '🟠 नारिंगी झोन - लवकर वैद्यकीय मदत' :
                            language === 'pa' ? '🟠 ਸੰਤਰੀ ਜ਼ੋਨ - ਜਲਦੀ ਮੈਡੀਕਲ ਮਦਦ' :
                              '🟠 ORANGE ZONE - Quick Medical Help'}
                      </p>
                      <p className="text-orange-700">
                        {language === 'hi' ? '24 घंटे के भीतर डॉक्टर से मिलें।' :
                          language === 'mr' ? '24 तासांच्या आत डॉक्टरांना भेटा.' :
                            language === 'pa' ? '24 ਘੰਟਿਆਂ ਦੇ ਅੰਦਰ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' :
                              'See a doctor within 24 hours.'}
                      </p>
                    </div>
                  )}

                  {analysisResult.severity === 'yellow' && (
                    <div>
                      <p className="font-medium text-yellow-800 mb-1">
                        {language === 'hi' ? '🟡 पीला क्षेत्र - चिकित्सा सलाह लें' :
                          language === 'mr' ? '🟡 पिवळा झोन - वैद्यकीय सल्ला घ्या' :
                            language === 'pa' ? '🟡 ਪੀਲਾ ਜ਼ੋਨ - ਮੈਡੀਕਲ ਸਲਾਹ ਲਓ' :
                              '🟡 YELLOW ZONE - Medical Advice'}
                      </p>
                      <p className="text-yellow-700">
                        {language === 'hi' ? '2-3 दिन में डॉक्टर से मिलें।' :
                          language === 'mr' ? '2-3 दिवसांत डॉक्टरांना भेटा.' :
                            language === 'pa' ? '2-3 ਦਿਨਾਂ ਵਿੱਚ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' :
                              'See a doctor within 2-3 days.'}
                      </p>
                    </div>
                  )}

                  {analysisResult.severity === 'green' && (
                    <div>
                      <p className="font-medium text-green-800 mb-1">
                        {language === 'hi' ? '🟢 हरा क्षेत्र - सामान्य देखभाल' :
                          language === 'mr' ? '🟢 हिरवा झोन - सामान्य काळजी' :
                            language === 'pa' ? '🟢 ਹਰਾ ਜ਼ੋਨ - ਆਮ ਦੇਖਭਾਲ' :
                              '🟢 GREEN ZONE - General Care'}
                      </p>
                      <p className="text-green-700">
                        {language === 'hi' ? 'घरेलू उपचार और आराम करें। आवश्यकता हो तो डॉक्टर से मिलें।' :
                          language === 'mr' ? 'घरगुती उपचार आणि आराम करा. गरज भासल्यास डॉक्टरांना भेटा.' :
                            language === 'pa' ? 'ਘਰੇਲੂ ਇਲਾਜ ਅਤੇ ਆਰਾਮ ਕਰੋ। ਲੋੜ ਹੋਵੇ ਤਾਂ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' :
                              'Home care and rest. See doctor if needed.'}
                      </p>
                    </div>
                  )}
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
                    {language === 'hi' ? 'डॉक्टर से सलाह लें' :
                      language === 'mr' ? 'डॉक्टरांचा सल्ला घ्या' :
                        language === 'pa' ? 'ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਲਓ' : 'Consult Doctor'}
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

              {conversationStep === 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">
                    {language === 'hi' ? 'उदाहरण:' :
                      language === 'mr' ? 'उदाहरणे:' :
                        language === 'pa' ? 'ਉਦਾਹਰਣਾਂ:' : 'Examples:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      language === 'hi' ? 'सिरदर्द और बुखार' : language === 'mr' ? 'डोकेदुखी आणि ताप' : language === 'pa' ? 'ਸਿਰ ਦਰਦ ਅਤੇ ਬੁਖ਼ਾਰ' : 'Headache and fever',
                      language === 'hi' ? 'पेट में दर्द' : language === 'mr' ? 'पोटात दुखणे' : language === 'pa' ? 'ਪੇਟ ਵਿਚ ਦਰਦ' : 'Stomach pain',
                      language === 'hi' ? 'खांसी और सर्दी' : language === 'mr' ? 'खोकला आणि सर्दी' : language === 'pa' ? 'ਖੰਘ ਅਤੇ ਸਰਦੀ' : 'Cough and cold'
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}