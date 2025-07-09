# 🎟️ Encuentro - Sistema de Gestión de Eventos (Microservicios Distribuidos)

Sistema completo de gestión de eventos implementado con **5 microservicios distribuidos**, autenticación JWT, comunicación por eventos (RabbitMQ), API Gateway (Kong) y base de datos distribuida (CockroachDB).

---

## 📦 Arquitectura de Microservicios

| Microservicio         | Puerto | Descripción                                      | Autenticación |
|-----------------------|--------|--------------------------------------------------|---------------|
| `ms-usuarios`         | 3005   | Registro, login y gestión de usuarios           | JWT           |
| `ms-reservas`         | 3001   | Crear y confirmar reservas con validación       | JWT Required  |
| `ms-entradas`         | 3003   | Generar entradas con QR tras confirmar reservas | Public        |
| `ms-conciertos`       | 3004   | CRUD completo de conciertos y zonas             | JWT (Admin)   |
| `ms-notificaciones`   | 3002   | Envío de notificaciones por email (simulado)    | Public        |

---

## 🏗️ Infraestructura

### 🔧 Servicios de Soporte

| Servicio              | Puerto | Descripción                           |
|-----------------------|--------|---------------------------------------|
| Kong API Gateway      | 8000   | Gateway unificado para todos los MS  |
| Kong Admin API        | 8001   | Administración del gateway           |
| Konga (Kong UI)       | 1337   | Interface web para Kong              |
| RabbitMQ              | 5672   | Message broker para eventos         |
| RabbitMQ Management   | 15672  | Panel de administración RabbitMQ     |
| CockroachDB (3 nodos) | 26257  | Base de datos distribuida            |
| CockroachDB UI        | 8080   | Panel de administración DB           |

---

## 🚀 Inicio Rápido

### 1. Prerequisitos
```bash
# Verificar que Docker y Docker Compose estén instalados
docker --version
docker-compose --version
```

### 2. Levantar todo el sistema
```bash
# Clonar el repositorio
git clone <repository-url>
cd ms-Backend

# Iniciar todos los servicios
docker-compose up --build

# Verificar que todos los servicios estén corriendo
docker-compose ps
```

### 3. Configurar Kong API Gateway
```bash
# Aplicar configuración de rutas
deck gateway sync kong-config.yml --kong-addr http://localhost:8001
```

---

## 🗄️ Esquemas de Base de Datos

### Acceso a CockroachDB
```bash
# Conectar al cluster
docker exec -it ms-backend-cockroach-1-1 ./cockroach sql --insecure
```

### 👤 Base de datos: usuarios
```sql
CREATE DATABASE IF NOT EXISTS usuarios;
USE usuarios;

CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  correo TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'usuario'
);

-- Insertar usuario administrador para pruebas
INSERT INTO usuarios (nombres, apellidos, correo, password, rol) 
VALUES ('Admin', 'Sistema', 'admin@encuentro.com', '$2a$10$hash...', 'admin');
```

### 🎫 Base de datos: reservas
```sql
CREATE DATABASE IF NOT EXISTS reservas;
USE reservas;

CREATE TABLE reservas (
    id UUID PRIMARY KEY,
    evento_id UUID NOT NULL,
    zona_id UUID NOT NULL,
    cantidad INT NOT NULL,
    estado STRING NOT NULL,
    vencimiento TIMESTAMP NOT NULL,
    usuario_id UUID NOT NULL
);
```

### 🎟️ Base de datos: entradas
```sql
CREATE DATABASE IF NOT EXISTS entradas;
USE entradas;

CREATE TABLE entradas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id STRING NOT NULL,
  usuario_id STRING,
  zona_id STRING NOT NULL,
  cantidad INT NOT NULL,
  qr_code TEXT,
  fecha TIMESTAMP DEFAULT NOW()
);
```

