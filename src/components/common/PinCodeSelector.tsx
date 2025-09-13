import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X } from 'lucide-react';
import { kochiPinCodes, groupedPinCodes } from '../../data/pincodes';
import { PinCode } from '../../types';

interface PinCodeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pinCode: PinCode) => void;
  selectedPin?: string;
}

const PinCodeSelector: React.FC<PinCodeSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedPin
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const filteredPinCodes = useMemo(() => {
    let filtered = kochiPinCodes;

    if (searchTerm) {
      filtered = filtered.filter(pin =>
        pin.pin.includes(searchTerm) ||
        pin.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pin.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion) {
      filtered = filtered.filter(pin => pin.region === selectedRegion);
    }

    return filtered;
  }, [searchTerm, selectedRegion]);

  const regions = Object.keys(groupedPinCodes);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-20 bottom-20 bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-w-md mx-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Select Your Area</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Welcome to ecfresh — Fresh food in Kochi! Enter your PIN to see what we deliver near you.
              </p>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search PIN or area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Region Filter */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedRegion('')}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedRegion === ''
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Regions
                </button>
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedRegion === region
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* PIN Codes List */}
            <div className="flex-1 overflow-auto p-4">
              {filteredPinCodes.length > 0 ? (
                <div className="space-y-2">
                  {filteredPinCodes.map(pin => (
                    <button
                      key={pin.pin}
                      onClick={() => {
                        onSelect(pin);
                        onClose();
                      }}
                      className={`w-full p-3 rounded-xl text-left transition-colors ${
                        selectedPin === pin.pin
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <MapPin className={`w-4 h-4 mt-1 ${
                            selectedPin === pin.pin ? 'text-green-600' : 'text-gray-400'
                          }`} />
                          <div>
                            <div className="font-medium text-gray-900">{pin.area}</div>
                            <div className="text-sm text-gray-500">{pin.region}</div>
                          </div>
                        </div>
                        <div className={`text-sm font-mono ${
                          selectedPin === pin.pin ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {pin.pin}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No matching areas found</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PinCodeSelector;