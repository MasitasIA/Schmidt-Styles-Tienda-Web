import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-zinc-400 py-6 mt-12">
            <div className="max-w-7xl mx-auto px-6 text-center text-sm">
                &copy; {new Date().getFullYear()} Todos los derechos reservados <span className="font-bold">Schmidt Styles</span>. Desarrollado por <span className="font-bold">MasitasIA</span> |{' '}
                <Link to="/aviso-legal" className="underline hover:text-zinc-200 transition-colors">
                    Aviso Legal
                </Link>{' '}
                |{' '}
                <Link to="/politica-privacidad" className="underline hover:text-zinc-200 transition-colors">
                    Política de Privacidad
                </Link>
            </div>
        </footer>
    );
}