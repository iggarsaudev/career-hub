# 🚀 Portfolio Full Stack - Career Hub

Este repositorio contiene el código fuente de mi portafolio profesional personal. No es solo una página estática, sino una aplicación **Full Stack** completa con un panel de administración (CMS) personalizado para gestionar proyectos, experiencia y habilidades en tiempo real.

🔗 **Demo en vivo:** [https://iggarsaudev-career-hub.vercel.app/](https://iggarsaudev-career-hub.vercel.app/)

## 🛠️ Tech Stack

El proyecto está construido utilizando una arquitectura moderna y escalable:

### Frontend
- **React.js** (Vite) - SPA reactiva y rápida.
- **Tailwind CSS** - Estilizado moderno y Responsive Design.
- **Context API** - Gestión de estado global (Idiomas, Temas).
- **React PDF** - Generación dinámica de documentos PDF en el cliente y servidor.

### Backend
- **Node.js & Express** - API RESTful robusta.
- **Prisma ORM** - Gestión de base de datos y tipado seguro.
- **PostgreSQL** (Neon Tech) - Base de datos relacional en la nube.
- **Multer & FS** - Gestión de archivos temporales para la generación del CV.

## ✨ Características Principales

1.  **Panel de Administración Privado (CMS):**
    - Autenticación segura.
    - CRUD completo de Proyectos, Experiencia, Educación y Skills.
    - Los cambios se reflejan instantáneamente en la web pública.

2.  **Generación de CV Dinámico:**
    - **Feature Estrella:** El sistema genera automáticamente un PDF descargable basado en los datos actuales de la base de datos.
    - Incluye un **Código QR dinámico** en el PDF que enlaza de vuelta al portfolio web.
    - Sistema de publicación: Permite previsualizar el CV antes de hacerlo público para los reclutadores.

3.  **Soporte Multi-idioma (i18n):**
    - Cambio instantáneo entre Español e Inglés.
    - Base de datos preparada para contenido bilingüe.

4.  **Diseño UI/UX:**
    - Modo Oscuro/Claro automático y manual.
    - Diseño totalmente responsivo (Mobile-first).
    - Notificaciones Toast personalizadas para feedback de usuario.

## 📦 Instalación Local

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/iggarsaudev/career-hub.git](https://github.com/iggarsaudev/career-hub.git)
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
