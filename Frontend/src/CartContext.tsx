import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Qué datos guardamos de cada prenda en el carrito
export interface CartItem {
    id: string; // Un ID único combinando producto + talle + color
    producto_id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen: string;
    talle: string;
    color: string;
}

interface CartContextType {
    cartItems: CartItem[];
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (newItem: CartItem) => {
        setCartItems(prev => {
            // Si ya existe la misma remera con el mismo talle y color, le sumamos 1 a la cantidad
            const existing = prev.find(item => item.id === newItem.id);
            if (existing) {
                return prev.map(item => item.id === newItem.id ? { ...item, cantidad: item.cantidad + 1 } : item);
            }
            // Si no existe, la agregamos al final
            return [...prev, newItem];
        });
        // Magia de UX: Abrimos el carrito automáticamente cuando agregan algo
        setIsCartOpen(true); 
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <CartContext.Provider value={{ cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
    return context;
};