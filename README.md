# ACB Dashboard / webadminACB

Dashboard administrativo Next.js App Router con SSR y un BFF independiente TypeScript/Fastify. Acceso exclusivo para MANAGER. Los servicios de negocio conservan la lógica y sus bases de datos.

## Estructura y estado

- `apps/web`: Next.js 16.4.3, React 19, MUI con caché de estilos SSR y TanStack Query por instancia.
- `apps/bff`: servicio HTTP independiente con login, sesión, CSRF, logout y health/readiness.
- `packages/contracts`: DTOs y schemas públicos; no contiene tokens ni clientes privados.
- Sesión y capacidades se consultan en servidor mediante la red interna del BFF, con cookies opacas y fetch sin caché. Se comprueba autorización en cada página protegida y en el BFF, no únicamente en el layout.
- Solo la identidad pública y capacidades se hidratan en el navegador. No se entregan el JWT backend ni el identificador de cookie mediante props o HTML.
- No se encontraron CRUD administrativos en los controladores locales revisados. El BFF declara esas capacidades no disponibles y la interfaz no inventa datos ni envía operaciones a endpoints supuestos. La geolocalización se integra mediante el servicio geoloca (ver más abajo).
- Las entradas SPA de Vite y React Router se retiraron con autorización. Vite permanece como herramienta de Vitest, no como servidor del dashboard.
- No se modifican `adminACB`, `geolocaACB` ni `presentationACB`.
- Docker local está implementado y verificado con Docker Desktop Linux 29.9.2. No se presenta como despliegue de producción terminado.

## Desarrollo local

Verificado con Node 24.16.0 y npm. Desde la raíz:

```sh
npm ci
npm run dev:bff
```

El BFF requiere Redis disponible y configuración privada en `apps/bff/.env`, usando los nombres de `apps/bff/.env.example`. Ese archivo está excluido de Git. Generar una clave aleatoria base64url de 48 bytes para `SESSION_SIGNING_SECRET` y otra independiente de 32 bytes para `SESSION_ENCRYPTION_KEY`; no publicar sus valores. No hay claves por defecto ni fallback de sesiones en memoria en el servidor.

Configurar la web con `apps/web/.env.local`, tomando `apps/web/.env.example`, y ejecutar en otra terminal:

```sh
npm run dev
```

Abrir `http://localhost:3000`. El `PUBLIC_ORIGIN` del BFF debe coincidir exactamente con el origen del navegador; el ejemplo BFF ya utiliza el puerto 3000. La web utiliza `BFF_INTERNAL_URL` para SSR. En desarrollo, Next.js redirige `/bff` al BFF para conservar un único origen; esa redirección es de destino fijo, no un proxy abierto.

`AUTH_BASE_URL` es el origen del servicio auth; el BFF llama a `POST /api/v1/auth/login` con username/password. El contrato revisado devuelve token y usuario; no hay refresh confirmado. El bearer permanece cifrado en Redis. La lectura de exp del JWT limita el TTL, pero no es una verificación de firma ni la fuente de autorización; el rol procede del login servidor-servidor.

## Build y arranque SSR

```sh
npm run build
npm run preview
```

El build genera `apps/web/.next/standalone`, incluyendo los archivos estáticos y public. El arranque utiliza su servidor mínimo, no `next start`. `PORT` y `HOSTNAME` permiten configurar su escucha. La configuración privada se recibe en ejecución; el comando de arranque local carga opcionalmente `.env` y `.env.local` de `apps/web`.

Next.js reenvía `/bff/*` al BFF con un `rewrite` de destino fijo (`BFF_INTERNAL_URL`, fijado en tiempo de build), tanto en desarrollo como en Docker; así se conserva un único origen sin proxy adicional. No se crea un segundo BFF en Route Handlers de Next.js. En producción, TLS lo aporta el gateway/ingress de la plataforma.

Para el BFF de producción se exige `PUBLIC_ORIGIN` HTTPS. Detrás de terminación TLS, configurar `TRUSTED_PROXY` con direcciones conocidas, nunca confianza universal. Redis debe permanecer privado, con ACL/credenciales y TLS cuando corresponda. No copiar claves de firma JWT de los servicios existentes.

Se mantiene el modelo sin Cache Components: no añadir caché persistente a las consultas autenticadas. React cache solo deduplica durante el render de una solicitud; los QueryClient no se comparten entre solicitudes o usuarios.

## Verificación

```sh
npm run lint
npm run typecheck
npm test
npm run test:ssr
npm run build
```

Los comandos incluyen los workspaces. `npm test` utiliza datos sintéticos y Redis simulado; incluye hidratación e interactividad del proveedor SSR. `npm run test:ssr` construye y arranca el servidor standalone real con un BFF de prueba: verifica HTML del login, estilos MUI, assets, rutas protegidas, solicitudes RSC, errores y dos identidades concurrentes sin filtración de JWT/cookies. No demuestra conectividad con auth o Redis reales ni sustituye una revisión visual en navegador.

