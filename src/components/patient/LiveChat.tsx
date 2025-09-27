import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, 
  Send,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Check,
  CheckCheck,
  Camera
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';

interface LiveChatProps {
  language: Language;
  doctorName: string;
  onBack: () => void;
  onVideoCall: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'patient' | 'doctor';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'audio';
}

export const LiveChat: React.FC<LiveChatProps> = ({
  language,
  doctorName,
  onBack,
  onVideoCall
}) => {
  const t = (key: string) => getTranslation(key, language);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'hi' ? 'नमस्ते! मैं डॉ. कुमार हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?' :
            language === 'mr' ? 'नमस्कार! मी डॉ. कुमार आहे। आज मी तुमची कशी मदत करू शकतो?' :
            language === 'pa' ? 'ਨਮਸਤੇ! ਮੈਂ ਡਾ. ਕੁਮਾਰ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?' :
            'Hello! I am Dr. Kumar. How can I help you today?',
      sender: 'doctor',
      timestamp: '10:30 AM',
      status: 'read'
    },
    {
      id: '2',
      text: language === 'hi' ? 'मुझे सीने में दर्द और सांस लेने में कठिनाई हो रही है।' :
            language === 'mr' ? 'मला छातीत दुखत आहे आणि श्वास घेण्यात अडचण येत आहे।' :
            language === 'pa' ? 'ਮੈਨੂੰ ਸੀਨੇ ਵਿੱਚ ਦਰਦ ਅਤੇ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੋ ਰਹੀ ਹੈ।' :
            'I am experiencing chest pain and difficulty breathing.',
      sender: 'patient',
      timestamp: '10:32 AM',
      status: 'read'
    },
    {
      id: '3',
      text: language === 'hi' ? 'मैं समझ गया। कृपया शांत रहें। यह दर्द कब से शुरू हुआ? क्या यह तेज है या धीमा?' :
            language === 'mr' ? 'मला समजले. कृपया शांत राहा. हे दुखणे कधी सुरू झाले? ते तीव्र आहे की मंद?' :
            language === 'pa' ? 'ਮੈਂ ਸਮਝ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਸ਼ਾਂਤ ਰਹੋ। ਇਹ ਦਰਦ ਕਦੋਂ ਤੋਂ ਸ਼ੁਰੂ ਹੋਇਆ? ਕੀ ਇਹ ਤੇਜ਼ ਹੈ ਜਾਂ ਹੌਲੀ?' :
            'I understand. Please stay calm. When did this pain start? Is it sharp or dull?',
      sender: 'doctor',
      timestamp: '10:33 AM',
      status: 'read'
    },
    {
      id: '4',
      text: language === 'hi' ? 'लगभग 20 मिनट पहले शुरू हुआ। दर्द तेज है और दबाव जैसा लग रहा है।' :
            language === 'mr' ? 'सुमारे 20 मिनिटांपूर्वी सुरू झाले. दुखणे तीव्र आहे आणि दाब सारखे वाटत आहे।' :
            language === 'pa' ? 'ਲਗਭਗ 20 ਮਿੰਟ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਹੋਇਆ। ਦਰਦ ਤੇਜ਼ ਹੈ ਅਤੇ ਦਬਾਅ ਵਰਗਾ ਲੱਗ ਰਿਹਾ ਹੈ।' :
            'Started about 20 minutes ago. The pain is sharp and feels like pressure.',
      sender: 'patient',
      timestamp: '10:34 AM',
      status: 'read'
    },
    {
      id: '5',
      text: language === 'hi' ? '⚠️ यह गंभीर हो सकता है। कृपया तुरंत बैठ जाएं और गहरी सांस लेने की कोशिश करें। मैं आपको वीडियो कॉल पर तुरंत देखना चाहता हूं।' :
            language === 'mr' ? '⚠️ हे गंभीर असू शकते. कृपया ताबडतोब बसा आणि खोल श्वास घेण्याचा प्रयत्न करा. मला तुम्हाला व्हिडिओ कॉलवर लगेच पहायचे आहे।' :
            language === 'pa' ? '⚠️ ਇਹ ਗੰਭੀਰ ਹੋ ਸਕਦਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ ਬੈਠੋ ਅਤੇ ਡੂੰਘੇ ਸਾਹ ਲੈਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ। ਮੈਂ ਤੁਹਾਨੂੰ ਵੀਡੀਓ ਕਾਲ ਤੇ ਤੁਰੰਤ ਦੇਖਣਾ ਚਾਹੁੰਦਾ ਹਾਂ।' :
            '⚠️ This could be serious. Please sit down immediately and try to breathe deeply. I want to see you on video call right away.',
      sender: 'doctor',
      timestamp: '10:35 AM',
      status: 'read'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [doctorOnline, setDoctorOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getDoctorResponse = (patientMessage: string, isEmergency: boolean = false): string => {
    const lowerMessage = patientMessage.toLowerCase();
    
    if (isEmergency) {
      return language === 'hi' ? '⚠️ यह गंभीर लक्षण है। कृपया वीडियो कॉल पर आएं ताकि मैं आपको बेहतर तरीके से देख सकूं।' :
             language === 'mr' ? '⚠️ हे गंभीर लक्षण आहे. कृपया व्हिडिओ कॉलवर या जेणेकरून मी तुम्हाला चांगल्या प्रकारे पाहू शकेन।' :
             language === 'pa' ? '⚠️ ਇਹ ਗੰਭੀਰ ਲੱਛਣ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਵੀਡੀਓ ਕਾਲ ਤੇ ਆਓ ਤਾਂ ਜੋ ਮੈਂ ਤੁਹਾਨੂੰ ਬਿਹਤਰ ਤਰੀਕੇ ਨਾਲ ਦੇਖ ਸਕਾਂ।' :
             '⚠️ These are serious symptoms. Please join video call so I can examine you better.';
    }

    if (lowerMessage.includes('fever') || lowerMessage.includes('बुखार') || lowerMessage.includes('ताप') || lowerMessage.includes('ਬੁਖਾਰ')) {
      return language === 'hi' ? 'बुखार कितना है? कब से है? कोई और लक्षण भी हैं?' :
             language === 'mr' ? 'ताप किती आहे? कधीपासून आहे? इतर काही लक्षणे आहेत का?' :
             language === 'pa' ? 'ਬੁਖਾਰ ਕਿੰਨਾ ਹੈ? ਕਦੋਂ ਤੋਂ ਹੈ? ਕੋਈ ਹੋਰ ਲੱਛਣ ਵੀ ਹਨ?' :
             'What is your temperature? How long have you had fever? Any other symptoms?';
    }

    if (lowerMessage.includes('headache') || lowerMessage.includes('सिरदर्द') || lowerMessage.includes('डोकेदुखी') || lowerMessage.includes('ਸਿਰਦਰਦ')) {
      return language === 'hi' ? 'सिरदर्द कितना तेज है? कब से है? चक्कर भी आ रहे हैं?' :
             language === 'mr' ? 'डोकेदुखी किती तीव्र आहे? कधीपासून आहे? चक्कर येत आहेत का?' :
             language === 'pa' ? 'ਸਿਰਦਰਦ ਕਿੰਨਾ ਤੇਜ਼ ਹੈ? ਕਦੋਂ ਤੋਂ ਹੈ? ਚੱਕਰ ਵੀ ਆ ਰਹੇ ਹਨ?' :
             'How severe is the headache? How long have you had it? Are you feeling dizzy too?';
    }

    if (lowerMessage.includes('cough') || lowerMessage.includes('खांसी') || lowerMessage.includes('खोकला') || lowerMessage.includes('ਖੰਘ')) {
      return language === 'hi' ? 'खांसी सूखी है या कफ के साथ? कब से है? बुखार भी है?' :
             language === 'mr' ? 'खोकला कोरडा आहे की कफासह? कधीपासून आहे? ताप सुद्धा आहे का?' :
             language === 'pa' ? 'ਖੰਘ ਸੁੱਕੀ ਹੈ ਜਾਂ ਕਫ਼ ਨਾਲ? ਕਦੋਂ ਤੋਂ ਹੈ? ਬੁਖਾਰ ਵੀ ਹੈ?' :
             'Is the cough dry or with phlegm? How long have you had it? Do you have fever too?';
    }

    // Default responses
    const defaultResponses = [
      language === 'hi' ? 'मैं समझ गया। कृपया अपने लक्षणों के बारे में और बताएं।' :
      language === 'mr' ? 'मला समजले. कृपया तुमच्या लक्षणांबद्दल अधिक सांगा।' :
      language === 'pa' ? 'ਮੈਂ ਸਮਝ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਲੱਛਣਾਂ ਬਾਰੇ ਹੋਰ ਦੱਸੋ।' :
      'I understand. Please tell me more about your symptoms.',

      language === 'hi' ? 'कब से यह परेशानी है? क्या कोई दवा ले रहे हैं?' :
      language === 'mr' ? 'कधीपासून ही समस्या आहे? काही औषध घेत आहात का?' :
      language === 'pa' ? 'ਕਦੋਂ ਤੋਂ ਇਹ ਮੁਸ਼ਕਲ ਹੈ? ਕੋਈ ਦਵਾਈ ਲੈ ਰਹੇ ਹੋ?' :
      'How long have you had this problem? Are you taking any medications?',

      language === 'hi' ? 'ठीक है। क्या यह लक्षण दिन में बढ़ते हैं या रात में?' :
      language === 'mr' ? 'ठीक आहे. ही लक्षणे दिवसा वाढतात की रात्री?' :
      language === 'pa' ? 'ਠੀਕ ਹੈ। ਕੀ ਇਹ ਲੱਛਣ ਦਿਨ ਵਿੱਚ ਵਧਦੇ ਹਨ ਜਾਂ ਰਾਤ ਵਿੱਚ?' :
      'Okay. Do these symptoms get worse during the day or at night?'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const patientMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'patient',
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'sent'
    };

    setMessages(prev => [...prev, patientMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate message delivery status
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === patientMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 1000);

    // Check for emergency keywords
    const emergencyKeywords = [
      'chest pain', 'heart attack', 'cannot breathe', 'unconscious', 'severe bleeding',
      'सीने में दर्द', 'दिल का दौरा', 'सांस नहीं आ रही', 'बेहोश', 'तेज खून',
      'छातीत दुखत', 'हृदयविकार', 'श्वास घेता येत नाही', 'बेशुद्ध', 'रक्तस्राव',
      'ਸੀਨੇ ਵਿੱਚ ਦਰਦ', 'ਦਿਲ ਦਾ ਦੌਰਾ', 'ਸਾਹ ਨਹੀਂ ਆ ਰਿਹਾ', 'ਬੇਹੋਸ਼', 'ਖੂਨ ਵਗਣਾ'
    ];

    const hasEmergency = emergencyKeywords.some(keyword => 
      newMessage.toLowerCase().includes(keyword.toLowerCase())
    );

    // Simulate doctor typing and response
    setTimeout(() => {
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getDoctorResponse(newMessage, hasEmergency),
        sender: 'doctor',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'read'
      };
      setMessages(prev => [...prev, doctorResponse]);
      setIsTyping(false);

      // Mark patient message as read when doctor responds
      setMessages(prev => prev.map(msg => 
        msg.id === patientMessage.id ? { ...msg, status: 'read' } : msg
      ));
    }, 2500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const getMessageStatus = (status?: string) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-100">
      {/* WhatsApp-style Header */}
      <div className="bg-[#007C91] text-white p-3 flex items-center gap-3 shadow-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-1 hover:bg-white/10 text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-white text-[#007C91]">
            Dr
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-medium">{doctorName}</h3>
          <p className="text-xs text-green-200">
            {isTyping ? (language === 'hi' ? 'टाइप कर रहे हैं...' :
                        language === 'mr' ? 'टाईप करत आहेत...' :
                        language === 'pa' ? 'ਟਾਈਪ ਕਰ ਰਹੇ ਹਨ...' :
                        'typing...') : 
             doctorOnline ? (language === 'hi' ? 'ऑनलाइन' :
                           language === 'mr' ? 'ऑनलाईन' :
                           language === 'pa' ? 'ਔਨਲਾਈਨ' :
                           'online') : 
                          (language === 'hi' ? 'आखिरी बार 5 मिनट पहले देखा गया' :
                           language === 'mr' ? 'शेवटचे 5 मिनिटांपूर्वी पाहिले' :
                           language === 'pa' ? '5 ਮਿੰਟ ਪਹਿਲਾਂ ਆਖਰੀ ਵਾਰ ਦੇਖਿਆ' :
                           'last seen 5 minutes ago')}
          </p>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-white/10 text-white"
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onVideoCall}
            className="p-2 hover:bg-white/10 text-white"
          >
            <Video className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-white/10 text-white"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* WhatsApp-style Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e5ddd5] bg-opacity-50" 
           style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="chat-bg" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"%3E%3Cpath d="M50 0v100M0 50h100" stroke="%23ffffff" stroke-width="0.5" opacity="0.1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23chat-bg)"/%3E%3C/svg%3E")'}}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-lg p-3 shadow-sm relative ${
                message.sender === 'patient'
                  ? 'bg-[#dcf8c6] text-gray-800 rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${
                message.sender === 'patient' ? 'justify-end' : 'justify-start'
              }`}>
                <span className="text-xs text-gray-500">
                  {message.timestamp}
                </span>
                {message.sender === 'patient' && getMessageStatus(message.status)}
              </div>
              
              {/* WhatsApp-style message tail */}
              <div className={`absolute bottom-0 w-0 h-0 ${
                message.sender === 'patient' 
                  ? 'right-[-8px] border-l-[8px] border-l-[#dcf8c6] border-b-[8px] border-b-transparent'
                  : 'left-[-8px] border-r-[8px] border-r-white border-b-[8px] border-b-transparent'
              }`} />
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-3 shadow-sm max-w-[75%] rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <div className="absolute bottom-0 left-[-8px] w-0 h-0 border-r-[8px] border-r-white border-b-[8px] border-b-transparent" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* WhatsApp-style Message Input */}
      <div className="bg-white p-3 flex items-end gap-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-gray-500 hover:bg-gray-100"
        >
          <Smile className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-gray-500 hover:bg-gray-100"
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <div className="flex-1 bg-gray-100 rounded-full flex items-center">
          <Input
            placeholder={language === 'hi' ? 'संदेश टाइप करें' :
                        language === 'mr' ? 'संदेश टाईप करा' :
                        language === 'pa' ? 'ਸੰਦੇਸ਼ ਟਾਈਪ ਕਰੋ' :
                        'Type a message'}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-transparent border-0 focus:ring-0 rounded-full"
          />
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-500 hover:bg-gray-100 mr-1"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        
        {newMessage.trim() ? (
          <Button 
            onClick={handleSendMessage}
            size="sm"
            className="bg-[#007C91] hover:bg-[#006273] text-white rounded-full w-10 h-10 p-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <Mic className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};