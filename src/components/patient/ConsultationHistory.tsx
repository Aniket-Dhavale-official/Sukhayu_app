import React, { useState } from 'react';
import { Patient, ASHAWorker, Language } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ArrowLeft, FileText, Upload, Download, Calendar, User } from 'lucide-react';
import { getTranslation } from '../../utils/translations';
import { mockConsultations, mockExternalConsultations } from '../../utils/mockData';
import { toast } from 'sonner@2.0.3';

interface ConsultationHistoryProps {
  user: Patient | ASHAWorker;
  language: Language;
  onBack: () => void;
}

export const ConsultationHistory: React.FC<ConsultationHistoryProps> = ({
  user,
  language,
  onBack
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    doctorName: '',
    date: '',
    file: null as File | null
  });

  const t = (key: string) => getTranslation(key, language);

  const patientConsultations = user.role === 'patient' 
    ? mockConsultations.filter(c => c.patientId === (user as Patient).patientId)
    : [];

  const externalConsultations = user.role === 'patient'
    ? mockExternalConsultations.filter(c => c.patientId === (user as Patient).patientId)
    : [];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadData(prev => ({ ...prev, file }));
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleUploadConsultation = () => {
    if (!uploadData.doctorName || !uploadData.date || !uploadData.file) {
      toast.error('Please fill all fields');
      return;
    }

    // Mock upload
    toast.success('Medical history uploaded successfully');
    setShowUpload(false);
    setUploadData({ doctorName: '', date: '', file: null });
  };

  const getSeverityColor = (severity: string) => {
    return severity === 'red' ? 'bg-red-100 text-red-800' :
           severity === 'orange' ? 'bg-orange-100 text-orange-800' :
           'bg-yellow-100 text-yellow-800';
  };

  const downloadPrescription = (consultationId: string) => {
    // Mock download
    toast.success('Prescription downloaded');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg">{t('pastConsultations')}</h1>
          <Button
            variant="ghost"
            onClick={() => setShowUpload(!showUpload)}
            className="p-2"
          >
            <Upload className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Upload External Consultation */}
        {showUpload && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('uploadExternal')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm mb-2">{t('doctorName')}</label>
                <Input
                  value={uploadData.doctorName}
                  onChange={(e) => setUploadData(prev => ({ ...prev, doctorName: e.target.value }))}
                  placeholder="Dr. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">{t('date')}</label>
                <Input
                  type="date"
                  value={uploadData.date}
                  onChange={(e) => setUploadData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Prescription PDF</label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUpload(false)}
                  className="flex-1"
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={handleUploadConsultation}
                  className="flex-1"
                >
                  {t('upload')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            {patientConsultations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No consultations yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {patientConsultations.map((consultation) => (
                  <div key={consultation.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>{consultation.doctorName}</span>
                        </div>
                        <p className="text-sm text-gray-600">{consultation.doctorDesignation}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{consultation.date}</span>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(consultation.severity)}>
                        {consultation.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm mb-1">{t('symptoms')}:</h4>
                      <div className="flex flex-wrap gap-1">
                        {consultation.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {consultation.diagnosis && (
                      <div>
                        <h4 className="text-sm mb-1">{t('diagnosis')}:</h4>
                        <p className="text-sm text-gray-800">{consultation.diagnosis}</p>
                      </div>
                    )}
                    
                    {consultation.prescriptionId && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPrescription(consultation.id)}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {t('download')} {t('prescription')}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Previous  Consultations */}
        {externalConsultations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Previous Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {externalConsultations.map((consultation) => (
                  <div key={consultation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>{consultation.doctorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{consultation.date}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPrescription(consultation.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};