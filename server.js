const express = require('express');
const { pipeline, cos_sim } = require('@xenova/transformers');
const OpenAI = require('openai');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

let documents;
let model;
let docEmbeddings = {};

async function initializeApp() {
  // Carrega documentos
  documents = JSON.parse(fs.readFileSync('data/documents.json', 'utf8'));
  
  // Inicializa modelo de embeddings
  model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  
  // Gera embeddings dos documentos
  for (const doc of documents) {
    const embedding = await model(doc.text, { pooling: 'mean', normalize: true });
    docEmbeddings[doc.id] = embedding.data;
  }
  
  console.log('Modelo inicializado com sucesso!');
}

function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function findBestDoc(query) {
  const queryEmbedding = await model(query, { pooling: 'mean', normalize: true });
  
  let bestDoc = {};
  let bestScore = -Infinity;
  
  for (const doc of documents) {
    const score = cosineSimilarity(queryEmbedding.data, docEmbeddings[doc.id]);
    if (score > bestScore) {
      bestScore = score;
      bestDoc = doc;
    }
  }
  
  return bestDoc;
}

app.post('/basic', async (req, res) => {
  try {
    const { query } = req.body;
    const bestDoc = await findBestDoc(query);
    res.json({ message: bestDoc.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/with-gpt', async (req, res) => {
  try {
    if (!openai) {
      return res.status(400).json({ error: 'OpenAI API key não configurada' });
    }
    
    const { query } = req.body;
    const bestDoc = await findBestDoc(query);
    
    const prompt = `Você é um assistente útil. Responda à pergunta usando APENAS o contexto fornecido:
    Contexto: ${bestDoc.text}
    Pergunta: ${query}
    Resposta:`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Você é um assistente útil que responde com base no contexto fornecido.' },
        { role: 'user', content: prompt }
      ]
    });
    
    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8000;

initializeApp().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://127.0.0.1:${PORT}`);
  });
});