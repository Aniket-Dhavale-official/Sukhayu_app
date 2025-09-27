import React, { useState, useEffect } from 'react';
import { Pharmacist, InventoryItem } from '../../types';
import { mockInventory } from '../../utils/mockData';
import { Package, AlertTriangle, Bell, Clock, TrendingUp, TrendingDown, Plus, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';

interface PharmacistHomepageProps {
  user: Pharmacist;
  onNavigate: (view: 'homepage' | 'profile' | 'inventory' | 'add-medicine' | 'predictive-analytics') => void;
}

export function PharmacistHomepage({ user, onNavigate }: PharmacistHomepageProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Load inventory for current pharmacy
    const pharmacyInventory = mockInventory.find(inv => inv.pharmacyId === user.licenseNumber);
    if (pharmacyInventory) {
      setInventory(pharmacyInventory.items);
      
      // Check for low stock items
      const lowStockItems = pharmacyInventory.items.filter(
        item => item.availableQuantity <= item.minStockLevel
      );
      
      if (lowStockItems.length > 0) {
        const lowStockNotifications = lowStockItems.map(
          item => `Low stock alert: ${item.medicineName} (${item.availableQuantity} remaining)`
        );
        setNotifications(lowStockNotifications);
      }
    }

    // Show end-of-day reminder (for demo purposes, showing at any time)
    const currentHour = new Date().getHours();
    if (currentHour >= 18) {
      setNotifications(prev => [...prev, 'Daily reminder: Please update your medicine inventory before closing.']);
    }
  }, [user.licenseNumber]);

  const lowStockCount = inventory.filter(item => item.availableQuantity <= item.minStockLevel).length;
  const totalMedicines = inventory.length;
  const totalAvailable = inventory.reduce((sum, item) => sum + item.availableQuantity, 0);
  const totalSold = inventory.reduce((sum, item) => sum + item.soldQuantity, 0);

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Welcome Section */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome Back!</h2>
        <p className="text-gray-600 mt-1">{user.fullName}</p>
        <p className="text-sm text-gray-500">{user.location}</p>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <Alert key={index} className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                {notification}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Medicines</p>
                <p className="text-2xl font-semibold text-gray-900">{totalMedicines}</p>
              </div>
              <Package className="h-8 w-8 text-[#007C91]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-semibold text-red-600">{lowStockCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Stock</p>
                <p className="text-2xl font-semibold text-green-600">{totalAvailable}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sold Today</p>
                <p className="text-2xl font-semibold text-blue-600">{totalSold}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={() => onNavigate('add-medicine')}
            className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Medicine
          </Button>
          
          <Button 
            onClick={() => onNavigate('inventory')}
            className="w-full bg-[#007C91] hover:bg-[#006a7a] text-white"
          >
            <Package className="h-4 w-4 mr-2" />
            Manage Inventory
          </Button>
          
          <Button 
            onClick={() => onNavigate('profile')}
            variant="outline"
            className="w-full"
          >
            <Package className="h-4 w-4 mr-2" />
            Update Profile
          </Button>

          <Button 
            onClick={() => onNavigate('predictive-analytics')}
            className="w-full bg-[#8E7CC3] hover:bg-[#7A6BB5] text-white relative"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Predictive Analytics
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white">!</span>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Low Stock Items */}
      {lowStockCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inventory
                .filter(item => item.availableQuantity <= item.minStockLevel)
                .slice(0, 3)
                .map(item => (
                  <div key={item.medicineId} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.medicineName}</p>
                      <p className="text-sm text-gray-600">
                        Only {item.availableQuantity} left (Min: {item.minStockLevel})
                      </p>
                    </div>
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      Low Stock
                    </Badge>
                  </div>
                ))}
              {lowStockCount > 3 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-[#007C91]"
                  onClick={() => onNavigate('inventory')}
                >
                  View All Low Stock Items
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Preview */}
      <Card className="border-l-4 border-l-[#8E7CC3]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#8E7CC3]" />
              Market Insights
            </span>
            <Badge className="bg-amber-100 text-amber-800 border-amber-300">
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">Disease Alert</span>
            </div>
            <p className="text-sm text-red-800">
              Dengue outbreak detected in {user.location}. Paracetamol demand increased by 40%.
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Stock Prediction</span>
            </div>
            <p className="text-sm text-blue-800">
              Winter approaching: Cough syrup demand expected to rise by 200% next month.
            </p>
          </div>
          <Button 
            onClick={() => onNavigate('predictive-analytics')}
            variant="outline"
            className="w-full text-[#8E7CC3] border-[#8E7CC3] hover:bg-[#8E7CC3] hover:text-white"
          >
            View Full Analytics
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Medicines in stock</span>
              <span className="font-semibold">{totalMedicines} types</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total available units</span>
              <span className="font-semibold text-green-600">{totalAvailable}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Units sold today</span>
              <span className="font-semibold text-blue-600">{totalSold}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Items needing restock</span>
              <span className="font-semibold text-red-600">{lowStockCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}