
# AppScrum

> Plataforma de gestión de proyectos basada en Scrum, diseñada para equipos de desarrollo, Product Owners, Scrum Masters y administradores.

## Tabla de Contenidos
- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Uso](#uso)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Descripción
AppScrum es una aplicación web que facilita la gestión de proyectos ágiles utilizando la metodología Scrum. Permite la colaboración entre diferentes roles, gestión de usuarios, tableros personalizados y control de tareas.

## Características
- Autenticación y gestión de usuarios por roles (Desarrollador, Product Owner, Scrum Master, Super Admin, Usuario)
- Dashboards personalizados según el rol
- Gestión de colaboradores y perfiles
- Sidebar y layouts adaptativos
- Integración con backend Node.js para manejo de datos y autenticación

## Tecnologías
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Base de datos:** (especificar si aplica, ej. MongoDB, PostgreSQL)
- **Control de versiones:** Git

## Instalación

### Requisitos previos
- Node.js >= 18.x
- npm >= 9.x

### Clonar el repositorio
```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/AppScrum.git
cd AppScrum
```

### Instalación de dependencias
#### Frontend
```bash
cd AppScrum
npm install
```
#### Backend
```bash
cd backend
npm install
```

### Variables de entorno
Crea un archivo `.env` en el directorio `backend/` y configura las variables necesarias (ver ejemplo en `.env.example` si existe).

### Ejecución
#### Frontend
```bash
cd AppScrum
npm run dev
```
#### Backend
```bash
cd backend
npm start
```

## Estructura del Proyecto
```
AppScrum/
  ├── backend/           # Backend Node.js/Express
  ├── src/               # Código fuente del frontend React
  ├── public/            # Archivos estáticos
  ├── package.json       # Configuración general
  └── ...
```

## Uso
1. Inicia el backend y el frontend como se indica arriba.
2. Accede a la aplicación desde tu navegador en `http://localhost:5173` (o el puerto configurado).
3. Regístrate o inicia sesión según tu rol.
4. Explora los dashboards y funcionalidades según tu perfil.

## Contribución
¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerencias, mejoras o correcciones.

## Licencia
Este proyecto está bajo la licencia MIT.
