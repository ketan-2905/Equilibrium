---
title: Equilibrium-Backend
emoji: ⚖️
colorFrom: indigo
colorTo: slate
sdk: docker
app_port: 7860
pinned: false
---

# Equilibrium: Financial Risk Intelligence Backend

This directory contains the core simulation engine and API for **Equilibrium**, a platform designed for systemic risk analysis and financial network stress testing.

## 🚀 Overview
The backend is a high-performance **FastAPI** application that combines real-time market data with advanced mathematical models to calculate systemic risk. It is designed to be deployed as a standalone container or on serverless platforms like Hugging Face Spaces.

## 🧠 Core Technologies
- **Simulation Engine**: Custom Python implementation of systemic risk models (using Log-Returns and Correlation matrices).
- **AI / Machine Learning**: Integrated **TensorFlow-CPU** neural network for predicting systemic payoff ($S_t$).
- **Market Data**: Real-time ticker resolution and historical data fetching via **Yahoo Finance (yfinance)**.
- **NLP / News**: Synthetic news generation for "News-Driven Cascades" using **Groq (Llama 3.3)**.
- **Containerization**: Optimized **Docker** configuration with a minimal footprint for cloud deployment.

## 📡 API Endpoints

### `POST /simulate`
The primary engine endpoint.
- **Input**: A list of tickers, shock magnitudes, and network connectivity parameters.
- **Output**: Cascading failure analysis, predicted systemic risk percentage, and node congestion scores.

### `POST /api/news/default`
Generates context-aware breaking news for a default event.
- **Input**: Bank ticker and default magnitude.
- **Output**: AI-generated headline and summary for the simulation dashboard.

### `GET /api/balance-sheet/{ticker}`
Synthesizes institutional balance sheet data based on live market capitalization.

## 🛠️ Environment Variables
Ensure the following are set in your `.env` file or cloud secrets:
```env
GROQ_API_KEY=your_key_here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📦 Deployment
The backend is ready for one-click deployment to Hugging Face Spaces:
1. Ensure `Dockerfile` and `requirements.txt` are up to date.
2. The server runs on port `7860` for compatibility with HF Spaces.
3. Add your `GROQ_API_KEY` to the HF Space **Secrets**.

## 🏗️ Local Setup
1. Create a virtual environment: `python -m venv .venv`
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `uvicorn app:app --reload --port 8000`
