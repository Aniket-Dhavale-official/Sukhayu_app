import React, { useState, useEffect } from 'react';
import { Pharmacist, InventoryItem } from '../../types';
import { mockInventory } from '../../utils/mockData';
import { ArrowLeft, Plus, Minus, AlertTriangle, Package, Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner@2.0.3';

interface InventoryManagementProps {
  user: Pharmacist;
  onBack: () => void;
  onAddMedicine: () => void;
}

export function InventoryManagement({ user, onBack, onAddMedicine }: InventoryManagementProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'low_stock' | 'in_stock'>('all');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(0);

  useEffect(() => {
    // Load inventory for current pharmacy
    const pharmacyInventory = mockInventory.find(inv => inv.pharmacyId === user.licenseNumber);
    if (pharmacyInventory) {
      setInventory(pharmacyInventory.items);
    }
  }, [user.licenseNumber]);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.medicineName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'low_stock' && item.availableQuantity <= item.minStockLevel) ||
      (filter === 'in_stock' && item.availableQuantity > item.minStockLevel);
    
    return matchesSearch && matchesFilter;
  });

  const handleQuantityUpdate = (medicineId: string, newQuantity: number) => {
    setInventory(prev => prev.map(item => 
      item.medicineId === medicineId 
        ? { ...item, availableQuantity: Math.max(0, newQuantity) }
        : item
    ));
    setEditingItem(null);
    toast.success('Quantity updated successfully!');
  };

  const handleSoldUpdate = (medicineId: string, soldCount: number) => {
    setInventory(prev => prev.map(item => {
      if (item.medicineId === medicineId) {
        const newSoldQuantity = item.soldQuantity + soldCount;
        const newAvailableQuantity = Math.max(0, item.availableQuantity - soldCount);
        return {
          ...item,
          soldQuantity: newSoldQuantity,
          availableQuantity: newAvailableQuantity
        };
      }
      return item;
    }));
    toast.success(`Recorded sale of ${soldCount} units`);
  };

  const startEditing = (medicineId: string, currentQuantity: number) => {
    setEditingItem(medicineId);
    setTempQuantity(currentQuantity);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setTempQuantity(0);
  };

  const lowStockCount = inventory.filter(item => item.availableQuantity <= item.minStockLevel).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#007C91] text-white p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Inventory Management</h1>
            <p className="text-sm opacity-90">{inventory.length} medicines tracked</p>
          </div>
          <Button
            onClick={onAddMedicine}
            size="sm"
            className="bg-white text-[#007C91] hover:bg-gray-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Medicine
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-900">{inventory.length}</p>
                <p className="text-xs text-gray-600">Total Items</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="text-center">
                <p className="text-2xl font-semibold text-red-600">{lowStockCount}</p>
                <p className="text-xs text-gray-600">Low Stock</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-3 pb-3">
              <div className="text-center">
                <p className="text-2xl font-semibold text-green-600">
                  {inventory.reduce((sum, item) => sum + item.availableQuantity, 0)}
                </p>
                <p className="text-xs text-gray-600">Total Units</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-[#007C91] hover:bg-[#006a7a]' : ''}
            >
              All ({inventory.length})
            </Button>
            <Button
              variant={filter === 'low_stock' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('low_stock')}
              className={filter === 'low_stock' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Low Stock ({lowStockCount})
            </Button>
            <Button
              variant={filter === 'in_stock' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('in_stock')}
              className={filter === 'in_stock' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              In Stock ({inventory.length - lowStockCount})
            </Button>
          </div>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medicine Inventory</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 p-4">
              {filteredInventory.map(item => (
                <div
                  key={item.medicineId}
                  className={`p-4 rounded-lg border ${
                    item.availableQuantity <= item.minStockLevel
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.medicineName}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {item.availableQuantity <= item.minStockLevel && (
                          <Badge variant="destructive" className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low Stock
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">
                          Min: {item.minStockLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Available</p>
                      <div className="flex items-center space-x-2">
                        {editingItem === item.medicineId ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={tempQuantity}
                              onChange={(e) => setTempQuantity(Number(e.target.value))}
                              className="w-20 h-8"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleQuantityUpdate(item.medicineId, tempQuantity)}
                              className="h-8 bg-[#007C91] hover:bg-[#006a7a]"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditing}
                              className="h-8"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold">{item.availableQuantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(item.medicineId, item.availableQuantity)}
                              className="h-8"
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sold Today</p>
                      <p className="text-lg font-semibold text-blue-600">{item.soldQuantity}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSoldUpdate(item.medicineId, 1)}
                      disabled={item.availableQuantity <= 0}
                      className="flex-1"
                    >
                      <Minus className="h-3 w-3 mr-1" />
                      Sell 1
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSoldUpdate(item.medicineId, 5)}
                      disabled={item.availableQuantity < 5}
                      className="flex-1"
                    >
                      <Minus className="h-3 w-3 mr-1" />
                      Sell 5
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleQuantityUpdate(item.medicineId, item.availableQuantity + 10)}
                      className="flex-1 bg-[#007C91] hover:bg-[#006a7a]"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Restock
                    </Button>
                  </div>
                </div>
              ))}

              {filteredInventory.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No medicines found</p>
                  <p className="text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search' : 'No items match the current filter'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* End of Day Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total medicines managed</span>
                <span className="font-semibold">{inventory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total units sold</span>
                <span className="font-semibold text-blue-600">
                  {inventory.reduce((sum, item) => sum + item.soldQuantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items needing restock</span>
                <span className="font-semibold text-red-600">{lowStockCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total available units</span>
                <span className="font-semibold text-green-600">
                  {inventory.reduce((sum, item) => sum + item.availableQuantity, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}