# WebIOT

Sitio web de [IOT in Motion](https://iotinmotion.com.ar) — Next.js 14, Tailwind CSS, TypeScript.

## Requisitos

- Node.js 18+
- npm

## Levantar localmente

1. **Clonar el repositorio**

   ```bash
   git clone <repo-url>
   cd WebIOT
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

   ```env
   MONGODB_URI=

   ADMIN_PASSWORD=

   SMTP_HOST=
   SMTP_PORT=
   SMTP_TLS=
   SMTP_USER=
   SMTP_PASS=
   MAIL_FROM=
   MAIL_TO=
   MAIL_REPLY_TO=

   PUBLIC_BASE_URL=http://localhost:3000
   ```

   Pedirle los valores reales al equipo.

4. **Iniciar el servidor de desarrollo**

   ```bash
   npm run dev
   ```

   El sitio queda disponible en [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción |
| `npm run start` | Inicia el build de producción |
| `npm run lint` | Ejecuta ESLint |
