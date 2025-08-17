import os
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class RAGService:
    def __init__(self):
        # Initialize Google Gemini chat model
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
            temperature=0.3
        )
        
        # Initialize embeddings (same as document processor)
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
        
        # Custom prompt template
        self.prompt_template = PromptTemplate(
            template="""Use the following pieces of context to answer the question at the end.
            
            Context: {context}
            
            Question: {question}
            
            Answer:""",
            input_variables=["context", "question"]
        )
    
    def get_answer(self, vector_db, question):
        """Get answer for a single question using the vector database"""
        try:
            # Create retrieval chain
            qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=vector_db.as_retriever(search_kwargs={"k": 3}),
                chain_type_kwargs={"prompt": self.prompt_template}
            )
            
            # Get answer
            response = qa_chain.invoke({"query": question})
            return response["result"]
            
        except Exception as e:
            print(f"Error getting answer: {str(e)}")
            return f"Error processing question: {str(e)}"
    
    def get_answers_batch(self, vector_db, questions):
        """Get answers for multiple questions"""
        answers = []
        for question in questions:
            answer = self.get_answer(vector_db, question)
            answers.append(answer)
        return answers
