import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X } from 'lucide-react';
import type { ProductItem } from '../types/calculator';

interface EditProductDialogProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: ProductItem) => void;
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    supplierName: product?.supplierName || '',
    accountHolder: product?.accountHolder || '',
    accountType: product?.accountType || 'cpf',
    sellingPrice: product?.sellingPrice || '',
    costPrice: product?.costPrice || '',
  });

  // Reset form when product changes
  React.useEffect(() => {
    if (product) {
        setFormData({
            name: product.name || '',
            sku: product.sku || '',
            supplierName: product.supplierName || '',
            accountHolder: product.accountHolder || '',
            accountType: product.accountType || 'cpf',
            sellingPrice: product.sellingPrice || '',
            costPrice: product.costPrice || '',
        });
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Merge updates
    const updated = {
        ...product,
        ...formData
    } as ProductItem;
    onSave(updated);
    onClose();
  };

  const dialog = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-[425px] rounded-xl border border-border bg-background p-6 shadow-lg sm:p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-foreground">Editar Produto</h2>
          <button onClick={onClose} className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-muted-foreground">Nome</Label>
            <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="col-span-3 text-foreground" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right text-muted-foreground">SKU</Label>
            <Input id="sku" value={formData.sku} onChange={(e) => handleChange('sku', e.target.value)} className="col-span-3 text-foreground" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supplier" className="text-right text-muted-foreground">Fornecedor</Label>
            <Input id="supplier" value={formData.supplierName} onChange={(e) => handleChange('supplierName', e.target.value)} className="col-span-3 text-foreground" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="holder" className="text-right text-muted-foreground">Titular</Label>
            <Input id="holder" value={formData.accountHolder} onChange={(e) => handleChange('accountHolder', e.target.value)} className="col-span-3 text-foreground" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right text-muted-foreground">Tipo Conta</Label>
            <Select value={formData.accountType} onValueChange={(val) => handleChange('accountType', val)}>
                <SelectTrigger className="col-span-3 text-foreground border-input">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="cnpj">CNPJ</SelectItem>
                </SelectContent>
            </Select>
          </div>
          
          {(!product.variations || product.variations.length === 0) && (
             <>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right text-muted-foreground">Venda</Label>
                    <Input id="price" type="number" value={formData.sellingPrice} onChange={(e) => handleChange('sellingPrice', e.target.value)} className="col-span-3 text-foreground" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cost" className="text-right text-muted-foreground">Custo</Label>
                    <Input id="cost" type="number" value={formData.costPrice} onChange={(e) => handleChange('costPrice', e.target.value)} className="col-span-3 text-foreground" />
                </div>
             </>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose} className="mt-2 sm:mt-0 text-foreground">Cancelar</Button>
          <Button type="submit" onClick={handleSave}>Salvar</Button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return dialog;
  }

  return createPortal(dialog, document.body);
};
