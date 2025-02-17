# OpenAI Embedding Demo

This demo program uses the OpenAI APIs to generate embeddings for text and perform semantic search.

## OpenAI API

This project uses the OpenAI API. You need to create an account and get an API key to use the API. Consult the [quick start guide](https://platform.openai.com/docs/quickstart) for instructions.

## AccuWeather API

We will be using AccuWeather developer services to obtain weather forecasts. AccuWeather is an American company that offers international weather forecasting services. Go to the [AccuWeather API](https://developer.accuweather.com/) website and create a free account. Following this, you should register a new application to obtain an API key.

## Run locally

Clone the repository and install the dependencies.

```bash
cd openai-function-call
npm install
```

Create a `.env.local` file in the project root and add the following content.

```plaintext
OPENAI_API_KEY=sk-...
ACCUWEATHER_API_KEY=...
```

Finally, run the following command to start the frontend development server.

```bash
npm run start
```
