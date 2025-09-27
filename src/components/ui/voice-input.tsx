import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VoiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  className,
  disabled
}) => {
  const [isListening, setIsListening] = useState(false);

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.success('🎤 Voice input started - please speak now');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onChange(value + (value ? ' ' : '') + transcript);
        toast.success('✅ Voice input captured');
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        toast.error('❌ Voice input error: ' + event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast.error('Voice input not supported in this browser');
    }
  };

  const stopVoiceInput = () => {
    setIsListening(false);
  };

  return (
    <div className="relative">
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`pr-12 ${className}`}
          disabled={disabled}
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pr-12 ${className}`}
          disabled={disabled}
        />
      )}
      
      <Button
        type="button"
        variant={isListening ? "destructive" : "ghost"}
        size="sm"
        className="absolute right-2 top-2 h-8 w-8 p-0"
        onClick={isListening ? stopVoiceInput : startVoiceInput}
        disabled={disabled}
      >
        {isListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};