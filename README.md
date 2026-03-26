# Schmidt Styles - Tienda Web 🛒

Un sistema completo de e-commerce dividido en dos partes: un **Frontend** moderno y responsivo para los clientes, y un **Backend** robusto para la gestión interna del catálogo.

El proyecto destaca por su **diseño Neo-Brutalista** (dark mode, bordes gruesos, sombras duras de alto contraste) en la vista del cliente, y un panel de administración rápido y eficiente en el servidor.

---

## 🏗️ Estructura del Proyecto

El repositorio está dividido en dos aplicaciones principales que trabajan en conjunto:

### 🎨 Frontend (Interfaz de Cliente)

Es la cara visible de la tienda. Se encarga de la experiencia de usuario, la visualización del catálogo interactivo, la gestión del carrito de compras y la navegación fluida.

- **Framework:** [React 18](https://react.dev/) con [Vite](https://vitejs.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Enrutamiento:** [React Router DOM](https://reactrouter.com/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Estado:** Context API (para el manejo global del carrito)

### ⚙️ Backend (API y Panel de Administración)

Es el motor de la tienda. Provee una API RESTful para alimentar el catálogo del frontend y cuenta con un panel de administración interno (Admin UI) para gestionar productos, categorías, talles, colores y stock.

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **ORM:** [SQLAlchemy](https://www.sqlalchemy.org/)
- **Panel Admin:** [SQLAdmin](https://aminalaee.dev/sqladmin/)
- **Base de Datos:** PostgreSQL alojada de forma remota en [Supabase](https://supabase.com/)

---

## ✨ Características Principales

- **Catálogo Dinámico:** Visualización de productos conectados a la base de datos, con búsqueda en tiempo real y filtrado por categorías.
- **Diseño Neo-Brutalista:** UI/UX consistente con alto contraste, tipografía en mayúsculas y elementos interactivos llamativos.
- **Carrito de Compras:** Gestión de estado global para agregar, visualizar y administrar productos antes de coordinar la compra.
- **Panel de Control Interno:** Interfaz administrativa (generada con SQLAdmin) para crear y editar el inventario, subir imágenes y manejar variantes sin tocar código.
- **Secciones Informativas:** Vistas detalladas para "Cómo Comprar", "Preguntas Frecuentes", "Aviso Legal" y "Contacto" (con enlaces a redes sociales).
- **Buscador Integrado:** Barra de búsqueda responsiva (Desktop y Móvil) para localizar prendas rápidamente.

---

## 🛠️ Instalación y Configuración Local

Sigue estos pasos para correr el proyecto en tu entorno local. Necesitarás tener instalados **Node.js** y **Python**.

1. **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/MasitasIA/schmidt-styles-tienda-web.git](https://github.com/MasitasIA/schmidt-styles-tienda-web.git)
    cd schmidt-styles-tienda-web
    ```

---

_Desarrollado por MasitasIA._
