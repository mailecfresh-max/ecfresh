import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { Address } from '../../types';

const emptyAddr = (): Address => ({ id: `addr-${Date.now()}`, name: '', phone: '', address: '', pinCode: '', isDefault: false });

const AddressesTab: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState<Address | null>(null);

  const addresses = user?.addresses || [];

  const saveAddress = () => {
    if (!editing) return;
    if (!editing.name.trim()) return toast.error('Name is required');
    if (!/^\d{10}$/.test(editing.phone)) return toast.error('Enter a valid 10-digit phone');
    if (!/^\d{6}$/.test(editing.pinCode)) return toast.error('Enter a valid 6-digit PIN');
    if (!editing.address || editing.address.length < 10) return toast.error('Address is too short');
    const list = addresses.some(a => a.id === editing.id)
      ? addresses.map(a => (a.id === editing.id ? editing : a))
      : [...addresses, editing];
    // enforce single default
    const normalized = editing.isDefault ? list.map(a => ({ ...a, isDefault: a.id === editing.id })) : list;
    updateUser({ addresses: normalized });
    toast.success('Address saved');
    setEditing(null);
  };

  const setDefault = (id: string) => {
    const normalized = addresses.map(a => ({ ...a, isDefault: a.id === id }));
    updateUser({ addresses: normalized });
  };

  const remove = (id: string) => {
    updateUser({ addresses: addresses.filter(a => a.id !== id) });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Addresses</h2>
        <button onClick={() => setEditing(emptyAddr())} className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" />
          <span>Add New</span>
        </button>
      </div>

      {addresses.length === 0 && <p className="text-gray-600">No addresses yet.</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr.id} className="border border-gray-200 rounded-xl p-4 relative">
            {addr.isDefault && (
              <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full inline-flex items-center">
                <Star className="w-3 h-3 mr-1" /> Default
              </span>
            )}
            <div className="font-medium text-gray-900">{addr.name} • {addr.phone}</div>
            <div className="text-gray-700 mt-1">{addr.address}</div>
            <div className="text-gray-500 text-sm">PIN: {addr.pinCode}</div>
            <div className="flex items-center gap-3 mt-3">
              {!addr.isDefault && (
                <button onClick={() => setDefault(addr.id)} className="text-sm text-green-600 hover:text-green-700">Set default</button>
              )}
              <button onClick={() => setEditing(addr)} className="text-sm text-blue-600 hover:text-blue-700 inline-flex items-center"><Edit2 className="w-4 h-4 mr-1" /> Edit</button>
              <button onClick={() => remove(addr.id)} className="text-sm text-red-600 hover:text-red-700 inline-flex items-center"><Trash2 className="w-4 h-4 mr-1" /> Remove</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-3">{addresses.some(a => a.id === editing.id) ? 'Edit Address' : 'Add Address'}</h3>
          <div className="grid gap-3">
            <input className="px-3 py-2 border border-gray-200 rounded-xl" placeholder="Contact Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <input className="px-3 py-2 border border-gray-200 rounded-xl" placeholder="Phone (10-digit)" value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
            <textarea className="px-3 py-2 border border-gray-200 rounded-xl" rows={3} placeholder="Address" value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} />
            <div className="grid md:grid-cols-2 gap-3">
              <input className="px-3 py-2 border border-gray-200 rounded-xl" placeholder="PIN (6-digit)" value={editing.pinCode} onChange={(e) => setEditing({ ...editing, pinCode: e.target.value })} />
              <label className="inline-flex items-center text-sm text-gray-700">
                <input type="checkbox" className="mr-2" checked={editing.isDefault} onChange={(e) => setEditing({ ...editing, isDefault: e.target.checked })} />
                Set as default
              </label>
            </div>
            <div className="flex gap-3">
              <button onClick={saveAddress} className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                <Save className="w-4 h-4" />
                <span>Save Address</span>
              </button>
              <button onClick={() => setEditing(null)} className="text-sm text-gray-600">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesTab;


