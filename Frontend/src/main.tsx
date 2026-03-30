import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { CartProvider } from "./CartContext.tsx";
import { AuthProvider } from "./AuthContext.tsx";
import { FavoritosProvider } from "./FavoritosContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <FavoritosProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </FavoritosProvider>
        </AuthProvider>
    </React.StrictMode>,
);
