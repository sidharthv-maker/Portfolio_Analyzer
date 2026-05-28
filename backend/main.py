from fastapi import FastAPI, BackgroundTasks
import yfinance as yf
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:5173"])

@app.get("/")
def root():
    return {"message" : "works"}

@app.get("/stock/{ticker}/1y")
def stock(ticker: str):
    stock = yf.Ticker(ticker)
    df = stock.history(period = "1y")
    return {
        "ticker" : ticker,
        "prices" : df["Close"].tolist(),
        "dates" : df.index.strftime("%Y-%m-%d").tolist()
    }
