'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PlayIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function LiveMarketCoverage() {
  const tradingViewRef = useRef<HTMLDivElement>(null)

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
          "title": "US 100"
        },
        {
          "proName": "FOREXCOM:DJI",
          "title": "Dow 30"
        },
        {
          "description": "Apple",
          "proName": "NASDAQ:AAPL"
        },
        {
          "description": "Google",
          "proName": "NASDAQ:GOOGL"
        },
        {
          "description": "Tesla",
          "proName": "NASDAQ:TSLA"
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
          "description": "Microsoft",
          "proName": "NASDAQ:MSFT"
        },
        {
          "description": "Amazon",
          "proName": "NASDAQ:AMZN"
        },
        {
          "description": "Meta",
          "proName": "NASDAQ:META"
        },
        {
          "description": "Netflix",
          "proName": "NASDAQ:NFLX"
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
            src="https://www.youtube.com/embed/live_stream?channel=UCJWh7F3AFyQ_x01VKJr9eyA"
            title="Bloomberg Live Stream"
            className="w-full h-full rounded-xl"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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