Para verificar persistencia Redis real, proporcionar un `BFF_TEST_REDIS_URL` dedicado y ejecutar `npm run test:integration`. Esa prueba crea y elimina únicamente sus propias sesiones aleatorias; no limpia bases ni escanea claves ajenas. Con la pila Compose activa, `redis://localhost:6380` apunta al Redis del proyecto.

## Docker local

Requiere Docker Desktop con el motor Linux. Copiar `.env.example` a `.env` y completar los secretos generados y `AUTH_BASE_URL`. La autenticación real necesita el servicio auth accesible desde los contenedores (`host.docker.internal` para un servicio del host).

```sh
docker compose up -d --build
```

Abrir `http://localhost:8080` (o el `WEB_PORT` configurado). Se despliegan tres contenedores (web, bff, redis); Next.js publica el puerto y reenvía `/bff/*` al BFF, manteniendo un único origen. Redis es privado dentro de la red; solo se publica en `127.0.0.1:6380` para permitir `npm run test:integration` con `BFF_TEST_REDIS_URL=redis://localhost:6380`.

El BFF se ejecuta en contenedor con `NODE_ENV=development` para aceptar el origen HTTP local: las cookies llevan `SameSite=Lax` sin `Secure`, válido únicamente en desarrollo. En producción se exige `PUBLIC_ORIGIN` HTTPS y proxy de confianza explícito.

Verificado con Docker 29.9.2: imágenes de web y BFF compiladas, los servicios saludables, CSRF real emitido a través del origen público, redirección de rutas protegidas, sesiones cifradas JWE/A256GCM con TTL en Redis real y `npm run test:integration` pasando. El login real todavía depende de que el servicio auth esté disponible en `AUTH_BASE_URL`.

## Integración admin_users

Con `ADMIN_USERS_BASE_URL` configurado (origen del servicio `ACB_admin_users_lo`), el BFF expone `/bff/v1/students`, `/bff/v1/guides`, `/bff/v1/users` y `/bff/v1/search`, reenviando el JWT de la sesión cifrada en Redis — el navegador nunca lo ve. Capacidades habilitadas: `estudiantes` y `guias`. Estudiantes no tiene DELETE confirmado; la UI no lo ofrece. Asignaciones, asistencia, alertas y dashboard siguen reportados como no disponibles hasta confirmar contrato.

## Integración geoloca

Con `GEO_BASE_URL` configurado (origen del servicio geoloca, `acb_path_lo`), el BFF expone:

- `GET /bff/v1/geo/routes`
- `GET /bff/v1/geo/routes/search?code=&route_code=`
- `GET /bff/v1/geo/routes/:id`
- `GET /bff/v1/geo/routes/:id/endpoints`
- `GET /bff/v1/geo/meeting-points`
- `POST /bff/v1/geo/imports/kmz` — multipart con un archivo `.kmz` de hasta 20 MB; requiere sesión, Origin permitido y `x-csrf-token`.

Las rutas se leen sin JWT hacia geoloca; las operaciones de admin_users sí reenvían el bearer de la sesión. El importador de geoloca conserva únicamente puntos de encuentro (paradas), colegios e inicio/fin explícitos de cada ruta: la georreferenciación de estudiantes y los puntos de riesgo se descartan en origen. Capacidades habilitadas: `rutas` y `geo`.

## Limitaciones actuales

- Los servicios adminACB (`ACB_admin_users_lo`) solo exponen `POST /api/v1/auth/login`: los controladores de students, guides, users y search no están implementados, por lo que esas llamadas reciben 404 del upstream.
- `admin_operation` no arranca: su migración Flyway usa sintaxis MySQL sobre PostgreSQL.
- Asignaciones, asistencia, alertas y dashboard no tienen contrato backend; el BFF los reporta como no disponibles.
- El login real requiere un usuario con rol MANAGER en `acb_auth_db`.

## SSR y BFF

Next.js lee la cookie opaca en servidor, llama a `BFF_INTERNAL_URL` (`/bff/v1/auth/session` y `/bff/v1/capabilities`) y cada página protegida aplica `requireAdmin`; el layout hidrata React Query con un QueryClient por solicitud. Las llamadas de datos del navegador van por `/bff/v1/*` (reenviadas por Next.js al BFF); el JWT solo existe cifrado en Redis. Ver `docs/arquitectura.puml`.

## Endpoints

Web: `GET /api/health`, mínimo e independiente de las dependencias backend.

BFF:

- `GET /bff/v1/auth/csrf`
- `POST /bff/v1/auth/login`
- `GET /bff/v1/auth/session`
- `POST /bff/v1/auth/logout`
- `GET /bff/v1/capabilities` (requiere sesión)
- `GET /health/live`
- `GET /health/ready`

Las mutaciones requieren Origin permitido y token `x-csrf-token`. Tras el login se regenera la sesión y debe solicitarse otro token CSRF. Las respuestas autenticadas no se cachean públicamente. Logout destruye la sesión del BFF, pero no implica revocación global del JWT backend: no existe un contrato confirmado para ello.

Los adaptadores heredados de refresh están desconectados de los exports activos y ya no consultan almacenamiento ni solicitan renovación. Los `.env` privados preexistentes de la raíz se conservaron, pero Next.js utiliza la configuración de `apps/web`.
