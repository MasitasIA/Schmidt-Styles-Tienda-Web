import { Heart } from "lucide-react";
import { useContext } from "react";
import { FavoritosContext } from "../../FavoritosContext";
import { AuthContext } from "../../AuthContext";

export default function BotonFavorito({ productoId }: { productoId: number }) {
    const { toggleFavorito, isFavorito } = useContext(FavoritosContext);
    const { isAuthenticated } = useContext(AuthContext);

    const favorito = isFavorito(productoId);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Evita que al tocar el corazón, te lleve a la página del producto
        if (!isAuthenticated) {
            alert(
                "Por favor, inicia sesión en 'Cuenta' para guardar favoritos.",
            );
            return;
        }
        toggleFavorito(productoId);
    };

    return (
        <button
            onClick={handleClick}
            className="absolute top-4 right-4 bg-background border-4 border-text p-2 hover:bg-text hover:text-background transition-colors z-20 shadow-[4px_4px_0px_0px_var(--color-text)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            title="Agregar a favoritos"
        >
            <Heart
                size={24}
                strokeWidth={3}
                fill={favorito ? "currentColor" : "none"}
                className={favorito ? "text-accent" : "text-current"}
            />
        </button>
    );
}
