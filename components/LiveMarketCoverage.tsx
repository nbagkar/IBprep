'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PlayIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function LiveMarketCoverage() {
  const tradingViewRef = useRef<HTMLDivElement>(null)
  const cryptoTickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load TradingView widget script
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      "symbols": [
        {
          "proName": "FOREXCOM:SPXUSD",
          "title": "S&P 500"
        },
        {
          "proName": "FOREXCOM:NSXUSD",
          "title": "NASDAQ"
        },
        {
          "proName": "FOREXCOM:DJI",
          "title": "Dow Jones"
        },
        {
          "proName": "FOREXCOM:VIX",
          "title": "VIX"
        },
        {
          "proName": "FOREXCOM:UST10Y",
          "title": "10Y Treasury"
        },
        {
          "proName": "FOREXCOM:USOIL",
          "title": "Crude Oil"
        },
        {
          "proName": "FOREXCOM:XAUUSD",
          "title": "Gold"
        },
        {
          "description": "Apple",
          "proName": "NASDAQ:AAPL"
        },
        {
          "description": "Microsoft",
          "proName": "NASDAQ:MSFT"
        },
        {
          "description": "Google",
          "proName": "NASDAQ:GOOGL"
        },
        {
          "description": "Amazon",
          "proName": "NASDAQ:AMZN"
        },
        {
          "description": "Tesla",
          "proName": "NASDAQ:TSLA"
        },
        {
          "description": "Meta",
          "proName": "NASDAQ:META"
        },
        {
          "description": "NVIDIA",
          "proName": "NASDAQ:NVDA"
        },
        {
          "description": "Netflix",
          "proName": "NASDAQ:NFLX"
        },
        {
          "description": "Salesforce",
          "proName": "NYSE:CRM"
        },
        {
          "description": "Adobe",
          "proName": "NASDAQ:ADBE"
        },
        {
          "description": "Oracle",
          "proName": "NYSE:ORCL"
        },
        {
          "description": "Intel",
          "proName": "NASDAQ:INTC"
        },
        {
          "description": "AMD",
          "proName": "NASDAQ:AMD"
        },
        {
          "description": "JPMorgan",
          "proName": "NYSE:JPM"
        },
        {
          "description": "Goldman Sachs",
          "proName": "NYSE:GS"
        },
        {
          "description": "Morgan Stanley",
          "proName": "NYSE:MS"
        },
        {
          "description": "Bank of America",
          "proName": "NYSE:BAC"
        },
        {
          "description": "Citigroup",
          "proName": "NYSE:C"
        },
        {
          "description": "Wells Fargo",
          "proName": "NYSE:WFC"
        },
        {
          "description": "BlackRock",
          "proName": "NYSE:BLK"
        },
        {
          "description": "Blackstone",
          "proName": "NYSE:BX"
        },
        {
          "description": "KKR",
          "proName": "NYSE:KKR"
        },
        {
          "description": "Apollo Global",
          "proName": "NYSE:APO"
        },
        {
          "description": "Berkshire Hathaway",
          "proName": "NYSE:BRK.A"
        },
        {
          "description": "Visa",
          "proName": "NYSE:V"
        },
        {
          "description": "Mastercard",
          "proName": "NYSE:MA"
        },
        {
          "description": "American Express",
          "proName": "NYSE:AXP"
        },
        {
          "description": "PayPal",
          "proName": "NASDAQ:PYPL"
        },
        {
          "description": "Square",
          "proName": "NYSE:SQ"
        },
        {
          "description": "Exxon Mobil",
          "proName": "NYSE:XOM"
        },
        {
          "description": "Chevron",
          "proName": "NYSE:CVX"
        },
        {
          "description": "ConocoPhillips",
          "proName": "NYSE:COP"
        },
        {
          "description": "Occidental",
          "proName": "NYSE:OXY"
        },
        {
          "description": "Johnson & Johnson",
          "proName": "NYSE:JNJ"
        },
        {
          "description": "Pfizer",
          "proName": "NYSE:PFE"
        },
        {
          "description": "Moderna",
          "proName": "NASDAQ:MRNA"
        },
        {
          "description": "BioNTech",
          "proName": "NASDAQ:BNTX"
        },
        {
          "description": "UnitedHealth",
          "proName": "NYSE:UNH"
        },
        {
          "description": "Anthem",
          "proName": "NYSE:ANTM"
        },
        {
          "description": "Walmart",
          "proName": "NYSE:WMT"
        },
        {
          "description": "Home Depot",
          "proName": "NYSE:HD"
        },
        {
          "description": "Costco",
          "proName": "NASDAQ:COST"
        },
        {
          "description": "Target",
          "proName": "NYSE:TGT"
        },
        {
          "description": "McDonald's",
          "proName": "NYSE:MCD"
        },
        {
          "description": "Starbucks",
          "proName": "NASDAQ:SBUX"
        },
        {
          "description": "Coca-Cola",
          "proName": "NYSE:KO"
        },
        {
          "description": "PepsiCo",
          "proName": "NASDAQ:PEP"
        },
        {
          "description": "Procter & Gamble",
          "proName": "NYSE:PG"
        },
        {
          "description": "Unilever",
          "proName": "NYSE:UL"
        },
        {
          "description": "Disney",
          "proName": "NYSE:DIS"
        },
        {
          "description": "Comcast",
          "proName": "NASDAQ:CMCSA"
        },
        {
          "description": "Verizon",
          "proName": "NYSE:VZ"
        },
        {
          "description": "AT&T",
          "proName": "NYSE:T"
        },
        {
          "description": "T-Mobile",
          "proName": "NASDAQ:TMUS"
        },
        {
          "description": "Boeing",
          "proName": "NYSE:BA"
        },
        {
          "description": "Airbus",
          "proName": "OTC:EADSY"
        },
        {
          "description": "General Electric",
          "proName": "NYSE:GE"
        },
        {
          "description": "3M",
          "proName": "NYSE:MMM"
        },
        {
          "description": "Caterpillar",
          "proName": "NYSE:CAT"
        },
        {
          "description": "Deere",
          "proName": "NYSE:DE"
        },
        {
          "description": "FedEx",
          "proName": "NYSE:FDX"
        },
        {
          "description": "UPS",
          "proName": "NYSE:UPS"
        },
        {
          "description": "Union Pacific",
          "proName": "NYSE:UNP"
        },
        {
          "description": "CSX",
          "proName": "NASDAQ:CSX"
        },
        {
          "description": "Airbnb",
          "proName": "NASDAQ:ABNB"
        },
        {
          "description": "Uber",
          "proName": "NYSE:UBER"
        },
        {
          "description": "Lyft",
          "proName": "NASDAQ:LYFT"
        },
        {
          "description": "DoorDash",
          "proName": "NYSE:DASH"
        },
        {
          "description": "Zoom",
          "proName": "NASDAQ:ZM"
        },
        {
          "description": "Slack",
          "proName": "NYSE:WORK"
        },
        {
          "description": "Palantir",
          "proName": "NYSE:PLTR"
        },
        {
          "description": "Snowflake",
          "proName": "NYSE:SNOW"
        },
        {
          "description": "Datadog",
          "proName": "NASDAQ:DDOG"
        },
        {
          "description": "CrowdStrike",
          "proName": "NASDAQ:CRWD"
        },
        {
          "description": "Zscaler",
          "proName": "NASDAQ:ZS"
        },
        {
          "description": "Okta",
          "proName": "NASDAQ:OKTA"
        },
        {
          "description": "Shopify",
          "proName": "NYSE:SHOP"
        },
        {
          "description": "Square",
          "proName": "NYSE:SQ"
        },
        {
          "description": "Twilio",
          "proName": "NYSE:TWLO"
        },
        {
          "description": "ServiceNow",
          "proName": "NYSE:NOW"
        },
        {
          "description": "Workday",
          "proName": "NASDAQ:WDAY"
        },
        {
          "description": "Splunk",
          "proName": "NASDAQ:SPLK"
        },
        {
          "description": "MongoDB",
          "proName": "NASDAQ:MDB"
        },
        {
          "description": "Elastic",
          "proName": "NYSE:ESTC"
        },
        {
          "description": "Confluent",
          "proName": "NASDAQ:CFLT"
        },
        {
          "description": "Coinbase",
          "proName": "NASDAQ:COIN"
        },
        {
          "description": "Robinhood",
          "proName": "NASDAQ:HOOD"
        },
        {
          "description": "SoFi",
          "proName": "NASDAQ:SOFI"
        },
        {
          "description": "Affirm",
          "proName": "NASDAQ:AFRM"
        },
        {
          "description": "Block",
          "proName": "NYSE:SQ"
        },
        {
          "description": "Marqeta",
          "proName": "NASDAQ:MQ"
        },
        {
          "description": "Bill.com",
          "proName": "NYSE:BILL"
        },
        {
          "description": "Toast",
          "proName": "NYSE:TOST"
        },
        {
          "description": "Instacart",
          "proName": "NASDAQ:CART"
        },
        {
          "description": "Rivian",
          "proName": "NASDAQ:RIVN"
        },
        {
          "description": "Lucid",
          "proName": "NASDAQ:LCID"
        },
        {
          "description": "Nikola",
          "proName": "NASDAQ:NKLA"
        },
        {
          "description": "ChargePoint",
          "proName": "NYSE:CHPT"
        },
        {
          "description": "Plug Power",
          "proName": "NASDAQ:PLUG"
        },
        {
          "description": "Bloom Energy",
          "proName": "NYSE:BE"
        },
        {
          "description": "First Solar",
          "proName": "NASDAQ:FSLR"
        },
        {
          "description": "SunPower",
          "proName": "NASDAQ:SPWR"
        },
        {
          "description": "Enphase",
          "proName": "NASDAQ:ENPH"
        },
        {
          "description": "SolarEdge",
          "proName": "NASDAQ:SEDG"
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": "light",
      "isTransparent": false,
      "displayMode": "adaptive",
      "locale": "en"
    })

    if (tradingViewRef.current) {
      tradingViewRef.current.appendChild(script)
    }

    // Cleanup function
    return () => {
      if (tradingViewRef.current) {
        const existingScript = tradingViewRef.current.querySelector('script')
        if (existingScript) {
          tradingViewRef.current.removeChild(existingScript)
        }
      }
    }
  }, [])

  useEffect(() => {
    // Crypto ticker widget
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "proName": "BINANCE:BTCUSDT", "title": "Bitcoin" },
        { "proName": "BINANCE:ETHUSDT", "title": "Ethereum" },
        { "proName": "BINANCE:SOLUSDT", "title": "Solana" },
        { "proName": "BINANCE:DOGEUSDT", "title": "Dogecoin" },
        { "proName": "BINANCE:ADAUSDT", "title": "Cardano" },
        { "proName": "BINANCE:AVAXUSDT", "title": "Avalanche" },
        { "proName": "BINANCE:XRPUSDT", "title": "XRP" },
        { "proName": "BINANCE:BNBUSDT", "title": "BNB" },
        { "proName": "BINANCE:LINKUSDT", "title": "Chainlink" },
        { "proName": "BINANCE:MATICUSDT", "title": "Polygon" },
        { "proName": "BINANCE:SHIBUSDT", "title": "Shiba Inu" },
        { "proName": "BINANCE:LTCUSDT", "title": "Litecoin" },
        { "proName": "BINANCE:DOTUSDT", "title": "Polkadot" },
        { "proName": "BINANCE:TRXUSDT", "title": "TRON" },
        { "proName": "BINANCE:BCHUSDT", "title": "Bitcoin Cash" },
        { "proName": "BINANCE:UNIUSDT", "title": "Uniswap" },
        { "proName": "BINANCE:XLMUSDT", "title": "Stellar" },
        { "proName": "BINANCE:APTUSDT", "title": "Aptos" },
        { "proName": "BINANCE:ARBUSDT", "title": "Arbitrum" },
        { "proName": "BINANCE:OPUSDT", "title": "Optimism" },
        { "proName": "BINANCE:TONUSDT", "title": "Toncoin" },
        { "proName": "BINANCE:WBTCUSDT", "title": "Wrapped BTC" },
        { "proName": "BINANCE:USDTUSDT", "title": "Tether" },
        { "proName": "BINANCE:USDCUSDT", "title": "USD Coin" },
        { "proName": "BINANCE:DAIUSDT", "title": "DAI" }
      ],
      "showSymbolLogo": true,
      "colorTheme": "light",
      "isTransparent": false,
      "displayMode": "adaptive",
      "locale": "en"
    })
    if (cryptoTickerRef.current) {
      cryptoTickerRef.current.appendChild(script)
    }
    return () => {
      if (cryptoTickerRef.current) {
        const existingScript = cryptoTickerRef.current.querySelector('script')
        if (existingScript) {
          cryptoTickerRef.current.removeChild(existingScript)
        }
      }
    }
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gradient mb-3"
        >
          Live Market Coverage
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-slate-600"
        >
          Stay updated with real-time market data and Bloomberg coverage
        </motion.p>
      </div>

      {/* Bloomberg YouTube Livestream */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center mr-3">
              <PlayIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Bloomberg Live</h3>
              <p className="text-sm text-slate-600">24/7 Market Coverage</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-red-600">LIVE</span>
          </div>
        </div>
        
        <div className="relative w-full h-[500px] bg-slate-100 rounded-xl overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/iEpJwprxDdk"
            title="Bloomberg Business News Live"
            className="w-full h-full rounded-xl"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </motion.div>

      {/* TradingView Ticker */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Market Ticker</h3>
              <p className="text-sm text-slate-600">Real-time stock prices</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-green-600">ACTIVE</span>
          </div>
        </div>
        
        <div className="tradingview-widget-container">
          <div 
            ref={tradingViewRef}
            className="tradingview-widget-container__widget"
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </motion.div>

      {/* Crypto Ticker */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Crypto Ticker</h3>
              <p className="text-sm text-slate-600">Real-time crypto prices</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-yellow-600">ACTIVE</span>
          </div>
        </div>
        <div className="tradingview-widget-container">
          <div 
            ref={cryptoTickerRef}
            className="tradingview-widget-container__widget"
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </motion.div>

      {/* Market Summary Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700">S&P 500</p>
              <p className="text-2xl font-bold text-green-800">4,850.43</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">+0.85%</p>
              <p className="text-xs text-green-500">+40.56</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">NASDAQ</p>
              <p className="text-2xl font-bold text-blue-800">15,628.95</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-blue-600">+1.12%</p>
              <p className="text-xs text-blue-500">+172.68</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-700">DOW JONES</p>
              <p className="text-2xl font-bold text-purple-800">37,592.98</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-purple-600">+0.45%</p>
              <p className="text-xs text-purple-500">+168.25</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-700">VIX</p>
              <p className="text-2xl font-bold text-amber-800">12.85</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-amber-600">-2.1%</p>
              <p className="text-xs text-amber-500">-0.28</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="card"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Market Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a 
            href="https://www.bloomberg.com/markets" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Bloomberg Markets</p>
              <p className="text-sm text-slate-600">Comprehensive market data</p>
            </div>
          </a>

          <a 
            href="https://finance.yahoo.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-xl border border-slate-200 hover:border-purple-300 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Yahoo Finance</p>
              <p className="text-sm text-slate-600">Stock quotes & news</p>
            </div>
          </a>

          <a 
            href="https://www.reuters.com/markets/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Reuters Markets</p>
              <p className="text-sm text-slate-600">Financial news & analysis</p>
            </div>
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
} 