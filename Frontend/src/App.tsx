import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Squares from './Squares';

// Importamos tus componentes fijos
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pestañas
import Home from './views/Home';
import AvisoLegal from './views/AvisoLegal';
import PoliticaPrivacidad from './views/PoliticaPrivacidad';

export default function App() {
    return (
        <BrowserRouter>
            <div className="relative flex flex-col min-h-screen text-white">
                
                {/* FONDO ANIMADO GLOBAL */}
                <div className="fixed inset-0 z-[-1]">
                    <Squares 
                        speed={0.5} 
                        squareSize={40}
                        direction='diagonal'
                        borderColor='#334155' 
                        hoverFillColor='#4f46e5' 
                    />
                </div>
                <div className="fixed inset-0 z-[-1] bg-slate-950/80 pointer-events-none"></div>

                {/* CONTENIDO DE LA WEB */}
                <Navbar />

                <main className="grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/aviso-legal" element={<AvisoLegal />} />
                        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}