import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../CartContext';

import { Contacto } from '../../utils/Constants';

export default function CartModal() {
    // Traemos todo desde la nube global
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart } = useCart();

    if (!isCartOpen) return null;

    const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    // --- Compra desde Whatsapp ---
    const handleCheckout = () => {
        const numeroWhatsApp = Contacto.telefono;

        let mensaje = "🔥 *NUEVO PEDIDO* 🔥\n\n";
        mensaje += "Hola, quiero confirmar mi pedido:\n\n";

        cartItems.forEach((item) => {
            mensaje += `▪️ *${item.cantidad}x* ${item.nombre}\n`;
            mensaje += `    Talle: ${item.talle} | Color: ${item.color}\n`;
            mensaje += `    Subtotal: $${(item.precio * item.cantidad).toLocaleString('es-AR')}\n\n`;
        });

        mensaje += `💰 *TOTAL: $${total.toLocaleString('es-AR')}*\n\n`;
        mensaje += "¿Me pasan los datos para hacer el pago?";

        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm transition-all">
            <div className="bg-background w-full max-w-md h-full border-l-4 border-text flex flex-col animate-in slide-in-from-right duration-300">
                
                <div className="flex items-center justify-between p-6 border-b-4 border-text bg-primary">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-text flex items-center gap-3">
                        <ShoppingBag size={32} strokeWidth={2.5} className="text-accent" />
                        Arsenal
                    </h2>
                    <button 
                        onClick={() => setIsCartOpen(false)} 
                        className="text-text border-4 border-transparent hover:border-text bg-background hover:bg-text hover:text-background p-1 transition-all shadow-[4px_4px_0px_0px_var(--color-transparent)] hover:shadow-[4px_4px_0px_0px_var(--color-accent)]"
                    >
                        <X size={28} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-background">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-6">
                            <div className="border-4 border-text p-6 bg-primary shadow-[8px_8px_0px_0px_var(--color-text)]">
                                <ShoppingBag size={64} strokeWidth={2} className="text-text" />
                            </div>
                            <p className="text-xl font-black uppercase tracking-widest text-text-secondary">
                                [ Vacío ]
                            </p>
                            <button 
                                onClick={() => setIsCartOpen(false)} 
                                className="mt-4 border-4 border-text bg-accent text-text font-black uppercase tracking-widest px-6 py-4 hover:bg-text hover:text-background shadow-[6px_6px_0px_0px_var(--color-text)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                            >
                                Cargar equipo
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-6">
                            {cartItems.map((item) => (
                                <li key={item.id} className="group border-4 border-text bg-background p-3 flex gap-4 shadow-[6px_6px_0px_0px_var(--color-accent)] hover:shadow-[6px_6px_0px_0px_var(--color-text)] transition-all">
                                    <div className="w-24 h-24 shrink-0 border-2 border-text bg-primary relative overflow-hidden">
                                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover grayscale-30 group-hover:grayscale-0 transition-all duration-300" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-black uppercase tracking-tighter text-text leading-tight line-clamp-2">
                                                {item.nombre}
                                            </h3>
                                            <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mt-1">
                                                {item.talle} / {item.color} | Cant: <span className="text-text">{item.cantidad}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xl font-black text-text tracking-tighter">
                                                ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                                            </span>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="border-2 border-text bg-background text-text p-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors" 
                                            >
                                                <Trash2 size={20} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 border-t-4 border-text bg-primary">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-sm font-black uppercase tracking-widest text-text-secondary">
                                Total a pagar:
                            </span>
                            <span className="text-4xl font-black text-text tracking-tighter leading-none">
                                ${total.toLocaleString('es-AR')}
                            </span>
                        </div>
                        {/* 6. CONECTAMOS LA FUNCIÓN AL BOTÓN */}
                        <button 
                            onClick={handleCheckout}
                            className="w-full bg-accent text-text border-4 border-text font-black uppercase tracking-widest text-xl py-5 shadow-[8px_8px_0px_0px_var(--color-text)] hover:shadow-none hover:bg-text hover:text-background hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                            Procesar Pago
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}