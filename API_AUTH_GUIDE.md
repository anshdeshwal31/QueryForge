# API Authentication Guide

## Available API Keys

Your RAG pipeline now supports multiple authentication methods:

### 1. Static API Keys (Ready to use)

- `demo-key-12345` - Demo key for testing
- `test-api-key-2024` - Test key
- `hackrx-api-key-123` - HackRX specific key
- `super-secret-master-key-2024` - Master key (from .env file)

### 2. JWT Tokens (Dynamic, with expiration)

- Generate temporary tokens using the master key
- Tokens expire after specified time (default: 24 hours)

## How to Use

### Option 1: Use Static Keys (Simplest)

**For testing with curl:**

```bash
curl -X POST http://localhost:5000/hackrx/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-key-12345" \
  -d '{
    "documents": "your-document-url",
    "questions": ["Your question here"]
  }'
```

**For the web UI:**

- Use any of the static keys in the API key field
- Example: `demo-key-12345`

### Option 2: Generate JWT Tokens

**Step 1: Generate a token**

```bash
curl -X POST http://localhost:5000/generate-token \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer super-secret-master-key-2024" \
  -d '{
    "user_id": "test_user",
    "expires_in_hours": 24
  }'
```

**Step 2: Use the returned token**

```bash
curl -X POST http://localhost:5000/hackrx/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "documents": "your-document-url",
    "questions": ["Your question"]
  }'
```

## Valid Endpoints

1. **POST /hackrx/run** - Main RAG endpoint (requires authentication)
2. **GET /health** - Health check (no authentication required)
3. **POST /generate-token** - Generate JWT token (requires master key)
4. **GET /** - Web UI (no authentication required)

## Environment Variables

Make sure these are set in your `.env` file:

```
GOOGLE_API_KEY=your_google_api_key_here
MASTER_API_KEY=super-secret-master-key-2024
JWT_SECRET=your-super-secret-jwt-key-2024
```

## Security Notes

- In production, use strong, randomly generated keys
- JWT tokens automatically expire
- Static keys are good for testing, JWT tokens for production
- The master key can generate new JWT tokens
- All API keys are case-sensitive
