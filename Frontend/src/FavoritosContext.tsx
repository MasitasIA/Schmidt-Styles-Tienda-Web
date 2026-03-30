import {
    createContext,
    useState,
    useEffect,
    useContext,
    type ReactNode,
} from "react";
import { AuthContext } from "./AuthContext";

interface FavoritoItem {
    producto_id: number;
}

interface FavoritosContextType {
    favoritosIds: number[];
    toggleFavorito: (productoId: number) => Promise<void>;
    isFavorito: (productoId: number) => boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const FavoritosContext = createContext<FavoritosContextType>(
    {} as FavoritosContextType,
);

export const FavoritosProvider = ({ children }: { children: ReactNode }) => {
    const { token, isAuthenticated } = useContext(AuthContext);
    const [favoritosIds, setFavoritosIds] = useState<number[]>([]);

    // Cargar favoritos al iniciar sesión
    useEffect(() => {
        if (isAuthenticated && token) {
            fetch("http://localhost:8000/favoritos/", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        // Guardamos solo los IDs de los productos para hacer comprobaciones rápidas
                        setFavoritosIds(
                            data.map((fav: FavoritoItem) => fav.producto_id),
                        );
                    }
                })
                .catch((err) => console.error(err));
        } else {
            setFavoritosIds([]); // Limpiar si cierra sesión
        }
    }, [isAuthenticated, token]);

    const toggleFavorito = async (productoId: number) => {
        if (!token) return;

        // Actualización optimista (cambia el color del corazón al instante)
        setFavoritosIds((prev) =>
            prev.includes(productoId)
                ? prev.filter((id) => id !== productoId)
                : [...prev, productoId],
        );

        try {
            const res = await fetch(
                `http://localhost:8000/favoritos/${productoId}`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            if (!res.ok) throw new Error("Error al modificar favorito");
        } catch {
            setFavoritosIds((prev) =>
                prev.includes(productoId)
                    ? prev.filter((id) => id !== productoId)
                    : [...prev, productoId],
            );
        }
    };

    const isFavorito = (productoId: number) =>
        favoritosIds.includes(productoId);

    return (
        <FavoritosContext.Provider
            value={{ favoritosIds, toggleFavorito, isFavorito }}
        >
            {children}
        </FavoritosContext.Provider>
    );
};
