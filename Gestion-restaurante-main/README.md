# 🍽️ Gestión Restaurante

Aplicación web de 3 capas para la administración integral de un restaurante. Permite gestionar productos, inventario, mesas y pedidos desde una interfaz moderna y responsiva, con sistema de autenticación y control de acceso por roles.

## 👤 Integrantes y Roles

| Nombre                           | Rol                                                       |
| -------------------------------- | --------------------------------------------------------- |
| Manuel Alejandro Alvarez Meneses | Full-Stack Developer (Frontend + Backend + Base de Datos) |
| Juan Felipe Londoño Marin        | DB-Developer                                              |
| Santiago Aristizabal Muñoz       | Frontend Developer                                        |

## 🛠️ Tecnologías

| Capa          | Tecnología                  |
| ------------- | --------------------------- |
| Frontend      | React + Vite + Tailwind CSS |
| Backend       | Node.js + Express           |
| Base de Datos | MongoDB + Mongoose          |
| Autenticación | JWT + bcryptjs              |

## 📁 Estructura del repositorio

```
/
├── frontend/     # React (Vite)
├── backend/      # Node.js / Express
└── database/     # Seed de datos iniciales
```

## 👥 Roles y permisos

| Rol          | Acceso                                                            |
| ------------ | ----------------------------------------------------------------- |
| **Admin**    | Todo: dashboard, productos, inventario, mesas, pedidos y usuarios |
| **Mesero**   | Mesas y pedidos                                                   |
| **Cocinero** | Solo vista de pedidos (puede actualizar estado)                   |

## ⚙️ Pasos para correr el proyecto localmente

### Requisitos previos

- Node.js v18 o superior
- MongoDB Atlas (URI de conexión) o MongoDB local

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/m-alejandro58/Gestion-restaurante.git
cd Gestion-restaurante
```

---

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear el archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Editar `.env` con los valores reales:

```
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/restaurante
JWT_SECRET=cambia_este_secreto_en_produccion
```

Iniciar el servidor:

```bash
npm run dev
```

El backend queda disponible en `http://localhost:5000`

---

### 3. Cargar los datos de prueba (Seeds)

```bash
# Productos, mesas y pedidos de ejemplo
node seeds/seed.js

# Usuarios del sistema (admin, mesero, cocinero)
npm run seedUsers
```

> ⚠️ Solo es necesario ejecutar los seeds **una vez**. Los datos quedan guardados permanentemente en MongoDB Atlas.

**Usuarios creados por defecto:**

| Email                  | Contraseña | Rol      |
| ---------------------- | ---------- | -------- |
| admin@restaurante.com  | admin123   | Admin    |
| mesero@restaurante.com | mesero123  | Mesero   |
| cocina@restaurante.com | cocina123  | Cocinero |

---

### 4. Configurar el Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`

---

### 5. Uso diario (después de la configuración inicial)

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 🔗 Endpoints de la API

### Autenticación

| Método | Ruta                | Descripción             | Acceso      |
| ------ | ------------------- | ----------------------- | ----------- |
| POST   | /api/auth/login     | Iniciar sesión          | Público     |
| GET    | /api/auth/me        | Verificar sesión activa | Autenticado |
| POST   | /api/auth/register  | Crear nuevo usuario     | Admin       |
| GET    | /api/auth/users     | Listar usuarios         | Admin       |
| DELETE | /api/auth/users/:id | Desactivar usuario      | Admin       |

### Productos

| Método | Ruta              | Descripción                                      | Acceso |
| ------ | ----------------- | ------------------------------------------------ | ------ |
| GET    | /api/products     | Listar productos (filtros: `category`, `search`) | Admin  |
| GET    | /api/products/:id | Obtener producto por ID                          | Admin  |
| POST   | /api/products     | Crear producto                                   | Admin  |
| PUT    | /api/products/:id | Actualizar producto                              | Admin  |
| DELETE | /api/products/:id | Eliminar producto                                | Admin  |

### Mesas

| Método | Ruta            | Descripción                     | Acceso        |
| ------ | --------------- | ------------------------------- | ------------- |
| GET    | /api/tables     | Listar mesas (filtro: `status`) | Admin, Mesero |
| GET    | /api/tables/:id | Obtener mesa por ID             | Admin, Mesero |
| POST   | /api/tables     | Crear mesa                      | Admin, Mesero |
| PUT    | /api/tables/:id | Actualizar mesa                 | Admin, Mesero |
| DELETE | /api/tables/:id | Eliminar mesa                   | Admin, Mesero |

### Pedidos

| Método | Ruta            | Descripción                       | Acceso                  |
| ------ | --------------- | --------------------------------- | ----------------------- |
| GET    | /api/orders     | Listar pedidos (filtro: `status`) | Admin, Mesero, Cocinero |
| GET    | /api/orders/:id | Obtener pedido por ID             | Admin, Mesero, Cocinero |
| POST   | /api/orders     | Crear pedido                      | Admin, Mesero           |
| PUT    | /api/orders/:id | Actualizar pedido                 | Admin, Mesero, Cocinero |
| DELETE | /api/orders/:id | Eliminar pedido                   | Admin                   |
