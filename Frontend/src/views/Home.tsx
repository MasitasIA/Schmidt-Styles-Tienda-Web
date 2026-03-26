import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Zap, ShieldCheck, Truck } from "lucide-react";
import { supabase } from "../supabase";

interface ImagenProducto {
    id: number;
    imagen: string;
}

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    categorias: Categoria;
    imagenes: ImagenProducto[];
}

export default function Home() {
    const [productosRecientes, setProductosRecientes] = useState<Producto[]>(
        [],
    );
    const [cargando, setCargando] = useState(true);

    // MAGIA NATIVA: Creamos una referencia al contenedor del carrusel
    const sliderRef = useRef<HTMLDivElement>(null);

    // Funciones para deslizar a la izquierda o derecha al tocar los botones
    const slideLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -340, behavior: "smooth" });
        }
    };

    const slideRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 340, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const fetchRecientes = async () => {
            try {
                const { data, error } = await supabase
                    .from("productos")
                    .select(
                        "*, imagenes:imagenes_producto(id, imagen), categorias (id, nombre)",
                    )
                    .eq("activo", true)
                    .order("id", { ascending: false })
                    .limit(6);

                if (error) throw error;
                setProductosRecientes(data as Producto[]);
            } catch (err) {
                console.error("Error cargando novedades:", err);
            } finally {
                setCargando(false);
            }
        };

        fetchRecientes();
    }, []);

    return (
        <div className="w-full bg-background text-text selection:bg-accent selection:text-text">
            {/* HERO SECTION */}
            <section className="relative px-4 py-24 md:py-32 flex flex-col items-center justify-center text-center">
                <div className="mb-8 px-4 py-2 border-2 border-text bg-background text-xs font-black tracking-[0.2em] uppercase text-text shadow-[4px_4px_0px_0px_var(--color-accent)] transform -skew-x-6">
                    [ En construcción ]
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6 max-w-5xl leading-[0.9]">
                    redefine tu <br />
                    <span className="text-text border-b-8 border-accent inline-block pb-2 mt-2 hover:text-text-hover transition-colors duration-300">
                        estilo urbano
                    </span>
                </h1>
                <p className="text-text-secondary font-bold max-w-xl mb-12 text-lg uppercase tracking-wide">
                    Streetwear minimalista. <br />
                    <span className="text-text">
                        Prendas diseñadas para destacar en el asfalto.
                    </span>
                </p>
                <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-4">
                    <Link
                        to="/catalogo"
                        className="group flex items-center justify-center gap-3 bg-secondary text-background border-2 border-secondary px-10 py-5 font-black uppercase tracking-widest hover:bg-background hover:text-secondary hover:border-accent hover:shadow-[8px_8px_0px_0px_var(--color-accent)] transition-all"
                    >
                        Ver catálogo
                        <ArrowRight
                            size={20}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                    <Link
                        to="/como-comprar"
                        className="flex items-center justify-center gap-2 bg-background border-2 border-primary-hover text-text px-10 py-5 font-black uppercase tracking-widest hover:border-text hover:bg-text hover:text-background hover:shadow-[8px_8px_0px_0px_var(--color-text)] transition-all"
                    >
                        Cómo comprar
                    </Link>
                </div>
            </section>

            {/* CARRUSEL NATIVO CON BOTONES */}
            <section className="container mx-auto px-4 pb-24">
                <div className="flex items-end justify-between mb-8 border-b-4 border-text pb-4">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-text">
                        Nuevos <span className="text-accent">Drops</span>
                    </h2>

                    {/* BOTONES DE CONTROL (Se ocultan en celular porque ahí se desliza con el dedo) */}
                    <div className="hidden md:flex gap-4">
                        <button
                            onClick={slideLeft}
                            className="w-14 h-14 flex items-center justify-center border-4 border-text bg-background hover:bg-text hover:text-background shadow-[4px_4px_0px_0px_var(--color-text)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                            <ArrowLeft size={28} strokeWidth={3} />
                        </button>
                        <button
                            onClick={slideRight}
                            className="w-14 h-14 flex items-center justify-center border-4 border-text bg-background hover:bg-text hover:text-background shadow-[4px_4px_0px_0px_var(--color-text)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                            <ArrowRight size={28} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {cargando ? (
                    <div className="w-full h-80 border-4 border-text bg-background flex items-center justify-center shadow-[8px_8px_0px_0px_var(--color-text)] animate-pulse">
                        <span className="font-black uppercase tracking-widest text-text">
                            [ Cargando Novedades ]
                        </span>
                    </div>
                ) : productosRecientes.length === 0 ? (
                    <div className="w-full h-80 border-4 border-dashed border-text bg-background flex items-center justify-center">
                        <span className="font-black uppercase tracking-widest text-text-secondary text-2xl">
                            [ No hay lanzamientos recientes ]
                        </span>
                    </div>
                ) : (
                    /* Le pasamos la "ref" a este contenedor para moverlo desde los botones */
                    <div
                        ref={sliderRef}
                        className="flex overflow-x-auto gap-8 pb-8 pt-2 snap-x snap-mandatory scroll-smooth"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }} // Oculta la barra scroll fea nativa
                    >
                        {productosRecientes.map((producto) => (
                            <Link
                                key={producto.id}
                                to={`/producto/${producto.id}`}
                                className="group flex flex-col min-w-70 sm:min-w-[320px] max-w-[320px] shrink-0 snap-start border-4 border-text bg-background hover:shadow-[12px_12px_0px_0px_var(--color-accent)] transition-all duration-300"
                            >
                                <div className="aspect-4/5 border-b-4 border-text bg-primary relative overflow-hidden">
                                    {producto.imagenes &&
                                    producto.imagenes.length > 0 ? (
                                        <img
                                            src={producto.imagenes[0].imagen}
                                            alt={producto.nombre}
                                            className="w-full h-full object-cover grayscale-30 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-black uppercase text-text-secondary text-xl tracking-widest">
                                            [ Sin Imagen ]
                                        </div>
                                    )}
                                    {producto.categorias && (
                                        <div className="absolute top-4 left-4 bg-text text-background font-black uppercase tracking-widest px-3 py-1 text-xs shadow-[4px_4px_0px_0px_var(--color-accent)]">
                                            {producto.categorias.nombre}
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-lg font-black uppercase tracking-tight text-text mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                                        {producto.nombre}
                                    </h3>
                                    <div className="mt-auto pt-4 border-t-2 border-text flex justify-between items-center">
                                        <span className="text-xl font-black text-text tracking-tighter">
                                            $
                                            {producto.precio.toLocaleString(
                                                "es-AR",
                                            )}
                                        </span>
                                        <ArrowRight
                                            size={20}
                                            strokeWidth={3}
                                            className="text-text group-hover:text-accent group-hover:translate-x-1 transition-all"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Botón "Ver todo" extra para la versión móvil */}
                <Link
                    to="/catalogo"
                    className="mt-8 md:hidden flex items-center justify-center gap-2 border-4 border-text py-4 font-black uppercase tracking-widest text-text hover:bg-text hover:text-background transition-colors shadow-[4px_4px_0px_0px_var(--color-text)]"
                >
                    Ver todo el catálogo{" "}
                    <ArrowRight size={24} strokeWidth={3} />
                </Link>
            </section>

            {/* BENEFICIOS */}
            <section className="container mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="group border-2 border-primary-hover bg-primary p-8 flex flex-col items-start text-left hover:border-secondary hover:shadow-[8px_8px_0px_0px_var(--color-secondary)] transition-all duration-300">
                        <Truck
                            size={40}
                            className="mb-6 text-text group-hover:text-accent transition-colors"
                        />
                        <h3 className="text-xl font-black uppercase tracking-widest mb-3 text-text">
                            Envíos al país
                        </h3>
                        <p className="text-text-secondary font-medium text-sm leading-relaxed">
                            Despachamos tu pedido rápidamente para que llegue a
                            tu casa sin demoras.
                        </p>
                    </div>
                    {/* Card 2 */}
                    <div className="group border-2 border-primary-hover bg-primary p-8 flex flex-col items-start text-left hover:border-secondary hover:shadow-[8px_8px_0px_0px_var(--color-secondary)] transition-all duration-300">
                        <ShieldCheck
                            size={40}
                            className="mb-6 text-text group-hover:text-accent transition-colors"
                        />
                        <h3 className="text-xl font-black uppercase tracking-widest mb-3 text-text">
                            Compra segura
                        </h3>
                        <p className="text-text-secondary font-medium text-sm leading-relaxed">
                            Pagos protegidos y múltiples medios de pago
                            disponibles a través de plataformas oficiales.
                        </p>
                    </div>
                    {/* Card 3 */}
                    <div className="group border-2 border-primary-hover bg-primary p-8 flex flex-col items-start text-left hover:border-secondary hover:shadow-[8px_8px_0px_0px_var(--color-secondary)] transition-all duration-300">
                        <Zap
                            size={40}
                            className="mb-6 text-text group-hover:text-accent transition-colors"
                        />
                        <h3 className="text-xl font-black uppercase tracking-widest mb-3 text-text">
                            Calidad premium
                        </h3>
                        <p className="text-text-secondary font-medium text-sm leading-relaxed">
                            Materiales pesados y seleccionados minuciosamente
                            para una durabilidad superior en la calle.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
