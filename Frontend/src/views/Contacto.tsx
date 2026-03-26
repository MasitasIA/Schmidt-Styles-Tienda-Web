import { MapPin, Phone, Instagram, Mail } from "lucide-react";

// Tus datos de contacto actuales
import { Contacto as DatosContacto } from "../utils/Constants";

export default function Contacto() {
    return (
        <div className="container mx-auto px-4 py-16 selection:bg-accent selection:text-text min-h-[70vh]">
            <h1 className="text-4xl md:text-6xl font-black uppercase mb-12 border-b-8 border-text pb-4 inline-block">
                Contacto
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                {/* Tarjeta: Ubicación */}
                <div className="border-4 border-text p-8 bg-background shadow-[8px_8px_0px_0px_var(--color-accent)]">
                    <div className="flex items-center gap-4 mb-4 text-accent">
                        <MapPin size={40} strokeWidth={2.5} />
                        <h2 className="text-2xl font-black uppercase">
                            Ubicación
                        </h2>
                    </div>
                    <p className="font-bold text-lg uppercase tracking-wide text-text-secondary leading-relaxed">
                        {DatosContacto.direccion}
                    </p>
                </div>

                {/* Tarjeta: Instagram */}
                <a
                    href={DatosContacto.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-4 border-text p-8 bg-background shadow-[8px_8px_0px_0px_var(--color-text)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all group block cursor-pointer"
                >
                    <div className="flex items-center gap-4 mb-4 text-text group-hover:text-accent transition-colors">
                        <Instagram size={40} strokeWidth={2.5} />
                        <h2 className="text-2xl font-black uppercase">
                            Instagram
                        </h2>
                    </div>
                    <p className="font-bold text-lg uppercase tracking-wide text-text-secondary">
                        @schmidt.styles
                    </p>
                    <div className="mt-6 inline-block bg-text text-background font-black uppercase px-4 py-2 text-sm group-hover:bg-accent transition-colors">
                        Seguinos
                    </div>
                </a>

                {/* Tarjeta: WhatsApp */}
                <a
                    href={`https://wa.me/${DatosContacto.telefono.replace(/\+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-4 border-text p-8 bg-background shadow-[8px_8px_0px_0px_var(--color-text)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all group block cursor-pointer"
                >
                    <div className="flex items-center gap-4 mb-4 text-text group-hover:text-accent transition-colors">
                        <Phone size={40} strokeWidth={2.5} />
                        <h2 className="text-2xl font-black uppercase">
                            WhatsApp
                        </h2>
                    </div>
                    <p className="font-bold text-lg uppercase tracking-wide text-text-secondary">
                        {DatosContacto.telefono === "+549"
                            ? "[ Número Próximamente ]"
                            : DatosContacto.telefono}
                    </p>
                    <div className="mt-6 inline-block bg-text text-background font-black uppercase px-4 py-2 text-sm group-hover:bg-accent transition-colors">
                        Escribinos
                    </div>
                </a>

                {/* Tarjeta: Email */}
                <a
                    href={
                        DatosContacto.email !== "#"
                            ? `mailto:${DatosContacto.email}`
                            : "#"
                    }
                    className="border-4 border-text p-8 bg-background shadow-[8px_8px_0px_0px_var(--color-text)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all group block cursor-pointer"
                >
                    <div className="flex items-center gap-4 mb-4 text-text group-hover:text-accent transition-colors">
                        <Mail size={40} strokeWidth={2.5} />
                        <h2 className="text-2xl font-black uppercase">Email</h2>
                    </div>
                    <p className="font-bold text-lg uppercase tracking-wide text-text-secondary">
                        {DatosContacto.email === "#"
                            ? "[ Email Próximamente ]"
                            : DatosContacto.email}
                    </p>
                    <div className="mt-6 inline-block bg-text text-background font-black uppercase px-4 py-2 text-sm group-hover:bg-accent transition-colors">
                        Enviar Correo
                    </div>
                </a>
            </div>
        </div>
    );
}
