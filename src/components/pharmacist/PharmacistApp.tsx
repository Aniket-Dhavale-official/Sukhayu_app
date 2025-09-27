import React, { useState } from 'react';
import { Pharmacist } from '../../types';
import { PharmacistHomepage } from './PharmacistHomepage';
import { PharmacistProfile } from './PharmacistProfile';
import { InventoryManagement } from './InventoryManagement';
import { AddMedicine } from './AddMedicine';
import { PredictiveAnalytics } from './PredictiveAnalytics';
import { User, Package, Bell, LogOut, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import sukhayuLogo from 'figma:asset/d04331b26d9697b77a11d091903e7e7f2fc132f0.png';

interface PharmacistAppProps {
  user: Pharmacist;
  onLogout: () => void;
}

type PharmacistView = 'homepage' | 'profile' | 'inventory' | 'add-medicine' | 'predictive-analytics';

export function PharmacistApp({ user, onLogout }: PharmacistAppProps) {
  const [currentView, setCurrentView] = useState<PharmacistView>('homepage');
  const [inventoryData, setInventoryData] = useState<any>(null);

  const handleAddMedicine = (newMedicine: any) => {
    // This would normally update the backend
    // For now, we'll just show success and navigate back
    setCurrentView('inventory');
  };

  const renderView = () => {
    switch (currentView) {
      case 'profile':
        return <PharmacistProfile user={user} onBack={() => setCurrentView('homepage')} />;
      case 'inventory':
        return (
          <InventoryManagement 
            user={user} 
            onBack={() => setCurrentView('homepage')}
            onAddMedicine={() => setCurrentView('add-medicine')}
          />
        );
      case 'add-medicine':
        return (
          <AddMedicine
            user={user}
            onBack={() => setCurrentView('inventory')}
            onAddMedicine={handleAddMedicine}
          />
        );
      case 'predictive-analytics':
        return (
          <PredictiveAnalytics
            user={user}
            onBack={() => setCurrentView('homepage')}
          />
        );
      default:
        return (
          <PharmacistHomepage 
            user={user} 
            onNavigate={(view) => {
              if (view === 'add-medicine') {
                setCurrentView('add-medicine');
              } else {
                setCurrentView(view);
              }
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#007C91] text-white p-4 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={sukhayuLogo} alt="Sukhayu Logo" className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-semibold">Sukhayu Pharmacy</h1>
              <p className="text-sm opacity-90">{user.pharmacyName}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-white hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {renderView()}
      </div>

      {/* Bottom Navigation */}
      {(currentView === 'homepage' || currentView === 'inventory' || currentView === 'add-medicine' || currentView === 'predictive-analytics') && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
          <div className="max-w-md mx-auto grid grid-cols-4 gap-2">
            <button
              onClick={() => setCurrentView('homepage')}
              className={`flex flex-col items-center py-2 ${
                currentView === 'homepage' ? 'text-[#007C91]' : 'text-gray-600'
              }`}
            >
              <Package className="h-4 w-4 mb-1" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => setCurrentView('inventory')}
              className={`flex flex-col items-center py-2 ${
                currentView === 'inventory' || currentView === 'add-medicine' ? 'text-[#007C91]' : 'text-gray-600'
              }`}
            >
              <Package className="h-4 w-4 mb-1" />
              <span className="text-xs">Inventory</span>
            </button>
            <button
              onClick={() => setCurrentView('predictive-analytics')}
              className={`flex flex-col items-center py-2 relative ${
                currentView === 'predictive-analytics' ? 'text-[#007C91]' : 'text-gray-600'
              }`}
            >
              <div className="relative">
                <BarChart3 className="h-4 w-4 mb-1" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></div>
              </div>
              <span className="text-xs">Analytics</span>
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`flex flex-col items-center py-2 ${
                currentView === 'profile' ? 'text-[#007C91]' : 'text-gray-600'
              }`}
            >
              <User className="h-4 w-4 mb-1" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}