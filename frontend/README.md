# QueryForge Frontend (Next.js)

A modern Next.js + Tailwind CSS interface for your Django RAG backend, with Clerk auth and animated components.

## Setup

1. Create `.env.local` in this folder:

```
NEXT_PUBLIC_API_BASE=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

If you don't want to wire Clerk yet, you can leave those unset and paste a token in the UI. For dev, backend accepts API_KEY.

2. Install and run:

```
npm install
npm run dev
```

Open http://localhost:3000.

## Notes

- Uses Clerk JWT when signed in, falls back to manual token field.
- Uploads file via POST /hackrx/run-file using multipart/form-data.
- Minimal animations via framer-motion; you can add aceternityUI or reactbits as desired.
