import os
import re
import pickle
import numpy as np
import faiss
import openai
import requests
import json
import ast  # For Python code parsing
import markdown  # For Markdown parsing
import logging
import chardet

api_key = os.getenv("API_KEY7")

# Configure logging
logging.basicConfig(filename='cdm_rag.log', level=logging.INFO, format='%(asctime)s %(levelname)s:%(message)s')

def parse_cdm_files(cdm_dir):
    """
    Parses all relevant files in the CDM directory and extracts text into a list of dictionaries.
    Each dictionary contains 'text' and 'metadata'.
    """
    all_chunks = []

    for root, dirs, files in os.walk(cdm_dir):
        for file in files:
            file_path = os.path.join(root, file)
            if file.endswith(('.md', '.txt')):
                # Parse Markdown or text files
                print(f'Parsing text file: {file_path}')
                file_text = parse_text_file(file_path)
                chunks = chunk_text(file_text)
                for chunk in chunks:
                    all_chunks.append({
                        'text': chunk,
                        'metadata': {
                            'file_path': file_path,
                            'file_type': 'text'
                        }
                    })
            elif file.endswith('.py'):
                # Parse Python code files
                print(f'Parsing Python file: {file_path}')
                file_text = parse_python_file(file_path)
                chunks = chunk_text(file_text)
                for chunk in chunks:
                    all_chunks.append({
                        'text': chunk,
                        'metadata': {
                            'file_path': file_path,
                            'file_type': 'python'
                        }
                    })
            elif file.endswith('.rosetta'):
                # Parse Rosetta DSL files
                print(f'Parsing Rosetta DSL file: {file_path}')
                file_text = parse_rosetta_file(file_path)
                chunks = chunk_text(file_text)
                for chunk in chunks:
                    all_chunks.append({
                        'text': chunk,
                        'metadata': {
                            'file_path': file_path,
                            'file_type': 'rosetta'
                        }
                    })
            elif file.endswith(('.json', '.xml')):
                # Parse JSON and XML files
                print(f'Parsing data file: {file_path}')
                file_text = parse_data_file(file_path)
                chunks = chunk_text(file_text)
                for chunk in chunks:
                    all_chunks.append({
                        'text': chunk,
                        'metadata': {
                            'file_path': file_path,
                            'file_type': 'data'
                        }
                    })
            elif file.endswith(('.java', '.scala')):
                # Parse Java and Scala files
                print(f'Parsing code file: {file_path}')
                file_text = parse_code_file(file_path)
                chunks = chunk_text(file_text)
                for chunk in chunks:
                    all_chunks.append({
                        'text': chunk,
                        'metadata': {
                            'file_path': file_path,
                            'file_type': 'code'
                        }
                    })
            else:
                # Skip other file types
                continue

    print('CDM parsing completed.')
    return all_chunks

def parse_text_file(file_path):
    """
    Parses text or Markdown files.
    """
    with open(file_path, 'rb') as f:
        raw_data = f.read()
    result = chardet.detect(raw_data)
    encoding = result['encoding']
    confidence = result['confidence']
    if encoding is None or confidence < 0.7:
        print(f"Low confidence in encoding detection for {file_path}. Skipping file.")
        logging.warning(f"Low confidence in encoding detection for {file_path}.")
        return ''
    try:
        text = raw_data.decode(encoding)
    except UnicodeDecodeError as e:
        print(f"UnicodeDecodeError for file {file_path}: {e}")
        logging.error(f"UnicodeDecodeError for file {file_path}: {e}")
        return ''
    # Convert Markdown to plain text if necessary
    if file_path.endswith('.md'):
        html = markdown.markdown(text)
        text = re.sub('<[^<]+?>', '', html)  # Remove HTML tags
    return text

