import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart as apiAdd, removeFromCart as apiRemove } from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user) getCart().then(setCart).catch(() => setCart([]));
    else setCart([]);
  }, [user]);

  const addToCart = async (productId, quantity = 1, size) => {
    const res = await apiAdd({ productId, quantity, size });
    setCart(res.cart);
  };

  const removeFromCart = async (productId, size) => {
    await apiRemove({ productId, size });
    setCart((prev) => prev.filter((c) => !(c.productId === productId && c.size === size)));
  };

  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
