# InstaAmbulance 🚑

InstaAmbulance is a high-performance hospital queuing system designed to streamline patient intake and triage. By utilizing AI-powered triage, real-time WebSocket communication, and robust caching, it reduces patient wait times and optimizes resource allocation in hospital environments.

---

## 🏛️ System Architecture Deep Dive

InstaAmbulance follows a modern, event-driven architecture using Next.js 15+ (App Router).

### 1. Data Flow & Interaction Model
The application separates concerns between the **Patient (Client-facing)** and **Receptionist (Operational)** interfaces.

```text
+----------------+      (REST API)      +-------------------+      (Database/Cache)
| Patient Client | -------------------> | Next.js API Layer | <--> | Supabase (Postgres)
+----------------+                      +-------------------+      | Redis (Caching)
                                                                   +-------------------+
                                                                             |
                                                                             | (Real-time Sync)
                                                                             v
+-----------------------+      (WebSocket)      +--------------------+
| Receptionist Dashboard| <-------------------- | Socket.io Server   |
+-----------------------+                       +--------------------+
```

### 2. Real-time Queue Management
To ensure the receptionist always has the live state of the queue without polling:
1.  **Events:** New token generation, triage submission, or "Call Next" triggers a database event.
2.  **Propagation:** Supabase triggers push updates to Redis Pub/Sub.
3.  **Broadcasting:** The Socket.io server listens to Redis and broadcasts the updated queue status immediately to all connected Receptionist clients.

---

## 🏗️ Core Components

### Frontend (Next.js App Router)
- **Patient Journey:**
  - `/patient`: Entry point, token generation.
  - `/patient/find`: Find existing tokens.
- **Receptionist Dashboard:**
  - `/receptionist`: Real-time queue view, patient calling, triage viewing.
- **Shared:**
  - `components/Providers.tsx`: Context providers for Auth and Socket.io.

### Backend Services
- **Supabase (PostgreSQL):** Persistent storage for Hospitals, Patients, Tokens, and Triage data.
- **Redis:** Manages fast-access queue state and Pub/Sub mechanism for Socket.io.
- **Groq AI:** Processes natural language triage descriptions into structured severity scores (`P1` - `P4`).

---

## 🔌 API Documentation

| Endpoint | Method | Payload Example | Description |
| :--- | :--- | :--- | :--- |
| `/api/tokens` | `POST` | `{ "hospitalId": "...", "patientId": "..." }` | Generates a new sequence number. |
| `/api/queue/call-next` | `POST` | `{ "hospitalId": "..." }` | Marks current patient as 'CALLED'. |
| `/api/triage` | `POST` | `{ "description": "..." }` | Returns AI-assigned severity. |
| `/api/tokens/[id]` | `GET` | N/A | Returns live status of a token. |

---

## 🔐 Authentication Flow
Authentication is managed via `next-auth` with a dual-role approach:
- **Patients:** Authenticated via Google OAuth.
- **Receptionists:** Authenticated via Credentials (Hospital Code + Admin Password).
- **Session Handling:** JWT-based session holding user role and relevant `patient_id` or `hospital_id`.

---

## 🚀 Deployment & Containerization
The project is built for scalable cloud environments using Docker and Kubernetes.

- **Docker:** Uses multi-stage builds for a minimal production footprint.
- **Kubernetes:** Manifests are located in `infrastructure/kubernetes/`, covering:
  - `deployment.yaml`: Application pods.
  - `service.yaml`: Internal load balancing.
  - `hpa.yaml`: Horizontal Pod Autoscaler based on CPU usage.

---

## ⚙️ Development Environment
Ensure you have the following in your `.env` (formerly `.env.local`):
```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
REDIS_URL=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GROQ_API_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

To start the dev stack:
```bash
docker compose up # Runs Redis and App
npm run dev       # Starts Next.js development server
```
