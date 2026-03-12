export default function AvisoLegal() {
    return (
        <main className="py-12 px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-800">
                <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">
                    Aviso Legal
                </h1>

                <div className="space-y-6 text-slate-300 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Datos Identificativos</h2>
                        <p>
                            En cumplimiento con el deber de información, se reflejan a continuación los siguientes datos: 
                            El sitio web de venta de indumentaria "Schmidt Styles" es operado desde Argentina. 
                            Para cualquier consulta, puede contactarnos a través de nuestros canales oficiales de atención al cliente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Usuarios</h2>
                        <p>
                            El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, desde dicho acceso y/o uso, 
                            las Condiciones Generales de Uso aquí reflejadas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Propiedad Intelectual e Industrial</h2>
                        <p>
                            "Schmidt Styles" por sí o como cesionaria, es titular de todos los derechos de propiedad intelectual e industrial 
                            de su página web, así como de los elementos contenidos en la misma (a título enunciativo: imágenes, sonido, 
                            audio, vídeo, software o textos; marcas o logotipos, combinaciones de colores, estructura y diseño).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Defensa del Consumidor</h2>
                        <p>
                            De acuerdo a la Ley de Defensa del Consumidor (Ley 24.240) de la República Argentina, el consumidor tiene derecho a 
                            revocar la aceptación de la compra dentro de los diez (10) días computados a partir de la celebración del contrato o 
                            de la entrega del producto, lo último que ocurra, sin responsabilidad alguna.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Legislación Aplicable y Jurisdicción</h2>
                        <p>
                            La relación entre "Schmidt Styles" y el USUARIO se regirá por la normativa argentina vigente. Cualquier controversia 
                            se someterá a los Juzgados y Tribunales competentes, renunciando expresamente 
                            las partes a cualquier otro fuero o jurisdicción que pudiera corresponderles.
                        </p>
                    </section>

                    <div className="pt-8 mt-8 border-t border-slate-800 text-sm text-slate-500">
                        Última actualización: {new Date().toLocaleDateString('es-AR')}
                    </div>
                </div>
            </div>
        </main>
    );
}