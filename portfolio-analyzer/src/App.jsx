import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './index.css'

const COLORS = [
  '#2563eb', '#16a34a', '#dc2626', '#d97706', '#7c3aed',
  '#db2777', '#0891b2', '#65a30d', '#ea580c', '#6366f1',
  '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4',
  '#84cc16', '#f97316', '#ec4899', '#10b981', '#3b82f6'
]

// Maximum number of stocks that can be compared at once
const MAX_STOCKS = 20

function SingleStock({ onBack }) {
  const [ticker, setTicker] = useState('')
  const [resp, setResp] = useState(null)
  const [period, setPeriod] = useState('')
  const [chartData, setChartData] = useState([])
  useEffect(() => {
    if (ticker === '' || period === '') return
    fetch(`http://localhost:8000/stock/${ticker}?period=${period}`)
      .then(r => r.json())
      .then(data => {
        setResp(data)
        setChartData(data.dates.map((date, index) => ({
          date: date,
          price: data.prices[index]
        })))
      })
  }, [ticker, period])

  return (
    <div className="app">
      <div className="card">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <header className="app-header">
          <h1>Analyze One Stock</h1>
          <p className="subtitle">
            Price history and risk metrics for any ticker
          </p>
        </header>

        <div className="controls">
          <input
            className="ticker-input"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter ticker e.g. AAPL"
          />
          <div className="period-group">
            <button
              className={`period-btn${period === '1y' ? ' active' : ''}`}
              onClick={() => setPeriod('1y')}
            >
              1 Year
            </button>
            <button
              className={`period-btn${period === '1mo' ? ' active' : ''}`}
              onClick={() => setPeriod('1mo')}
            >
              1 Month
            </button>
            <button
              className={`period-btn${period === '1d' ? ' active' : ''}`}
              onClick={() => setPeriod('1d')}
            >
              1 Day
            </button>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 10, right: 24, left: 8, bottom: 24 }}>
                <XAxis
                  dataKey="date"
                  label={{ value: 'Date', position: 'insideBottom', offset: -12 }}
                />
                <YAxis
                  label={{
                    value: 'Price',
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {resp && (
          <div className="metrics">
            <div className="metric">
              <span className="metric-label">Volatility</span>
              <span className="metric-value">{resp.Volatility}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Sharpe Ratio</span>
              <span className="metric-value">{resp.Sharpe_Ratio}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Beta</span>
              <span className="metric-value">{resp.Beta}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
function Portfolio({ onBack }) {
  const [lst, setLst] = useState([])
  const [ticker, setTicker] = useState('')
  const [period, setPeriod] = useState('')
  const [portfolioData, setPortfolioData] = useState(null)
  const [chartData, setChartData] = useState([])
  useEffect(()=>{
    if(lst.length === 0 || period === '') return
    fetch(`http://localhost:8000/multi?tickers=${lst.join(",")}&period=${period}`)
      .then(r => r.json())
      .then(data=>{
        console.log(data)
        setPortfolioData(data)
        const tickers = Object.keys(data)
        const dates = data[tickers[0]].date
        const chartData = dates.map((date, i) => {
          const point = { date }
          tickers.forEach(t => {
            point[t] = data[t].price[i]
          })
          return point
        })
        setChartData(chartData)
      })
  }, [lst, period])

  const addTicker = () => {
    const t = ticker.trim()
    if (t === '' || lst.includes(t) || lst.length >= MAX_STOCKS) return
    setLst([...lst, t])
    setTicker('')
  }

  return (
    <div className="app">
      <div className="card">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <header className="app-header">
          <h1>Check Your Portfolio</h1>
          <p className="subtitle">
            Compare the normalized performance of multiple stocks
          </p>
        </header>

        <div className="controls">
          <input
            className="ticker-input"
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter ticker e.g. AAPL"
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTicker()
            }}
          />
          <button
            className="add-btn"
            onClick={addTicker}
            disabled={lst.length >= MAX_STOCKS}
          >
            Add
          </button>
          <span className="limit-hint">{lst.length}/{MAX_STOCKS}</span>
          <div className="period-group">
            <button
              className={`period-btn${period === '1y' ? ' active' : ''}`}
              onClick={() => setPeriod('1y')}
            >
              1 Year
            </button>
            <button
              className={`period-btn${period === '1mo' ? ' active' : ''}`}
              onClick={() => setPeriod('1mo')}
            >
              1 Month
            </button>
            <button
              className={`period-btn${period === '1d' ? ' active' : ''}`}
              onClick={() => setPeriod('1d')}
            >
              1 Day
            </button>
          </div>
        </div>

        {lst.length > 0 && (
          <div className="chip-list">
            {lst.map((t) => (
              <span className="chip" key={t}>
                {t}
                <button
                  className="chip-remove"
                  onClick={() => setLst(lst.filter(x => x !== t))}
                  aria-label={`Remove ${t}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {chartData.length > 0 && portfolioData && (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 10, right: 24, left: 8, bottom: 24 }}>
                <XAxis
                  dataKey="date"
                  label={{ value: 'Date', position: 'insideBottom', offset: -12 }}
                />
                <YAxis
                  label={{
                    value: 'Norm. Performance',
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip />
                {Object.keys(portfolioData).map((t, i) => (
                  <Line
                    key={t}
                    type="monotone"
                    dataKey={t}
                    stroke={COLORS[i % COLORS.length]}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
function App() {
  const [view, setView] = useState('home')
  if (view === 'single') return <SingleStock onBack={() => setView('home')} />
  if (view === 'portfolio') return <Portfolio onBack={() => setView('home')} />
  return (
    <div className="app">
      <div className="card">
        <header className="app-header">
          <h1>Portfolio Analyzer</h1>
          <p className="subtitle">What would you like to do?</p>
        </header>

        <div className="home-options">
          <button className="option-card" onClick={() => setView('single')}>
            <span className="option-title">Analyze one stock</span>
            <span className="option-desc">
              Look up a single ticker's price history and risk metrics.
            </span>
          </button>
          <button className="option-card" onClick={() => setView('portfolio')}>
            <span className="option-title">Check your portfolio</span>
            <span className="option-desc">
              Analyze multiple stocks together as a portfolio.
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App