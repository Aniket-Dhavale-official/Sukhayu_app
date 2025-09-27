import React, { useState } from 'react';
import { Button } from './button';
import { Volume2, VolumeX, Pause } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface VoiceReaderProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'default';
}

export const VoiceReader: React.FC<VoiceReaderProps> = ({
  text,
  className,
  size = 'sm',
  variant = 'ghost'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSpeechSynthesis(synth);

      if (isPlaying) {
        synth.pause();
        setIsPlaying(false);
        return;
      }

      // Cancel any ongoing speech
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsPlaying(true);
        toast.success('🔊 Reading text aloud');
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error('❌ Error reading text');
      };

      synth.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in this browser');
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-3 h-3';
      case 'md': return 'w-4 h-4';
      case 'lg': return 'w-5 h-5';
      default: return 'w-4 h-4';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'h-6 w-6 p-0';
      case 'md': return 'h-8 w-8 p-0';
      case 'lg': return 'h-10 w-10 p-0';
      default: return 'h-8 w-8 p-0';
    }
  };

  if (!text || text.trim().length === 0) {
    return null;
  }

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant={variant}
        size="sm"
        className={`${getButtonSize()} ${className}`}
        onClick={speakText}
        title="Read text aloud"
      >
        {isPlaying ? (
          <Pause className={getIconSize()} />
        ) : (
          <Volume2 className={getIconSize()} />
        )}
      </Button>
      
      {isPlaying && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 ml-1"
          onClick={stopSpeaking}
          title="Stop reading"
        >
          <VolumeX className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};