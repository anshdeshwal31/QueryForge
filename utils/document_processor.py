import os
import requests
import tempfile
from urllib.parse import urlparse
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

class DocumentProcessor:
    def __init__(self):
        # Initialize Google Generative AI embeddings
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
    
    def process_document_from_url(self, url):
        """Download PDF from URL and process it into a vector database"""
        try:
            # Download the PDF
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # Save to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
                tmp_file.write(response.content)
                tmp_file_path = tmp_file.name
            
            # Load and process the PDF
            loader = PyPDFLoader(tmp_file_path)
            documents = loader.load()
            
            # Split documents into chunks
            splits = self.text_splitter.split_documents(documents)
            
            print(f"Document processed: {len(splits)} chunks created")
            
            # Create vector database using FAISS (no gRPC issues)
            vector_db = FAISS.from_documents(
                documents=splits,
                embedding=self.embeddings
            )
            
            # Clean up temporary file
            os.unlink(tmp_file_path)
            
            return vector_db
            
        except Exception as e:
            print(f"Error processing document: {str(e)}")
            raise e
