import React, { useEffect, useState } from 'react';
import { Save, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ProfileTab: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [optionalPhone, setOptionalPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMobile(user.phone || '');
      setPinCode(user.pinCode || '');
      const defaultAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];
      setAddress(defaultAddress?.address || '');
      setLandmark(defaultAddress?.landmark || '');
      setOptionalPhone(defaultAddress?.optionalPhone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const onSave = () => {
    if (!name.trim()) return toast.error('Name is required');
    if (!/^\d{10}$/.test(mobile)) return toast.error('Enter a valid 10-digit mobile');
    if (pinCode && !/^\d{6}$/.test(pinCode)) return toast.error('Enter a valid 6-digit PIN code');
    if (!address.trim()) return toast.error('Address is required');
    if (!landmark.trim()) return toast.error('Landmark is required');
    
    setSaving(true);
    try {
      const updatedAddresses = [{
        id: user?.addresses?.[0]?.id || `addr-${Date.now()}`,
        name,
        phone: mobile,
        address,
        pinCode,
        landmark,
        optionalPhone,
        isDefault: true
      }];
      
      updateUser({ 
        name, 
        phone: mobile, 
        email, 
        pinCode,
        addresses: updatedAddresses
      });
      toast.success('Profile saved');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
    toast.success('Signed out successfully');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Mobile *</label>
          <input value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="10-digit" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">PIN Code</label>
          <input value={pinCode} onChange={(e) => setPinCode(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="6-digit PIN" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Address *</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" rows={3} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Landmark *</label>
          <input value={landmark} onChange={(e) => setLandmark(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Additional Phone (optional)</label>
          <input value={optionalPhone} onChange={(e) => setOptionalPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="10-digit" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email (optional)</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" type="email" />
        </div>
        <div className="flex justify-between items-center">
          <button 
            onClick={handleSignOut}
            className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <button onClick={onSave} disabled={saving} className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-medium">
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;


