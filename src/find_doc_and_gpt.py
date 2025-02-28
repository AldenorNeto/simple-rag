from fastapi import FastAPI, HTTPException
from sentence_transformers import SentenceTransformer, util
from pydantic import BaseModel
from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()

with open("data/documents.json", "r") as file:
    documents = json.load(file)

model = SentenceTransformer('all-MiniLM-L6-v2')
doc_embeddings = {
  doc['id']: model.encode(doc['text'], convert_to_tensor=True) for doc in documents
}

class Query(BaseModel):
  query: str

def find_best_doc(query: str):
    query_embedding = model.encode(query, convert_to_tensor=True)
    best_doc = {}
    best_score = float("-inf")

    for doc in documents:
        score = util.cos_sim(query_embedding, doc_embeddings[doc['id']])
        if score > best_score:
            best_score = score
            best_doc = doc
    return best_doc

@app.post("/basic")
def basic_search(request: Query):
    best_doc = find_best_doc(request.query)
    return {"message": best_doc.get('text')}

@app.post("/with-gpt")
def gpt_search(request: Query):
    best_doc = find_best_doc(request.query)
    
    prompt = f"""Você é um assistente útil. Responda à pergunta usando APENAS o contexto fornecido:
    Contexto: {best_doc.get('text')}
    Pergunta: {request.query}
    Resposta:"""
    
    try:
        res = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é um assistente útil que responde com base no contexto fornecido."},
                {"role": "user", "content": prompt}
            ]
        )
        return {"message": res.choices[0].message.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))