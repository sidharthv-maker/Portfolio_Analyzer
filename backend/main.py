from fastapi import FastAPI, BackgroundTasks
import yfinance as yf
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from scipy.stats import linregress
import math
def safe(val):
    if val is None or math.isnan(val) or math.isinf(val):
        return None
    return float(val)

app = FastAPI()

app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:5173"],allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def root():
    return {"message" : "works"}

@app.get("/stock/{ticker}")
def stock(ticker: str, period:str = "1y"):
    stock = yf.Ticker(ticker)
    sap = yf.Ticker("^GSPC")
    df1 = sap.history(period)
    df1.index = pd.to_datetime(df1.index)
    bhelp = df1["Close"].pct_change().dropna()
    df = stock.history(period)
    df.index = pd.to_datetime(df.index)
    returns = df["Close"].pct_change().dropna()
    combined = pd.concat([returns, bhelp], axis=1).dropna()
    if len(combined) < 30:
        beta = None
    else:
        res = linregress(combined.iloc[:, 0], combined.iloc[:, 1])
        beta = safe(res.slope)
    volatility = np.std(returns, ddof=1) * (252 ** 0.5)
    return {
        "ticker" : ticker,
        "prices" : df["Close"].tolist(),
        "dates" : df.index.strftime("%Y-%m-%d").tolist(),
        "Volatility" : volatility,
        "Sharpe_Ratio":(np.mean(returns) * 252 - 0.04)/volatility,
        "Beta" : beta
    }

@app.get("/multi")
def get_stocks(tickers: str, period: str = "1y"):
    lst = tickers.split(",")
    dic = {}
    for ticker in lst:
        df = yf.Ticker(ticker).history(period = period)
        clos = df["Close"].tolist()
        normalised = (df["Close"]/df["Close"].iloc[0])*100
        dic[ticker] = {
            "date" : df.index.strftime("%Y-%m-%d").tolist(),
            "price": normalised.tolist()
            }
    return dic

@app.get("/corel")
def get_corel(tickers: str, period: str = "1y"):
    lst = tickers.split(",")
    dic = {}
    for ticker in lst:
        df = yf.Ticker(ticker).history(period = period)
        clos = df["Close"].tolist()
        dic[ticker] = clos
    dframe = pd.DataFrame(dic)
    ans = dframe.corr()
    return ans.to_dict()
