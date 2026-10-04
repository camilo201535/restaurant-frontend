# React + Vite

Integrantes
Juan Camilo Talaga Cruz 
Tecnologías
React 19 + Vite
react-router-dom ()
Axios ()
Bootstrap 5 

Node.js 18 o superior
El backend  corriendo en http://localhost:3000 (Base de datos PostgreSQL)

Instrucciones de ejecución
Levantar el backend :
bash
   npm install
   npm start

La API debe quedar disponible en http://localhost:3000/api.

Clonar e iniciar el frontend:
bash
   git clone <https://github.com/camilo201535/restaurant-frontend>
   cd <C:\Users\Juan Camilo Cruz\Documents\Programacion_IV\restaurantProject>
   npm install
   npm start

la URL que muestra la terminal ( http://localhost:5173).

Otros comandos

npm run build	Genera la versión de producción
npm run preview	Sirve localmente el build generado
npm run lint	Revisa el código con ESLint

Módulos y rutas

Módulo	Ruta	Endpoints consumidos
Productos	/products	GET/POST /api/products, PUT/DELETE /api/products/:id
Usuarios	/users	GET/POST /api/users, PUT/DELETE /api/users/:id
Proveedores	/providers	GET/POST /api/providers, PUT/DELETE /api/providers/:id
Ventas	/sales	GET/POST /api/sales, PUT/DELETE /api/sales/:id

Cada módulo permite visualizar los registros en una tabla, crear , editar  y eliminar registros.

Arquitectura

El proyecto separa la interfaz de la lógica de acceso a datos:

src/
├── components/
│   └── layout/
│       └── MainLayout.jsx     #  Navbar y diseño  con Bootstrap
├── pages/
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProvidersPage.jsx
│   ├── UsersPage.jsx
│   └── SalesPage.jsx         
├── services/
│   ├── api.js                 # Configuración de Axios
│   ├── product.service.js
│   ├── provider.service.js
│   ├── user.service.js
│   └── sale.service.js        
├── styles/
│   └── global.css
├── App.jsx                    # Configuración de Rutas (react-router-dom)
└── main.jsx                   # Importación de Bootstrap y renderizado


Flujo de datos: página → servicio → API REST → servicio → página .