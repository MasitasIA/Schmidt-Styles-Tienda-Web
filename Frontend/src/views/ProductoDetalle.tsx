import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, AlertTriangle } from 'lucide-react';
import { supabase } from '../supabase';

// --- IMPORTAMOS EL CARRITO DESDE EL CONTEXTO ---
import { useCart } from '../CartContext';

// --- INTERFACES ACTUALIZADAS ---
interface ImagenProducto {
    id: number;
    imagen: string;
}

interface Talle {
    nombre: string;
}

interface Color {
    nombre: string;
}

interface Variante {
    stock: number;
    talles: Talle;
    colores: Color;
}

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categorias: Categoria;
    imagenes: ImagenProducto[];
    variantes: Variante[];
}

export default function ProductoDetalle() {
    const { id } = useParams<{ id: string }>();

    const [producto, setProducto] = useState<Producto | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [talleSeleccionado, setTalleSeleccionado] = useState<string | null>(null);
    const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(null);

    // --- TRAEMOS LA FUNCIÓN PARA AGREGAR AL CARRITO ---
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducto = async () => {
        try {
            const { data, error } = await supabase
            .from('productos')
            .select(`
                *,
                imagenes:imagenes_producto(id, imagen),
                variantes:variantes_producto(
                stock,
                talles (nombre),
                colores (nombre)
                ),
                categorias (id, nombre)
            `)
            .eq('id', id)
            .single();

            if (error) throw error;

            setProducto(data as Producto);
        } catch {
            setError('Producto no encontrado o fuera de stock.');
        } finally {
            setCargando(false);
        }
        };

        if (id) fetchProducto();
    }, [id]);

    if (cargando) {
        return (
        <div className="flex justify-center items-center min-h-[70vh] bg-background">
            <div className="border-4 border-text p-6 bg-background shadow-[8px_8px_0px_0px_var(--color-text)] animate-pulse">
            <span className="text-xl font-black uppercase tracking-widest text-text">
                [ Localizando Prenda ]
            </span>
            </div>
        </div>
        );
    }

    if (error || !producto) {
        return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-background px-4">
            <AlertTriangle
            size={64}
            className="text-accent mb-6"
            strokeWidth={2}
            />

            <h2 className="text-4xl font-black uppercase tracking-tighter text-text mb-4">
            Error 404
            </h2>

            <p className="text-text-secondary font-bold uppercase tracking-wide mb-8">
            {error}
            </p>

            <Link
            to="/catalogo"
            className="border-4 border-text px-8 py-4 font-black uppercase tracking-widest hover:bg-text hover:text-background transition-colors shadow-[6px_6px_0px_0px_var(--color-accent)]"
            >
            Volver al catálogo
            </Link>
        </div>
        );
    }

    const variantesConStock =
        producto.variantes?.filter(v => v.stock > 0) || [];

    const tallesDisponibles = Array.from(
        new Set(
        variantesConStock
            .map(v => v.talles?.nombre)
            .filter(Boolean)
        )
    );

    const coloresDisponibles = Array.from(
        new Set(
        variantesConStock
            .map(v => v.colores?.nombre)
            .filter(Boolean)
        )
    );

    // --- FUNCIÓN QUE SE EJECUTA AL TOCAR EL BOTÓN ---
    const handleAddToCart = () => {
        if (!talleSeleccionado || !colorSeleccionado) return;

        // Creamos el objeto con los datos exactos que pide el CartContext
        addToCart({
            // Generamos un ID único combinando el producto, el talle y el color
            // Así, si agrega un "Talle M" y luego un "Talle L", son renglones distintos en el carrito
            id: `${producto.id}-${talleSeleccionado}-${colorSeleccionado}`, 
            producto_id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1, // Por defecto siempre arranca en 1
            imagen: producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0].imagen : '',
            talle: talleSeleccionado,
            color: colorSeleccionado
        });
    };

    return (
        <div className="min-h-screen bg-background text-text selection:bg-accent selection:text-text py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Botón Volver */}
            <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-text-secondary hover:text-accent transition-colors mb-10 group"
            >
            <ArrowLeft
                size={24}
                strokeWidth={3}
                className="group-hover:-translate-x-2 transition-transform"
            />
            Volver
            </Link>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

            {/* LADO IZQUIERDO */}
            <div className="w-full lg:w-1/2">
                <div className="aspect-[4/5] border-4 border-text bg-primary relative shadow-[12px_12px_0px_0px_var(--color-text)] overflow-hidden group">

                {producto.imagenes && producto.imagenes.length > 0 ? (
                    <img
                    src={producto.imagenes[0].imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center font-black uppercase text-text-secondary text-2xl tracking-widest">
                    [ Imagen No Disponible ]
                    </div>
                )}

                {producto.categorias && (
                    <div className="absolute top-6 left-6 bg-background text-text border-2 border-text font-black uppercase tracking-widest px-4 py-2 text-sm shadow-[4px_4px_0px_0px_var(--color-accent)]">
                        {producto.categorias.nombre}
                    </div>
                )}
                </div>
            </div>

            {/* LADO DERECHO */}
            <div className="w-full lg:w-1/2 flex flex-col pt-4">

                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none">
                {producto.nombre}
                </h1>

                <p className="text-4xl font-black text-text mb-8 tracking-tighter">
                ${producto.precio.toLocaleString('es-AR')}
                </p>

                <p className="text-text-secondary font-bold text-lg uppercase tracking-wide leading-relaxed mb-10">
                {producto.descripcion}
                </p>

                <div className="w-full h-1 bg-text mb-10"></div>

                {/* TALLES */}
                <div className="mb-8">

                <h3 className="font-black uppercase tracking-widest text-sm mb-4">
                    Selecciona tu talle:
                    <span className="text-accent ml-2">
                    {talleSeleccionado || '[ Requerido ]'}
                    </span>
                </h3>

                <div className="flex flex-wrap gap-3">

                    {tallesDisponibles.length > 0 ? (
                    tallesDisponibles.map(t => (
                        <button
                        key={t}
                        onClick={() => setTalleSeleccionado(t)}
                        className={`min-w-[3.5rem] px-3 h-14 flex items-center justify-center font-black text-lg border-4 transition-all ${
                            talleSeleccionado === t
                            ? 'bg-text border-text text-background shadow-[4px_4px_0px_0px_var(--color-accent)] transform -translate-y-1'
                            : 'bg-background border-text text-text hover:bg-text hover:text-background'
                        }`}
                        >
                        {t}
                        </button>
                    ))
                    ) : (
                    <span className="text-accent font-bold uppercase tracking-widest text-sm border-2 border-accent px-4 py-2">
                        Agotado
                    </span>
                    )}

                </div>
                </div>

                {/* COLORES */}
                <div className="mb-12">

                <h3 className="font-black uppercase tracking-widest text-sm mb-4">
                    Color:
                    <span className="text-accent ml-2">
                    {colorSeleccionado || '[ Requerido ]'}
                    </span>
                </h3>

                <div className="flex flex-wrap gap-3">

                    {coloresDisponibles.length > 0 ? (
                    coloresDisponibles.map(c => (
                        <button
                        key={c}
                        onClick={() => setColorSeleccionado(c)}
                        className={`px-6 py-3 font-black uppercase tracking-wider text-sm border-4 transition-all ${
                            colorSeleccionado === c
                            ? 'bg-text border-text text-background shadow-[4px_4px_0px_0px_var(--color-accent)] transform -translate-y-1'
                            : 'bg-background border-text text-text hover:bg-text hover:text-background'
                        }`}
                        >
                        {c}
                        </button>
                    ))
                    ) : (
                    <span className="text-accent font-bold uppercase tracking-widest text-sm border-2 border-accent px-4 py-2">
                        Agotado
                    </span>
                    )}

                </div>
                </div>

                {/* BOTÓN CONECTADO AL CONTEXTO */}
                <button
                disabled={
                    !talleSeleccionado ||
                    !colorSeleccionado ||
                    tallesDisponibles.length === 0
                }
                onClick={handleAddToCart} // <-- EJECUTA LA FUNCIÓN
                className={`mt-auto w-full flex items-center justify-center gap-4 py-6 border-4 border-text font-black uppercase tracking-widest text-xl transition-all ${
                    !talleSeleccionado ||
                    !colorSeleccionado ||
                    tallesDisponibles.length === 0
                    ? 'bg-primary text-text-secondary cursor-not-allowed opacity-50'
                    : 'bg-accent text-text hover:bg-text hover:text-background shadow-[8px_8px_0px_0px_var(--color-text)] hover:shadow-none hover:translate-x-1 hover:translate-y-1'
                }`}
                >
                <ShoppingCart size={28} strokeWidth={3} />

                {!talleSeleccionado || !colorSeleccionado
                    ? 'Selecciona Talle y Color'
                    : 'Añadir al arsenal'}
                </button>

            </div>
            </div>
        </div>
        </div>
    );
}