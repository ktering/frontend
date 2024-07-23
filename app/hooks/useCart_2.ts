import { useEffect, useState } from "react";
import { CartItem } from "@/types/hooks/useCart";
import { useCartCount } from "@/contexts/CartContext";

function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { cartCount, updateCartCount } = useCartCount();

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCartItems(JSON.parse(cart));
    }
  }, []);

  useEffect(() => {
    const syncCartWithLocalStorage = () => {
      const cart = localStorage.getItem("cart");
      setCartItems(cart ? JSON.parse(cart) : []);
    };

    window.addEventListener("storage", syncCartWithLocalStorage);

    return () => {
      window.removeEventListener("storage", syncCartWithLocalStorage);
    };
  }, []);

  function useLocalStorageCart() {
    const [cartLength, setCartLength] = useState(0);

    useEffect(() => {
      const updateCartCount = () => {
        const cart = localStorage.getItem("cart");
        const cartItems = cart ? JSON.parse(cart) : [];
        setCartLength(cartItems.length);
      };
      updateCartCount();
      window.addEventListener("storage", updateCartCount);
      return () => {
        window.removeEventListener("storage", updateCartCount);
      };
    }, []);
    return cartLength;
  }

  const saveCartItems = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    // setCartItems(items);
  };

  const addItemToCart = (newItem: CartItem) => {
    setCartItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item.id === newItem.id && item.size === newItem.size
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = currentItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...currentItems, newItem];
        // updatedItems = [newItem];
      }
      saveCartItems(updatedItems);
      return updatedItems;
    });
  };

  // const removeItemFromCart = (id: string, size: string) => {

  //   console.log('actuales',cartItems);
  //   const updatedItems = cartItems.filter(
  //     (item) => !(item.id === id && item.size === size)
  //   );
  //   console.log('filtrados',updatedItems);
  //   saveCartItems(updatedItems);
  //   console.log('luego de borrar',cartItems);
  //   updateCartCount(updatedItems.length);

  //   return;
  //   setCartItems((currentItems) => {

  //     return updatedItems;
  //   });
  // };
  const removeItemFromCart = (id: string, size: string) => {
    const updatedItems = cartItems.filter(
      (item) => !(item.id === id && item.size === size)
    );

    setCartItems(updatedItems);
    updateCartCount(updatedItems.length);
  };

  useEffect(() => {
    saveCartItems(cartItems);
  }, [cartItems]); // Esto se ejecutará cada vez que `cartItems` cambie

  const updateItemQuantity = (
    id: string,
    size: string,
    newQuantity: number
  ) => {
    setCartItems((currentItems) => {
      const updatedItems = currentItems.map((item) => {
        if (item.id === id && item.size === size) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      saveCartItems(updatedItems);
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    updateCartCount(0);
    localStorage.removeItem("cart");
  };

  return {
    cartItems,
    setCartItems,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    useLocalStorageCart,
    clearCart,
  };
}

export default useCart;
