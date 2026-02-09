# 🚀 Portfolio Full Stack - Career Hub

Este repositorio contiene el código fuente de mi portafolio profesional personal. No es solo una página estática, sino una aplicación **Full Stack** completa con un panel de administración (CMS) personalizado para gestionar proyectos, experiencia y habilidades en tiempo real.

🔗 **Demo en vivo:** ([https://tu-url-de-render.onrender.com](https://iggarsaudev-career-hub.vercel.app/))

## 🛠️ Tech Stack

El proyecto está construido utilizando una arquitectura moderna y escalable:

### Frontend
- **React.js** (Vite) - SPA reactiva y rápida.
- **Tailwind CSS** - Estilizado moderno y Responsive Design.
- **Context API** - Gestión de estado global (Idiomas, Temas).
- **React Router** - Navegación declarativa.

### Backend
- **Node.js & Express** - API RESTful robusta.
- **Prisma ORM** - Gestión de base de datos y tipado seguro.
- **PostgreSQL** (Neon Tech) - Base de datos relacional en la nube.
- **JWT (JSON Web Tokens)** - Autenticación segura para el panel de administración.

### DevOps & Herramientas
- **Render** - Despliegue continuo (CI/CD).
- **Git & GitHub** - Control de versiones.

## ✨ Características Principales

1.  **Panel de Administración Privado:**
    - Autenticación segura.
    - CRUD completo de Proyectos, Experiencia, Educación y Skills.
    - Los cambios se reflejan instantáneamente en la web pública.
    
2.  **Soporte Multi-idioma (i18n):**
    - Cambio instantáneo entre Español e Inglés gestionado por Contexto.
    - Base de datos preparada para almacenar contenido en ambos idiomas.

3.  **Diseño UI/UX:**
    - Modo Oscuro/Claro automático y manual.
    - Diseño totalmente responsivo (Mobile-first).
    - Animaciones suaves y transiciones.

## 📦 Instalación y Despliegue Local

Si quieres clonar y ejecutar este proyecto localmente:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/career-hub.git](https://github.com/tu-usuario/career-hub.git)
    cd career-hub
    ```

2.  **Configurar Backend:**
    ```bash
    cd backend
    npm install
    # Crea un archivo .env basado en .env.example con tus credenciales de BD y JWT
    npx prisma generate
    npm run dev
    ```

3.  **Configurar Frontend:**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

---
*Este proyecto es parte de mi portfolio personal para demostrar habilidades en desarrollo Full Stack.*
