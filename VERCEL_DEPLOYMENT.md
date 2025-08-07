# Vercel Deployment Guide

## Steps to Deploy on Vercel Dashboard

### 1. **Prepare Your GitHub Repository**

1. Create a new repository on GitHub
2. Push your RAG project to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### 2. **Deploy on Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Sign in with your GitHub account
3. Click **"New Project"**
4. **Import** your GitHub repository
5. Vercel will automatically detect it's a Python project

### 3. **Configure Environment Variables**

In the Vercel deployment settings, add these environment variables:

| Name             | Value                                             |
| ---------------- | ------------------------------------------------- |
| `GOOGLE_API_KEY` | Your Google Gemini API key                        |
| `API_KEY`        | Your custom API key (e.g., `hackrx-api-key-2025`) |

### 4. **Deploy**

1. Click **"Deploy"**
2. Wait for deployment to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## API Usage After Deployment

### Test with cURL:

```bash
curl -X POST https://your-project-name.vercel.app/hackrx/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer hackrx-api-key-2025" \
  -d '{
    "documents": "https://example.com/document.pdf",
    "questions": ["What is this document about?"]
  }'
```

### Test with the UI:

Visit: `https://your-project-name.vercel.app`

## File Structure for Vercel:

```
├── api/
│   └── index.py          # Vercel serverless entry point
├── utils/
│   ├── document_processor.py
│   └── rag_service.py
├── templates/
│   └── index.html
├── app.py                # Main Flask app
├── vercel.json           # Vercel configuration
├── requirements.txt      # Python dependencies
└── .vercelignore        # Files to ignore during deployment
```

## Important Notes:

- **Serverless**: Each request runs in a new serverless function
- **Cold starts**: First requests may be slower
- **Timeouts**: Max 30 seconds per request (configurable)
- **Environment variables**: Set in Vercel dashboard, not in .env files

## Troubleshooting:

1. **Build errors**: Check the build logs in Vercel dashboard
2. **Runtime errors**: Check function logs in Vercel dashboard
3. **Environment variables**: Ensure they're set correctly in Vercel settings
