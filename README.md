# Projeto de Busca com RAG (Retrieval-Augmented Generation)

Este projeto é um exemplo simples de um sistema de busca que usa **RAG (Retrieval-Augmented Generation)**. Ele combina uma etapa de recuperação de informações (retrieval) com uma etapa de geração de texto (generation) usando GPT.

---

## Como funciona?

1. **Recuperação (Retrieval)**:
   - O sistema busca o documento mais relevante no arquivo `documents.json` com base na consulta do usuário.
   - Para isso, ele usa embeddings de texto (vetores que representam o significado do texto) e calcula a similaridade entre a consulta e os documentos.
2. **Geração (Generation)**:
   - Se a rota com GPT for usada, o sistema envia o documento recuperado para o GPT-3.5, que gera uma resposta com base no contexto fornecido.

---

## Como rodar o projeto?

### Pré-requisitos

- Python 3.12 ou superior.
- Uma chave da OpenAI (apenas se quiser usar a rota com GPT).

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-projeto.git
   ```

2. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

3. Configure o arquivo `.env`:
   - Crie um arquivo `.env` na raiz do projeto e adicione sua chave da OpenAI:
     ```plaintext
     OPENAI_API_KEY=sua_chave_aqui
     ```
   - Se não quiser usar a rota com GPT, ignore essa etapa.
4. Execute o projeto:

   ```bash
   python main.py
   ```

5. Acesse a API em `http://127.0.0.1:8000`.

---

## Rotas disponíveis

### 1. **Rota básica (`/basic`)**:

- **Método**: POST
- **Descrição**: Retorna o texto do documento mais relevante sem usar GPT.
- **Exemplo de requisição**:
  ```bash
  curl -X POST "http://127.0.0.1:8000/basic" -H "Content-Type: application/json" -d '{"query": "What is the moon made of?"}'
  ```
- **Resposta**:
  ```json
  {
    "message": "The moon is made entirely of cheese, but NASA keeps it a secret to avoid a global cheese shortage."
  }
  ```

### 2. **Rota com GPT (`/with-gpt`)**:

- **Método**: POST
- **Descrição**: Retorna uma resposta gerada pelo GPT-3.5 com base no documento mais relevante.
- **Requer**: Chave da OpenAI no arquivo `.env`.
- **Exemplo de requisição**:
  ```bash
  curl -X POST "http://127.0.0.1:8000/with-gpt" -H "Content-Type: application/json" -d '{"query": "Why do polar bears wear sunglasses?"}'
  ```
- **Resposta**:
  ```json
  {
    "message": "Polar bears wear sunglasses at night to protect their eyes from the glare of the Northern Lights, which are actually disco lights for penguins."
  }
  ```

### 3. **Documentação automática (`/docs` e `/redoc`)**:

- **Método**: GET
- **Descrição**: Interface interativa gerada automaticamente pela FastAPI para explorar e testar as rotas disponíveis.
- **Acesse em**:
  - `http://127.0.0.1:8000/docs` (Swagger UI)
  - `http://127.0.0.1:8000/redoc` (ReDoc UI)

---

## O que é RAG?

RAG (**Retrieval-Augmented Generation**) é uma técnica que combina:

1. **Recuperação (Retrieval)**: Busca informações relevantes em um conjunto de documentos.
2. **Geração (Generation)**: Usa um modelo de linguagem (como GPT) para gerar uma resposta com base nas informações recuperadas.

Neste projeto:

- A **recuperação** é feita comparando a consulta do usuário com os documentos em `documents.json`.
- A **geração** é opcional e usa o GPT-3.5 para criar uma resposta mais elaborada.

---

## Limitações

1. **Rota básica (`/basic`)**:
   - Retorna apenas o texto do documento mais relevante, sem nenhuma adaptação ou explicação adicional.
2. **Rota com GPT (`/with-gpt`)**:
   - Depende de uma chave da OpenAI.
   - Pode gerar respostas incorretas ou exageradas se o documento recuperado for impreciso.

---

## Estrutura do projeto

```
|-- data/
|   |-- documents.json          # Arquivo com os documentos
|-- src/
|   |-- find_doc_and_gpt.py     # Código principal da API
|   |-- __init__.py             # Transforma a pasta em um pacote Python
|-- main.py                     # Ponto de entrada do projeto
|-- requirements.txt            # Dependências do projeto
|-- .env                        # Chave da OpenAI (opcional)
|-- README.md                   # Esta documentação
```
