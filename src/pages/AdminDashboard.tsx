import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Package, 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Upload,
  Save,
  X,
  Download,
  Filter,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdminData } from '../hooks/useAdminData';
import { Banner, Category, Product, ProductVariant } from '../types';
import ImageUpload from '../components/admin/ImageUpload';
import BulkImport from '../components/admin/BulkImport';
import { format } from 'date-fns';
import { formatTimeSlot } from '../utils/timeSlots';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'banner' | 'category' | 'product'>('banner');
  
  const {
    banners,
    categories,
    products,
    orders,
    addBanner,
    updateBanner,
    deleteBanner,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshData
  } = useAdminData();

  // Check if user is admin
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Refresh orders when tab changes to orders
  React.useEffect(() => {
    if (activeTab === 'orders') {
      refreshData();
    }
  }, [activeTab, refreshData]);

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: 89,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
  };

  const handleSave = (data: any) => {
    if (modalType === 'banner') {
      if (editingItem) {
        updateBanner(editingItem.id, data);
      } else {
        addBanner(data);
      }
    } else if (modalType === 'category') {
      if (editingItem) {
        updateCategory(editingItem.id, data);
      } else {
        addCategory(data);
      }
    } else if (modalType === 'product') {
      if (editingItem) {
        updateProduct(editingItem.id, data);
      } else {
        addProduct(data);
      }
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (type: string, id: string) => {
    if (type === 'banner') {
      deleteBanner(id);
    } else if (type === 'category') {
      deleteCategory(id);
    } else if (type === 'product') {
      deleteProduct(id);
    }
  };

  const openModal = (type: 'banner' | 'category' | 'product', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setIsModalOpen(true);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div>
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div>
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => openModal('banner')}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Banner</span>
          </button>
          <button
            onClick={() => openModal('category')}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
          <button
            onClick={() => openModal('product')}
            className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button 
            onClick={() => setIsBulkImportOpen(true)}
            className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Bulk Import</span>
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Site</span>
          </button>
          <button className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderBanners = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Banners</h2>
        <button
          onClick={() => openModal('banner')}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Banner</span>
        </button>
      </div>
      
      <div className="grid gap-6">
        {banners.map(banner => (
          <div key={banner.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{banner.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal('banner', banner)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete('banner', banner.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Categories</h2>
        <button
          onClick={() => openModal('category')}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div key={category.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">{category.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal('category', category)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete('category', category.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Products</h2>
        <button
          onClick={() => openModal('product')}
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => {
                const categoryName = categories.find(c => c.id === product.category)?.name || 'Unknown';
                const minPrice = Math.min(...product.variants.map(v => v.price));
                const maxPrice = Math.max(...product.variants.map(v => v.price));
                
                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description.slice(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{categoryName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{minPrice} - ₹{maxPrice}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isAvailable ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('product', product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete('product', product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => {
    const [orderFilter, setOrderFilter] = useState('all');
    
    const filteredOrders = orderFilter === 'all' 
      ? orders 
      : orders.filter(order => order.status === orderFilter);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Orders Management</h2>
          <div className="flex items-center space-x-4">
            <select
              value={orderFilter}
              onChange={(e) => setOrderFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="packed">Packed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Orders will appear here once customers start placing them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy • hh:mm a')}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₹{order.total}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                    <div className="text-sm text-gray-600">
                      <p>{order.address.name}</p>
                      <p>{order.address.phone}</p>
                      <p>{order.address.address}</p>
                      <p>{order.address.landmark}, {order.address.pinCode}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Schedule</h4>
                    <div className="text-sm text-gray-600">
                      <p>{format(new Date(order.deliveryDate), 'EEE, MMM dd, yyyy')}</p>
                      <p>{formatTimeSlot(order.timeSlot)}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded object-cover" />
                          <span>{item.product.name} ({item.variant.weight}) × {item.quantity}</span>
                        </div>
                        <span className="font-medium">₹{item.variant.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              Back to Site
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'banners', label: 'Banners', icon: Upload },
                { id: 'categories', label: 'Categories', icon: Settings },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingCart }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === id
                      ? 'bg-green-100 text-green-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'banners' && renderBanners()}
            {activeTab === 'categories' && renderCategories()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'orders' && renderOrders()}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        type={modalType}
        item={editingItem}
        categories={categories}
      />
      
      <BulkImport
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
      />
    </div>
  );
};

// Modal Component
const AdminModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  type: 'banner' | 'category' | 'product';
  item?: any;
  categories: Category[];
}> = ({ isOpen, onClose, onSave, type, item, categories }) => {
  const [formData, setFormData] = useState(() => {
    if (type === 'banner') {
      return { title: '', image: '', order: 1, isActive: true };
    } else if (type === 'category') {
      return { name: '', image: '', order: 1, isActive: true };
    } else {
      return {
        name: '',
        category: '',
        images: [''],
        description: '',
        nutritionalInfo: '',
        recipeIdea: '',
        productType: 'variable',
        variants: [{ weight: '300g', price: 0 }],
        isAvailable: true
      };
    }
  });

  React.useEffect(() => {
    if (item) {
      if (type === 'product' && item) {
        setFormData({
          ...item,
          images: Array.isArray(item.image) ? item.image : [item.image],
          productType: item.variants && item.variants.length > 1 ? 'variable' : 'single',
          variants: Array.isArray(item.variants) ? item.variants : [{ weight: '300g', price: 0 }]
        });
      } else {
        setFormData(item);
      }
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'product') {
      const productData = {
        ...formData,
        image: formData.images[0] || '',
        variants: formData.productType === 'single' 
          ? [{ weight: '300g', price: formData.singlePrice || 0 }]
          : formData.variants
      };
      onSave(productData);
    } else {
      onSave(formData);
    }
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...(formData.variants || []), { weight: '500g', price: 0 }]
    });
  };

  const removeVariant = (index: number) => {
    if ((formData.variants || []).length > 1) {
      setFormData({
        ...formData,
        variants: (formData.variants || []).filter((_, i) => i !== index)
      });
    }
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

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
            className="fixed inset-x-4 top-20 bottom-20 bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-w-2xl mx-auto overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {item ? 'Edit' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {type === 'banner' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <ImageUpload
                        images={formData.image ? [formData.image] : []}
                        onChange={(images) => setFormData({...formData, image: images[0] || ''})}
                        maxImages={1}
                        label="Banner Image"
                      />
                    </div>
                  </>
                )}

                {type === 'category' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <ImageUpload
                        images={formData.image ? [formData.image] : []}
                        onChange={(images) => setFormData({...formData, image: images[0] || ''})}
                        maxImages={1}
                        label="Category Image"
                      />
                    </div>
                  </>
                )}

                {type === 'product' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nutritional Info</label>
                      <textarea
                        value={formData.nutritionalInfo || ''}
                        onChange={(e) => setFormData({...formData, nutritionalInfo: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Rich in vitamins and antioxidants"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Idea</label>
                      <textarea
                        value={formData.recipeIdea || ''}
                        onChange={(e) => setFormData({...formData, recipeIdea: e.target.value})}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Perfect for fish curry and vegetable stir-fry"
                      />
                    </div>
                    <div>
                      <ImageUpload
                        images={formData.images || []}
                        onChange={(images) => setFormData({...formData, images})}
                        maxImages={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="single"
                            checked={formData.productType === 'single'}
                            onChange={(e) => setFormData({...formData, productType: e.target.value})}
                            className="mr-2"
                          />
                          Single Product
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="variable"
                            checked={formData.productType === 'variable'}
                            onChange={(e) => setFormData({...formData, productType: e.target.value})}
                            className="mr-2"
                          />
                          Variable Product
                        </label>
                      </div>
                    </div>
                    
                    {formData.productType === 'single' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input
                          type="number"
                          value={formData.singlePrice || 0}
                          onChange={(e) => setFormData({...formData, singlePrice: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Variants</label>
                          <button
                            type="button"
                            onClick={addVariant}
                            className="text-sm text-green-600 hover:text-green-700"
                          >
                            + Add Variant
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(formData.variants || []).map((variant, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                              <select
                                value={variant.weight}
                                onChange={(e) => updateVariant(index, 'weight', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded"
                              >
                                <option value="300g">300g</option>
                                <option value="500g">500g</option>
                                <option value="1kg">1kg</option>
                              </select>
                              <input
                                type="number"
                                placeholder="Price"
                                value={variant.price}
                                onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded"
                                min="0"
                                step="0.01"
                              />
                              <input
                                type="number"
                                placeholder="Original Price (optional)"
                                value={variant.originalPrice || ''}
                                onChange={(e) => updateVariant(index, 'originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded"
                                min="0"
                                step="0.01"
                              />
                              {(formData.variants || []).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeVariant(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isAvailable}
                          onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                          className="mr-2"
                        />
                        Available for sale
                      </label>
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminDashboard;