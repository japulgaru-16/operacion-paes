# Operación PAES: Desactiva la Bomba

Juego web inspirado en "Keep Talking and Nobody Explodes" con ejercicios matemáticos tipo PAES (Chile, módulos M1 y M2). Cada bomba pertenece a un eje temático (Números, Álgebra, Geometría, Probabilidad y Estadística, Funciones) y se desactiva resolviendo ejercicios contra el reloj. Incluye ranking global compartido por dificultad (M1 / M2).

Esta guía explica, paso a paso y desde cero, cómo publicar el juego en internet gratis y cómo actualizarlo.

---

## 0. Preparar tu computador (solo la primera vez)

Necesitas instalar 3 programas gratis:

1. **Node.js** (hace funcionar el proyecto):
   - Entra a https://nodejs.org y pulsa el botón verde que dice **LTS** (versión 20 o superior).
   - Abre el archivo descargado y acepta todo con "Siguiente" hasta terminar.
2. **Visual Studio Code** (editor para ver y editar el código):
   - Entra a https://code.visualstudio.com y pulsa **Download**.
   - Instálalo igual: "Siguiente" hasta terminar.
3. **Git** (sube el código a GitHub):
   - Entra a https://git-scm.com y pulsa **Download for Windows** (o tu sistema).
   - Instala con las opciones por defecto (no cambies nada).

Comprueba que quedaron bien instalados: abre **Visual Studio Code**, menú **Terminal -> New Terminal** y escribe:

```bash
node -v
git --version
```

Si ambos muestran un número de versión, está todo listo. Si dicen "command not found" o "no se reconoce", cierra y vuelve a abrir VSCode; si persiste, reinstala.

## 1. Descargar el proyecto

Descarga el archivo **operacion-paes.zip** desde el panel de descargas (es el proyecto completo empaquetado en un solo archivo). Descomprímelo en una carpeta que encuentres fácil, por ejemplo `Documentos/operacion-paes` (en Windows: clic derecho al ZIP -> "Extraer todo...").

## 2. Probar el juego en tu computador (recomendado antes de publicar)

1. Abre **Visual Studio Code** -> menú **File -> Open Folder** -> selecciona la carpeta del proyecto.
2. Menú **Terminal -> New Terminal** (se abre abajo).
3. Ejecuta estos comandos uno por uno (escribe y presiona Enter; espera a que cada uno termine):

```bash
npm install
cp .env.example .env
mkdir db
npm run db:push
npm run dev:simple
```

Qué hace cada uno: `npm install` descarga las piezas del proyecto (tarda unos minutos la primera vez), el segundo crea tu archivo de configuración local, `mkdir db` crea la carpeta de la base de datos local, `db:push` crea la base de datos y el último enciende el juego.

4. Abre tu navegador en **http://localhost:3000** y juega.
5. Para apagar el juego: vuelve a la terminal y presiona **Ctrl+C**.

## 3. Subir el proyecto a GitHub (primera vez)

1. Crea cuenta (o entra) en **https://github.com**.
2. Pulsa el ícono **+** (arriba a la derecha) -> **New repository**.
3. Escribe el nombre, por ejemplo `operacion-paes`. Déjalo **Public** (o Private, Vercel funciona con ambos) y **NO marques** ninguna casilla de README. Pulsa **Create repository**.
4. GitHub te muestra una pantalla con comandos. Copia el bloque de abajo ("...push an existing repository from the command line"). Son estos (cambia `TU-USUARIO`):

```bash
git init
git add .
git commit -m "Primera versión del juego"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/operacion-paes.git
git push -u origin main
```

5. Pega esos comandos en la terminal de VSCode, de a uno o todos juntos, y presiona Enter.
   - Si es la primera vez que usas Git, puede pedirte identificarte: ejecuta `git config --global user.name "Tu Nombre"` y `git config --global user.email "tu@correo.com"`.
   - Al hacer `git push`, se abre una ventana del navegador para **iniciar sesión en GitHub** (es el administrador de credenciales de Git). Autoriza y vuelve a la terminal.
6. Refresca la página de GitHub: verás todos los archivos del proyecto subidos.

## 4. Crear la base de datos en la nube (Neon, gratuita)

El ranking compartido necesita que los datos de todos los jugadores se guarden en internet. Vercel no permite guardar archivos, así que se usa una base de datos gratuita en la nube llamada **Neon**:

1. Entra a **https://neon.com** y pulsa **Sign Up** -> elige **Sign up with GitHub** (así no creas otra contraseña).
2. Dentro de tu cuenta, pulsa **Create project** (o **New project**). Nómbralo `operacion-paes` y deja la región que venga. Pulsa **Create**.
3. En la pantalla te muestra una **Connection string** (o pulsa el botón **Connect** / **Dashboard -> Connection string**): es una dirección que empieza con `postgresql://...`. Cópiala completa y guárdala en un bloc de notas.

