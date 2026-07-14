# Veridion Financial Sandbox

Veridion is a compliant single-page React framework financial sandbox. It acts as an interactive simulation gateway for testing, trading, and securing digital assets, including Bitcoin (BTC), Ethereum (ETH), and Veridion's own state currency, Veridion Coin (VRDN).

---

## 📚 Technical Documentation Directory

To make the codebase accessible, the documentation is divided into separate, specialized files:

1. **[ABOUT.md](file:///home/krushn/Veridion/ABOUT.md)**: Product details, system architecture, core security components (MFA, Session lockouts), and sandbox desk operations.
2. **[SCHEMA.md](file:///home/krushn/Veridion/SCHEMA.md)**: Comprehensive database schemas, tables structure, relations, and data types (PostgreSQL mapped via Prisma).
3. **[INTEGRATIONS.md](file:///home/krushn/Veridion/INTEGRATIONS.md)**: Specifications and payloads for the upcoming transition to a **Rust-based sovereign blockchain ledger** (including RPC structs and WebSocket block-minting event formats).

---

## 🛠️ Sandbox Structure

* **`frontend/`**: Single-page application using React, Vite, and TypeScript. Includes real-time ticking yield compounding, live ledger block explorer simulations, and state indicators.
* **`backend/`**: Node.js + Express API server with JWT cookie session controls, geographical IP-based device tracking, and programmatic startup database seeding.

---

## 🚀 Local Development Setup

### 1. Backend API Server
```bash
cd backend
cp .env.example .env        # edit JWT secrets or CORS settings if needed
docker compose up -d db     # starts the PostgreSQL container only
npm install
npm run prisma:migrate      # applies migration schemas
npm run dev                 # runs backend server on http://localhost:4000
```
*Note: On server startup, the database automatically runs a programmatic seed check to ensure the default **Administrator Demo** account (`user@example.com` / `password123`) is created.*

### 2. Frontend Client
```bash
cd frontend
cp .env.example .env        # specifies VITE_API_URL=http://localhost:4000
npm install
npm run dev                 # runs Vite web client on http://localhost:5173
```

---

## 🏁 Verification & Build Scripts
Both the frontend and backend applications are validated:
* **Backend Build Check**: `npm run build` inside `backend/` compiling TypeScript output.
* **Backend Lint & Typecheck**: `npm run typecheck` verifying Prisma client models.
* **Frontend Build Check**: `npm run build` inside `frontend/` generating static asset bundles under `dist/`.
* **Frontend Typecheck**: `npx tsc --noEmit` confirming React prop structures.
