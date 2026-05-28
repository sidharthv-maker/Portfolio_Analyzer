from fastapi import FastAPI, BackgroundTasks
import yfinance as yf
import pandas as pd

app = FastAPI()

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
@app.get("/stock/{ticker}/1m")
def stock(ticker: str):
    stock = yf.Ticker(ticker)
    df = stock.history(period = "1mo")
    return {
        "ticker" : ticker,
        "prices" : df["Close"].tolist(),
        "dates" : df.index.strftime("%Y-%m-%d").tolist()
    }
@app.get("/stock/{ticker}/1d")
def stock(ticker: str):
    stock = yf.Ticker(ticker)
    df = stock.history(period = "1d")
    return {
        "ticker" : ticker,
        "prices" : df["Close"].tolist(),
        "dates" : df.index.strftime("%Y-%m-%d").tolist()
    }