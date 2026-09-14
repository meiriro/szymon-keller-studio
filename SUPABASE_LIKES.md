# Likes compartidos

La web ya contiene el botón de corazón y está preparada para contar un único like por visitante y proyecto. El contador se activa con una base de datos de Supabase.

## Activación

1. Crea un proyecto en [Supabase](https://supabase.com/dashboard/projects). El plan Free es suficiente para este uso.
2. En **Authentication → Providers → Anonymous**, activa **Anonymous sign-ins**. Como medida contra abuso, activa también CAPTCHA o Cloudflare Turnstile.
3. Abre **SQL Editor → New query**, pega y ejecuta el contenido de [`supabase/project-likes.sql`](supabase/project-likes.sql).
4. En **Project Settings → API**, copia el **Project URL** y la **publishable key**. No uses nunca la clave `service_role`.
5. Sustituye los dos valores vacíos de `dist/likes-config.js` por esos datos y publica.

Las claves publishable son seguras para incluir en una web pública porque las funciones de la base de datos limitan cada like al usuario anónimo que lo creó. El contador no pide nombre, correo ni registro al visitante.

## Funcionamiento

- Un visitante puede dar o retirar un like en cada proyecto desde su ficha.
- Cada navegador mantiene una sesión anónima, por lo que no puede dar dos likes al mismo proyecto desde esa sesión.
- Si alguien borra los datos del navegador o usa otro dispositivo, se considera una visita distinta.
- El total es compartido y se actualiza al pulsar el corazón.
