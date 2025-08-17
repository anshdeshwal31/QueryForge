import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.questioningDocuments import QuestioningTheDB

def main():
    """
    Test function for the RAG pipeline
    """
    print("Testing RAG Pipeline...")
    QuestioningTheDB()

if __name__ == "__main__":
    main()