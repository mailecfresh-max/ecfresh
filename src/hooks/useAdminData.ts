import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Banner, Category, Product, Order } from '../types';

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

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Initialize data
  useEffect(() => {
    if (!supabase) return;
    loadData();
  }, []);

  const loadData = async () => {
    if (!supabase) return;

    try {
      // Load banners
      const { data: bannersData } = await supabase
        .from('banners')
        .select('*')
        .order('order');
      
      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('order');
      
      // Load products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Load orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      setBanners(bannersData?.map(transformBanner) || []);
      setCategories(categoriesData?.map(transformCategory) || []);
      setProducts(productsData?.map(transformProduct) || []);
      setOrders(ordersData?.map(transformOrder) || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Transform functions to convert Supabase data to app format
  const transformBanner = (data: any): Banner => ({
    id: data.id,
    title: data.title,
    image: data.image,
    order: data.order,
    isActive: data.is_active
  });

  const transformCategory = (data: any): Category => ({
    id: data.id,
    name: data.name,
    image: data.image,
    order: data.order,
    isActive: data.is_active
  });

  const transformProduct = (data: any): Product => ({
    id: data.id,
    name: data.name,
    category: data.category_id,
    image: data.image,
    description: data.description,
    nutritionalInfo: data.nutritional_info,
    recipeIdea: data.recipe_idea,
    variants: data.variants,
    isAvailable: data.is_available,
    createdAt: data.created_at
  });

  const transformOrder = (data: any): Order => ({
    id: data.id,
    userId: data.user_id,
    items: data.items,
    total: data.total,
    deliveryFee: data.delivery_fee,
    loyaltyUsed: data.loyalty_used,
    deliveryDate: data.delivery_date,
    timeSlot: data.time_slot,
    address: data.address,
    status: data.status,
    createdAt: data.created_at
  });

  // Banner operations
  const addBanner = async (banner: Omit<Banner, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert({
          title: banner.title,
          image: banner.image,
          order: banner.order,
          is_active: banner.isActive
        })
        .select()
        .single();

      if (error) throw error;
      setBanners(prev => [...prev, transformBanner(data)]);
    } catch (error) {
      console.error('Error adding banner:', error);
    }
  };

  const updateBanner = async (id: string, banner: Partial<Banner>) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({
          title: banner.title,
          image: banner.image,
          order: banner.order,
          is_active: banner.isActive
        })
        .eq('id', id);

      if (error) throw error;
      setBanners(prev => prev.map(b => b.id === id ? { ...b, ...banner } : b));
    } catch (error) {
      console.error('Error updating banner:', error);
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  // Category operations
  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          image: category.image,
          order: category.order,
          is_active: category.isActive
        })
        .select()
        .single();

      if (error) throw error;
      setCategories(prev => [...prev, transformCategory(data)]);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: category.name,
          image: category.image,
          order: category.order,
          is_active: category.isActive
        })
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...category } : c));
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Product operations
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          category_id: product.category,
          image: product.image,
          description: product.description,
          nutritional_info: product.nutritionalInfo,
          recipe_idea: product.recipeIdea,
          variants: product.variants,
          is_available: product.isAvailable
        })
        .select()
        .single();

      if (error) throw error;
      setProducts(prev => [...prev, transformProduct(data)]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          category_id: product.category,
          image: product.image,
          description: product.description,
          nutritional_info: product.nutritionalInfo,
          recipe_idea: product.recipeIdea,
          variants: product.variants,
          is_available: product.isAvailable
        })
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const bulkImportProducts = async (newProducts: Omit<Product, 'id' | 'createdAt'>[]) => {
    try {
      const productsToInsert = newProducts.map(product => ({
        name: product.name,
        category_id: product.category,
        image: product.image,
        description: product.description,
        nutritional_info: product.nutritionalInfo,
        recipe_idea: product.recipeIdea,
        variants: product.variants,
        is_available: product.isAvailable
      }));

      const { data, error } = await supabase
        .from('products')
        .insert(productsToInsert)
        .select();

      if (error) throw error;
      setProducts(prev => [...prev, ...data.map(transformProduct)]);
    } catch (error) {
      console.error('Error bulk importing products:', error);
    }
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
    loadData();
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