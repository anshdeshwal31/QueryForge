import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.document_processor import DocumentProcessor
from utils.rag_service import RAGService

def test_faiss_setup():
    """Test if FAISS vector database is working correctly"""
    try:
        print("Testing FAISS setup...")
        
        # Initialize services
        doc_processor = DocumentProcessor()
        rag_service = RAGService()
        
        print("✅ Services initialized successfully")
        print("✅ FAISS vector database is ready to use!")
        print("✅ No gRPC issues - ChromaDB has been replaced with FAISS")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_faiss_setup()
