import React, { useState } from 'react';
import { Language } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, 
  Search,
  Pill,
  CheckCircle,
  XCircle,
  MapPin
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { mockInventory, mockPharmacists } from '../../utils/mockData';

interface MedicineAvailabilityCheckProps {
  language: Language;
  onBack: () => void;
}

export const MedicineAvailabilityCheck: React.FC<MedicineAvailabilityCheckProps> = ({
  language,
  onBack
}) => {
  const t = (key: string) => getTranslation(key, language);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const results: any[] = [];
    
    mockInventory.forEach((pharmacy) => {
      const pharmacyInfo = mockPharmacists.find(p => p.id === pharmacy.pharmacyId);
      pharmacy.items.forEach((item) => {
        if (item.medicineName.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({
            ...item,
            pharmacyName: pharmacyInfo?.pharmacyName || 'Unknown Pharmacy',
            pharmacyLocation: pharmacyInfo?.location || 'Unknown Location',
            isAvailable: item.availableQuantity > 0
          });
        }
      });
    });

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                {t('checkMedicineAvailability')}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search Section */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('medicineName')}</label>
            <div className="flex gap-2">
              <Input
                placeholder={t('enterMedicineName')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('searchMedicine')} Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('noMedicinesFound')}</p>
              </div>
            ) : (
              searchResults.map((result, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium">{result.medicineName}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <MapPin className="w-3 h-3" />
                          {result.pharmacyName}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{result.pharmacyLocation}</p>
                      </div>
                      <Badge 
                        className={
                          result.isAvailable 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {result.isAvailable ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {t('medicineAvailable')}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            {t('medicineUnavailable')}
                          </div>
                        )}
                      </Badge>
                    </div>
                    
                    {result.isAvailable && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{t('quantity')}:</span>
                        <span className="font-medium text-green-700">
                          {result.availableQuantity} units
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Common Medicines Quick Search */}
      {!hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common Medicines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {['Paracetamol 500mg', 'Amoxicillin 250mg', 'Omeprazole 20mg', 'Cetirizine 10mg'].map((medicine) => (
              <Button
                key={medicine}
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setSearchQuery(medicine);
                  handleSearch();
                }}
              >
                <Pill className="w-4 h-4 mr-2" />
                {medicine}
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};