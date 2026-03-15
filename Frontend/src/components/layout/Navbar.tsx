// Iconos
import { Search, ShoppingCart, User, LogOut, X, Menu } from 'lucide-react';

// Enlaces y navegación
import { Link, useNavigate } from 'react-router-dom';

// Componentes
import LoginModal from '../modals/LoginModal';
import CartModal from '../modals/CartModal'; // <-- Corregido: ya no importamos CartItem de acá

import { useState } from 'react';

// --- IMPORTAMOS EL CARRITO GLOBAL ---
import { useCart } from '../../CartContext';

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
    const navigate = useNavigate(); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    
    // Estados para la vista móvil
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Estado para guardar lo que se escribe en el buscador
    const [searchQuery, setSearchQuery] = useState('');

    // --- TRAEMOS LOS DATOS DEL CARRITO DESDE LA NUBE ---
    const { cartItems, setIsCartOpen } = useCart();

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

    // Funciones para alternar menú y buscador en móvil
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isMobileSearchOpen) setIsMobileSearchOpen(false);
    };

    const toggleMobileSearch = () => {
        setIsMobileSearchOpen(!isMobileSearchOpen);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    // --- FUNCIÓN QUE EJECUTA LA BÚSQUEDA ---
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault(); 
        if (searchQuery.trim() !== '') {
            navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileSearchOpen(false); 
            setSearchQuery(''); 
        }
    };

    return (
        <>
            {/* Header principal crudo y sólido */}
            <header className="sticky top-0 w-full bg-background border-b-4 border-text z-50">
                {/* PRIMERA FILA */}
                <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
            
                    {/* Lado Izquierdo: Menú Hamburguesa (Móvil) + Logo */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Botón Menú Hamburguesa */}
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="md:hidden text-text hover:text-accent transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={32} strokeWidth={2.5} /> : <Menu size={32} strokeWidth={2.5} />}
                        </button>

                        {/* Logo */}
                        <Link to="/" className="text-2xl font-black text-text tracking-tighter uppercase hover:text-accent transition-colors">
                            <img 
                                src="/logo.png" 
                                alt="Schmidt Styles" 
                                className="h-10 md:h-16 w-auto inline-block transition-all grayscale hover:grayscale-0" 
                            />
                        </Link> 
                    </div>

                    {/* Buscador Desktop (Estilo Industrial) */}
                    <div className="flex-1 max-w-2xl hidden md:block relative px-8">
                        <form onSubmit={handleSearch} className="relative w-full group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="BUSCAR PRENDAS..."
                                className="w-full pl-5 pr-12 py-3 bg-background border-2 border-text text-text font-black uppercase placeholder-text-secondary rounded-none focus:outline-none focus:border-accent focus:shadow-[6px_6px_0px_0px_var(--color-accent)] transition-all"
                            />
                            <button 
                                type="submit" 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text hover:text-accent transition-colors"
                            >      
                                <Search size={24} strokeWidth={2.5} />
                            </button>
                        </form>
                    </div>

                    {/* Iconos Derecha */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-text">
                        
                        {/* --- LUPA PARA MÓVILES --- */}
                        <button
                            type="button"
                            onClick={toggleMobileSearch}
                            className="md:hidden flex items-center gap-2 hover:text-accent transition-colors"
                        >
                            <Search size={28} strokeWidth={2.5} />
                        </button>
                        
                        {/* --- LÓGICA CONDICIONAL DEL USUARIO --- */}
                        {user ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-black uppercase hidden sm:block text-accent border-2 border-accent px-2 py-1 shadow-[2px_2px_0px_0px_var(--color-text)]">
                                    {user.nombre}
                                </span>
                                <button 
                                    type="button" 
                                    onClick={handleLogout}
                                    title="Cerrar sesión"
                                    className="text-text hover:text-red-500 transition-colors"
                                >
                                    <LogOut size={26} strokeWidth={2.5} />
                                </button>
                            </div>
                        ) : (
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 hover:text-accent transition-colors"
                            >   
                                <User size={28} strokeWidth={2.5} />
                                <span className="text-sm font-black uppercase hidden sm:block">Cuenta</span>
                            </button>
                        )}

                        {/* Carrito con Globo Brutalista */}
                        <button 
                            type="button" 
                            onClick={() => setIsCartOpen(true)}
                            className="flex items-center gap-2 hover:text-accent transition-colors relative"
                        >
                            <ShoppingCart size={28} strokeWidth={2.5} />
                            <span className="text-sm font-black uppercase hidden sm:block">Cart</span>
                            
                            {cartItems.length > 0 && (
                                <span className="absolute -top-3 -right-3 sm:-top-3 sm:right-10 bg-accent text-background text-[11px] font-black h-6 w-6 border-2 border-text shadow-[2px_2px_0px_0px_var(--color-text)] flex items-center justify-center">
                                    {cartItems.reduce((acc, item) => acc + item.cantidad, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* --- BUSCADOR MÓVIL (Desplegable) --- */}
                {isMobileSearchOpen && (
                    <div className="md:hidden px-4 pb-4 animate-in slide-in-from-top-2 bg-background">
                        <form onSubmit={handleSearch} className="relative w-full flex items-center gap-3">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="BUSCAR PRENDAS..."
                                    className="w-full pl-4 pr-12 py-3 bg-background border-2 border-text text-text font-black uppercase placeholder-text-secondary rounded-none focus:outline-none focus:border-accent focus:shadow-[4px_4px_0px_0px_var(--color-accent)] transition-all"
                                    autoFocus
                                />
                                <button 
                                    type="submit" 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-accent transition-colors"
                                >      
                                    <Search size={24} strokeWidth={2.5} />
                                </button>
                            </div>
                            <button type="button" onClick={() => setIsMobileSearchOpen(false)} className="text-text hover:text-accent border-2 border-text p-2 hover:shadow-[2px_2px_0px_0px_var(--color-text)] transition-all">
                                <X size={24} strokeWidth={3} />
                            </button>
                        </form>
                    </div>
                )}

                {/* --- MENÚ MÓVIL (Desplegable) --- */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t-4 border-text bg-background animate-in slide-in-from-top-2">
                        <nav className="container mx-auto px-4 py-4">
                            <ul className="flex flex-col gap-0">
                                {enlacesNavegacion.map((enlace) => (
                                    <li key={enlace.nombre}>
                                        <Link 
                                            to={enlace.href} 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-lg font-black uppercase text-text hover:bg-text hover:text-background transition-colors py-4 px-2 border-b-2 border-text"
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
                <div className="border-t-4 border-text bg-background hidden md:block">
                    <div className="container mx-auto px-4">
                        <nav>
                            <ul className="flex items-center justify-center gap-12 py-4">
                                {enlacesNavegacion.map((enlace) => (
                                    <li key={enlace.nombre}>
                                        <Link 
                                            to={enlace.href} 
                                            className="text-sm font-black tracking-widest uppercase text-text hover:text-accent hover:underline decoration-4 underline-offset-8 transition-all"
                                        >
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

            {/* Renderiza el modal del carrito sin pasarle props */}
            <CartModal />
        </>
    );
}