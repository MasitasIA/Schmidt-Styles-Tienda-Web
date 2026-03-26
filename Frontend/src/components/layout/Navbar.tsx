// Iconos
import { Search, ShoppingCart, User, LogOut, X, Menu } from "lucide-react";

// Enlaces y navegación
import { Link, useNavigate } from "react-router-dom";

// Componentes
import LoginModal from "../modals/LoginModal";
import CartModal from "../modals/CartModal"; // <-- Corregido: ya no importamos CartItem de acá

import { useState, useEffect } from "react";

// --- IMPORTAMOS EL CARRITO GLOBAL ---
import { useCart } from "../../CartContext";

// --- IMPORTAMOS SUPABASE PARA LAS CATEGORÍAS ---
import { supabase } from "../../supabase";

// Interfaz para los enlaces de navegación
interface NavigationLink {
    nombre: string;
    href: string;
}

interface UserData {
    nombre: string;
    email: string;
}

// --- INTERFAZ PARA CATEGORÍAS ---
interface Categoria {
    id: number;
    nombre: string;
}

export default function Navbar() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);

    // Estados para la vista móvil
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Estado para guardar lo que se escribe en el buscador
    const [searchQuery, setSearchQuery] = useState("");

    // --- ESTADOS PARA CATEGORÍAS ---
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

    // --- TRAEMOS LOS DATOS DEL CARRITO DESDE LA NUBE ---
    const { cartItems, setIsCartOpen } = useCart();

    // --- OBTENER CATEGORÍAS AL CARGAR EL NAVBAR ---
    useEffect(() => {
        const fetchCategorias = async () => {
            const { data, error } = await supabase
                .from("categorias")
                .select("id, nombre");
            if (!error && data) {
                setCategorias(data);
            }
        };
        fetchCategorias();
    }, []);

    const enlacesNavegacion: NavigationLink[] = [
        { nombre: "Inicio", href: "/" },
        { nombre: "Catálogo", href: "/catalogo" },
        { nombre: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
        { nombre: "Cómo comprar", href: "/como-comprar" },
        { nombre: "Contacto", href: "/contacto" },
    ];

    const handleGoogleLogin = () => {
        setUser({ nombre: "Nereo", email: "nereo@ejemplo.com" });
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

    // --- FUNCIÓN QUE EJECUTA LA BÚSQUEDA MODIFICADA ---
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (searchQuery.trim()) params.append("q", searchQuery.trim());
        if (categoriaSeleccionada)
            params.append("categoria", categoriaSeleccionada);

        if (params.toString() !== "") {
            navigate(`/catalogo?${params.toString()}`);
        } else {
            navigate("/catalogo");
        }

        setIsMobileSearchOpen(false);
        setSearchQuery(""); // Limpiamos el texto después de buscar (opcional)
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
                            {isMobileMenuOpen ? (
                                <X size={32} strokeWidth={2.5} />
                            ) : (
                                <Menu size={32} strokeWidth={2.5} />
                            )}
                        </button>

                        {/* Logo */}
                        <Link
                            to="/"
                            className="text-2xl font-black text-text tracking-tighter uppercase hover:text-accent transition-colors"
                        >
                            <img
                                src="/logo.png"
                                alt="Schmidt Styles"
                                className="h-10 md:h-16 w-auto inline-block transition-all grayscale hover:grayscale-0"
                            />
                        </Link>
                    </div>

                    {/* --- BUSCADOR DESKTOP MODIFICADO --- */}
                    <div className="flex-1 max-w-2xl hidden md:block relative px-8">
                        <form
                            onSubmit={handleSearch}
                            className="relative w-full flex border-2 border-text bg-background focus-within:border-accent focus-within:shadow-[6px_6px_0px_0px_var(--color-accent)] transition-all group"
                        >
                            <select
                                value={categoriaSeleccionada}
                                onChange={(e) =>
                                    setCategoriaSeleccionada(e.target.value)
                                }
                                className="w-35 bg-background text-text font-black uppercase pl-4 pr-2 py-3 border-r-2 border-text focus:outline-none cursor-pointer text-sm group-focus-within:border-accent transition-colors truncate"
                            >
                                <option
                                    value=""
                                    className="bg-background text-text font-black"
                                >
                                    TODAS
                                </option>
                                {categorias.map((cat) => (
                                    <option
                                        key={cat.id}
                                        value={cat.id}
                                        className="bg-background text-text font-black"
                                    >
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="BUSCAR PRENDAS..."
                                className="flex-1 bg-transparent pl-4 pr-12 py-3 text-text font-black uppercase placeholder-text-secondary rounded-none focus:outline-none"
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
                                <span className="text-sm font-black uppercase hidden sm:block">
                                    Cuenta
                                </span>
                            </button>
                        )}

                        {/* Carrito con Globo Brutalista */}
                        <button
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            className="flex items-center gap-2 hover:text-accent transition-colors relative"
                        >
                            <ShoppingCart size={28} strokeWidth={2.5} />
                            <span className="text-sm font-black uppercase hidden sm:block">
                                Cart
                            </span>

                            {cartItems.length > 0 && (
                                <span className="absolute -top-3 -right-3 sm:-top-3 sm:right-10 bg-accent text-background text-[11px] font-black h-6 w-6 border-2 border-text shadow-[2px_2px_0px_0px_var(--color-text)] flex items-center justify-center">
                                    {cartItems.reduce(
                                        (acc, item) => acc + item.cantidad,
                                        0,
                                    )}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* --- BUSCADOR MÓVIL MODIFICADO (Desplegable) --- */}
                {isMobileSearchOpen && (
                    <div className="md:hidden px-4 pb-4 animate-in slide-in-from-top-2 bg-background flex gap-2 items-center">
                        <form
                            onSubmit={handleSearch}
                            className="relative flex-1 flex border-2 border-text bg-background focus-within:border-accent focus-within:shadow-[4px_4px_0px_0px_var(--color-accent)] transition-all group"
                        >
                            <select
                                value={categoriaSeleccionada}
                                onChange={(e) =>
                                    setCategoriaSeleccionada(e.target.value)
                                }
                                className="w-27.5 bg-background text-text font-black uppercase pl-3 pr-1 py-3 border-r-2 border-text focus:outline-none cursor-pointer text-sm group-focus-within:border-accent transition-colors truncate"
                            >
                                <option
                                    value=""
                                    className="bg-background text-text font-black"
                                >
                                    TODAS
                                </option>
                                {categorias.map((cat) => (
                                    <option
                                        key={cat.id}
                                        value={cat.id}
                                        className="bg-background text-text font-black"
                                    >
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="BUSCAR..."
                                className="flex-1 w-full bg-transparent pl-3 pr-10 py-3 text-text font-black uppercase placeholder-text-secondary rounded-none focus:outline-none"
                                autoFocus
                            />

                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-accent transition-colors"
                            >
                                <Search size={22} strokeWidth={2.5} />
                            </button>
                        </form>

                        <button
                            type="button"
                            onClick={() => setIsMobileSearchOpen(false)}
                            className="text-text hover:text-accent border-2 border-text p-3 hover:shadow-[2px_2px_0px_0px_var(--color-text)] transition-all shrink-0"
                        >
                            <X size={24} strokeWidth={3} />
                        </button>
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
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
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
