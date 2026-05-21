# Estructura del Frontend

```
FrontedcompiladoresRefact/
├── public/
│   └── favicon.svg                    # Icono de la aplicación
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Header.jsx             # Cabecera con estado de conexión
│   │   └── dashboard/
│   │       ├── SqlEditor.jsx          # Editor SQL + selector de dialecto
│   │       ├── ConnectionPanel.jsx    # Formulario de conexión a BD
│   │       └── ResultTabs.jsx         # Visor de resultados (4 tabs)
│   ├── data/
│   │   └── mockData.js                # Datos mock (dialectos, SQL default)
│   ├── services/
│   │   └── api.js                     # Capa de servicios HTTP para backend
│   ├── App.jsx                        # Componente raíz (orquestador)
│   ├── main.jsx                       # Entry point React
│   └── index.css                      # Estilos globales + Tailwind + tema
├── docs/
│   ├── CONEXION_FRONTEND_BACKEND.md   # Documentación de integración
│   └── ESTRUCTURA_FRONTEND.md         # Este archivo
├── .env                               # VITE_API_URL
├── index.html                         # HTML principal
├── package.json                       # Dependencias npm
├── vite.config.js                     # Configuración Vite + proxy
├── eslint.config.js                   # Configuración ESLint
└── README.md                          # Documentación del proyecto
```

## Flujo de Datos

```
                    ┌──────────────────────────┐
                    │         App.jsx          │
                    │  - response (estado)     │
                    │  - loading (estado)      │
                    │  - connectionConfig      │
                    │  - connectionStatus      │
                    └───────┬───────┬──────────┘
                            │       │
            ┌───────────────┘       └───────────────────┐
            ▼                                           ▼
    ┌───────────────┐                           ┌─────────────────┐
    │  SqlEditor    │                           │ ConnectionPanel │
    │  - sql        │                           │ - host, port    │
    │  - dialect    │                           │ - database      │
    │               │                           │ - username, pwd │
    │ onAnalyze(sql,│                           │                 │
    │  dialect) ────┤                           │onConnectionChange│
    └───────────────┘                           │(config) ────────┤
                                                └─────────────────┘
            │                                           │
            └───────────────────┬───────────────────────┘
                                ▼
                    ┌───────────────────────┐
                    │     ResultTabs        │
                    │  - response           │
                    │  - loading            │
                    └───────────────────────┘
```

## Dependencias

| Paquete | Versión | Uso |
|---|---|---|
| `react` | ^19.2.6 | UI Library |
| `react-dom` | ^19.2.6 | Render DOM |
| `framer-motion` | ^12.39.0 | Animaciones |
| `lucide-react` | ^1.16.0 | Iconos |
| `tailwindcss` | ^4.3.0 | Estilos utilitarios |
| `vite` | ^8.0.12 | Bundler y dev server |
