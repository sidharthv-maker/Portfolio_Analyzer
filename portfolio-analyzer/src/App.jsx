import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import './index.css'
function App() {
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
        <header className="app-header">
          <h1>Portfolio Analyzer</h1>
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
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
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
export default App