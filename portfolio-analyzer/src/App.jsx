import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
function App() {
  const [ticker, setTicker] = useState('')
  const [resp, setResp] = useState(null)
  const [period, setPeriod] = useState('')
  const [chartData, setChartData] = useState([])
  useEffect(()=>{
    if(ticker === '' || period === '') return
    fetch(`http://localhost:8000/stock/${ticker}/${period}`)
      .then(r=>r.json())
      .then(data=>{
        setResp(data)
        setChartData(data.dates.map((date, index) => ({
          date: date,
          price: data.prices[index]
        })))
      })
  }, [ticker, period])

  return (
    <div>
      <h1>Portfolio Analyzer</h1>
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Enter ticker e.g. AAPL"
      />
      <p>You typed: {ticker}</p>
      <button onClick={() => setPeriod('1y')}>1 Year</button>
      <button onClick={() => setPeriod('1m')}>1 Month</button>
      <button onClick={() => setPeriod('1d')}>1 Day</button>
      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
export default App