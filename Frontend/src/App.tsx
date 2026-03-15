import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos tus componentes fijos
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pestañas
import Home from './views/Home';
import AvisoLegal from './views/AvisoLegal';
import PoliticaPrivacidad from './views/PoliticaPrivacidad';
import Catalogo from './views/Catalogo';
import ProductoDetalle from './views/ProductoDetalle';

export default function App() {
    return (
        <BrowserRouter>
            <div className="relative flex flex-col min-h-screen text-white bg-black">
                {/* CONTENIDO DE LA WEB */}
                <ScrollToTop />

                <Navbar />

                <main className="grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/aviso-legal" element={<AvisoLegal />} />
                        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                        <Route path="/catalogo" element={<Catalogo />} />
                        <Route path="/producto/:id" element={<ProductoDetalle />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}