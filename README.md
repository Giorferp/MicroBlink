# MicroBlink ⚡

[Español](#español) | [English](#english)

---

## Español

**MicroBlink** es una dApp descentralizada diseñada para la recolección de datos macroeconómicos y demográficos con integridad verificable on-chain. Este proyecto fue desarrollado como parte del **Solana VibeBootcamp Venezuela**.

La plataforma permite a investigadores y organizaciones recopilar encuestas de alta pureza. Los participantes se registran de forma segura con sus billeteras de Solana, verifican su ubicación geográfica aproximada de manera privada (GPS) y responden cuestionarios económicos. Cada conjunto de respuestas genera un hash criptográfico único que se almacena en la base de datos y se valida on-chain para garantizar que la información no sea manipulada.

### Características Clave
*   **Autenticación Web3:** Inicio de sesión sin contraseñas tradicionales, utilizando firma criptográfica y credenciales deterministas derivadas del par de claves de Solana.
*   **Verificación Geográfica:** Validación demográfica mediante GPS respetando la privacidad del usuario (solo almacena municipio y estado).
*   **Integridad de Datos:** Generación de un hash SHA-256 de las respuestas para su posterior auditoría y verificación on-chain en Solana Devnet.
*   **Diseño Premium y Fluido:** Interfaz moderna y responsive optimizada para dispositivos móviles y de escritorio.

### Stack Tecnológico
*   **Frontend:** React 18, Vite, TypeScript, TailwindCSS.
*   **Web3:** Solana Web3.js, Solana Wallet Adapter.
*   **Backend & Base de Datos:** Supabase (PostgreSQL, Row Level Security, Edge Functions).

### Ejecución Local
1.  Instala las dependencias:
    ```bash
    npm install
    ```
2.  Crea un archivo `.env` en la raíz (puedes copiar de `.env.example`) y configura tus claves de Supabase:
    ```bash
    VITE_SUPABASE_URL=tu_supabase_url
    VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

---

## English

**MicroBlink** is a decentralized dApp designed for macroeconomic and demographic data collection with on-chain verifiable integrity. This project was developed as part of the **Solana VibeBootcamp Venezuela**.

The platform enables researchers and organizations to gather high-purity economic survey data. Participants log in securely using their Solana wallets, verify their approximate geographic location privately (GPS), and fill out economic surveys. Each set of answers produces a unique cryptographic hash stored in the database and validated on-chain to ensure the integrity of the data.

### Key Features
*   **Web3 Authentication:** Passwordless login using cryptographic signatures and deterministic credentials derived from Solana keypairs.
*   **Geographic Verification:** Privacy-friendly demographic validation via GPS (only stores municipality and state).
*   **Data Integrity:** SHA-256 hash generation of responses for subsequent on-chain verification on Solana Devnet.
*   **Premium UX/UI:** Modern, responsive interface optimized for mobile and desktop screens.

### Tech Stack
*   **Frontend:** React 18, Vite, TypeScript, TailwindCSS.
*   **Web3:** Solana Web3.js, Solana Wallet Adapter.
*   **Backend & Database:** Supabase (PostgreSQL, Row Level Security, Edge Functions).

### Local Setup
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` file at the root (you can copy `.env.example`) and configure your Supabase credentials:
    ```bash
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
