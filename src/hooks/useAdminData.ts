import React from 'react';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Banner, Category, Product, Order } from '../types';
import { LOCAL_STORAGE_KEYS, getFromLocalStorage, setToLocalStorage } from '../utils/localStorage';
import { sampleBanners, sampleCategories, sampleProducts } from '../data/sampleData';

interface AdminDataContextType {
  banners: Banner[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkImportProducts: (products: Omit<Product, 'id' | 'createdAt'>[]) => void;
  exportProducts: () => string;
  refreshData: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

const ADMIN_STORAGE_KEYS = {
  BANNERS: 'ecfresh_admin_banners',
  CATEGORIES: 'ecfresh_admin_categories',
  PRODUCTS: 'ecfresh_admin_products'
};

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Initialize data
  useEffect(() => {
    const savedBanners = getFromLocalStorage<Banner[]>(ADMIN_STORAGE_KEYS.BANNERS, sampleBanners);
    const savedCategories = getFromLocalStorage<Category[]>(ADMIN_STORAGE_KEYS.CATEGORIES, sampleCategories);
    const savedProducts = getFromLocalStorage<Product[]>(ADMIN_STORAGE_KEYS.PRODUCTS, sampleProducts);
    const savedOrders = getFromLocalStorage<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);

    setBanners(savedBanners);
    setCategories(savedCategories);
    setProducts(savedProducts);
    setOrders(savedOrders);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    setToLocalStorage(ADMIN_STORAGE_KEYS.BANNERS, banners);
  }, [banners]);

  useEffect(() => {
    setToLocalStorage(ADMIN_STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);

  useEffect(() => {
    setToLocalStorage(ADMIN_STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  // Banner operations
  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newBanner = { ...banner, id: Date.now().toString() };
    setBanners(prev => [...prev, newBanner]);
  };

  const updateBanner = (id: string, banner: Partial<Banner>) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...banner } : b));
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  // Category operations
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...category } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Product operations
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const bulkImportProducts = (newProducts: Omit<Product, 'id' | 'createdAt'>[]) => {
    const productsWithIds = newProducts.map(product => ({
      ...product,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }));
    setProducts(prev => [...prev, ...productsWithIds]);
  };

  const exportProducts = () => {
    const csvHeader = 'name,category,description,image,variants,isAvailable\n';
    const csvData = products.map(product => {
      const variantsStr = product.variants.map(v => `${v.weight}:${v.price}${v.originalPrice ? `:${v.originalPrice}` : ''}`).join(';');
      return `"${product.name}","${product.category}","${product.description}","${product.image}","${variantsStr}",${product.isAvailable}`;
    }).join('\n');
    return csvHeader + csvData;
  };

  const refreshData = () => {
    const savedOrders = getFromLocalStorage<Order[]>(LOCAL_STORAGE_KEYS.ORDERS, []);
    setOrders(savedOrders);
  };

  return (
    React.createElement(AdminDataContext.Provider, {
      value: {
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
        bulkImportProducts,
        exportProducts,
        refreshData
      }
    }, children)
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
};