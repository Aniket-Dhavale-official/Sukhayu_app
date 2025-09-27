import React, { useState, useEffect } from 'react';
import { Pharmacist } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Package,
  AlertTriangle,
  Calendar,
  MapPin,
  Lock,
  Clock,
  LineChart,
  Activity,
  Users,
  Shield,
  Info
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface PredictiveAnalyticsProps {
  user: Pharmacist;
  onBack: () => void;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({
  user,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('stock-prediction');

  // Mock data for medicine stock prediction
  const stockPredictionData = [
    { month: 'Jan', paracetamol: 450, amoxicillin: 120, omeprazole: 85, predicted_paracetamol: 480, predicted_amoxicillin: 130, predicted_omeprazole: 90 },
    { month: 'Feb', paracetamol: 420, amoxicillin: 110, omeprazole: 90, predicted_paracetamol: 440, predicted_amoxicillin: 125, predicted_omeprazole: 95 },
    { month: 'Mar', paracetamol: 480, amoxicillin: 130, omeprazole: 95, predicted_paracetamol: 510, predicted_amoxicillin: 140, predicted_omeprazole: 100 },
    { month: 'Apr', paracetamol: 520, amoxicillin: 145, omeprazole: 110, predicted_paracetamol: 550, predicted_amoxicillin: 155, predicted_omeprazole: 115 },
    { month: 'May', paracetamol: 580, amoxicillin: 160, omeprazole: 125, predicted_paracetamol: 610, predicted_amoxicillin: 170, predicted_omeprazole: 130 },
    { month: 'Jun', paracetamol: 610, amoxicillin: 175, omeprazole: 140, predicted_paracetamol: 640, predicted_amoxicillin: 185, predicted_omeprazole: 145 },
    { month: 'Jul', paracetamol: 640, amoxicillin: 190, omeprazole: 155, predicted_paracetamol: 670, predicted_amoxicillin: 200, predicted_omeprazole: 160 },
    { month: 'Aug', paracetamol: 590, amoxicillin: 170, omeprazole: 145, predicted_paracetamol: 620, predicted_amoxicillin: 180, predicted_omeprazole: 150 },
    { month: 'Sep', paracetamol: 550, amoxicillin: 155, omeprazole: 130, predicted_paracetamol: 580, predicted_amoxicillin: 165, predicted_omeprazole: 135 },
    { month: 'Oct', paracetamol: 510, amoxicillin: 140, omeprazole: 115, predicted_paracetamol: 540, predicted_amoxicillin: 150, predicted_omeprazole: 120 },
    { month: 'Nov', paracetamol: 470, amoxicillin: 125, omeprazole: 100, predicted_paracetamol: 500, predicted_amoxicillin: 135, predicted_omeprazole: 105 },
    { month: 'Dec', paracetamol: 430, amoxicillin: 115, omeprazole: 95, predicted_paracetamol: 460, predicted_amoxicillin: 125, predicted_omeprazole: 100 }
  ];

  // Mock data for medicine categories distribution
  const medicineCategories = [
    { name: 'Pain Relief', value: 35, color: '#007C91' },
    { name: 'Antibiotics', value: 25, color: '#2ECC71' },
    { name: 'Digestive', value: 20, color: '#8E7CC3' },
    { name: 'Vitamins', value: 12, color: '#F39C12' },
    { name: 'Others', value: 8, color: '#E74C3C' }
  ];

  // Mock data for seasonal trends
  const seasonalTrends = [
    { season: 'Winter', cough_syrup: 85, fever_medicine: 90, vitamins: 65 },
    { season: 'Spring', cough_syrup: 45, fever_medicine: 60, vitamins: 70 },
    { season: 'Summer', cough_syrup: 25, fever_medicine: 40, vitamins: 55 },
    { season: 'Monsoon', cough_syrup: 70, fever_medicine: 80, vitamins: 60 }
  ];

  // Mock disease outbreak data for village
  const villageOutbreaks = [
    {
      id: 1,
      disease: 'Dengue Fever',
      severity: 'high',
      cases: 23,
      trend: 'increasing',
      location: user.location,
      lastUpdated: '3 hours ago',
      relatedMedicines: ['Paracetamol', 'ORS', 'Multivitamins'],
      stockImpact: 'High demand expected',
      recommendedStock: '150% of normal levels'
    },
    {
      id: 2,
      disease: 'Viral Gastroenteritis',
      severity: 'medium',
      cases: 12,
      trend: 'stable',
      location: user.location,
      lastUpdated: '8 hours ago',
      relatedMedicines: ['ORS', 'Loperamide', 'Probiotics'],
      stockImpact: 'Moderate demand increase',
      recommendedStock: '120% of normal levels'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') {
      return <TrendingUp className="w-4 h-4 text-red-600" />;
    } else if (trend === 'decreasing') {
      return <TrendingDown className="w-4 h-4 text-green-600" />;
    }
    return <BarChart3 className="w-4 h-4 text-orange-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#007C91] text-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button variant="ghost" onClick={onBack} className="p-2 text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg">Predictive Analytics</h1>
          <div></div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Premium Feature Notice */}
        <Card className="mb-4 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 mb-1">Premium Feature - Future Available</h3>
                <p className="text-sm text-amber-700 mb-2">
                  This feature will be provided after 2 years of app usage and will be charged. 
                  The data below is sample only for demonstration purposes.
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <Clock className="w-3 h-3" />
                  <span>Availability: 2027</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="stock-prediction">Stock Prediction</TabsTrigger>
            <TabsTrigger value="outbreak-analysis">Disease Outbreaks</TabsTrigger>
          </TabsList>

          <TabsContent value="stock-prediction" className="space-y-4">
            {/* Yearly Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-[#007C91]" />
                  Medicine Stock Prediction (2025)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={stockPredictionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="paracetamol" 
                        stroke="#007C91" 
                        strokeWidth={2}
                        name="Paracetamol (Actual)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted_paracetamol" 
                        stroke="#007C91" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Paracetamol (Predicted)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="amoxicillin" 
                        stroke="#2ECC71" 
                        strokeWidth={2}
                        name="Amoxicillin (Actual)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted_amoxicillin" 
                        stroke="#2ECC71" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Amoxicillin (Predicted)"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Medicine Categories Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#8E7CC3]" />
                  Medicine Categories Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={medicineCategories}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                        fontSize={10}
                      >
                        {medicineCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Seasonal Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#F39C12]" />
                  Seasonal Medicine Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={seasonalTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="season" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="cough_syrup" fill="#007C91" name="Cough Syrup" />
                      <Bar dataKey="fever_medicine" fill="#2ECC71" name="Fever Medicine" />
                      <Bar dataKey="vitamins" fill="#8E7CC3" name="Vitamins" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#E74C3C]" />
                  Key Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-l-blue-500">
                  <h4 className="font-medium text-blue-900 mb-1">Peak Season Alert</h4>
                  <p className="text-sm text-blue-800">
                    Winter months show 200% increase in cough syrup demand. 
                    Stock up by October for optimal availability.
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-l-green-500">
                  <h4 className="font-medium text-green-900 mb-1">Cost Optimization</h4>
                  <p className="text-sm text-green-800">
                    Paracetamol shows consistent demand. Consider bulk purchasing 
                    during April-June for better pricing.
                  </p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-l-orange-500">
                  <h4 className="font-medium text-orange-900 mb-1">Trending Medicine</h4>
                  <p className="text-sm text-orange-800">
                    Multivitamin demand increasing by 15% monthly. 
                    Consider expanding variety and stock levels.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outbreak-analysis" className="space-y-4">
            {villageOutbreaks.map((outbreak) => (
              <Card key={outbreak.id} className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      {outbreak.disease}
                    </CardTitle>
                    <Badge className={getRiskColor(outbreak.severity)}>
                      {outbreak.severity.charAt(0).toUpperCase() + outbreak.severity.slice(1)} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Cases</p>
                        <p className="font-medium">{outbreak.cases}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(outbreak.trend)}
                      <div>
                        <p className="text-sm text-gray-600">Trend</p>
                        <p className="font-medium capitalize">{outbreak.trend}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{outbreak.location}</span>
                  </div>

                  {/* Stock Impact Section */}
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-900">Stock Impact Analysis</span>
                    </div>
                    <p className="text-sm text-yellow-800 mb-2">{outbreak.stockImpact}</p>
                    <p className="text-sm font-medium text-yellow-900">
                      Recommended: {outbreak.recommendedStock}
                    </p>
                  </div>

                  {/* Related Medicines */}
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Related Medicines in High Demand</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {outbreak.relatedMedicines.map((medicine, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-300">
                          {medicine}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Recommendations */}
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Recommended Actions</span>
                    </div>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Increase stock levels for related medicines by 50%</li>
                      <li>• Contact suppliers for emergency stock if needed</li>
                      <li>• Monitor daily sales for trending patterns</li>
                      <li>• Coordinate with local health authorities</li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Last updated: {outbreak.lastUpdated}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};