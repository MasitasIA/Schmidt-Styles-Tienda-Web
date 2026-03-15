export default function PoliticaPrivacidad() {
    return (
        <main className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-legal backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-2xl border-4 border-accent">
                <h1 className="text-3xl font-extrabold text-legal-text mb-8 tracking-tight">
                    Política de Privacidad
                </h1>

                <div className="space-y-6 text-legal-text leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-legal-text mb-3">1. Información que recopilamos</h2>
                        <p>
                            En "Schmidt Styles" recopilamos información personal de nuestros usuarios exclusivamente a través del sistema de autenticación de Google (Google Login). 
                            Al iniciar sesión, obtenemos acceso a tu nombre, dirección de correo electrónico y foto de perfil pública asociada a tu cuenta de Google. 
                            También recopilamos la información de envío que proporciones voluntariamente al realizar una compra. No almacenamos contraseñas en nuestros servidores.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-legal-text mb-3">2. Uso de la información</h2>
                        <p>
                            La información recopilada se utiliza exclusivamente para los siguientes fines:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Procesar, preparar y enviar tus pedidos.</li>
                            <li>Enviarte actualizaciones sobre el estado de tu compra.</li>
                            <li>Mejorar tu experiencia de usuario en nuestro sitio web.</li>
                            <li>Comunicarnos contigo en caso de dudas sobre tu pedido o responder a tus consultas.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-legal-text mb-3">3. Protección de tus datos</h2>
                        <p>
                            De conformidad con lo dispuesto por la Ley N° 25.326 de Protección de Datos Personales de la República Argentina, 
                            "Schmidt Styles" se compromete a tratar tus datos personales con el grado de protección adecuado, 
                            tomando las medidas de seguridad necesarias para evitar su alteración, pérdida, tratamiento o acceso no autorizado.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-legal-text mb-3">4. Compartir información con terceros</h2>
                        <p>
                            No vendemos, comercializamos ni alquilamos la información personal de nuestros usuarios a terceros. 
                            Solo compartiremos la información estrictamente necesaria con empresas de logística y correo para poder efectuar 
                            la entrega de los productos adquiridos, o con plataformas de procesamiento de pagos seguras.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-legal-text mb-3">5. Derechos del Usuario</h2>
                        <p>
                            El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita 
                            a intervalos no inferiores a seis meses. Asimismo, tienes derecho a solicitar la rectificación, actualización o 
                            supresión de tus datos personales enviándonos una solicitud a través de nuestros canales de contacto.
                        </p>
                    </section>

                    <div className="pt-8 mt-8 border-t bg-legal text-sm text-legal-text text-center">
                        Última actualización: {new Date().toLocaleDateString('es-AR')}
                    </div>
                </div>
            </div>
        </main>
    );
}