def parse_python_file(file_path):
    """
    Parses Python code files to extract docstrings and comments.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        code = f.read()

    code_text = ''
    try:
        parsed_code = ast.parse(code)
        for node in ast.walk(parsed_code):
            if isinstance(node, (ast.Module, ast.ClassDef, ast.FunctionDef)):
                docstring = ast.get_docstring(node)
                if docstring:
                    code_text += docstring + '\n'
    except SyntaxError as e:
        logging.error(f"Syntax error in file {file_path}: {e}")

    return code_text

def parse_rosetta_file(file_path):
    """
    Parses Rosetta DSL files to extract definitions and comments.
    """
    code_text = ''
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_comment = False
    for line in lines:
        stripped_line = line.strip()
        if stripped_line.startswith('/*'):
            in_comment = True
            code_text += stripped_line.lstrip('/*').strip() + '\n'
        elif '*/' in stripped_line:
            in_comment = False
            code_text += stripped_line.rstrip('*/').strip() + '\n'
        elif in_comment or stripped_line.startswith('//'):
            code_text += stripped_line.lstrip('//').strip() + '\n'
        else:
            # Extract entity and attribute definitions
            match = re.match(r'(type|entity)\s+(\w+)', stripped_line)
            if match:
                code_text += f'{match.group(1).capitalize()}: {match.group(2)}\n'

    return code_text

def parse_data_file(file_path):
    """
    Parses JSON or XML files to extract key-value pairs and elements.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Return raw content or implement a parser as needed
    return content

def parse_code_file(file_path):
    """
    Parses Java and Scala code files to extract comments and definitions.
    """
    code_text = ''
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_comment = False
    for line in lines:
        stripped_line = line.strip()
        if stripped_line.startswith('/*'):
            in_comment = True
            code_text += stripped_line.lstrip('/*').strip() + '\n'
        elif '*/' in stripped_line:
            in_comment = False
            code_text += stripped_line.rstrip('*/').strip() + '\n'
        elif in_comment or stripped_line.startswith('//'):
            code_text += stripped_line.lstrip('//').strip() + '\n'
        else:
            # Extract class and method names
            class_match = re.match(r'(public|private|protected)?\s*(class|interface)\s+(\w+)', stripped_line)
            if class_match:
                code_text += f'Class: {class_match.group(3)}\n'
            method_match = re.match(r'(public|private|protected)?\s*(static\s+)?[\w<>\[\]]+\s+(\w+)\s*\(.*\)', stripped_line)
            if method_match:
                code_text += f'Method: {method_match.group(3)}\n'

    return code_text

def chunk_text(text, max_length=700, overlap=70):
    """
    Splits text into chunks with overlap to maintain context.
    """
    tokens = text.split()
    chunks = []
    start = 0
    while start < len(tokens):
        end = start + max_length
        chunk = ' '.join(tokens[start:end])
        chunks.append(chunk)
        start += max_length - overlap
    return chunks

def get_embedding(text, model="text-embedding-3-large"):
    """
    Generates an embedding for the given text using OpenAI's API.
    """
    response = openai.Embedding.create(
        input=text,
        model=model
    )
    return response['data'][0]['embedding']

def generate_embeddings(chunks):
    """
    Generates embeddings for a list of text chunks.
    """
    embeddings = []
    for idx, chunk_data in enumerate(chunks):
        try:
            print(f'Processing chunk {idx + 1}/{len(chunks)}')
            embedding = get_embedding(chunk_data['text'])
            embeddings.append({
                'embedding': embedding,
                'metadata': chunk_data['metadata'],
                'text': chunk_data['text']
            })
        except Exception as e:
            logging.error(f"Error generating embedding for chunk {idx + 1}: {e}")
    return embeddings

def create_faiss_index(embeddings):
    """
    Creates a FAISS index from embedding vectors.
    """
    embedding_vectors = [np.array(e['embedding']).astype('float32') for e in embeddings]
    embedding_matrix = np.vstack(embedding_vectors)

    # Normalize embeddings
    faiss.normalize_L2(embedding_matrix)

    # Create a FAISS index
    embedding_dim = embedding_matrix.shape[1]
    index = faiss.IndexFlatIP(embedding_dim)  # Using Inner Product for cosine similarity

    # Add embeddings to the index
    index.add(embedding_matrix)

    print(f'Number of vectors in the index: {index.ntotal}')
    return index

