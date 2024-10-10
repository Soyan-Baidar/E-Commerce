import { createContext, useContext, useEffect, useState } from "react";

// Create context for cart
export const CartContext = createContext();

// Custom hook to manage local storage state
function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error("Error reading local storage:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error setting local storage:", error);
    }
  }, [key, state]);

  return [state, setState];
}

// Custom hook to manage cart state
export function useCart() {
  const [cart, setCart] = useLocalStorage("cart", []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const productExists = prevCart.find(({ _id }) => _id === product._id);

      if (productExists) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, orderQuantity: item.orderQuantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, orderQuantity: 1 }];
      }
    });
  };

  return { cart, setCart, addToCart };
}

// CartProvider component to wrap your app
export const CartProvider = ({ children }) => {
  const cart = useCart();

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access cart context
export const useCartContext = () => useContext(CartContext);
