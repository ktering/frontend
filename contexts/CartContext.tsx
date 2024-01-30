"use client";

import React, { createContext, useState, ReactNode } from 'react';

interface CartContextType {
    cartCount: number;
    updateCartCount: (newCount: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export const useCartCount = () => {
    const context = React.useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cartCount, setCartCount] = useState<number>(() => {
        const cart = localStorage.getItem('cart');
        if (cart) {
            return JSON.parse(cart).length;
        }
        return 0;
    });

    const updateCartCount = (newCount: number) => {
        setCartCount(newCount);
    };

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
