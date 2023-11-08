import {useEffect, useState} from 'react';

function useCart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const cart = localStorage.getItem('cart');
        if (cart) {
            setCartItems(JSON.parse(cart));
        }
    }, []);

    const saveCartItems = (items) => {
        localStorage.setItem('cart', JSON.stringify(items));
        setCartItems(items);
        console.log('Cart Items: ', cartItems);
    };

    const addItemToCart = (newItem) => {
        setCartItems((currentItems) => {
            const itemIndex = currentItems.findIndex(
                (item) => item.id === newItem.id && item.size === newItem.size
            );

            // Update quantity if the item already exists.
            if (itemIndex !== -1) {
                const updatedItems = currentItems.map((item, index) => {
                    if (index === itemIndex) {
                        return {...item, quantity: item.quantity + newItem.quantity};
                    }
                    return item;
                });
                saveCartItems(updatedItems);
                return updatedItems;
            } else {
                // Add the new item since it doesn't exist.
                const updatedItems = [...currentItems, newItem];
                saveCartItems(updatedItems);
                return updatedItems;
            }
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

    const updateItemQuantity = (id, size, quantity) => {
        setCartItems((currentItems) => {
            const itemIndex = currentItems.findIndex(
                (item) => item.id === id && item.size === size
            );

            if (itemIndex !== -1) {
                const updatedItems = currentItems.map((item, index) => {
                    if (index === itemIndex) {
                        return {...item, quantity: quantity};
                    }
                    return item;
                });
                saveCartItems(updatedItems);
                return updatedItems;
            }
            return currentItems; // If for some reason the item isn't found, return the current state.
        });
    };

    return {
        cartItems,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity // Include updateItemQuantity in the returned object
    };
}

export default useCart;
