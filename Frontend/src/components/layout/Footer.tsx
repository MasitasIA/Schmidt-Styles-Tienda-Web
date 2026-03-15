import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full bg-background border-t-4 border-text pt-12 pb-8 mt-20 selection:bg-accent selection:text-text">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                
                {/* Copyright y Marca */}
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-text">
                    &copy; {new Date().getFullYear()}{' '}
                    {/* Efecto etiqueta invertida para la marca */}
                    <span className="bg-text text-background px-3 py-1 ml-1 shadow-[2px_2px_0px_0px_var(--color-accent)]">
                        Schmidt Styles
                    </span>
                    <span className="block mt-4 md:inline md:mt-0 md:ml-3 text-text-secondary">
                        Todos los derechos reservados.
                    </span>
                </div>

                {/* Enlaces Legales (Estilo botón crudo) */}
                <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-black uppercase tracking-widest">
                    <Link 
                        to="/aviso-legal" 
                        className="text-text hover:text-background hover:bg-text px-4 py-2 border-2 border-transparent hover:border-text transition-all"
                    >
                        Aviso Legal
                    </Link>
                    <Link 
                        to="/politica-privacidad" 
                        className="text-text hover:text-background hover:bg-text px-4 py-2 border-2 border-transparent hover:border-text transition-all"
                    >
                        Privacidad
                    </Link>
                </div>

                {/* Créditos del Desarrollador */}
                <div className="text-xs font-black uppercase tracking-widest text-text-secondary">
                    Dev by{' '}
                    <a 
                        href="https://github.com/MasitasIA" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-text border-b-4 border-text hover:text-accent hover:border-accent transition-colors pb-1"
                    >
                        MasitasIA
                    </a>
                </div>

            </div>
        </footer>
    );
}