import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { ProductButton } from 'src/pages/Dashboard/styles';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const keys = await AsyncStorage.getAllKeys();
      const allProducts = await AsyncStorage.multiGet(keys);
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    await AsyncStorage.multiSet([
      ['@GoBarder:id', product.id],
      ['@GoBarder:title', product.title],
      ['@GoBarder:image_url', product.image_url],
      ['@GoBarder:price', product.price],
      ['@GoBarder:quantity', product.quantity],
    ]);
  }, []);

  const increment = useCallback(async id => {
    const storageProducts = await AsyncStorage.getItem('@GoMarketplace:products');
    if (storageProducts) {
      setProducts([...JSON.parse(storageProducts)]);
    }

  }, []);

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
