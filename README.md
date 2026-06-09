# MicroBlink

Plataforma descentralizada para recolección de datos macroeconómicos y demográficos con integridad verificable. Desarrollada en el marco del **Solana VibeBootcamp Venezuela**.

**Stack:** React · Vite · TypeScript · Solana (Devnet) · Supabase

[Español](#español) · [English](#english)

---

## Español

### Resumen

MicroBlink conecta **investigadores** que necesitan datos estadísticos confiables con **participantes** que responden encuestas desde su wallet de Solana. Cada respuesta genera un hash SHA-256 para auditoría, se asocia a una verificación geográfica aproximada (municipio y estado) y queda disponible para análisis agregado en el panel de investigador.

### Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| **Autenticación Web3** | Login sin contraseña vía wallet (Phantom). Sesión Supabase derivada de la dirección Solana. |
| **Registro demográfico** | Perfil con datos socioeconómicos y verificación GPS (solo municipio/estado). |
| **Encuestas** | Cuestionarios activos con flujo paso a paso y hash de integridad al enviar. |
| **Dashboard participante** | Historial personal, estadísticas y estado del hash por respuesta. |
| **Panel investigador** | Resultados agregados, exportación CSV, incentivos opcionales y enlaces Blink. |
| **Solana Blinks** | Distribución de encuestas en redes sociales mediante Solana Actions. |

### Arquitectura

```
Participante                    Investigador
     │                                │
     ▼                                ▼
┌─────────────┐              ┌──────────────────┐
│  React SPA  │              │ /investigador    │
│  (Vercel)   │              │ Panel + export   │
└──────┬──────┘              └────────┬─────────┘
       │                              │
       ▼                              ▼
┌─────────────────────────────────────────────┐
│              Supabase (PostgreSQL)           │
│  profiles · surveys · survey_responses       │
│  RLS por rol (participant / researcher)        │
└─────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Edge Functions: ensure-user · blink-survey  │
└─────────────────────────────────────────────┘

Blink (redes sociales): /encuesta/:id → actions.json → blink-survey → dApp
```

### Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- Wallet Solana (Phantom) en **Devnet**
- Cuenta en [Vercel](https://vercel.com) (despliegue frontend)

### Configuración local

```bash
git clone https://github.com/TU_USUARIO/MicroBlink.git
cd MicroBlink
npm install
cp .env.example .env
# Edita .env con tus credenciales de Supabase
npm run dev
```

Variables de entorno:

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima pública de Supabase |

La app estará disponible en `http://localhost:5173`.

### Despliegue en producción

Sigue este orden. Cada paso depende del anterior.

#### Prioridad 1 — Base funcional (día 1)

1. **Aplicar migraciones en Supabase**  
   Ejecuta en el SQL Editor (en orden) los archivos de `supabase/migrations/`, incluido `1780153900_researcher_blinks.sql`.

2. **Configurar variables en Vercel**  
   Añade `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Settings → Environment Variables.

3. **Desplegar el frontend**  
   Conecta el repositorio a Vercel y despliega. El `vercel.json` ya incluye rewrites SPA y CORS para `actions.json`.

4. **Verificar flujo participante**  
   - Conectar wallet → Iniciar sesión → Registro → Responder encuesta → Ver hash en `/dashboard`

#### Prioridad 2 — Panel investigador (día 1–2)

5. **Otorgar rol de investigador**  
   Tras registrarte con tu wallet, ejecuta en Supabase:

   ```sql
   UPDATE profiles SET role = 'researcher' WHERE wallet_address = 'TU_WALLET';
   ```

6. **Verificar panel**  
   Accede a `/investigador`: listado de encuestas, agregados, export CSV e incentivos.

#### Prioridad 3 — Blinks (día 2–3)

7. **Desplegar Edge Function**

   ```bash
   supabase login
   supabase link --project-ref TU_PROJECT_REF
   supabase functions deploy blink-survey
   ```

8. **Configurar secreto en Supabase** (Edge Functions → Secrets):

   ```
   APP_URL=https://tu-dominio.vercel.app
   ```

9. **Probar Blink**  
   - URL directa: `https://tu-dominio.vercel.app/encuesta/{survey_id}`  
   - Vista previa: `https://dial.to/?action=solana-action:https://tu-dominio.vercel.app/encuesta/{survey_id}`  
   - Inspector: [blinks.xyz/inspector](https://www.blinks.xyz/inspector)

#### Prioridad 4 — Pulido (día 3–5)

10. Revisar textos de incentivo en encuestas clave desde el panel investigador.  
11. Probar en móvil (GPS, navegación inferior, wallet Phantom).  
12. Validar que `https://tu-dominio.vercel.app/actions.json` responde con CORS.

### Rutas principales

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Landing y documentación |
| `/registro` | Autenticado | Onboarding demográfico + GPS |
| `/encuestas` | Registrado | Listado de encuestas |
| `/encuestas/:id` | Registrado | Responder encuesta |
| `/dashboard` | Registrado | Historial del participante |
| `/investigador` | Rol `researcher` | Panel de análisis |
| `/encuesta/:id` | Público | Entrada Blink → redirige a encuesta |

### Incentivos

Los investigadores pueden definir un **texto de incentivo** por encuesta (sorteo, transferencia manual, etc.). MicroBlink **no procesa pagos on-chain**; el incentivo es informativo y lo gestiona cada investigador.

### Estado del proyecto

| Componente | Estado |
|------------|--------|
| Auth wallet + Supabase | ✅ Operativo |
| Encuestas y hash SHA-256 | ✅ Operativo |
| Panel investigador + CSV | ✅ Operativo |
| Solana Blinks | ✅ Implementado (requiere despliegue) |
| Anclaje on-chain del hash | 🔜 Planificado |
| cNFT como credencial | 🔜 Planificado |

### Estructura del repositorio

```
src/
  pages/           # Vistas (encuestas, dashboard, investigador)
  components/      # UI y rutas protegidas
  hooks/           # Auth, geolocalización
  lib/             # Supabase, tipos, utilidades Blink
supabase/
  migrations/      # Esquema y políticas RLS
  functions/       # ensure-user, blink-survey
public/
  actions.json     # Configuración Solana Actions
```

### Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Vista previa del build
npm run lint     # ESLint
```

---

## English

### Overview

MicroBlink is a decentralized platform for macroeconomic and demographic data collection with verifiable integrity. It connects **researchers** who need reliable survey data with **participants** who respond via their Solana wallet.

### Key features

- Web3 authentication (Phantom, Devnet)
- Demographic onboarding with privacy-friendly GPS (municipality/state only)
- Step-by-step surveys with SHA-256 integrity hashes
- Participant dashboard with response history
- Researcher panel with aggregates, CSV export, optional incentives, and Blink links
- Solana Blinks for social distribution

### Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.

### Production deployment (priority order)

1. Run Supabase migrations (including `1780153900_researcher_blinks.sql`)
2. Set env vars on Vercel and deploy the frontend
3. Verify participant flow: wallet → register → survey → dashboard
4. Promote your wallet: `UPDATE profiles SET role = 'researcher' WHERE wallet_address = '...'`
5. Deploy `blink-survey` edge function and set `APP_URL` secret
6. Test Blinks via dial.to or the Blinks Inspector

### Incentives

Researchers can set optional incentive text per survey. **No on-chain payments** are processed by the platform.

### Project status

| Component | Status |
|-----------|--------|
| Wallet auth + Supabase | ✅ Ready |
| Surveys + SHA-256 hash | ✅ Ready |
| Researcher panel + CSV | ✅ Ready |
| Solana Blinks | ✅ Implemented (deploy required) |
| On-chain hash anchoring | 🔜 Planned |
| cNFT credentials | 🔜 Planned |

---

## Licencia

Proyecto educativo — Solana VibeBootcamp Venezuela.