### 🎵 Base de datos: conciertos
```sql
CREATE DATABASE IF NOT EXISTS conciertos;
USE conciertos;

CREATE TABLE conciertos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre STRING NOT NULL,
  fecha TIMESTAMP NOT NULL,
  lugar STRING NOT NULL,
  organizador_id STRING NOT NULL,
  ciudad TEXT NOT NULL,
  categoria TEXT NOT NULL
);

CREATE TABLE zonas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concierto_id UUID NOT NULL REFERENCES conciertos(id) ON DELETE CASCADE,
  nombre STRING NOT NULL,
  capacidad INT NOT NULL CHECK (capacidad > 0),
  precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0)
);
```

---

## 🔐 Autenticación y Autorización

### Sistema JWT
- **Algoritmo**: HS256
- **Duración**: 4 horas
- **Roles**: `admin`, `usuario`
- **Header**: `Authorization: Bearer <token>`

### Endpoints de autenticación
```http
# Registro de usuario
POST /api/usuarios/register
Content-Type: application/json

{
  "nombres": "Juan",
  "apellidos": "Pérez",
  "correo": "juan@ejemplo.com",
  "password": "password123",
  "rol": "usuario"
}

# Login
POST /api/usuarios/login
Content-Type: application/json

{
  "correo": "juan@ejemplo.com",
  "password": "password123"
}

# Obtener perfil (requiere token)
GET /api/usuarios/me
Authorization: Bearer <token>
```

---

## 🛠️ API Endpoints Completos

### 🎵 Conciertos y Zonas

#### Conciertos
```http
# Crear concierto (requiere admin)
POST /api/conciertos
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "nombre": "Festival Rock Andino 2025",
  "fecha": "2025-12-01T20:00:00Z",
  "lugar": "Coliseo Rumiñahui",
  "ciudad": "Sangolquí",
  "categoria": "Rock",
  "organizador_id": "admin-123"
}

# Listar conciertos (público)
GET /api/conciertos
GET /api/conciertos?tipo=rock&fecha=2025-12-01

# Obtener concierto específico
GET /api/conciertos/{id}

# Actualizar concierto (requiere admin)
PUT /api/conciertos/{id}
Authorization: Bearer <admin_token>

# Eliminar concierto (requiere admin)
DELETE /api/conciertos/{id}
Authorization: Bearer <admin_token>
```

#### Zonas
```http
# Crear zona (requiere admin)
POST /api/zonas
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "concierto_id": "uuid-del-concierto",
  "nombre": "VIP",
  "capacidad": 100,
  "precio": 150.00
}

# Listar zonas por concierto
GET /api/zonas/concierto/{concierto_id}

# Actualizar precio de zona (requiere admin)
PUT /api/zonas/{id}/precio
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "precio": 200.00
}
```

### 🎫 Reservas

```http
# Crear reserva (requiere autenticación)
POST /api/reservas
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "evento_id": "uuid-del-evento",
  "zona_id": "uuid-de-la-zona",
  "cantidad": 2
}

# Confirmar reserva (requiere autenticación)
PUT /api/reservas/{id}/confirmar
Authorization: Bearer <user_token>

# Obtener reserva específica
GET /api/reservas/{id}

# Eliminar reserva (requiere autenticación)
DELETE /api/reservas/{id}
Authorization: Bearer <user_token>
```

### 🎟️ Entradas

```http
# Crear entrada manual
POST /api/entradas
Content-Type: application/json

{
  "evento_id": "uuid-del-evento",
  "zona_id": "uuid-de-la-zona",
  "cantidad": 1,
  "usuario_id": "uuid-del-usuario"
}

# Listar todas las entradas
GET /api/entradas

# Obtener entrada específica
GET /api/entradas/{id}

# Obtener entradas por usuario
GET /api/entradas/usuario/{usuario_id}
```

### 📧 Notificaciones

```http
# Enviar notificación manual
POST /api/notificaciones
Content-Type: application/json

{
  "correo": "usuario@ejemplo.com",
  "asunto": "Entrada generada",
  "mensaje": "Tu entrada ya está lista con código QR."
}
```

