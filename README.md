# RAG Pipeline - Document Q&A System

This is a Retrieval-Augmented Generation (RAG) pipeline that can process documents from URLs and answer questions based on their content.

## Features

- **REST API Endpoint**: `/hackrx/run` for processing documents and answering questions
- **Web UI**: Simple interface for testing the RAG pipeline
- **Document Support**: PDF and text files from URLs
- **Bearer Token Authentication**: API key-based authentication
- **Multiple Questions**: Process multiple questions in a single request

## Quick Start

### 1. Setup Environment

```bash
# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

### 2. Configure OpenAI API

Edit the `.env` file and add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Application

**Windows:**

```bash
start.bat
```

**Linux/Mac:**

```bash
chmod +x start.sh
./start.sh
```

**Manual:**

```bash
python app.py
```

The application will start on `http://localhost:5000`

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
curl -X POST http://localhost:5000/hackrx/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-key-12345" \
  -d '{
    "documents": "https://hackrx.blob.core.windows.net/assets/policy.pdf?sv=2023-01-03&st=2025-07-04T09%3A11%3A24Z&se=2027-07-05T09%3A11%3A00Z&sr=b&sp=r&sig=N4a9OU0w0QXO6AOIBiu4bpl7AXvEZogeT%2FjUHNO7HzQ%3D",
    "questions": [
      "What is the grace period for premium payment?",
      "What is the waiting period for pre-existing diseases?"
    ]
  }'
```

## Web Interface

Visit `http://localhost:5000` to access the web interface where you can:

1. Enter a document URL
2. Add your API key
3. Enter questions (one per line)
4. Get answers instantly

## Project Structure

```
finserv RAG/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
├── start.sh / start.bat       # Startup scripts
├── templates/
│   └── index.html             # Web UI
├── utils/
│   ├── document_processor.py  # Document processing logic
│   ├── rag_service.py         # RAG service implementation
│   ├── questioningDocuments.py # Original questioning logic
│   └── storingDocuments.py    # Original document storage logic
└── scripts/
    └── main.py                # Test script
```

## API Authentication

For development, any API key is accepted. In production, implement proper API key validation in the `/hackrx/run` endpoint.

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad Request (missing required fields)
- `401`: Unauthorized (invalid/missing API key)
- `500`: Internal Server Error

## Dependencies

- Flask: Web framework
- LangChain: RAG pipeline framework
- Google Gemini: Language model API (replaced OpenAI)
- FAISS: Vector database (replaced ChromaDB - no gRPC issues!)
- PyPDF: PDF processing
- python-dotenv: Environment variables

## Notes

- Documents are processed in memory using FAISS vector store
- Each request creates a new vector database for the provided document
- The system supports both PDF and text documents
- **No more gRPC timeout issues** - ChromaDB has been replaced with FAISS
- Maximum document size depends on available memory and Google API token limits
