# 🎟️ Encuentro - Sistema de Gestión de Eventos (Microservicios Distribuidos)

Este sistema implementa **4 microservicios distribuidos** para gestionar reservas, entradas, conciertos y notificaciones, usando **Node.js**, **RabbitMQ** y **CockroachDB** (clúster de 3 nodos).

---

## 📦 Microservicios incluidos

| Microservicio         | Puerto | Descripción                                      |
|-----------------------|--------|--------------------------------------------------|
| `ms-reservas`         | 3001   | Crea y confirma reservas                         |
| `ms-entradas`         | 3003   | Genera entradas con QR tras confirmar reservas   |
| `ms-conciertos`       | 3004   | Registra y lista conciertos                      |
| `ms-notificaciones`   | 3002   | Simula envío de correos (escucha QR generado)    |

---

## ⚙️ Requisitos

- Docker y Docker Compose instalados
- Puertos libres: `3001`, `3002`, `3003`, `3004`, `26257`, `8080`, `5672`, `15672`

---

## 🚀 ¿Cómo levantar todo?

1. Clona este repositorio.
2. Ejecuta el siguiente comando en la raíz del proyecto:

   ```bash
   docker compose up --build
   ```

Esto iniciará:

- CockroachDB distribuido (3 nodos)
- RabbitMQ + panel web
- Todos los microservicios conectados y configurados

---

### 📊 RabbitMQ

- UI: [http://localhost:15672](http://localhost:15672)
- Usuario: `admin`
- Contraseña: `admin`

**Colas utilizadas:**
- `reserva_confirmada`: Emite `ms-reservas`, escucha `ms-entradas`
- `qr_generado`: Emite `ms-entradas`, escucha `ms-notificaciones`

---

### 🗃️ CockroachDB

- UI: [http://localhost:8080](http://localhost:8080)
- Conexión desde microservicios: `cockroach-1:26257`
- Modo clúster real (3 nodos distribuidos)

---

## 🧱 Crear las bases y tablas (SQL)

### Acceder al shell SQL

```bash
docker exec -it ms-backend-cockroach-1 ./cockroach sql --insecure
```

### 🟩 Reservas

```sql
CREATE DATABASE IF NOT EXISTS reservas;
USE reservas;

CREATE TABLE IF NOT EXISTS reservas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id STRING NOT NULL,
  zona_id STRING NOT NULL,
  cantidad INT NOT NULL,
  estado STRING DEFAULT 'temporal',
  vencimiento TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
```

### 🟦 Entradas

```sql
CREATE DATABASE IF NOT EXISTS entradas;
USE entradas;

CREATE TABLE IF NOT EXISTS entradas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id STRING NOT NULL,
  usuario_id STRING,
  zona_id STRING NOT NULL,
  cantidad INT NOT NULL,
  qr_code STRING,
  fecha TIMESTAMP
);
```

### 🟥 Conciertos

```sql
CREATE DATABASE IF NOT EXISTS conciertos;
USE conciertos;

CREATE TABLE IF NOT EXISTS conciertos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre STRING NOT NULL,
  fecha TIMESTAMP NOT NULL,
  lugar STRING NOT NULL,
  organizador_id STRING NOT NULL
);
```

---

## 🧪 Pruebas por microservicio

### ✅ Crear concierto

```http
POST http://localhost:3004/api/v1/conciertos
Content-Type: application/json

{
  "nombre": "Festival Andino",
  "fecha": "2025-12-01T20:00:00Z",
  "lugar": "Coliseo Rumiñahui",
  "organizador_id": "admin"
}
```

### ✅ Crear reserva

```http
POST http://localhost:3001/api/v1/reservas
Content-Type: application/json

{
  "evento_id": "evt123",
  "zona_id": "vip01",
  "cantidad": 2
}
```

### ✅ Confirmar reserva (esto dispara evento a ms-entradas)

```http
POST http://localhost:3001/api/v1/reservas/confirmar
Content-Type: application/json

{
  "reserva_id": "<ID devuelto>",
  "metodo_pago": "tarjeta"
}
```

### ✅ Ver entradas generadas

```http
GET http://localhost:3003/api/v1/entradas
```

### ✅ Simular envío de correo manual

```http
POST http://localhost:3002/api/v1/notificaciones
Content-Type: application/json

{
  "correo": "usuario@ejemplo.com",
  "asunto": "Entrada generada",
  "mensaje": "Tu entrada ya está lista con código QR."
}
```

---

## 🔁 Flujo de eventos

```plaintext
[Usuario] → POST /reservas → ms-reservas
    → (RabbitMQ: reserva_confirmada)
    → ms-entradas → genera QR y guarda entrada
    → (RabbitMQ: qr_generado)
    → ms-notificaciones → simula envío de correo
```

---

## 👥 Autores

- Josué Marín → ms-reservas, ms-notificaciones
- Elkin Pabón → ms-entradas
- José Sanmartín → ms-conciertos

---

## ✅ Estado final

- 🟢 Microservicios funcionales
- 🟢 Comunicación por eventos
- 🟢 Base de datos replicada (CockroachDB 3 nodos)
- 🟢 Listo para pruebas, ampliación o integración con frontend

