# Martín Rivero Tecnología

Portal educativo para organizar contenidos por cursos, asignaturas, temas y recursos. Está construido con React, TypeScript, Vite, Tailwind CSS y Shadcn UI.

## Persistencia

El contenido inicial está incluido en `src/data/mockData.ts`. En producción, la aplicación consulta `content/content.json` mediante una función de Vercel:

- las visitas leen el contenido compartido desde `/api/content`;
- el panel publica cada cambio mediante la GitHub Contents API;
- GitHub guarda cada actualización como un commit permanente;
- si el archivo aún no existe, el primer cambio del panel lo crea automáticamente;
- si GitHub no está configurado o disponible, la web muestra el contenido inicial incluido en la aplicación.

No se utiliza una base de datos. GitHub actúa como almacenamiento permanente. Cada commit también puede iniciar un nuevo despliegue de Vercel si el proyecto está conectado al mismo repositorio.

## Configuración de GitHub

1. Abre GitHub y crea un token fine-grained en `Settings > Developer settings > Personal access tokens`.
2. Limita el token únicamente al repositorio de este portal.
3. Concede el permiso `Repository permissions > Contents: Read and write`.
4. Conserva el token para configurarlo como `GITHUB_TOKEN`; no lo añadas al repositorio.

## Variables de Vercel

Configura estas variables privadas en `Project > Settings > Environment Variables`:

```env
ADMIN_PASSWORD=una-contraseña-segura
SESSION_SECRET=un-valor-aleatorio-largo
GITHUB_TOKEN=github_pat_...
GITHUB_REPO=usuario/repositorio
GITHUB_BRANCH=main
GITHUB_CONTENT_PATH=content/content.json
```

`GITHUB_CONTENT_PATH` es opcional y usa `content/content.json` por defecto. `SESSION_SECRET` puede generarse con un gestor de contraseñas o con `openssl rand -hex 32`.

No uses `VITE_ADMIN_PASSWORD`: cualquier variable que empiece por `VITE_` queda incluida en el JavaScript público. La nueva autenticación valida `ADMIN_PASSWORD` en el servidor y guarda la sesión en una cookie `HttpOnly`.

Después de configurar las variables, vuelve a desplegar el proyecto. El primer guardado realizado en `/admin` creará el archivo compartido y, al terminar, el panel mostrará `Todos los cambios están publicados`.

## Desarrollo local

Las rutas `api/` son funciones de Vercel. Para probar el flujo completo en local:

1. Instala Node.js 20 o posterior y ejecuta `npm install`.
2. Copia `.env.example` como `.env` y completa sus valores.
3. Instala o ejecuta la CLI de Vercel y arranca `npx vercel dev`.
4. Abre la URL local indicada por Vercel.

`npm run dev` sigue sirviendo únicamente el frontend con Vite; sin las funciones API el contenido inicial se puede consultar, pero el login y la publicación no estarán disponibles.

## Panel de administración

El acceso está disponible en `/admin/login`. Desde allí se pueden crear, editar y eliminar cursos, asignaturas, temas y recursos. Las eliminaciones en cascada mantienen el contenido coherente.

El panel publica los cambios en orden. Si GitHub rechaza una actualización, muestra el error y permite reintentar sin cerrar sesión ni descartar el estado actual del navegador.

## Comandos

```bash
npm run dev
npm run typecheck
npm test
npm run lint
npm run build
```
