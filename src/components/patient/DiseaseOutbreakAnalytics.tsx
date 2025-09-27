import React, { useState } from 'react';
import { Patient, ASHAWorker, Language } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft, 
  TrendingUp, 
  AlertTriangle, 
  MapPin, 
  Calendar,
  Users,
  Shield,
  Info,
  BarChart3,
  Lock,
  Clock
} from 'lucide-react';
import { getTranslation } from '../../utils/translations';

interface DiseaseOutbreakAnalyticsProps {
  user: Patient | ASHAWorker;
  language: Language;
  onBack: () => void;
}

export const DiseaseOutbreakAnalytics: React.FC<DiseaseOutbreakAnalyticsProps> = ({
  user,
  language,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('current-outbreaks');

  const t = (key: string) => getTranslation(key, language);

  // Mock outbreak data
  const currentOutbreaks = [
    {
      id: 1,
      disease: language === 'hi' ? 'डेंगू बुखार' :
               language === 'mr' ? 'डेंग्यू ताप' :
               language === 'pa' ? 'ਡੈਂਗੂ ਬੁਖਾਰ' : 'Dengue Fever',
      severity: 'high',
      cases: 247,
      trend: 'increasing',
      location: language === 'hi' ? 'आपके क्षेत्र में' :
                language === 'mr' ? 'तुमच्या भागात' :
                language === 'pa' ? 'ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ' : 'In Your Area',
      lastUpdated: '2 hours ago',
      riskLevel: 'High',
      transmission: language === 'hi' ? 'मच्छरों के काटने से' :
                    language === 'mr' ? 'डासांच्या चावण्यापासून' :
                    language === 'pa' ? 'ਮੱਛਰਾਂ ਦੇ ਕੱਟਣ ਨਾਲ' : 'Mosquito bites'
    },
    {
      id: 2,
      disease: language === 'hi' ? 'वायरल गैस्ट्रोएंटेराइटिस' :
               language === 'mr' ? 'व्हायरल गॅस्ट्रोएन्टेरायटिस' :
               language === 'pa' ? 'ਵਾਇਰਲ ਗੈਸਟ੍ਰੋਐਂਟੇਰਾਇਟਿਸ' : 'Viral Gastroenteritis',
      severity: 'medium',
      cases: 89,
      trend: 'stable',
      location: language === 'hi' ? 'जिला स्तर पर' :
                language === 'mr' ? 'जिल्हा पातळीवर' :
                language === 'pa' ? 'ਜ਼ਿਲ੍ਹਾ ਪੱਧਰ ਤੇ' : 'District Level',
      lastUpdated: '6 hours ago',
      riskLevel: 'Medium',
      transmission: language === 'hi' ? 'दूषित पानी/भोजन' :
                    language === 'mr' ? 'दूषित पाणी/अन्न' :
                    language === 'pa' ? 'ਦੂਸ਼ਿਤ ਪਾਣੀ/ਭੋਜਨ' : 'Contaminated water/food'
    }
  ];

  const preventiveMeasures = {
    dengue: [
      {
        title: language === 'hi' ? 'पानी का भंडारण न करें' :
               language === 'mr' ? 'पाणी साठवू नका' :
               language === 'pa' ? 'ਪਾਣੀ ਜਮ੍ਹਾ ਨਾ ਕਰੋ' : 'Avoid water stagnation',
        description: language === 'hi' ? 'घर के आसपास पानी जमा न होने दें' :
                     language === 'mr' ? 'घराभोवती पाणी जमा होऊ देऊ नका' :
                     language === 'pa' ? 'ਘਰ ਦੇ ਆਸ ਪਾਸ ਪਾਣੀ ਇਕੱਠਾ ਨਾ ਹੋਣ ਦਿਓ' : 'Prevent water accumulation around your home'
      },
      {
        title: language === 'hi' ? 'मच्छरदानी का प्रयोग करें' :
               language === 'mr' ? 'डासपटी वापरा' :
               language === 'pa' ? 'ਮੱਛਰਦਾਨੀ ਦਾ ਇਸਤੇਮਾਲ ਕਰੋ' : 'Use mosquito nets',
        description: language === 'hi' ? 'सोते समय मच्छरदानी लगाकर सोएं' :
                     language === 'mr' ? 'झोपताना डासपटी लावून झोपा' :
                     language === 'pa' ? 'ਸੁੱਤੇ ਸਮੇਂ ਮੱਛਰਦਾਨੀ ਲਗਾ ਕੇ ਸੌਓ' : 'Sleep under mosquito nets'
      },
      {
        title: language === 'hi' ? 'फुल स्लीव कपड़े पहनें' :
               language === 'mr' ? 'पूर्ण बाही कपडे घाला' :
               language === 'pa' ? 'ਪੂਰੀ ਬਾਂਹ ਦੇ ਕੱਪੜੇ ਪਹਿਨੋ' : 'Wear full-sleeve clothes',
        description: language === 'hi' ? 'खासकर सुबह और शाम के समय' :
                     language === 'mr' ? 'विशेषतः सकाळ आणि संध्याकाळी' :
                     language === 'pa' ? 'ਖਾਸ ਕਰਕੇ ਸਵੇਰੇ ਅਤੇ ਸ਼ਾਮ ਦੇ ਸਮੇਂ' : 'Especially during morning and evening hours'
      }
    ]
  };

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
    }
    return <BarChart3 className="w-4 h-4 text-orange-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg">
            {language === 'hi' ? 'रोग विकास विश्लेषण' :
             language === 'mr' ? 'रोग विकास विश्लेषण' :
             language === 'pa' ? 'ਰੋਗ ਵਿਕਾਸ ਵਿਸ਼ਲੇਸ਼ਣ' :
             'Disease Outbreak Analytics'}
          </h1>
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
                <h3 className="font-medium text-amber-800 mb-1">
                  {language === 'hi' ? 'प्रीमियम सुविधा - भविष्य में उपलब्ध' :
                   language === 'mr' ? 'प्रीमियम सुविधा - भविष्यात उपलब्ध' :
                   language === 'pa' ? 'ਪ੍ਰੀਮੀਅਮ ਸੁਵਿਧਾ - ਭਵਿੱਖ ਵਿੱਚ ਉਪਲਬਧ' :
                   'Premium Feature - Available in Future'}
                </h3>
                <p className="text-sm text-amber-700 mb-2">
                  {language === 'hi' ? 'यह सुविधा 2 साल के ऐप उपयोग के बाद शुल्क के साथ उपलब्ध होगी। नीचे दिया गया डेटा केवल उदाहरण है।' :
                   language === 'mr' ? 'ही सुविधा 2 वर्षांच्या अॅप वापरानंतर शुल्कासह उपलब्ध होईल. खाली दिलेला डेटा फक्त उदाहरण आहे.' :
                   language === 'pa' ? 'ਇਹ ਸੁਵਿਧਾ 2 ਸਾਲ ਦੇ ਐਪ ਵਰਤੋਂ ਤੋਂ ਬਾਅਦ ਸ਼ੁਲਕ ਦੇ ਨਾਲ ਉਪਲਬਧ ਹੋਵੇਗੀ। ਹੇਠਾਂ ਦਿੱਤਾ ਡੇਟਾ ਸਿਰਫ਼ ਉਦਾਹਰਣ ਹੈ।' :
                   'This feature will be provided after 2 years of app usage and will be charged. The data below is sample only.'}
                </p>
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <Clock className="w-3 h-3" />
                  <span>
                    {language === 'hi' ? 'उपलब्धता: 2027 में' :
                     language === 'mr' ? 'उपलब्धता: 2027 मध्ये' :
                     language === 'pa' ? 'ਉਪਲਬਧਤਾ: 2027 ਵਿੱਚ' :
                     'Availability: 2027'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current-outbreaks">
              {language === 'hi' ? 'वर्तमान प्रकोप' :
               language === 'mr' ? 'सध्याचे प्रादुर्भाव' :
               language === 'pa' ? 'ਮੌਜੂਦਾ ਫੈਲਾਅ' :
               'Current Outbreaks'}
            </TabsTrigger>
            <TabsTrigger value="prevention">
              {language === 'hi' ? 'रोकथाम' :
               language === 'mr' ? 'प्रतिबंध' :
               language === 'pa' ? 'ਰੋਕਥਾਮ' :
               'Prevention'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current-outbreaks" className="space-y-4">
            {currentOutbreaks.map((outbreak) => (
              <Card key={outbreak.id} className="border-l-4 border-l-red-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      {outbreak.disease}
                    </CardTitle>
                    <Badge className={getRiskColor(outbreak.riskLevel)}>
                      {language === 'hi' ? 'उच्च जोखिम' :
                       language === 'mr' ? 'उच्च धोका' :
                       language === 'pa' ? 'ਉੱਚਾ ਜੋਖਮ' :
                       outbreak.riskLevel} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {language === 'hi' ? 'मामले' :
                           language === 'mr' ? 'प्रकरणे' :
                           language === 'pa' ? 'ਕੇਸ' :
                           'Cases'}
                        </p>
                        <p className="font-medium">{outbreak.cases}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(outbreak.trend)}
                      <div>
                        <p className="text-sm text-gray-600">
                          {language === 'hi' ? 'रुझान' :
                           language === 'mr' ? 'ट्रेंड' :
                           language === 'pa' ? 'ਰੁਝਾਨ' :
                           'Trend'}
                        </p>
                        <p className="font-medium capitalize">{outbreak.trend}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{outbreak.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">
                      {language === 'hi' ? 'संचरण: ' :
                       language === 'mr' ? 'संक्रमण: ' :
                       language === 'pa' ? 'ਸੰਚਾਰ: ' :
                       'Transmission: '}
                      {outbreak.transmission}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {language === 'hi' ? 'तत्काल सावधानी' :
                         language === 'mr' ? 'तातडीची खबरदारी' :
                         language === 'pa' ? 'ਤੁਰੰਤ ਸਾਵਧਾਨੀ' :
                         'Immediate Precautions'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {outbreak.disease.includes('डेंगू') || outbreak.disease.includes('Dengue') 
                        ? (language === 'hi' ? 'मच्छरदानी का प्रयोग करें, साफ पानी पिएं, बुखार होने पर तुरंत डॉक्टर से मिलें।' :
                           language === 'mr' ? 'डासपटी वापरा, स्वच्छ पाणी प्या, ताप आल्यास ताबडतोब डॉक्टरांना भेटा.' :
                           language === 'pa' ? 'ਮੱਛਰਦਾਨੀ ਵਰਤੋ, ਸਾਫ਼ ਪਾਣੀ ਪੀਓ, ਬੁਖਾਰ ਹੋਣ ਤੇ ਤੁਰੰਤ ਡਾਕਟਰ ਨੂੰ ਮਿਲੋ।' :
                           'Use mosquito nets, drink clean water, consult doctor immediately if fever occurs.')
                        : (language === 'hi' ? 'साफ पानी पिएं, हाथ धोएं, पका हुआ भोजन करें।' :
                           language === 'mr' ? 'स्वच्छ पाणी प्या, हात धुवा, शिजवलेले अन्न खा.' :
                           language === 'pa' ? 'ਸਾਫ਼ ਪਾਣੀ ਪੀਓ, ਹੱਥ ਧੋਵੋ, ਪਕਿਆ ਭੋਜਨ ਕਰੋ।' :
                           'Drink clean water, wash hands, eat cooked food.')
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {language === 'hi' ? 'अंतिम अपडेट: ' :
                       language === 'mr' ? 'शेवटचे अपडेट: ' :
                       language === 'pa' ? 'ਆਖਰੀ ਅਪਡੇਟ: ' :
                       'Last updated: '}
                      {outbreak.lastUpdated}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="prevention" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  {language === 'hi' ? 'डेंगू बुखार से बचाव' :
                   language === 'mr' ? 'डेंग्यू तापापासून बचाव' :
                   language === 'pa' ? 'ਡੈਂਗੂ ਬੁਖਾਰ ਤੋਂ ਬਚਾਅ' :
                   'Dengue Fever Prevention'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {preventiveMeasures.dengue.map((measure, index) => (
                  <div key={index} className="border-l-4 border-l-green-500 pl-4 py-2">
                    <h4 className="font-medium text-green-900 mb-1">{measure.title}</h4>
                    <p className="text-sm text-gray-700">{measure.description}</p>
                  </div>
                ))}
                
                <div className="bg-green-50 rounded-lg p-4 mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">
                      {language === 'hi' ? 'डॉक्टर से कब मिलें' :
                       language === 'mr' ? 'डॉक्टरांना कधी भेटावे' :
                       language === 'pa' ? 'ਡਾਕਟਰ ਨੂੰ ਕਦੋਂ ਮਿਲਣਾ ਚਾਹੀਦਾ' :
                       'When to See a Doctor'}
                    </span>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• {language === 'hi' ? 'तेज बुखार (101°F से अधिक)' :
                           language === 'mr' ? 'तीव्र ताप (101°F पेक्षा जास्त)' :
                           language === 'pa' ? 'ਤੇਜ਼ ਬੁਖਾਰ (101°F ਤੋਂ ਜ਼ਿਆਦਾ)' :
                           'High fever (above 101°F)'}</li>
                    <li>• {language === 'hi' ? 'सिरदर्द और मांसपेशियों में दर्द' :
                           language === 'mr' ? 'डोकेदुखी आणि स्नायुंमध्ये दुखणे' :
                           language === 'pa' ? 'ਸਿਰ ਦਰਦ ਅਤੇ ਮਾਸਪੇਸ਼ੀਆਂ ਵਿੱਚ ਦਰਦ' :
                           'Headache and muscle pain'}</li>
                    <li>• {language === 'hi' ? 'मतली और उल्टी' :
                           language === 'mr' ? 'मळमळ आणि उलटी' :
                           language === 'pa' ? 'ਜੀ ਮਿਚਲਾਉਣਾ ਅਤੇ ਉਲਟੀ' :
                           'Nausea and vomiting'}</li>
                    <li>• {language === 'hi' ? 'त्वचा पर लाल चकत्ते' :
                           language === 'mr' ? 'त्वचेवर लाल ठिपके' :
                           language === 'pa' ? 'ਚਮੜੀ ਤੇ ਲਾਲ ਦਾਗ' :
                           'Red spots on skin'}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};