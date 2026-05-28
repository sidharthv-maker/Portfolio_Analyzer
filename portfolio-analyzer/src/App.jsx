import { useState } from 'react'
function App() {
  const [ticker, setTicker] = useState('')
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
    </div>
  )
}
export default App