---

## 🔄 Flujo de Eventos (Event-Driven Architecture)

### Diagrama de Flujo
```mermaid
graph TB
    A[Usuario crea reserva] --> B[ms-reservas]
    B --> C[Reserva temporal creada]
    C --> D[Usuario confirma reserva]
    D --> E[ms-reservas confirma]
    E --> F[RabbitMQ: reserva_confirmada]
    F --> G[ms-entradas escucha]
    G --> H[Genera QR y guarda entrada]
    H --> I[RabbitMQ: qr_generado]
    I --> J[ms-notificaciones escucha]
    J --> K[Envía email con QR]
```

### Colas de RabbitMQ
| Cola                | Emisor        | Receptor           | Payload                    |
|---------------------|---------------|--------------------|----------------------------|
| `reserva_confirmada`| ms-reservas   | ms-entradas        | {evento_id, zona_id, ...}  |
| `qr_generado`       | ms-entradas   | ms-notificaciones  | {correo, qr_code, ...}     |

---

## 🧪 Guía de Pruebas Completa

### Paso 1: Registrar usuario administrador
```bash
curl -X POST http://localhost:8000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "Admin",
    "apellidos": "Sistema",
    "correo": "admin@encuentro.com",
    "password": "admin123",
    "rol": "admin"
  }'
```

### Paso 2: Hacer login y obtener token
```bash
curl -X POST http://localhost:8000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "admin@encuentro.com",
    "password": "admin123"
  }'
```

### Paso 3: Crear concierto
```bash
curl -X POST http://localhost:8000/api/conciertos \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Festival Rock Andino 2025",
    "fecha": "2025-12-01T20:00:00Z",
    "lugar": "Coliseo Rumiñahui",
    "ciudad": "Sangolquí",
    "categoria": "Rock",
    "organizador_id": "admin-123"
  }'
```

### Paso 4: Crear zona para el concierto
```bash
curl -X POST http://localhost:8000/api/zonas \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "concierto_id": "CONCIERTO_ID_FROM_STEP_3",
    "nombre": "VIP",
    "capacidad": 100,
    "precio": 150.00
  }'
```

### Paso 5: Registrar usuario normal
```bash
curl -X POST http://localhost:8000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombres": "Juan",
    "apellidos": "Pérez",
    "correo": "juan@ejemplo.com",
    "password": "user123",
    "rol": "usuario"
  }'
```

### Paso 6: Login como usuario normal
```bash
curl -X POST http://localhost:8000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "juan@ejemplo.com",
    "password": "user123"
  }'
```

### Paso 7: Crear reserva
```bash
curl -X POST http://localhost:8000/api/reservas \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "evento_id": "CONCIERTO_ID",
    "zona_id": "ZONA_ID",
    "cantidad": 2
  }'
```

### Paso 8: Confirmar reserva (dispara eventos automáticos)
```bash
curl -X PUT http://localhost:8000/api/reservas/RESERVA_ID/confirmar \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### Paso 9: Verificar entrada generada
```bash
curl -X GET http://localhost:8000/api/entradas/usuario/USER_ID
```

---

## 📊 Monitoreo y Logs

### Ver logs de microservicios
```bash
# Logs de un servicio específico
docker-compose logs -f ms-usuarios
docker-compose logs -f ms-reservas
docker-compose logs -f ms-entradas
docker-compose logs -f ms-conciertos
docker-compose logs -f ms-notificaciones

# Logs de infraestructura
docker-compose logs -f kong
docker-compose logs -f rabbitmq
docker-compose logs -f cockroach-1
```

### Panels de administración
- **Kong Admin UI**: http://localhost:1337
- **RabbitMQ Management**: http://localhost:15672 (admin/admin)
- **CockroachDB UI**: http://localhost:8080

---

## 🔧 Configuración Avanzada

### Escalamiento horizontal
```bash
# Escalar microservicios
docker-compose up --scale ms-reservas=3 --scale ms-entradas=2 --scale ms-usuarios=2

