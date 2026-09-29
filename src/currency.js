import { useEffect, useState } from 'react'
import { usdRate } from './content.js'

// Today's European Central Bank rate: free, no key, and the browser caches
// it for a day. Only fetched once someone switches to US dollars.
const RATE_URL = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=PHP'

const usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const pesoFormat = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })

function remembered() {
  try {
    return localStorage.getItem('currency') === 'USD' ? 'USD' : 'PHP'
  } catch {
    return 'PHP'
  }
}

// Prices are written in pesos everywhere. In USD mode, `money` rewrites each
// "₱2,499" in a text as US dollars at `rate` pesos per dollar.
export function useCurrency() {
  const [code, setCode] = useState(remembered)
  const [rate, setRate] = useState(usdRate)
  const [live, setLive] = useState(false)

  useEffect(() => {
    if (code !== 'USD' || live) return
    let active = true
    fetch(RATE_URL)
      .then((response) => response.json())
      .then(({ rates }) => {
        if (!active || !rates?.PHP) return
        setRate(rates.PHP)
        setLive(true)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [code, live])

  function choose(next) {
    setCode(next)
    try {
      localStorage.setItem('currency', next)
    } catch {
      // Storage blocked: the choice just won't be remembered.
    }
  }

  const money = (text) =>
    code === 'PHP'
      ? text
      : text.replace(/₱([\d,]+)/g, (_, pesos) => usdFormat.format(pesos.replaceAll(',', '') / rate))

  return { code, rate, choose, money }
}
