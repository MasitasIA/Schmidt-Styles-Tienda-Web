import { X, Trash2, ShoppingBag } from 'lucide-react';

// Interfaz para los items del carrito
export interface CartItem {
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen: string;
}

// Props para el componente CartModal
interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
}

export default function CartModal({ isOpen, onClose, cartItems }: CartModalProps) {
    if (!isOpen) return null;

    // Calcular el precio total
    const total = cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-all">
            {/* Contenedor del panel lateral (Drawer) */}
            <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                
                {/* Cabecera del carrito */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingBag size={24} className="text-indigo-600" />
                        Tu Carrito
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        title="Cerrar"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cuerpo del carrito */}
                <div className="flex-1 overflow-y-auto p-5">
                    {cartItems.length === 0 ? (
                        // Estado vacío
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                            <ShoppingBag size={64} className="text-gray-200" />
                            <p className="text-lg font-medium text-gray-600">El carrito está vacío</p>
                            <button 
                                onClick={onClose} 
                                className="mt-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                            >
                                Seguir comprando
                            </button>
                        </div>
                    ) : (
                        // Lista de productos
                        <ul className="space-y-4">
                            {cartItems.map((item) => (
                                <li key={item.id} className="flex gap-4 border-b border-gray-50 pb-4">
                                    <img 
                                        src={item.imagen} 
                                        alt={item.nombre} 
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-100" 
                                    />
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                                                {item.nombre}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">Cant: {item.cantidad}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            {/* Formateo a moneda local (ARS) */}
                                            <span className="font-bold text-gray-900">
                                                ${item.precio.toLocaleString('es-AR')}
                                            </span>
                                            <button 
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1" 
                                                title="Eliminar producto"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Pie del carrito */}
                {cartItems.length > 0 && (
                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 font-medium">Total:</span>
                            <span className="text-2xl font-bold text-gray-900">
                                ${total.toLocaleString('es-AR')}
                            </span>
                        </div>
                        <button className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                            Iniciar Compra
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}