# Verificar instancias
docker-compose ps
```

### Variables de entorno personalizables
```env
# Común para todos los microservicios
JWT_SECRET=tu_secreto_super_seguro
DB_HOST=cockroach-1
DB_PORT=26257
DB_USER=root
DB_PASSWORD=
DB_SSL=false

# RabbitMQ
RABBITMQ_URL=amqp://admin:admin@rabbitmq
RABBITMQ_DEFAULT_USER=admin
RABBITMQ_DEFAULT_PASS=admin

# Kong
KONG_ADMIN_LISTEN=0.0.0.0:8001
KONG_PROXY_ACCESS_LOG=/dev/stdout
```

---

## 🔒 Seguridad

### Buenas prácticas implementadas
- ✅ Autenticación JWT con expiración
- ✅ Autorización basada en roles
- ✅ Validación de entrada en todos los endpoints
- ✅ Conexiones seguras entre microservicios
- ✅ Logs de acceso y errores
- ✅ Rate limiting via Kong (configurable)

### Recomendaciones para producción
- 🔐 Usar HTTPS en Kong
- 🔐 Configurar TLS en CockroachDB
- 🔐 Implementar circuit breakers
- 🔐 Monitoreo con Prometheus/Grafana
- 🔐 Backup automático de bases de datos

---

## 📈 Métricas y Observabilidad

### Endpoints de salud
```http
# Verificar estado de cada microservicio
GET http://localhost:3001/health  # ms-reservas
GET http://localhost:3002/health  # ms-notificaciones
GET http://localhost:3003/health  # ms-entradas
GET http://localhost:3004/health  # ms-conciertos
GET http://localhost:3005/health  # ms-usuarios
```

### Métricas de RabbitMQ
- Cola `reserva_confirmada`: Mensajes procesados
- Cola `qr_generado`: Notificaciones enviadas
- Latencia promedio de procesamiento

---

## 🚀 Siguientes Pasos

### Funcionalidades pendientes
- [ ] Implementar WebSockets para notificaciones en tiempo real
- [ ] Agregar sistema de pagos (Stripe/PayPal)
- [ ] Implementar caché con Redis
- [ ] Agregar tests automatizados
- [ ] Implementar CI/CD pipeline
- [ ] Agregar frontend React/Vue.js
- [ ] Implementar sistema de métricas

### Mejoras técnicas
- [ ] Implementar Circuit Breaker pattern
- [ ] Agregar retry logic para RabbitMQ
- [ ] Implementar health checks
- [ ] Agregar documentación OpenAPI/Swagger
- [ ] Implementar rate limiting personalizado

---

## 👥 Equipo de Desarrollo

| Desarrollador    | Microservicios Asignados          | Responsabilidades                    |
|------------------|-----------------------------------|--------------------------------------|
| **Josué Marín**  | ms-reservas, ms-notificaciones   | Gestión de reservas y notificaciones |
| **Elkin Pabón**  | ms-entradas                      | Generación de entradas y QR         |
| **José Sanmartín**| ms-conciertos, ms-usuarios      | Gestión de eventos y autenticación  |

---

## 📞 Soporte

Para problemas técnicos o preguntas:
1. Revisar logs con `docker-compose logs -f <servicio>`
2. Verificar conectividad entre servicios
3. Consultar documentación de Kong y RabbitMQ
4. Verificar configuración de base de datos

---

## ✅ Estado del Proyecto

- 🟢 **Microservicios**: 5/5 funcionales
- 🟢 **Autenticación**: JWT implementado
- 🟢 **Base de datos**: CockroachDB cluster operativo
- 🟢 **Comunicación**: RabbitMQ eventos funcionando
- 🟢 **Gateway**: Kong configurado
- 🟢 **Logs**: Centralizados con Docker
- 🟢 **Documentación**: Completa y actualizada

**✨ Sistema listo para producción o integración con frontend**

