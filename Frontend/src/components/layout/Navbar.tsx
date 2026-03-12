// Iconos
import { Search, ShoppingCart, User, LogOut, X, Menu } from 'lucide-react';

// Enlaces de navegación
import { Link } from 'react-router-dom';

// Componentes
import LoginModal from '../modals/LoginModal';
import CartModal, { type CartItem } from '../modals/CartModal';

import { useState } from 'react';

// Interfaz para los enlaces de navegación
interface NavigationLink {
    nombre: string;
    href: string;
}

interface UserData {
    nombre: string;
    email: string;
}

export default function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);

    const [isCartOpen, setIsCartOpen] = useState(false);
    
    // Estados para la vista móvil
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [cartItems] = useState<CartItem[]>([
            {
                id: '1',
                nombre: 'Remera Oversize Negra',
                precio: 15000,
                cantidad: 2,
                imagen: 'https://via.placeholder.com/150'
            },
            {
                id: '2',
                nombre: 'Pantalón Cargo Beige',
                precio: 32000,
                cantidad: 1,
                imagen: 'https://via.placeholder.com/150'
            }
        ]);

    const enlacesNavegacion: NavigationLink[] = [
        { nombre: 'Inicio', href: '/' },
        { nombre: 'Catálogo', href: '/catalogo' },
        { nombre: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
        { nombre: 'Cómo comprar', href: '/como-comprar' },
        { nombre: 'Contacto', href: '/contacto' },
    ];

    const handleGoogleLogin = () => {
        setUser({ nombre: 'Nereo', email: 'nereo@ejemplo.com' });
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        setUser(null);
    };

    // Funciones para alternar menú y buscador en móvil (para que no se abran los dos a la vez)
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isMobileSearchOpen) setIsMobileSearchOpen(false);
    };

    const toggleMobileSearch = () => {
        setIsMobileSearchOpen(!isMobileSearchOpen);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    return (
        <>
            <header className="w-full bg-slate-950/90 shadow-sm relative z-50">
                {/* PRIMERA FILA */}
                <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
            
                    {/* Lado Izquierdo: Menú Hamburguesa (Móvil) + Logo */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Botón Menú Hamburguesa */}
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="md:hidden text-gray-300 hover:text-white transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>

                        {/* Logo */}
                        <Link to="/" className="text-2xl font-extrabold text-white tracking-tight">
                            <img 
                                src="/logo.png" 
                                alt="Schmidt Styles" 
                                className="h-10 md:h-16 w-auto inline-block transition-all" 
                            />
                        </Link> 
                    </div>

                    {/* Buscador Desktop */}
                    <div className="flex-1 max-w-2xl hidden md:block relative px-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Buscar remeras, pantalones, accesorios..."
                                className="w-full pl-5 pr-12 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                            <button 
                                type="button" 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                            >      
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Iconos Derecha: Buscador Móvil, Usuario y Carrito */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-white">
                        
                        {/* --- LUPA PARA MÓVILES --- */}
                        <button
                            type="button"
                            onClick={toggleMobileSearch}
                            className="md:hidden flex items-center gap-2 hover:text-indigo-400 transition-colors"
                        >
                            <Search size={24} />
                        </button>
                        
                        {/* --- LÓGICA CONDICIONAL DEL USUARIO --- */}
                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium hidden sm:block text-indigo-400">
                                    Hola, {user.nombre}
                                </span>
                                <button 
                                    type="button" 
                                    onClick={handleLogout}
                                    title="Cerrar sesión"
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
                            >   
                                <User size={24} />
                                <span className="text-sm font-medium hidden sm:block">Mi Cuenta</span>
                            </button>
                        )}

                        <button 
                            type="button" 
                            onClick={() => setIsCartOpen(true)}
                            className="flex items-center gap-2 hover:text-indigo-400 transition-colors relative"
                        >
                            <ShoppingCart size={24} />
                            <span className="text-sm font-medium hidden sm:block">Carrito</span>
                            {/* Globo de cantidad en el carrito */}
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 sm:-top-2 sm:right-10 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                    {cartItems.reduce((acc, item) => acc + item.cantidad, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* --- BUSCADOR MÓVIL (Desplegable) --- */}
                {isMobileSearchOpen && (
                    <div className="md:hidden px-4 pb-4 animate-in slide-in-from-top-2">
                        <div className="relative w-full flex items-center gap-2">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Buscar prendas..."
                                    className="w-full pl-5 pr-12 py-2.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-inner"
                                    autoFocus
                                />
                                <button 
                                    type="button" 
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                                >      
                                    <Search size={20} />
                                </button>
                            </div>
                            <button onClick={() => setIsMobileSearchOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                )}

                {/* --- MENÚ MÓVIL (Desplegable) --- */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-800 bg-slate-900 animate-in slide-in-from-top-2">
                        <nav className="container mx-auto px-4 py-4">
                            <ul className="flex flex-col gap-4">
                                {enlacesNavegacion.map((enlace) => (
                                    <li key={enlace.nombre}>
                                        <Link 
                                            to={enlace.href} 
                                            onClick={() => setIsMobileMenuOpen(false)} // Cierra el menú al navegar
                                            className="block text-base font-medium text-white hover:text-indigo-400 transition-colors py-2 border-b border-slate-800/50"
                                        >
                                            {enlace.nombre}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}

                {/* Menú de Navegación Desktop */}
                <div className="border-t border-slate-950/90 bg-slate-950/90 hidden md:block">
                    <div className="container mx-auto px-4">
                        <nav>
                            <ul className="flex items-center justify-center gap-10 py-3">
                                {enlacesNavegacion.map((enlace) => (
                                    <li key={enlace.nombre}>
                                        <Link to={enlace.href} className="text-sm font-medium text-white hover:text-indigo-400 transition-colors">
                                            {enlace.nombre}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Renderiza el modal de login */}
            <LoginModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onLogin={handleGoogleLogin} 
            />

            {/* Renderiza el modal del carrito */}
            <CartModal 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cartItems={cartItems} 
            />
        </>
    );
}