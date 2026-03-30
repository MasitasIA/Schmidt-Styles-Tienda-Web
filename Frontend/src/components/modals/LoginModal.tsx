import { useState, useContext, type FormEvent } from "react";
import { AuthContext } from "../../AuthContext";

export default function LoginModal({ onClose }: { onClose: () => void }) {
    const { login } = useContext(AuthContext);

    // Estado para alternar entre Login y Registro
    const [isLogin, setIsLogin] = useState(true);

    // Estados del formulario
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setMensajeExito("");

        try {
            if (isLogin) {
                // FastAPI OAuth2 espera los datos como formulario (x-www-form-urlencoded)
                const formData = new URLSearchParams();
                formData.append("username", email);
                formData.append("password", password);

                const res = await fetch("http://localhost:8000/login/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: formData,
                });

                if (!res.ok) throw new Error("Email o contraseña incorrectos");

                const data = await res.json();
                login(data.access_token);
                onClose();
            } else {
                // El endpoint de registro espera un JSON normal
                const res = await fetch("http://localhost:8000/registro/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, email, password }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.detail || "Error al registrarse");
                }

                // Éxito al registrar
                setIsLogin(true);
                setMensajeExito("¡Cuenta creada! Ahora inicia sesión.");
                setPassword("");
            }
        } catch (err: unknown) {
            // Manejo estricto de errores en TypeScript
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Ocurrió un error inesperado");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-background border-4 border-text p-8 w-full max-w-md relative flex flex-col shadow-[12px_12px_0px_0px_var(--color-accent)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text hover:text-accent font-black text-xl"
                >
                    X
                </button>

                <h2 className="text-3xl font-black uppercase tracking-widest text-text mb-6 text-center">
                    {isLogin ? "Acceso" : "Crear Cuenta"}
                </h2>

                {error && (
                    <div className="bg-red-500 text-white font-bold p-3 mb-4 border-2 border-text">
                        {error}
                    </div>
                )}
                {mensajeExito && (
                    <div className="bg-green-500 text-white font-bold p-3 mb-4 border-2 border-text">
                        {mensajeExito}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="TU NOMBRE"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="bg-primary border-2 border-text text-text p-3 font-bold uppercase placeholder-text-secondary focus:outline-none focus:border-accent"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="CORREO ELECTRÓNICO"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-primary border-2 border-text text-text p-3 font-bold uppercase placeholder-text-secondary focus:outline-none focus:border-accent"
                    />
                    <input
                        type="password"
                        placeholder="CONTRASEÑA"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-primary border-2 border-text text-text p-3 font-bold uppercase placeholder-text-secondary focus:outline-none focus:border-accent"
                    />

                    <button
                        type="submit"
                        className="mt-2 bg-text text-background border-2 border-text py-4 font-black uppercase tracking-widest hover:bg-background hover:text-text hover:shadow-[6px_6px_0px_0px_var(--color-text)] transition-all"
                    >
                        {isLogin ? "Entrar" : "Registrarse"}
                    </button>
                </form>

                <div className="mt-6 text-center border-t-2 border-text pt-4">
                    <p className="text-text-secondary font-bold uppercase text-sm">
                        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
                    </p>
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                            setMensajeExito("");
                        }}
                        className="text-accent font-black uppercase tracking-widest mt-2 hover:underline"
                    >
                        {isLogin ? "Crear cuenta nueva" : "Iniciar sesión"}
                    </button>
                </div>
            </div>
        </div>
    );
}
