import os

from dotenv import load_dotenv
from langchain.vectorstores import Chroma  # ✅ Corrected import path
from langchain_core.messages import HumanMessage, SystemMessage
from langchain.chat_models import ChatOpenAI
from langchain.embeddings.openai import OpenAIEmbeddings
from .storingDocuments import creatingVectorDB

# Load environment variables from .env
load_dotenv()

def QuestioningTheDB():
    
    creatingVectorDB()
    
    # Define the persistent directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    persistent_directory = os.path.join(
        current_dir, "db", "chroma_db_with_metadata")

    # Define the embedding model
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    # Load the existing vector store with the embedding function
    db = Chroma(persist_directory=persistent_directory,
                embedding_function=embeddings)

    # Define the user's question
    query = "What does dracula fear the most?"

    # Retrieve relevant documents based on the query
    retriever = db.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3},
    )
    relevant_docs = retriever.invoke(query)

    # Display the relevant results with metadata
    print("\n--- Relevant Documents ---")
    for i, doc in enumerate(relevant_docs, 1):
        print(f"Document {i}:\n{doc.page_content}\n")

    # Combine the query and the relevant document contents
    combined_input = (
        "Here are some documents that might help answer the question: "
        + query
        + "\n\nRelevant Documents:\n"
        + "\n\n".join([doc.page_content for doc in relevant_docs])
        + "\n\nPlease provide a rough answer based only on the provided documents. If the answer is not found in the documents, respond with 'I'm not sure'."
    )

    # Create a ChatOpenAI model
    model = ChatOpenAI(model="gpt-4o")

    # Define the messages for the model
    messages = [
        SystemMessage(content="You are a helpful assistant."),
        HumanMessage(content=combined_input),
    ]

    # Invoke the model with the combined input
    result = model.invoke(messages)

    # Display the full result and content only
    print("\n--- Generated Response ---")
    # print("Full result:")
    # print(result)
    print("Content only:")
    print(result.content)