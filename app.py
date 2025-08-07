from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import requests
import tempfile
from dotenv import load_dotenv
from utils.document_processor import DocumentProcessor
from utils.rag_service import RAGService
import warnings

# Load environment variables
load_dotenv()

# Suppress gRPC warnings and reduce verbosity
os.environ["GRPC_VERBOSITY"] = "ERROR"
warnings.filterwarnings("ignore", message=".*grpc.*")

app = Flask(__name__)
CORS(app)

# Initialize services
document_processor = DocumentProcessor()
rag_service = RAGService()

# Simple single token verification
VALID_API_TOKEN = os.getenv("API_KEY", "demo-key-12345")

@app.route('/', methods=['GET'])
def index():
    """Serve the main UI page"""
    return render_template('index.html')

@app.route('/hackrx/run', methods=['POST'])
def run_rag():
    """Main RAG endpoint that processes documents and answers questions"""
    try:
        # Check authorization
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        
        # Extract API key
        api_key = auth_header.split(' ')[1]
        
        # Simple token validation - check if token exists in our valid tokens set
        if api_key != VALID_API_TOKEN:
            return jsonify({"error": "Invalid API key"}), 401
        
        print(f"Authentication successful with token: {api_key}")
        
        # Get request data
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON in request body"}), 400
        
        documents_url = data.get('documents')
        questions = data.get('questions', [])
        
        if not documents_url or not questions:
            return jsonify({"error": "Both 'documents' and 'questions' are required"}), 400
        
        # Download and process the document
        print(f"Processing document from: {documents_url}")
        vector_db = document_processor.process_document_from_url(documents_url)
        
        # Generate answers for all questions
        answers = []
        for question in questions:
            print(f"Processing question: {question}")
            answer = rag_service.get_answer(vector_db, question)
            answers.append(answer)
        
        return jsonify({"answers": answers})
    
    except Exception as e:
        print(f"Error in run_rag: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "RAG service is running"})

if __name__ == '__main__':
    # Ensure required directories exist
    os.makedirs('utils/db', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
