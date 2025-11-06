# Projeto RAG em Node.js

Versão Node.js do sistema de busca com RAG (Retrieval-Augmented Generation).

## Como rodar

### Pré-requisitos
- Node.js 18+ 
- Chave OpenAI (opcional, apenas para rota `/with-gpt`)

### Instalação

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure o arquivo `.env` (se quiser usar GPT):
   ```plaintext
   OPENAI_API_KEY=sua_chave_aqui
   ```

3. Execute o servidor:
   ```bash
   npm start
   ```
   
   Ou para desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse em `http://127.0.0.1:8000`

## Rotas

### POST `/basic`
Retorna o documento mais relevante sem GPT.

```bash
curl -X POST "http://127.0.0.1:8000/basic" \
  -H "Content-Type: application/json" \
  -d '{"query": "What is the moon made of?"}'
```

### POST `/with-gpt`
Retorna resposta gerada pelo GPT com base no documento mais relevante.

```bash
curl -X POST "http://127.0.0.1:8000/with-gpt" \
  -H "Content-Type: application/json" \
  -d '{"query": "Why do polar bears wear sunglasses?"}'
```

## Diferenças da versão Python

- Usa `@xenova/transformers` em vez de `sentence-transformers`
- Express.js em vez de FastAPI
- Implementação manual da similaridade cosseno
- Inicialização assíncrona do modelo