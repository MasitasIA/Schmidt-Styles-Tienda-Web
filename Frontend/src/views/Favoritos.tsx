import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import BotonFavorito from "../components/ui/BotonFavorito";

// 1. Definimos las interfaces para eliminar el "any"
interface ImagenProducto {
    id: number;
    imagen: string;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    imagenes: ImagenProducto[];
}

interface FavoritoItem {
    id: number;
    producto: Producto;
}

export default function Favoritos() {
    const { token, isAuthenticated } = useContext(AuthContext);

    // 2. Usamos la interfaz FavoritoItem en lugar de any[]
    const [favoritos, setFavoritos] = useState<FavoritoItem[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (isAuthenticated && token) {
            fetch("http://localhost:8000/favoritos/", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    setFavoritos(data);
                    setCargando(false);
                })
                .catch(() => setCargando(false));
        }
        // 3. Eliminamos el bloque 'else' síncrono. Al no estar autenticado,
        // el return de "Acceso Restringido" actuará de forma natural.
    }, [isAuthenticated, token]);

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <h2 className="text-4xl font-black uppercase text-text mb-4">
                    Acceso Restringido
                </h2>
                <p className="text-xl font-bold text-text-secondary uppercase">
                    Debes iniciar sesión para ver tus favoritos.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-text mb-12 border-b-4 border-text pb-4">
                Tus <span className="text-accent">Favoritos</span>
            </h2>

            {cargando ? (
                <div className="w-full h-64 border-4 border-text bg-background flex items-center justify-center animate-pulse">
                    <span className="font-black uppercase tracking-widest text-text">
                        [ CARGANDO ]
                    </span>
                </div>
            ) : favoritos.length === 0 ? (
                <div className="w-full border-4 border-dashed border-text bg-background p-12 text-center">
                    <span className="font-black uppercase tracking-widest text-text-secondary text-2xl">
                        [ No tienes prendas guardadas ]
                    </span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {favoritos.map((fav) => (
                        <div
                            key={fav.id}
                            className="relative group flex flex-col h-full border-4 border-text bg-background hover:shadow-[12px_12px_0px_0px_var(--color-accent)] transition-all duration-300"
                        >
                            {/* Inyectamos el botón sobre la imagen en un contenedor relativo */}
                            <BotonFavorito productoId={fav.producto.id} />

                            <Link
                                to={`/producto/${fav.producto.id}`}
                                className="flex flex-col flex-1"
                            >
                                <div className="aspect-4/5 border-b-4 border-text bg-primary relative overflow-hidden">
                                    {fav.producto.imagenes &&
                                    fav.producto.imagenes.length > 0 ? (
                                        <img
                                            src={
                                                fav.producto.imagenes[0].imagen
                                            }
                                            alt={fav.producto.nombre}
                                            className="w-full h-full object-cover grayscale-30 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-black uppercase text-text-secondary tracking-widest">
                                            [ Sin Imagen ]
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-lg font-black uppercase tracking-tight text-text mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                                        {fav.producto.nombre}
                                    </h3>
                                    <div className="mt-auto pt-4 border-t-2 border-text flex justify-between items-center">
                                        <span className="text-xl font-black text-text tracking-tighter">
                                            $
                                            {fav.producto.precio.toLocaleString(
                                                "es-AR",
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
