# Caso 1 – Inscripción de alumnos a una universidad

Backend desarrollado en **Node.js + TypeScript** siguiendo **Clean Architecture**, utilizando los patrones de diseño **Chain of Responsibility** y **Proxy**, y un frontend mínimo en `public/index.html` para probar el flujo completo.

---

## Stack técnico

- **Runtime**: Node.js (pensado para v24.13.0 con `nvm`)
- **Lenguaje**: TypeScript
- **Gestor de paquetes recomendado**: `pnpm` (aunque también funciona con `npm`)
- **Framework HTTP**: Express
- **Frontend**: HTML + JS puro servido desde `public/`

---

## Estructura de carpetas (Clean Architecture)

```text
src/
  domain/
    entities/
    repositories/
    services/
      validation/
  usecases/
    proxy/
  adapters/
    controllers/
  infrastructure/
    repositories/
    services/
    logging/
    time/
    server.ts
public/
  index.html
```

### Domain

Contiene el **core del dominio**, totalmente independiente de frameworks:

- **Entidades**
  - `Student`, `Course`, `EnrollmentRequest`, `EnrollmentResult`
  - Ruta: `src/domain/entities/*`
- **Repositorios (interfaces)**
  - `StudentRepository`, `CourseRepository`, `EnrollmentRepository`
  - Ruta: `src/domain/repositories/*`
- **Servicios de dominio**
  - Cadena de validación de inscripción (Chain of Responsibility):
    - `EnrollmentValidationHandler` (abstracta)
    - `DocumentValidationHandler`
    - `SeatsValidationHandler`
    - `PaymentValidationHandler`
  - Ruta: `src/domain/services/validation/*`

El dominio no conoce Express, ni HTTP, ni bases de datos. Solo tipos y contratos.

### Use Cases

Contiene la **lógica de aplicación**, orquestando el dominio:

- `EnrollStudentUseCase`
  - Implementa la lógica del caso de uso de inscripción de alumnos.
  - Orquesta repositorios, cadena de validación y persistencia.
- `EnrollmentService` (interfaz)
  - Contrato alto nivel que el controlador HTTP consumirá.
- `EnrollmentServiceProxy`
  - Implementa el patrón Proxy envolviendo a `EnrollmentService`.

Ruta: `src/usecases/*`

### Adapters

Adaptadores hacia el exterior (en este caso, HTTP):

- `EnrollmentController`
  - Expone el endpoint `POST /api/enrollments`.
  - Traduce la request HTTP al `EnrollmentRequest` del dominio.
  - Maneja respuestas HTTP (códigos 200/400/500).

Ruta: `src/adapters/controllers/EnrollmentController.ts`

### Infrastructure

Implementaciones concretas de detalles técnicos:

- **Repositorios en memoria**
  - `InMemoryStudentRepository`
  - `InMemoryCourseRepository`
  - `InMemoryEnrollmentRepository`
  - Ruta: `src/infrastructure/repositories/*`
- **Servicios técnicos**
  - `InMemoryPaymentValidator` (simula validación de pago)
  - `ConsoleAuditLogger` (auditoría a consola)
  - `SystemClock` (reloj del sistema)
- **Servidor HTTP**
  - `server.ts`: instancia Express, registra middlewares, monta controladores y arma el grafo de dependencias.

Ruta: `src/infrastructure/*`

La infraestructura puede cambiar (por ejemplo, pasar de repositorios en memoria a una base de datos real) sin romper el dominio ni los casos de uso.

---

## Patrones de diseño

### 1. Chain of Responsibility – Proceso de inscripción

**Objetivo**: desacoplar y encadenar distintas validaciones del proceso de inscripción:

- Validación de documentos
- Validación de cupos
- Validación de pago

Cada eslabón decide si:

1. **Maneja** la petición (por ejemplo, rechazando la inscripción con un mensaje).
2. **Delega** al siguiente eslabón de la cadena.

#### Implementación

- Clase base abstracta:
  - `src/domain/services/validation/EnrollmentValidationHandler.ts`

Define:

- `setNext(handler)`: encadena el siguiente handler.
- `handle(request)`: ejecuta `doHandle` y, si todo va bien, llama al siguiente handler.

Handlers concretos:

- `DocumentValidationHandler`
  - Verifica `documentosCompletos`.
  - Si falta documentación → corta la cadena con mensaje de error.
- `SeatsValidationHandler`
  - Consulta `CourseRepository` para verificar curso y cupos.
- `PaymentValidationHandler`
  - Usa un `PaymentValidator` para comprobar si el pago es válido (en este ejemplo, se basa en `pagoRegistrado`).

#### Dónde se arma la cadena

En el **caso de uso**:

- `src/usecases/EnrollStudentUseCase.ts`

Allí se instancia:

```ts
const documentValidation = new DocumentValidationHandler()
const seatsValidation = new SeatsValidationHandler(courseRepository)
const paymentValidation = new PaymentValidationHandler(paymentValidator)

documentValidation
  .setNext(seatsValidation)
  .setNext(paymentValidation)
```

