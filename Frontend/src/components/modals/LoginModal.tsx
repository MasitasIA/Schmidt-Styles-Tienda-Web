import { X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void; // Esta función simulará el login por ahora
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      {/* Contenedor del Modal */}
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Botón para cerrar */}
        <button 
          type="button"
          onClick={onClose} 
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8 mt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido</h2>
          <p className="text-sm text-gray-500">
            Inicia sesión para gestionar tus compras y guardar tus favoritos.
          </p>
        </div>

        {/* Botón de Google */}
        <button
          type="button"
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 hover:shadow-sm transition-all"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Logo de Google" 
            className="w-5 h-5" 
          />
          Continuar con Google
        </button>
      </div>
    </div>
  );
}