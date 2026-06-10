# InstaAmbulance 🚑

```text
    ______________________
   /                      \
  |    INSTA AMBULANCE     |
   \______________________/
           |  |  |
        ___|__|__|___
       /  ___   ___  \
      |  /   \ /   \  |
      |  | 0 | | 0 |  |
      |  \___/ \___/  |
      |_______________|
         |         |
      ___|_________|___
     /                 \
    |___________________|
```

InstaAmbulance is a rapid hospital queuing application designed to minimize patient wait times by allowing token generation and triage before arrival.

## Project Structure

Our project follows a clean, modular structure centered around the `src/` directory.

```text
InstaAmbulance/
├── .next/                  # Build output
├── infrastructure/         # Kubernetes & Deployment configs
│   └── kubernetes/         # K8s manifests (deployment, svc, etc.)
├── public/                 # Static assets
├── src/                    # Source code
│   ├── app/                # Next.js App Router (pages/api)
│   ├── components/         # Reusable UI components
│   ├── database/           # Database schema & seed files
│   └── lib/                # Shared logic (auth, redis, supabase)
├── __tests__/              # Unit & Integration tests
├── .env.local              # Local environment variables
├── docker-compose.dev.yml  # Dev container orchestration
├── Dockerfile              # Production container definition
├── package.json            # Dependencies & scripts
└── tsconfig.json           # TypeScript configuration
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Run tests:**
   ```bash
   npx vitest run
   ```

## Built With

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** Vanilla CSS
- **Database:** Supabase
- **Caching:** Redis
- **Testing:** Vitest
- **AI:** [Groq API](https://console.groq.com/) (Triage + Switching)
- **Containerization:** Docker & Kubernetes
