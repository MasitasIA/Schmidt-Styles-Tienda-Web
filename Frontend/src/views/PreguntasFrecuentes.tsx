import { useState } from "react";
import { HelpCircle, Send, CheckCircle } from "lucide-react";
// Asegúrate de que el nombre exportado en Constants.ts coincida (ej: EMAIL_CONTACTO)
import { Contacto } from "../utils/Constants";

export default function PreguntasFrecuentes() {
    const [pregunta, setPregunta] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [cargando, setCargando] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pregunta.trim()) return;

        setCargando(true);

        /* OPCIÓN 1: Usar Formspree (Más fácil para enviar directo a tu correo sin programar backend)
          Reemplaza la URL con tu endpoint de Formspree vinculado a EMAIL_CONTACTO
        */
        try {
            // const response = await fetch("https://formspree.io/f/TU_ID_AQUI", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({
            //         mensaje: pregunta,
            //         origen: "Pregunta Anónima - FAQ"
            //     })
            // });

            /* Simulación temporal de envío para que veas el diseño: */
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setEnviado(true);
            setPregunta("");
        } catch (error) {
            console.error("Error al enviar la pregunta", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16 selection:bg-accent selection:text-text">
            <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 border-b-8 border-text pb-4 inline-block">
                Preguntas Frecuentes
            </h1>

            <div className="max-w-3xl border-4 border-text p-8 bg-background shadow-[8px_8px_0px_0px_var(--color-accent)]">
                <div className="flex items-center gap-4 mb-6 text-accent">
                    <HelpCircle size={40} />
                    <h2 className="text-2xl font-black uppercase">
                        ¿Tienes alguna duda?
                    </h2>
                </div>

                <p className="font-bold text-lg mb-8 text-text-secondary">
                    Todavía estamos construyendo nuestra sección de preguntas.
                    Déjanos tu consulta de forma{" "}
                    <span className="text-text bg-accent px-2">
                        totalmente anónima
                    </span>{" "}
                    y la responderemos en nuestras redes o la agregaremos aquí
                    próximamente.
                </p>

                {enviado ? (
                    <div className="bg-text text-background p-6 border-4 border-text flex flex-col items-center text-center animate-fade-in">
                        <CheckCircle
                            size={48}
                            className="mb-4 text-background"
                        />
                        <h3 className="text-xl font-black uppercase mb-2">
                            ¡Pregunta enviada!
                        </h3>
                        <p className="font-bold uppercase tracking-widest text-sm">
                            Gracias por ayudarnos a mejorar.
                        </p>
                        <button
                            onClick={() => setEnviado(false)}
                            className="mt-6 bg-background text-text px-6 py-2 border-2 border-background hover:bg-accent transition-all font-black uppercase text-sm"
                        >
                            Enviar otra pregunta
                        </button>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="pregunta"
                                className="font-black uppercase tracking-widest text-sm"
                            >
                                Tu Pregunta:
                            </label>
                            <textarea
                                id="pregunta"
                                rows={5}
                                value={pregunta}
                                onChange={(e) => setPregunta(e.target.value)}
                                placeholder="Escribe aquí lo que quieras saber..."
                                className="w-full bg-background border-4 border-text p-4 text-text font-bold resize-none focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/50"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={cargando}
                            className="flex items-center justify-center gap-3 bg-text text-background px-8 py-4 border-4 border-transparent hover:bg-accent hover:text-text hover:border-text transition-all font-black uppercase tracking-widest text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cargando ? "Enviando..." : "Enviar Anónimamente"}
                            {!cargando && <Send size={24} />}
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t-4 border-text/10 text-xs font-black uppercase tracking-widest text-text-secondary text-center">
                    Las respuestas llegarán a:{" "}
                    {Contacto.email || "nuestro correo"}
                </div>
            </div>
        </div>
    );
}
