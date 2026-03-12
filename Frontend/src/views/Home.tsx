import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
    return (
        <div className="w-full">
            {/* HERO SECTION */}
            <section className="relative px-4 py-24 md:py-32 flex flex-col items-center justify-center text-center">
                {/* Etiqueta superior */}
                <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
                    <Zap size={16} className="text-indigo-400" />
                    <span>Nueva Colección de Temporada</span>
                </div>

                {/* Título principal */}
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-md max-w-4xl">
                    Redefine tu <span className="text-indigo-500">Estilo</span> Urbano
                </h1>

                {/* Subtítulo */}
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10 drop-shadow">
                    Descubre indumentaria diseñada para destacar. Calidad premium, cortes modernos y envíos a todo el país.
                </p>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                        to="/catalogo" 
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-500/20"
                    >
                        Ver Catálogo <ArrowRight size={20} />
                    </Link>
                    <Link 
                        to="/como-comprar" 
                        className="flex items-center justify-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-700 transition-all border border-slate-700"
                    >
                        ¿Cómo comprar?
                    </Link>
                </div>
            </section>

            {/* SECCIÓN DE BENEFICIOS (Opcional, queda muy bien debajo del Hero) */}
            <section className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Beneficio 1 */}
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="bg-indigo-500/20 p-4 rounded-full mb-4">
                            <Truck size={32} className="text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Envíos a todo el país</h3>
                        <p className="text-slate-400 text-sm">Despachamos tu pedido en el día para que lo recibas cuanto antes.</p>
                    </div>

                    {/* Beneficio 2 */}
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="bg-indigo-500/20 p-4 rounded-full mb-4">
                            <ShieldCheck size={32} className="text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Compra Segura</h3>
                        <p className="text-slate-400 text-sm">Tus datos están protegidos. Aceptamos todos los medios de pago.</p>
                    </div>

                    {/* Beneficio 3 */}
                    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="bg-indigo-500/20 p-4 rounded-full mb-4">
                            <Zap size={32} className="text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Calidad Premium</h3>
                        <p className="text-slate-400 text-sm">Seleccionamos los mejores materiales para garantizar durabilidad.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}