import React, { useState } from 'react';
import { Pharmacist, InventoryItem } from '../../types';
import { ArrowLeft, Plus, Package, AlertTriangle, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';

interface AddMedicineProps {
  user: Pharmacist;
  onBack: () => void;
  onAddMedicine: (medicine: InventoryItem) => void;
}

interface MedicineFormData {
  medicineName: string;
  initialQuantity: number;
  minStockLevel: number;
  category: string;
  batchNumber: string;
  expiryDate: string;
  supplierName: string;
  costPerUnit: number;
}

export function AddMedicine({ user, onBack, onAddMedicine }: AddMedicineProps) {
  const [formData, setFormData] = useState<MedicineFormData>({
    medicineName: '',
    initialQuantity: 0,
    minStockLevel: 10,
    category: '',
    batchNumber: '',
    expiryDate: '',
    supplierName: '',
    costPerUnit: 0
  });

  const [errors, setErrors] = useState<Partial<MedicineFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common medicine categories for quick selection
  const commonCategories = [
    'Antibiotics',
    'Pain Relief',
    'Fever & Cold',
    'Digestive',
    'Cardiovascular',
    'Respiratory',
    'Diabetes',
    'Vitamins',
    'First Aid',
    'Others'
  ];

  // Common medicine suggestions
  const commonMedicines = [
    'Paracetamol 500mg',
    'Amoxicillin 250mg',
    'Cetirizine 10mg',
    'Omeprazole 20mg',
    'Ibuprofen 400mg',
    'Aspirin 75mg',
    'Metformin 500mg',
    'Amlodipine 5mg',
    'Azithromycin 500mg',
    'Salbutamol Inhaler',
    'ORS Packets',
    'Betadine Solution',
    'Crocin Syrup',
    'Cough Syrup'
  ];

  const handleInputChange = (field: keyof MedicineFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<MedicineFormData> = {};

    if (!formData.medicineName.trim()) {
      newErrors.medicineName = 'Medicine name is required';
    }

    if (formData.initialQuantity <= 0) {
      newErrors.initialQuantity = 'Initial quantity must be greater than 0';
    }

    if (formData.minStockLevel < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.batchNumber.trim()) {
      newErrors.batchNumber = 'Batch number is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.expiryDate = 'Expiry date must be in the future';
      }
    }

    if (formData.costPerUnit <= 0) {
      newErrors.costPerUnit = 'Cost per unit must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique medicine ID
      const medicineId = `M${Date.now().toString().slice(-6)}`;
      
      // Create new inventory item
      const newMedicine: InventoryItem = {
        medicineId,
        medicineName: formData.medicineName.trim(),
        availableQuantity: formData.initialQuantity,
        soldQuantity: 0,
        minStockLevel: formData.minStockLevel
      };

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      onAddMedicine(newMedicine);
      
      toast.success(`${formData.medicineName} added to inventory successfully!`);
      
      // Reset form
      setFormData({
        medicineName: '',
        initialQuantity: 0,
        minStockLevel: 10,
        category: '',
        batchNumber: '',
        expiryDate: '',
        supplierName: '',
        costPerUnit: 0
      });

    } catch (error) {
      toast.error('Failed to add medicine. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSelectMedicine = (medicine: string) => {
    setFormData(prev => ({
      ...prev,
      medicineName: medicine
    }));
  };

  const handleQuickSelectCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category
    }));
  };

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
          <div>
            <h1 className="text-xl font-semibold">Add New Medicine</h1>
            <p className="text-sm opacity-90">Add medicine to {user.pharmacyName} inventory</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Medicine Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              Quick Select Common Medicines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {commonMedicines.map((medicine) => (
                <Button
                  key={medicine}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelectMedicine(medicine)}
                  className="text-left justify-start h-auto py-2 px-3"
                >
                  {medicine}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Medicine Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Medicine Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Medicine Name */}
              <div>
                <Label htmlFor="medicineName">Medicine Name *</Label>
                <Input
                  id="medicineName"
                  value={formData.medicineName}
                  onChange={(e) => handleInputChange('medicineName', e.target.value)}
                  placeholder="Enter medicine name and strength (e.g., Paracetamol 500mg)"
                  className={errors.medicineName ? 'border-red-500' : ''}
                />
                {errors.medicineName && (
                  <p className="text-sm text-red-600 mt-1">{errors.medicineName}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Select or enter category"
                  className={errors.category ? 'border-red-500' : ''}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {commonCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="cursor-pointer hover:bg-[#007C91] hover:text-white"
                      onClick={() => handleQuickSelectCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                )}
              </div>

              {/* Quantity and Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="initialQuantity">Initial Quantity *</Label>
                  <Input
                    id="initialQuantity"
                    type="number"
                    value={formData.initialQuantity}
                    onChange={(e) => handleInputChange('initialQuantity', Number(e.target.value))}
                    placeholder="Enter quantity"
                    min="1"
                    className={errors.initialQuantity ? 'border-red-500' : ''}
                  />
                  {errors.initialQuantity && (
                    <p className="text-sm text-red-600 mt-1">{errors.initialQuantity}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="minStockLevel">Minimum Stock Level *</Label>
                  <Input
                    id="minStockLevel"
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => handleInputChange('minStockLevel', Number(e.target.value))}
                    placeholder="Min stock alert level"
                    min="0"
                    className={errors.minStockLevel ? 'border-red-500' : ''}
                  />
                  {errors.minStockLevel && (
                    <p className="text-sm text-red-600 mt-1">{errors.minStockLevel}</p>
                  )}
                </div>
              </div>

              {/* Batch and Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batchNumber">Batch Number *</Label>
                  <Input
                    id="batchNumber"
                    value={formData.batchNumber}
                    onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                    placeholder="Enter batch number"
                    className={errors.batchNumber ? 'border-red-500' : ''}
                  />
                  {errors.batchNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.batchNumber}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className={errors.expiryDate ? 'border-red-500' : ''}
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-red-600 mt-1">{errors.expiryDate}</p>
                  )}
                </div>
              </div>

              {/* Supplier and Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplierName">Supplier Name</Label>
                  <Input
                    id="supplierName"
                    value={formData.supplierName}
                    onChange={(e) => handleInputChange('supplierName', e.target.value)}
                    placeholder="Enter supplier name"
                  />
                </div>

                <div>
                  <Label htmlFor="costPerUnit">Cost per Unit (₹) *</Label>
                  <Input
                    id="costPerUnit"
                    type="number"
                    step="0.01"
                    value={formData.costPerUnit}
                    onChange={(e) => handleInputChange('costPerUnit', Number(e.target.value))}
                    placeholder="Enter cost"
                    min="0.01"
                    className={errors.costPerUnit ? 'border-red-500' : ''}
                  />
                  {errors.costPerUnit && (
                    <p className="text-sm text-red-600 mt-1">{errors.costPerUnit}</p>
                  )}
                </div>
              </div>

              {/* Warning for expiry date */}
              {formData.expiryDate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-700">
                      Expiry Date: {new Date(formData.expiryDate).toLocaleDateString()} 
                      ({Math.ceil((new Date(formData.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days from now)
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#007C91] hover:bg-[#006a7a]"
                >
                  {isSubmitting ? (
                    <>
                      <Package className="w-4 h-4 mr-2 animate-spin" />
                      Adding Medicine...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add to Inventory
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Summary */}
        {formData.medicineName && formData.initialQuantity > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg text-green-800">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>Medicine:</span>
                  <span className="font-medium">{formData.medicineName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{formData.category || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity to add:</span>
                  <span className="font-medium">{formData.initialQuantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span>Total value:</span>
                  <span className="font-medium">₹{(formData.initialQuantity * formData.costPerUnit).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stock alert level:</span>
                  <span className="font-medium">{formData.minStockLevel} units</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}