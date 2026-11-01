# ACB Dashboard / webadminACB

Dashboard administrativo Next.js App Router con SSR y un BFF independiente TypeScript/Fastify. Acceso exclusivo para MANAGER. Los servicios de negocio conservan la lógica y sus bases de datos.

## Estructura y estado

- `apps/web`: Next.js 16.4.3, React 19, MUI con caché de estilos SSR y TanStack Query por instancia.
- `apps/bff`: servicio HTTP independiente con login, sesión, CSRF, logout y health/readiness.
- `packages/contracts`: DTOs y schemas públicos; no contiene tokens ni clientes privados.
- Sesión y capacidades se consultan en servidor mediante la red interna del BFF, con cookies opacas y fetch sin caché. Se comprueba autorización en cada página protegida y en el BFF, no únicamente en el layout.
- Solo la identidad pública y capacidades se hidratan en el navegador. No se entregan el JWT backend ni el identificador de cookie mediante props o HTML.
- No se encontraron CRUD administrativos en los controladores locales revisados. El BFF declara esas capacidades no disponibles y la interfaz no inventa datos ni envía operaciones a endpoints supuestos. Geolocalización sigue pendiente de adaptar.
- Las entradas SPA de Vite y React Router se retiraron con autorización. Vite permanece como herramienta de Vitest, no como servidor del dashboard.
- No se modifican `adminACB`, `geolocaACB` ni `presentationACB`.
- Docker, el proxy de entrada y CI siguen pendientes. No se presenta como despliegue de producción terminado.

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

En producción, la entrada del mismo origen debe dirigir `/bff/v1/*` al BFF y las páginas a Next.js. Ese proxy pertenece a la fase Docker pendiente: ejecutar únicamente la vista previa no habilita las mutaciones del navegador contra el BFF. No se crea un segundo BFF en Route Handlers de Next.js.

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

Para verificar persistencia Redis real, proporcionar un `BFF_TEST_REDIS_URL` dedicado y ejecutar `npm run test:integration`. Esa prueba crea y elimina únicamente sus propias sesiones aleatorias; no limpia bases ni escanea claves ajenas. Docker/Redis real siguen pendientes mientras Docker Desktop no tenga su motor activo.

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
