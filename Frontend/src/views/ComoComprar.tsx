import {
    ShoppingCart,
    MessageCircle,
    CreditCard,
    CheckCircle,
    Instagram,
} from "lucide-react";

import { Contacto } from "../utils/Constants";

export default function ComoComprar() {
    const pasos = [
        {
            icon: <ShoppingCart size={32} />,
            titulo: "1. Elige tu producto",
            desc: "Navega por nuestro catálogo y selecciona las prendas que más te gusten.",
        },
        {
            icon: <MessageCircle size={32} />,
            titulo: "2. Contáctanos",
            desc: "Escríbenos para consultar stock y talles disponibles a través de nuestras redes.",
        },
        {
            icon: <CreditCard size={32} />,
            titulo: "3. Elige el pago",
            desc: "Aceptamos Transferencia bancaria, Efectivo o Mercado Pago.",
        },
        {
            icon: <CheckCircle size={32} />,
            titulo: "4. ¡Listo!",
            desc: "Coordinamos el envío o retiro y ya tenés tu prenda Schmidt Styles.",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-16 selection:bg-accent selection:text-text">
            <h1 className="text-4xl md:text-6xl font-black uppercase mb-12 border-b-8 border-text pb-4 inline-block">
                Cómo Comprar
            </h1>

            {/* Primer div: Pasos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {pasos.map((paso, index) => (
                    <div
                        key={index}
                        className="border-4 border-text p-6 bg-background shadow-[8px_8px_0px_0px_var(--color-accent)]"
                    >
                        <div className="mb-4 text-accent">{paso.icon}</div>
                        <h3 className="text-xl font-black uppercase mb-3">
                            {paso.titulo}
                        </h3>
                        <p className="text-sm font-bold text-text-secondary leading-relaxed">
                            {paso.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* Segundo div: Proceso de compra con enlaces */}
            <div className="bg-text text-background p-8 border-4 border-text shadow-[8px_8px_0px_0px_var(--color-accent)]">
                <h2 className="text-2xl font-black uppercase mb-6 underline decoration-accent decoration-4 underline-offset-8">
                    Proceso de compra:
                </h2>
                <p className="font-bold text-lg mb-8 max-w-2xl">
                    Por el momento coordinamos la compra a través de medios
                    virtuales. Haz clic en el medio que prefieras para iniciar
                    tu pedido:
                </p>

                <div className="flex flex-wrap gap-6">
                    <a
                        href={Contacto.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-background text-text px-6 py-3 border-2 border-background hover:bg-accent transition-all font-black uppercase tracking-widest"
                    >
                        <Instagram size={24} />
                        Instagram
                    </a>
                    <a
                        href={`https://wa.me/${Contacto.telefono}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-background text-text px-6 py-3 border-2 border-background hover:bg-accent transition-all font-black uppercase tracking-widest"
                    >
                        <MessageCircle size={24} />
                        WhatsApp
                    </a>
                </div>

                <div className="mt-10 pt-6 border-t-2 border-background/20">
                    <h3 className="text-sm font-black uppercase mb-4 opacity-80">
                        Métodos de pago aceptados:
                    </h3>
                    <div className="flex gap-4 font-bold text-sm uppercase">
                        <span>• Transferencia</span>
                        <span>• Efectivo</span>
                        <span>• Mercado Pago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