Ejemplo de cómo se ve:

```
postgresql://usuario:contraseña@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require
```

Esa dirección es la "llave" de tu base de datos: nunca la subas a GitHub ni la compartas (el proyecto ya está configurado para que quede fuera del código).

## 5. Publicar en Vercel

1. Entra a **https://vercel.com** y pulsa **Continue with GitHub** (usa tu cuenta de GitHub).
2. Pulsa el botón **Add New...** (o **New Project**) -> **Project**.
3. Verás la lista de tus repositorios. Busca `operacion-paes` y pulsa **Import**.
4. En la pantalla de configuración, **no cambies nada**: Vercel detecta solo que es un proyecto Next.js.
5. Antes de desplegar, busca la sección **Environment Variables** (más abajo) y completa:
   - **Name:** `DATABASE_URL`
   - **Value:** pega aquí la connection string de Neon (del paso 4).
   - Pulsa **Add**.
6. Pulsa el botón **Deploy** (abajo) y espera 1 a 2 minutos (verás una animación).
7. Cuando termine verás "Congratulations" y una dirección como:

```
https://operacion-paes.vercel.app
```

Esa es la URL pública de tu juego. Ábrela, juega una partida y revisa el ranking: tu resultado queda registrado.

## 6. Compartir el juego

Copia la URL pública (`https://tu-juego.vercel.app`) y envíala por WhatsApp, Discord, correo, etc. Todas las personas que jueguen desde ese enlace compartirán el mismo ranking global, separado por dificultad (pestañas M1 y M2 dentro del juego).

## 7. Actualizar el juego después de un cambio

Cuando modifiques algo del código (por ejemplo, agregues preguntas en `src/data/questions.ts`), guarda los cambios y ejecuta en la terminal de VSCode los 3 comandos:

```bash
git add .
git commit -m "Descripción de lo que cambié"
git push
```

Vercel detecta el `git push` automáticamente, vuelve a desplegar en 1-2 minutos y conserva el historial de versiones (pestaña **Deployments** en Vercel; desde ahí puedes volver a una versión anterior con **Promote to Production**).

## 8. Problemas comunes y soluciones

| Problema | Solución |
| --- | --- |
| "node" o "git" no se reconocen como comandos | Cierra y reabre VSCode (o reinstala Node.js / Git). |
| `git remote add` dice "remote origin already exists" | Ejecuta `git remote remove origin` y repite el comando. |
| `git push` pide usuario y contraseña | Es normal la primera vez: se abre el navegador, inicia sesión con GitHub y autoriza. No uses tu contraseña de GitHub en la terminal. |
| `npm install` se queda muy rato | Es normal la primera vez (3-10 minutos). |
| Vercel falla con error de base de datos (P1001, "can't reach database") | La `DATABASE_URL` quedó mal copiada: revisa en Vercel -> Settings -> Environment Variables que esté completa, con `?sslmode=require` al final, y haz **Redeploy**. |
| Cambié el código pero la web no se actualiza | Revisa que hiciste `git push` y espera 2 minutos. Luego recarga la página (Ctrl+F5). |
| El ranking aparece vacío en la web | Es normal al principio: se llena cuando alguien juega. Juega una partida para verificar. |

## 9. Estructura del proyecto

| Carpeta / archivo | Qué contiene |
| --- | --- |
| `src/app/page.tsx` | Página principal (el juego completo) |
| `src/app/api/` | Backend: preguntas, resultados, estadísticas y ranking |
| `src/components/game/` | Componentes del juego (bombas, temporizador, ranking, etc.) |
| `src/data/questions.ts` | Banco de preguntas PAES (M1 y M2, por eje) |
| `prisma/schema.prisma` | Modelo de la base de datos (preguntas y partidas) |
| `scripts/prepare-prisma.mjs` | Ajusta la base de datos automáticamente (SQLite local / Postgres en Vercel) |
| `public/bombs/` | Imágenes de las bombas por eje temático |

## 10. Comandos útiles

| Comando | Qué hace |
| --- | --- |
| `npm run dev:simple` | Servidor de desarrollo en http://localhost:3000 |
| `npm run db:push` | Aplica el modelo a la base de datos local |
| `npm run build` | Compila el proyecto (lo que ejecuta Vercel al desplegar) |
| `npm run lint` | Revisa la calidad del código |

---

Temario basado en los ejes de la PAES de Matemática (M1 y M2) de Chile: Números, Álgebra, Geometría, Probabilidad y Estadística, y Funciones (M2). Juego con fines educativos, sin afiliación oficial con DEMRE.
