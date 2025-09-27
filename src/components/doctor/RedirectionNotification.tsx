import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  User, 
  MapPin, 
  Calendar,
  AlertTriangle,
  X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RedirectionNotificationProps {
  patientName: string;
  patientId: string;
  fromDoctor: string;
  toDoctor: string;
  toDoctorName: string;
  priority: 'yellow' | 'orange';
  estimatedWaitTime: string;
  redirectionId: string;
  timestamp: string;
  onClose?: () => void;
}

export const RedirectionNotification: React.FC<RedirectionNotificationProps> = ({
  patientName,
  patientId,
  fromDoctor,
  toDoctor,
  toDoctorName,
  priority,
  estimatedWaitTime,
  redirectionId,
  timestamp,
  onClose
}) => {
  const [stage, setStage] = useState<'initial' | 'processing' | 'completed'>('initial');

  useEffect(() => {
    // Simulate the redirection process
    const timer1 = setTimeout(() => setStage('processing'), 1000);
    const timer2 = setTimeout(() => setStage('completed'), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getPriorityColor = (priority: string) => {
    return priority === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getPriorityDot = (priority: string) => {
    return priority === 'orange' ? 'bg-orange-500' : 'bg-yellow-500';
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-l-4 border-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {stage === 'initial' && <Clock className="w-5 h-5 text-blue-600" />}
            {stage === 'processing' && <ArrowRight className="w-5 h-5 text-orange-600 animate-pulse" />}
            {stage === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
            Patient Redirection
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Case #{redirectionId}
          </Badge>
          <Badge className={getPriorityColor(priority)}>
            {priority.toUpperCase()} Priority
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Patient Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <User className="w-8 h-8 text-blue-600 bg-blue-100 p-1.5 rounded-full" />
          <div>
            <h4 className="font-medium">{patientName}</h4>
            <p className="text-sm text-gray-600">ID: {patientId}</p>
          </div>
        </div>

        {/* Redirection Path */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-600">From:</span>
              <p className="font-medium">{fromDoctor}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
            <div className="text-sm text-right">
              <span className="text-gray-600">To:</span>
              <p className="font-medium">{toDoctor}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${getPriorityDot(priority)}`}></div>
              <span className="text-sm font-medium">Assigned Doctor</span>
            </div>
            <p className="text-sm text-gray-700">👨‍⚕️ {toDoctorName}</p>
            <p className="text-sm text-gray-600">⏱️ Est. wait time: {estimatedWaitTime}</p>
          </div>
        </div>

        {/* Status Updates */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <div className={`w-2 h-2 rounded-full ${stage === 'initial' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            <span className={stage === 'initial' ? 'text-blue-600' : 'text-green-600'}>
              Redirection initiated
            </span>
            {stage !== 'initial' && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              stage === 'processing' ? 'bg-orange-500 animate-pulse' : 
              stage === 'completed' ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
            <span className={
              stage === 'processing' ? 'text-orange-600' : 
              stage === 'completed' ? 'text-green-600' : 'text-gray-500'
            }>
              Transferring to {toDoctor} queue
            </span>
            {stage === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className={`w-2 h-2 rounded-full ${stage === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className={stage === 'completed' ? 'text-green-600' : 'text-gray-500'}>
              Patient notified of new assignment
            </span>
            {stage === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
          <Calendar className="w-3 h-3" />
          <span>Redirected on {timestamp}</span>
        </div>

        {/* Action Buttons */}
        {stage === 'completed' && (
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => toast.success('Queue status updated successfully')}
            >
              View Queue
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => toast.info('Notification sent to patient')}
            >
              Notify Patient
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Sample usage component for demonstration
export const RedirectionNotificationDemo: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);

  const sampleRedirection = {
    patientName: 'Ramesh Sharma',
    patientId: 'PT123456',
    fromDoctor: 'Chief Health Officer',
    toDoctor: 'Medical Officer',
    toDoctorName: 'Dr. Rajesh Kumar',
    priority: 'yellow' as const,
    estimatedWaitTime: '15-20 mins',
    redirectionId: 'RD1638273849',
    timestamp: new Date().toLocaleString()
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Sample Redirection Notification</h3>
        <Button 
          onClick={() => setShowNotification(true)}
          className="bg-teal-600 hover:bg-teal-700"
        >
          Simulate Patient Redirection
        </Button>
      </div>
      
      {showNotification && (
        <div className="mt-6">
          <RedirectionNotification
            {...sampleRedirection}
            onClose={() => setShowNotification(false)}
          />
        </div>
      )}
    </div>
  );
};