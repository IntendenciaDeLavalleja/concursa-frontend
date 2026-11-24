# Lavalleja Concursa · Frontend

Portal público en React y Vite. El contenedor sirve sus archivos con Nginx en el puerto interno **80**. El navegador se comunica con el backend en su propio subdominio.

## Coolify

| Ajuste | Valor |
| --- | --- |
| Repositorio | `IntendenciaDeLavalleja/concursa-frontend` |
| Rama | `main` |
| Build Pack | Dockerfile |
| Base Directory | `/` |
| Dockerfile Location | `/Dockerfile` |
| Puerto interno | `80` |
| Health Check | `GET /health` |
| Dominio | Subdominio HTTPS del portal público |

En **Environment Variables** agregá `VITE_BACKEND_URL` con **Buildtime** activado. El valor es el origen HTTPS del backend, por ejemplo `https://api.concursa.example.org`, sin el sufijo `/api`. El contenedor requiere esa variable para compilar. Como Vite la incorpora a los archivos públicos, cambiá su valor y volvé a desplegar si se mueve el backend. [Ejemplo de variables](.env.example)

En el backend, definí `FRONTEND_URL` con el origen HTTPS del portal público. Si usás `CORS_ORIGINS`, incluí también ese origen. El panel administrativo se abre en el dominio del backend. [Repositorio del backend](https://github.com/IntendenciaDeLavalleja/concursa-backend)

## Desarrollo

Usá Node.js 24 e instalá las dependencias con `npm ci`. En desarrollo, Vite usa el proxy hacia el backend local en el puerto 5000 cuando `VITE_BACKEND_URL` está vacía. Para probar otro backend podés configurar la variable en `.env.local`.

```sh
npm ci
npm run dev
npm run lint
npm run build
```
