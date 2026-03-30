import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// IMPORTANTE: Agregamos el ícono "X" para cerrar el modal
import { ArrowLeft, ShoppingCart, AlertTriangle, X } from "lucide-react";
import { supabase } from "../supabase";

import { useCart } from "../CartContext";
import BotonFavorito from "../components/ui/BotonFavorito"; // <-- Importamos el botón

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

    const [talleSeleccionado, setTalleSeleccionado] = useState<string | null>(
        null,
    );
    const [colorSeleccionado, setColorSeleccionado] = useState<string | null>(
        null,
    );
    const [imagenSeleccionada, setImagenSeleccionada] = useState<string>("");

    // NUEVO: Estado para abrir/cerrar la guía de talles
    const [mostrarGuia, setMostrarGuia] = useState(false);

    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const { data, error } = await supabase
                    .from("productos")
                    .select(
                        `
                *,
                imagenes:imagenes_producto(id, imagen),
                variantes:variantes_producto(
                stock,
                talles (nombre),
                colores (nombre)
                ),
                categorias (id, nombre)
            `,
                    )
                    .eq("id", id)
                    .single();

                if (error) throw error;

                setProducto(data as Producto);

                if (data && data.imagenes && data.imagenes.length > 0) {
                    setImagenSeleccionada(data.imagenes[0].imagen);
                }
            } catch {
                setError("Producto no encontrado o fuera de stock.");
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
        producto.variantes?.filter((v) => v.stock > 0) || [];
    const tallesDisponibles = Array.from(
        new Set(variantesConStock.map((v) => v.talles?.nombre).filter(Boolean)),
    );
    const coloresDisponibles = Array.from(
        new Set(
            variantesConStock.map((v) => v.colores?.nombre).filter(Boolean),
        ),
    );

    const handleAddToCart = () => {
        if (!talleSeleccionado || !colorSeleccionado) return;

        addToCart({
            id: `${producto.id}-${talleSeleccionado}-${colorSeleccionado}`,
            producto_id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            imagen:
                producto.imagenes && producto.imagenes.length > 0
                    ? producto.imagenes[0].imagen
                    : "",
            talle: talleSeleccionado,
            color: colorSeleccionado,
        });
    };

    // NUEVO: Función para determinar qué imagen mostrar según la categoría
    const renderImagenGuia = () => {
        const nombreCategoria =
            producto.categorias?.nombre?.toLowerCase() || "";

        // Comprobamos si la categoría contiene la palabra "baggy" o "pantalón"
        if (
            nombreCategoria.includes("baggy") ||
            nombreCategoria.includes("pantalon") ||
            nombreCategoria.includes("pantalón")
        ) {
            return (
                <img
                    src="/guia-baggy.png"
                    alt="Guía Pantalones Baggy"
                    className="w-full border-2 border-text mb-6"
                />
            );
        }
        // Comprobamos si es remera
        else if (
            nombreCategoria.includes("remera") ||
            nombreCategoria.includes("t-shirt")
        ) {
            return (
                <img
                    src="/guia-remera.png"
                    alt="Guía Remeras"
                    className="w-full border-2 border-text mb-6"
                />
            );
        }
        // Imagen por defecto si es otra categoría
        else {
            return (
                <img
                    src="/guia-general.png"
                    alt="Guía General"
                    className="w-full border-2 border-text mb-6"
                />
            );
        }
    };

    return (
        <div className="min-h-screen bg-background text-text selection:bg-accent selection:text-text py-12 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    {/* LADO IZQUIERDO: Imágenes */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className="aspect-4/5 border-4 border-text bg-primary relative shadow-[12px_12px_0px_0px_var(--color-text)] overflow-hidden group">
                            {/* BOTÓN DE FAVORITOS INYECTADO AQUÍ */}
                            <BotonFavorito productoId={producto.id} />

                            {imagenSeleccionada ? (
                                <img
                                    src={imagenSeleccionada}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 transition-all duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-black uppercase text-text-secondary text-2xl tracking-widest">
                                    [ Imagen No Disponible ]
                                </div>
                            )}

                            {producto.categorias && (
                                <div className="absolute top-6 left-6 bg-background text-text border-2 border-text font-black uppercase tracking-widest px-4 py-2 text-sm shadow-[4px_4px_0px_0px_var(--color-accent)] pointer-events-none">
                                    {producto.categorias.nombre}
                                </div>
                            )}
                        </div>

                        {producto.imagenes && producto.imagenes.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {producto.imagenes.map((imgObj) => (
                                    <button
                                        key={imgObj.id}
                                        onClick={() =>
                                            setImagenSeleccionada(imgObj.imagen)
                                        }
                                        className={`shrink-0 w-24 h-24 border-4 overflow-hidden transition-all ${
                                            imagenSeleccionada === imgObj.imagen
                                                ? "border-accent shadow-[4px_4px_0px_0px_var(--color-accent)] transform -translate-y-1"
                                                : "border-text hover:border-accent"
                                        }`}
                                    >
                                        <img
                                            src={imgObj.imagen}
                                            alt={`Vista ${imgObj.id}`}
                                            className="w-full h-full object-cover grayscale-50 hover:grayscale-0 transition-all"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* LADO DERECHO: Info */}
                    <div className="w-full lg:w-1/2 flex flex-col pt-4">
                        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none">
                            {producto.nombre}
                        </h1>

                        <p className="text-4xl font-black text-text mb-8 tracking-tighter">
                            ${producto.precio.toLocaleString("es-AR")}
                        </p>

                        <p className="text-text-secondary font-bold text-lg uppercase tracking-wide leading-relaxed mb-10">
                            {producto.descripcion}
                        </p>

                        <div className="w-full h-1 bg-text mb-10"></div>

                        {/* TALLES */}
                        <div className="mb-8">
                            {/* Contenedor con el título de talles y el botón de la guía juntos */}
                            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                                <h3 className="font-black uppercase tracking-widest text-sm">
                                    Selecciona tu talle:
                                    <span className="text-accent ml-2">
                                        {talleSeleccionado || "[ Requerido ]"}
                                    </span>
                                </h3>

                                {/* Botón para abrir modal */}
                                <button
                                    onClick={() => setMostrarGuia(true)}
                                    className="text-text hover:text-accent font-black text-xs uppercase underline tracking-widest flex items-center gap-1 transition-colors"
                                >
                                    📏 Ver Guía de Talles
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {tallesDisponibles.length > 0 ? (
                                    tallesDisponibles.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() =>
                                                setTalleSeleccionado(t)
                                            }
                                            className={`min-w-14 px-3 h-14 flex items-center justify-center font-black text-lg border-4 transition-all ${
                                                talleSeleccionado === t
                                                    ? "bg-text border-text text-background shadow-[4px_4px_0px_0px_var(--color-accent)] transform -translate-y-1"
                                                    : "bg-background border-text text-text hover:bg-text hover:text-background"
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
                                    {colorSeleccionado || "[ Requerido ]"}
                                </span>
                            </h3>

                            <div className="flex flex-wrap gap-3">
                                {coloresDisponibles.length > 0 ? (
                                    coloresDisponibles.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() =>
                                                setColorSeleccionado(c)
                                            }
                                            className={`px-6 py-3 font-black uppercase tracking-wider text-sm border-4 transition-all ${
                                                colorSeleccionado === c
                                                    ? "bg-text border-text text-background shadow-[4px_4px_0px_0px_var(--color-accent)] transform -translate-y-1"
                                                    : "bg-background border-text text-text hover:bg-text hover:text-background"
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

                        {/* BOTÓN AÑADIR AL CARRITO */}
                        <button
                            disabled={
                                !talleSeleccionado ||
                                !colorSeleccionado ||
                                tallesDisponibles.length === 0
                            }
                            onClick={handleAddToCart}
                            className={`mt-auto w-full flex items-center justify-center gap-4 py-6 border-4 border-text font-black uppercase tracking-widest text-xl transition-all ${
                                !talleSeleccionado ||
                                !colorSeleccionado ||
                                tallesDisponibles.length === 0
                                    ? "bg-primary text-text-secondary cursor-not-allowed opacity-50"
                                    : "bg-accent text-text hover:bg-text hover:text-background shadow-[8px_8px_0px_0px_var(--color-text)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                            }`}
                        >
                            <ShoppingCart size={28} strokeWidth={3} />
                            {!talleSeleccionado || !colorSeleccionado
                                ? "Selecciona Talle y Color"
                                : "Añadir al arsenal"}
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL DE GUÍA DE TALLES */}
            {mostrarGuia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-background border-4 border-text p-6 md:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-[16px_16px_0px_0px_var(--color-text)]">
                        {/* Botón para cerrar */}
                        <button
                            onClick={() => setMostrarGuia(false)}
                            className="absolute top-4 right-4 text-text hover:text-accent transition-colors bg-background border-2 border-text p-1"
                        >
                            <X size={28} strokeWidth={3} />
                        </button>

                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 border-b-4 border-text pb-4">
                            Guía de Talles: {producto.categorias?.nombre}
                        </h2>

                        {/* Carga la imagen correspondiente */}
                        {renderImagenGuia()}

                        {/* Explicación general */}
                        <div className="bg-primary p-6 border-4 border-text">
                            <h3 className="font-black uppercase tracking-widest text-lg mb-4">
                                ¿Cómo medirte? 📏
                            </h3>
                            <p className="text-text-secondary font-bold mb-4 leading-relaxed">
                                Busca tu prenda favorita (esa que te queda
                                increíble), ponela sobre una mesa bien estirada
                                y usa una cinta métrica o regla:
                            </p>
                            <ul className="list-disc list-inside space-y-2 text-text font-semibold">
                                <li>
                                    <span className="font-black uppercase text-accent">
                                        Ancho:
                                    </span>{" "}
                                    Medí de lado a lado (axila a axila en
                                    remeras, o de costura a costura en la
                                    cintura de pantalones).
                                </li>
                                <li>
                                    <span className="font-black uppercase text-accent">
                                        Largo:
                                    </span>{" "}
                                    Medí desde el borde más alto (cuello o
                                    cintura) hasta el final de la prenda.
                                </li>
                            </ul>

                            <div className="mt-6 pt-4 border-t-2 border-text/20">
                                <p className="text-sm font-black uppercase tracking-wider text-text">
                                    <span className="text-accent">💡 Tip:</span>{" "}
                                    Nuestras prendas son corte Unisex. Para un
                                    fit oversize extremo, subí un talle.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
