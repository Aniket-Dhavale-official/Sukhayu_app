import React from 'react';
import { Language } from '../types';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

const languageOptions = [
  { value: 'en' as Language, label: 'English', nativeLabel: 'English' },
  { value: 'hi' as Language, label: 'Hindi', nativeLabel: 'हिंदी' },
  { value: 'mr' as Language, label: 'Marathi', nativeLabel: 'मराठी' },
  { value: 'pa' as Language, label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4" />
      <Select value={currentLanguage} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col">
                <span>{option.nativeLabel}</span>
                <span className="text-xs opacity-60">{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};