import { Product, Category, Banner } from '../types';

export const sampleCategories: Category[] = [
  { id: '1', name: 'Curry Cuts', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500', order: 1, isActive: true },
  { id: '2', name: 'Cut Fruits', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=500', order: 2, isActive: true },
  { id: '3', name: 'Fresh Vegetables', image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=500', order: 3, isActive: true },
  { id: '4', name: 'Juice Cuts', image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=500', order: 4, isActive: true },
  { id: '5', name: 'Mezhukkupuratti Cut', image: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=500', order: 5, isActive: true },
  { id: '6', name: 'Peeled Items', image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=500', order: 6, isActive: true },
  { id: '7', name: 'Salads', image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=500', order: 7, isActive: true },
  { id: '8', name: 'Fresh Fruits', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=500', order: 8, isActive: true },
  { id: '9', name: 'Grated Items', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500', order: 9, isActive: true },
  { id: '10', name: 'Thoran Cut', image: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=500', order: 10, isActive: true }
];

export const sampleBanners: Banner[] = [
  { id: '1', title: 'Fresh Vegetables Daily', image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675', order: 1, isActive: true },
  { id: '2', title: 'Ready to Cook Cuts', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675', order: 2, isActive: true },
  { id: '3', title: 'Fresh Cut Fruits', image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675', order: 3, isActive: true }
];

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Onion - Curry Cut',
    category: '1',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Fresh onions cut perfectly for curry preparations',
    nutritionalInfo: 'Rich in vitamins and antioxidants',
    recipeIdea: 'Perfect for fish curry and vegetable stir-fry',
    variants: [
      { weight: '300g', price: 45, originalPrice: 55 },
      { weight: '500g', price: 70, originalPrice: 85 },
      { weight: '1kg', price: 130, originalPrice: 150 }
    ],
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Tomato - Curry Cut',
    category: '1',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Ripe tomatoes cut for instant cooking',
    nutritionalInfo: 'High in lycopene and vitamin C',
    recipeIdea: 'Great for sambar and rasam',
    variants: [
      { weight: '300g', price: 60 },
      { weight: '500g', price: 95 },
      { weight: '1kg', price: 180 }
    ],
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Mixed Fruit Bowl',
    category: '2',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Fresh seasonal fruits cut and ready to eat',
    nutritionalInfo: 'Rich in vitamins, fiber and natural sugars',
    recipeIdea: 'Eat fresh or make fruit salad',
    variants: [
      { weight: '300g', price: 120 },
      { weight: '500g', price: 190 },
      { weight: '1kg', price: 350 }
    ],
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Carrot - Fresh',
    category: '3',
    image: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Fresh carrots straight from farm',
    nutritionalInfo: 'High in beta-carotene and fiber',
    recipeIdea: 'Perfect for salads and stir-fry',
    variants: [
      { weight: '300g', price: 40 },
      { weight: '500g', price: 65 },
      { weight: '1kg', price: 120 }
    ],
    isAvailable: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Orange - Juice Cut',
    category: '4',
    image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Sweet oranges cut for easy juicing',
    nutritionalInfo: 'Packed with Vitamin C',
    recipeIdea: 'Fresh juice or eat as is',
    variants: [
      { weight: '300g', price: 80 },
      { weight: '500g', price: 125 },
      { weight: '1kg', price: 240 }
    ],
    isAvailable: true,
    createdAt: new Date().toISOString()
  }
];