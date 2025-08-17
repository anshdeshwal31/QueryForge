# QueryForge - RAG Pipeline Document Q&A System

This is a Retrieval-Augmented Generation (RAG) pipeline that processes documents from URLs and answers questions based on their content.

## Features

- **REST API Endpoint**: `/hackrx/run` for processing documents and answering questions
- **Web UI**: Next.js frontend for testing the RAG pipeline
- **Document Support**: PDF and text files from URLs
- **Bearer Token Authentication**: API key-based authentication
- **Multiple Questions**: Process multiple questions in a single request

## Project Structure

```
QueryForge/
├── frontend/         # Next.js frontend (deployed separately)
├── queryforge/       # Django project configuration
├── rag_api/          # Main Django app with API logic
├── manage.py         # Django management script
├── requirements.txt  # Python dependencies
├── .env.example      # Example environment variables
└── ...
```

## Quick Start

### 1. Backend Setup (Django)

```bash
# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env and add your API keys (e.g., GOOGLE_API_KEY, DJANGO_SECRET_KEY)
```

### 2. Run the Backend

```bash
python manage.py migrate
python manage.py runserver
```

The backend will start at `http://localhost:8000`

### 3. Frontend Setup (Next.js)

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:3000`

## API Usage

### Endpoint: `POST /hackrx/run`

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <your-api-key>
```

**Request Body:**

```json
{
  "documents": "https://example.com/document.pdf",
  "questions": [
    "What is the main topic of this document?",
    "Are there any specific requirements mentioned?"
  ]
}
```

**Response:**

```json
{
  "answers": [
    "The main topic of this document is...",
    "Yes, the specific requirements mentioned are..."
  ]
}
```

### Example with cURL

```bash
curl -X POST http://localhost:8000/hackrx/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-api-key>" \
  -d '{"documents": "https://example.com/document.pdf", "questions": ["What is the main topic of this document?"]}'
```

## Web Interface

- Access the web UI at `http://localhost:3000` after starting the frontend.

## API Authentication

- All API requests require a Bearer token in the `Authorization` header.

## Error Handling

- The API returns appropriate error messages for invalid input, authentication errors, or processing failures.

## Dependencies

- Python 3.x
- Django
- Other dependencies listed in `requirements.txt`
- Node.js (for frontend)
- Next.js (for frontend)

## Notes

- Do **not** commit your `.env` file or virtual environment folders.
- For deployment, deploy the backend (Django) and frontend (Next.js) separately.
