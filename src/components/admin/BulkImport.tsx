import React, { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminData } from '../../hooks/useAdminData';
import { Product, ProductVariant } from '../../types';

interface BulkImportProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkImport: React.FC<BulkImportProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);
  const { bulkImportProducts, exportProducts, categories } = useAdminData();

  const downloadTemplate = () => {
    const template = `name,category,description,image,variants,isAvailable
"Onion - Curry Cut","1","Fresh onions cut perfectly for curry preparations","https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg","300g:45:55;500g:70:85;1kg:130:150",true
"Tomato - Curry Cut","1","Ripe tomatoes cut for instant cooking","https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg","300g:60;500g:95;1kg:180",true`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportCurrentProducts = () => {
    const csvData = exportProducts();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());

        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }
    return data;
  };

  const parseVariants = (variantStr: string): ProductVariant[] => {
    if (!variantStr) return [{ weight: '300g', price: 0 }];
    
    return variantStr.split(';').map(variant => {
      const parts = variant.split(':');
      const weight = parts[0] as '300g' | '500g' | '1kg';
      const price = parseFloat(parts[1]) || 0;
      const originalPrice = parts[2] ? parseFloat(parts[2]) : undefined;
      
      return { weight, price, originalPrice };
    });
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResults(null);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      const errors: string[] = [];
      const products: Omit<Product, 'id' | 'createdAt'>[] = [];

      data.forEach((row, index) => {
        try {
          if (!row.name || !row.category) {
            errors.push(`Row ${index + 2}: Name and category are required`);
            return;
          }

          const categoryExists = categories.some(c => c.id === row.category || c.name === row.category);
          if (!categoryExists) {
            errors.push(`Row ${index + 2}: Category "${row.category}" not found`);
            return;
          }

          const variants = parseVariants(row.variants);
          const isAvailable = row.isAvailable === 'true' || row.isAvailable === true;

          products.push({
            name: row.name,
            category: row.category,
            description: row.description || '',
            image: row.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
            variants,
            isAvailable
          });
        } catch (error) {
          errors.push(`Row ${index + 2}: Invalid data format`);
        }
      });

      if (products.length > 0) {
        bulkImportProducts(products);
      }

      setResults({
        success: products.length,
        errors
      });
    } catch (error) {
      setResults({
        success: 0,
        errors: ['Failed to parse CSV file']
      });
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Bulk Import Products</h2>
          <p className="text-gray-600 mt-1">Import products from CSV file</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Download */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Download Template</h3>
            <p className="text-sm text-blue-700 mb-3">
              Download the CSV template to see the required format for importing products.
            </p>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Export Current Products */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Export Current Products</h3>
            <p className="text-sm text-green-700 mb-3">
              Export your current products to CSV format for backup or editing.
            </p>
            <button
              onClick={exportCurrentProducts}
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Products</span>
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Choose CSV file
                  </span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="sr-only"
                  />
                </label>
              </div>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>

          {/* Import Results */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {results.success > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">
                        Successfully imported {results.success} products
                      </span>
                    </div>
                  </div>
                )}

                {results.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-red-900">
                          {results.errors.length} errors found:
                        </span>
                        <ul className="mt-2 text-sm text-red-700 space-y-1">
                          {results.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {importing ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{importing ? 'Importing...' : 'Import Products'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BulkImport;