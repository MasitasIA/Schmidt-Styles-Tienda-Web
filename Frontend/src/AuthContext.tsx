import { createContext, useState, type ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem("comprador_token");
    });

    const login = (nuevoToken: string) => {
        localStorage.setItem("comprador_token", nuevoToken);
        setToken(nuevoToken);
    };

    const logout = () => {
        localStorage.removeItem("comprador_token");
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{ token, login, logout, isAuthenticated: !!token }}
        >
            {children}
        </AuthContext.Provider>
    );
};
