export const LOCAL_STORAGE_KEYS = {
  USER_PIN: 'ecfresh_user_pin',
  CART: 'ecfresh_cart',
  USER: 'ecfresh_user',
  LOYALTY: 'ecfresh_loyalty',
  LAST_TIME_SLOT: 'ecfresh_last_time_slot',
  WISHLIST: 'ecfresh_wishlist',
  ORDERS: 'ecfresh_orders'
} as const;

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};