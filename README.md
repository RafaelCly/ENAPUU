# Sistema de Gestión de Tickets ENAPU

Sistema completo de gestión portuaria con frontend en React + Vite + Tailwind CSS y datos simulados (mock data).

## 🚀 Tecnologías

- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes UI
- **React Router** - Navegación
- **Lucide React** - Iconos

## 📋 Características

### Por Rol de Usuario

**👤 Cliente:**
- Dashboard con resumen de tickets
- Generación de nuevos tickets con QR
- Consulta de tickets activos
- Historial de operaciones
- Gestión de flota de vehículos
- Notificaciones en tiempo real
- Perfil de usuario

**🔧 Operario:**
- Panel de operaciones completo
- Validación de tickets con QR
- Registro de ingresos y salidas
- Monitor de turnos en tiempo real
- Consulta rápida de contenedores

**⚙️ Administrador:**
- Dashboard con estadísticas generales
- Vista de usuarios (solo lectura)
- Configuración del sistema (solo lectura)
- Reportes y analítica
- Monitor de logs del sistema

## 🛠️ Instalación y Uso

### Requisitos Previos
- Node.js 18+ y npm

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

El proyecto se abrirá en `http://localhost:8080`

4. **Build para producción:**
```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## 🎯 Uso del Sistema

### Login Simulado
Al iniciar, selecciona uno de los tres roles:
- **Cliente** → Gestiona tickets y flota
- **Operario** → Valida y procesa operaciones
- **Administrador** → Vista general del sistema

### Datos de Prueba
El sistema incluye datos mock en `/src/data/mocks.js`:
- 10 tickets de ejemplo
- 7 turnos
- 6 contenedores
- 10 slots portuarios
- 7 vehículos de flota
- 5 usuarios
- Notificaciones y logs del sistema

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes shadcn/ui
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── CardStat.tsx
│   ├── DataTable.tsx
│   └── QRCard.tsx
├── pages/              # Páginas por rol
│   ├── auth/           # Login
│   ├── client/         # Vistas de cliente
│   ├── operator/       # Vistas de operario
│   └── admin/          # Vistas de administrador
├── data/
│   └── mocks.js        # Datos simulados
├── lib/
│   └── utils.ts
├── App.tsx
├── index.css           # Estilos y design system
└── main.tsx
```

## 🎨 Design System

El proyecto utiliza un sistema de diseño institucional basado en:
- **Color primario:** Navy Blue (#003366)
- **Acentos:** Celeste/Sky Blue
- **Tokens semánticos** en HSL
- **Componentes con variantes**
- **Responsive** para desktop, tablet y mobile

## ⚠️ Notas Importantes

1. **Sin Backend Real:** Todos los datos están en memoria (localStorage para sesión)
2. **Solo Lectura para Admin/Operario:** Los puertos/slots solo pueden visualizarse, no editarse
3. **Mock Data:** Las operaciones simulan cambios pero no persisten
4. **Simulación de Tiempo Real:** El monitor de turnos actualiza estados cada 8 segundos

## 📝 Desarrollado con Lovable

Este proyecto fue generado completamente con **Lovable**, plataforma de desarrollo con IA.

---

**© 2024 ENAPU - Sistema de Gestión de Tickets Portuarios**
