# 🍽️ Gestión Restaurante

Aplicación web de 3 capas para la administración integral de un restaurante. Permite gestionar productos, inventario, mesas y pedidos desde una interfaz moderna y responsiva.

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

## 📁 Estructura del repositorio

```
/
├── frontend/     # React (Vite)
├── backend/      # Node.js / Express
└── database/     # Seed de datos iniciales
```

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
```

Iniciar el servidor:

```bash
npm run dev
```

El backend queda disponible en `http://localhost:5000`

---

### 3. Cargar los datos de prueba (Seed)

```bash
cd database
node seed.js
```

Esto carga automáticamente productos, mesas y pedidos de prueba en la base de datos.

---

### 4. Configurar el Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`

---

## 🔗 Endpoints de la API

| Método | Ruta              | Descripción                                      |
| ------ | ----------------- | ------------------------------------------------ |
| GET    | /api/products     | Listar productos (filtros: `category`, `search`) |
| GET    | /api/products/:id | Obtener producto por ID                          |
| POST   | /api/products     | Crear producto                                   |
| PUT    | /api/products/:id | Actualizar producto                              |
| DELETE | /api/products/:id | Eliminar producto                                |
| GET    | /api/tables       | Listar mesas (filtro: `status`, `location`)      |
| GET    | /api/tables/:id   | Obtener mesa por ID                              |
| POST   | /api/tables       | Crear mesa                                       |
| PUT    | /api/tables/:id   | Actualizar mesa                                  |
| DELETE | /api/tables/:id   | Eliminar mesa                                    |
| GET    | /api/orders       | Listar pedidos (filtro: `status`)                |
| GET    | /api/orders/:id   | Obtener pedido por ID                            |
| POST   | /api/orders       | Crear pedido                                     |
| PUT    | /api/orders/:id   | Actualizar pedido                                |
| DELETE | /api/orders/:id   | Eliminar pedido                                  |