def save_index_and_embeddings(index, embeddings, index_file='faiss_index.idx', embeddings_file='embeddings.pkl'):
    """
    Saves the FAISS index and embeddings with metadata to disk.
    """
    faiss.write_index(index, index_file)
    with open(embeddings_file, 'wb') as f:
        pickle.dump(embeddings, f)

def load_index_and_embeddings(index_file='faiss_index.idx', embeddings_file='embeddings.pkl'):
    """
    Loads the FAISS index and embeddings with metadata from disk.
    """
    index = faiss.read_index(index_file)
    with open(embeddings_file, 'rb') as f:
        embeddings = pickle.load(f)
    return index, embeddings

def embed_query(query, model="text-embedding-3-large"):
    """
    Generates an embedding for the query text.
    """
    response = openai.Embedding.create(
        input=query,
        model=model
    )
    return response['data'][0]['embedding']

def retrieve_chunks(query, index, embeddings, k=8):
    """
    Retrieves the most relevant text chunks for a given query.
    """
    query_embedding = embed_query(query)
    query_vector = np.array([query_embedding]).astype('float32')
    faiss.normalize_L2(query_vector)

    # Search the index
    distances, indices = index.search(query_vector, k)
    results = [embeddings[i] for i in indices[0]]

    return results

def generate_answer(query, relevant_chunks):
    """
    Generates an answer to the query using GPT-4 and the relevant context.
    """
    # Construct context from retrieved chunks
    context = ''
    for chunk in relevant_chunks:
        context += f"File: {chunk['metadata']['file_path']}\nContent:\n{chunk['text']}\n\n"

    prompt = f"""You are a CDM expert providing detailed and accurate answers.

Context:
{context}

Question:
{query}

Answer as thoroughly as possible based on the context provided."""

    # Use OpenAI's GPT-4 model
    response = openai.ChatCompletion.create(
        model='gpt-4o',
        messages=[
            {'role': 'system', 'content': 'You are a CDM expert providing detailed and accurate answers.'},
            {'role': 'user', 'content': prompt}
        ],
        temperature=0.1,  # Lower temperature for more precise answers
        max_tokens=4096
    )

    answer = response['choices'][0]['message']['content']
    return answer.strip()

def main():
    # Ask the user whether to update the RAG components
    update_rag = input("Do you want to update the RAG components with CDM data? (Y/n): ").strip().lower()

    if update_rag == 'y' or update_rag == '':
        # Paths and filenames
        cdm_dir = 'cdm_cloned'       # Directory containing the cloned CDM repository
        # Ensure that 'cdm_dir' points to the correct location of the cloned repo
        if not os.path.exists(cdm_dir):
            print(f"The directory '{cdm_dir}' does not exist. Please clone the CDM repository into this directory.")
            return

        # Step 1: Parse CDM files and extract text
        all_chunks = parse_cdm_files(cdm_dir)

        # Step 2: Generate embeddings
        embeddings = generate_embeddings(all_chunks)

        # Step 3: Create FAISS index
        index = create_faiss_index(embeddings)

        # Step 4: Save index and embeddings
        save_index_and_embeddings(index, embeddings)
    else:
        # Load index and embeddings
        index, embeddings = load_index_and_embeddings()
        print("Loaded existing FAISS index and embeddings.")

    # Step 5: Retrieve relevant chunks for a query
    user_query = input("Enter your question about CDM: ")
    relevant_chunks = retrieve_chunks(user_query, index, embeddings)
    print("\nRetrieved Chunks:")
    for i, chunk in enumerate(relevant_chunks):
        print(f"\nChunk {i + 1}:")
        print(f"File: {chunk['metadata']['file_path']}")
        print(f"Content:\n{chunk['text']}")

    # Step 6: Generate answer
    answer = generate_answer(user_query, relevant_chunks)
    print("\nAnswer:\n", answer)

if __name__ == "__main__":
    main()
