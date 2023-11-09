import {useEffect, useState} from 'react';

function useCart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const cart = localStorage.getItem('cart');
        if (cart) {
            setCartItems(JSON.parse(cart));
        }
    }, []);

    useEffect(() => {
        const syncCartWithLocalStorage = () => {
            const cart = localStorage.getItem('cart');
            setCartItems(cart ? JSON.parse(cart) : []);
        };

        window.addEventListener('storage', syncCartWithLocalStorage);

        return () => {
            window.removeEventListener('storage', syncCartWithLocalStorage);
        };
    }, []);

    function useLocalStorageCart() {
        const [cartLength, setCartLength] = useState(0);

        useEffect(() => {
            // Update cart count upon mounting and when localStorage changes
            const updateCartCount = () => {
                const cart = localStorage.getItem('cart');
                const cartItems = cart ? JSON.parse(cart) : [];
                setCartLength(cartItems.length);
            };

            // Call it now to set the initial value
            updateCartCount();

            // Set up event listener for future updates
            window.addEventListener('storage', updateCartCount);

            // Clean up event listener
            return () => {
                window.removeEventListener('storage', updateCartCount);
            };
        }, []);

        return cartLength;
    }

    const saveCartItems = (items) => {
        localStorage.setItem('cart', JSON.stringify(items));
        setCartItems(items);
    };

    const addItemToCart = (newItem) => {
        setCartItems((currentItems) => {
            // Find if the item already exists in the cart
            const existingItemIndex = currentItems.findIndex(
                (item) => item.id === newItem.id && item.size === newItem.size
            );

            // Update the item if it exists, otherwise add as a new item
            let updatedItems;
            if (existingItemIndex >= 0) {
                updatedItems = currentItems.map((item, index) =>
                    index === existingItemIndex
                        ? {...item, quantity: item.quantity + newItem.quantity}
                        : item
                );
            } else {
                updatedItems = [...currentItems, newItem];
            }

            // Save updated items to localStorage
            saveCartItems(updatedItems);
            return updatedItems;
        });
    };

    const removeItemFromCart = (id, size) => {
        setCartItems((currentItems) => {
            const updatedItems = currentItems.filter(
                (item) => !(item.id === id && item.size === size)
            );
            saveCartItems(updatedItems);
            return updatedItems;
        });
    };

    const updateItemQuantity = (id, size, newQuantity) => {
        setCartItems((currentItems) => {
            const updatedItems = currentItems.map((item) => {
                if (item.id === id && item.size === size) {
                    return {...item, quantity: newQuantity};
                }
                return item;
            });
            saveCartItems(updatedItems);
            return updatedItems;
        });
    };

    return {
        cartItems,
        setCartItems,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        useLocalStorageCart,
    };
}

export default useCart;