El caso de uso solo invoca `validationChain.handle(request)` y recibe un `ValidationResult`. No necesita conocer el orden interno ni la lógica de cada handler.

### 2. Proxy – Control de acceso al servicio de inscripción

**Objetivo**: envolver el caso de uso de inscripción para:

- Controlar si la operación está permitida (por ejemplo, horario de oficina).
- Añadir logging/auditoría sin ensuciar el caso de uso.

#### Implementación

Clase:

- `src/usecases/proxy/EnrollmentServiceProxy.ts`

Responsabilidades:

- Implementa la misma interfaz `EnrollmentService` que el caso de uso.
- Recibe en el constructor:
  - `target: EnrollmentService` (el caso de uso real).
  - `auditLogger: AuditLogger` (para auditoría).
  - `clock: Clock` (para hora actual, fácilmente testeable).

Lógica principal:

1. Comprueba `estaEnHorarioDeOficina()` (en desarrollo se puede forzar a `true`).
2. Si no está permitido:
   - Registra evento de auditoría.
   - Devuelve `exito: false` con mensaje de horario.
3. Si está permitido:
   - Log de inicio.
   - Llama a `target.inscribir(request)`.
   - Log de fin incluyendo duración y resultado.

Implementaciones concretas usadas:

- `ConsoleAuditLogger` (`src/infrastructure/logging/ConsoleAuditLogger.ts`)
- `SystemClock` (`src/infrastructure/time/SystemClock.ts`)

El controlador HTTP no sabe si está llamando al caso de uso “directo” o a un proxy; solo conoce el contrato `EnrollmentService`.

---

## Flujo completo de la inscripción

A continuación, el flujo end-to-end desde el navegador hasta la capa de dominio.

1. **Usuario rellena el formulario en `index.html`**
   - Ruta: `public/index.html`
   - Campos:
     - `studentId`
     - `courseId`
     - `documentosCompletos` (checkbox)
     - `pagoRegistrado` (checkbox)

2. **Frontend envía `fetch` al backend**

```js
fetch("/api/enrollments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
})
```

3. **Express recibe la request**

- `src/infrastructure/server.ts`:
  - Configura Express (`express.json`, `cors`, `express.static("public")`).
  - Registra el router de inscripción en `/api`.

4. **Controlador HTTP adapta la request**

- `src/adapters/controllers/EnrollmentController.ts`
  - Endpoint: `POST /api/enrollments`
  - Valida que `studentId` y `courseId` vengan en el body.
  - Construye un `EnrollmentRequest` (dominio).

5. **El controlador llama al servicio de inscripción (Proxy)**

- Se inyecta un `EnrollmentService` que en realidad es un `EnrollmentServiceProxy`.

6. **Proxy (EnrollmentServiceProxy)**

- Verifica si la operación está permitida (horario).
- Registra logs de auditoría.
- Llama al caso de uso real `EnrollStudentUseCase`.

7. **Caso de uso `EnrollStudentUseCase`**

- Comprueba si el alumno existe (`StudentRepository`).
- Lanza la **cadena de validación**:
  - Documentos.
  - Cupos del curso.
  - Pago.
- Si la validación falla → devuelve `exito: false` con el mensaje correspondiente.
- Si todo está OK:
  - Registra la inscripción (`EnrollmentRepository`).
  - Actualiza los cupos del curso (`CourseRepository.save`).

8. **Respuesta hacia el frontend**

- El caso de uso devuelve `EnrollmentResult`.
- El controlador HTTP:
  - Usa `status 200` si `exito === true`.
  - Usa `status 400` si `exito === false`.
- El frontend muestra el JSON en pantalla en la sección de “Resultado”.

---

## Persistencia: repositorios en memoria

Para simplificar el caso de estudio, la “base de datos” es in-memory:

- `InMemoryStudentRepository`
- `InMemoryCourseRepository`
- `InMemoryEnrollmentRepository`

Esto permite:

- Tener un backend funcional sin configurar un motor de BD.
- Centrarse en Clean Architecture y en los patrones de diseño.

Si se desea una base de datos real (PostgreSQL, MongoDB, etc.), solo hay que:

1. Crear nuevas clases que implementen las interfaces de `domain/repositories`.
2. Reemplazar las instancias `InMemory*Repository` por las nuevas implementaciones en `server.ts`.

El dominio, los casos de uso y el frontend se mantienen igual.

---

## Cómo ejecutar el proyecto

### Requisitos

- Node.js instalado (idealmente v24.13.0 gestionado con `nvm`).

### Comandos básicos (pnpm recomendado)

```bash
nvm use 24.13.0
pnpm install
pnpm run build
pnpm run start
```

Después abre en el navegador:

- `http://localhost:3000` → formulario de inscripción.
- `http://localhost:3000/health` → endpoint de salud del backend.

