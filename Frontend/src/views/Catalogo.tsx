// Importaciones necesarias
import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; 
import { Link, useSearchParams } from 'react-router-dom';

// Interfaces para tipar los datos que vienen de Supabase
interface ImagenProducto {
  id: number;
  imagen: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categorias: Categoria; 
  activo: boolean;
  imagenes: ImagenProducto[];
}

// Componente principal del catálogo
export default function Catalogo() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); 

  useEffect(() => {
    const fetchProductos = async () => {
      setCargando(true);
      setError(null);
      
      try {
        let supabaseQuery = supabase
          .from('productos')
          .select(`
            *,
            imagenes:imagenes_producto(id, imagen),
            categorias (id, nombre)
          `)
          .eq('activo', true);

        if (query) {
            supabaseQuery = supabaseQuery.or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`);
        }

        const { data, error } = await supabaseQuery;

        if (error) throw error;
        
        setProductos(data as Producto[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el catálogo');
      } finally {
        setCargando(false);
      }
    };

    fetchProductos();
  }, [query]); 

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-background">
        <div className="border-4 border-text p-6 bg-background shadow-[8px_8px_0px_0px_var(--color-text)] animate-pulse">
          <span className="text-xl font-black uppercase tracking-widest text-text">
            [ Localizando {query ? 'Resultados' : 'Stock'} ]
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-background px-4">
        <div className="border-4 border-accent p-8 bg-background max-w-2xl text-center shadow-[12px_12px_0px_0px_var(--color-accent)]">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-text mb-4">Error del sistema</h2>
          <p className="text-text-secondary font-bold uppercase tracking-wide">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text selection:bg-accent selection:text-text py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 border-b-4 border-text pb-6">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2">
            {query ? 'Resultados' : 'Catálogo'}
          </h1>
          <p className="text-lg md:text-xl font-bold uppercase tracking-widest text-text-secondary">
            {query ? (
              <>Búsqueda: <span className="text-accent">"{query}"</span></>
            ) : (
              <>Nuestra colección <span className="bg-text text-background px-2 ml-1 shadow-[4px_4px_0px_0px_var(--color-accent)]">Premium</span></>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {productos.length === 0 ? (
            <div className="col-span-full border-4 border-dashed border-text p-16 text-center">
              <span className="text-2xl font-black uppercase tracking-widest text-text-secondary">
                {query ? 'No se encontraron coincidencias' : 'No hay stock disponible'}
              </span>
              {query && (
                <div className="mt-6">
                  <Link to="/catalogo" className="border-4 border-text px-6 py-3 font-black uppercase hover:bg-text hover:text-background transition-colors shadow-[4px_4px_0px_0px_var(--color-text)]">
                    Ver todo el catálogo
                  </Link>
                </div>
              )}
            </div>
          ) : (
            productos.map((producto) => (
              <Link 
                to={`/producto/${producto.id}`}
                key={producto.id} 
                className="group flex flex-col border-4 border-text bg-background hover:shadow-[12px_12px_0px_0px_var(--color-accent)] transition-all duration-300"
              >
                <div className="aspect-4/5 border-b-4 border-text bg-primary relative overflow-hidden">
                  {producto.imagenes && producto.imagenes.length > 0 ? (
                    <img
                      src={producto.imagenes[0].imagen}
                      alt={producto.nombre}
                      className="w-full h-full object-cover grayscale-30 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black uppercase text-text-secondary text-xl tracking-widest">
                      [ Sin Imagen ]
                    </div>
                  )}
                  
                  {/* 4. Usamos el nombre desde la tabla relacionada (si existe) */}
                  {producto.categorias && (
                    <div className="absolute top-4 left-4 bg-text text-background font-black uppercase tracking-widest px-3 py-1 text-xs shadow-[4px_4px_0px_0px_var(--color-accent)]">
                      {producto.categorias.nombre}
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-black uppercase tracking-tight text-text mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                    {producto.nombre}
                  </h3>
                  <p className="text-text-secondary font-bold text-sm mb-6 line-clamp-2 uppercase tracking-wide">
                    {producto.descripcion}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t-2 border-text pt-6">
                    <span className="text-2xl font-black text-text tracking-tighter">
                      ${producto.precio.toLocaleString('es-AR')}
                    </span>
                    
                    <button 
                      className="bg-background border-2 border-text text-text p-2 group-hover:bg-text group-hover:text-background transition-colors shadow-[4px_4px_0px_0px_var(--color-text)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 pointer-events-none" 
                      title="Ver detalles"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                        <path d="M5 12h14"/>
                        <path d="m12 5 7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}