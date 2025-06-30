'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore, type NewsItem } from '@/lib/store'
import { 
  PlusIcon, 
  TrashIcon, 
  BookmarkIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function NewsFeed() {
  const { newsItems, addNewsItem, deleteNewsItem } = useAppStore()
  const [activeTab, setActiveTab] = useState('live')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newRssUrl, setNewRssUrl] = useState('')

  // Mock live news data
  const liveNews = [
    {
      id: '1',
      title: 'Fed Signals Potential Rate Cuts in 2024',
      source: 'Bloomberg',
      url: '#',
      publishedAt: new Date().toISOString(),
      summary: 'Federal Reserve officials indicated they may consider interest rate reductions next year as inflation continues to moderate.'
    },
    {
      id: '2',
      title: 'Tech M&A Activity Surges in Q4',
      source: 'Reuters',
      url: '#',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      summary: 'Technology sector merger and acquisition deals reached $150 billion in the fourth quarter, marking the highest level in two years.'
    },
    {
      id: '3',
      title: 'Oil Prices Stabilize Amid OPEC+ Production Cuts',
      source: 'WSJ',
      url: '#',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      summary: 'Crude oil prices found support as OPEC+ members reaffirmed their commitment to production cuts through early 2024.'
    },
    {
      id: '4',
      title: 'European Markets Rally on ECB Policy Shift',
      source: 'Financial Times',
      url: '#',
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      summary: 'European stock markets gained ground following the European Central Bank\'s dovish policy stance and improved economic outlook.'
    }
  ]

  const tabs = [
    { id: 'live', name: 'Live News', icon: GlobeAltIcon },
    { id: 'bookmarks', name: 'Bookmarks', icon: BookmarkIcon },
    { id: 'rss', name: 'RSS Feeds', icon: PlusIcon },
  ]

  const handleAddRssFeed = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRssUrl.trim()) {
      addNewsItem({
        title: `RSS Feed: ${newRssUrl}`,
        source: 'RSS',
        url: newRssUrl,
        publishedAt: new Date().toISOString(),
        summary: 'Custom RSS feed added to your news sources.'
      })
      toast.success('RSS feed added!')
      setNewRssUrl('')
      setShowAddModal(false)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Feed</h1>
          <p className="mt-2 text-gray-600">Stay updated with market news and industry insights</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add RSS Feed
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm flex items-center
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Live News Tab */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Live Market News</h2>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live
            </div>
          </div>

          {/* Bloomberg TV Embed Placeholder */}
          <div className="card">
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <GlobeAltIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Bloomberg TV Live</h3>
                <p className="text-gray-400">Live market coverage and financial news</p>
                <p className="text-sm text-gray-500 mt-2">(Embed Bloomberg TV stream here)</p>
              </div>
            </div>
          </div>

          {/* News Articles */}
          <div className="space-y-4">
            {liveNews.map((news) => (
              <div key={news.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">{news.source}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {formatTimeAgo(news.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h3>
                    <p className="text-gray-700 mb-3">{news.summary}</p>
                    <div className="flex items-center space-x-3">
                      <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
                      >
                        Read Full Article
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
                      </a>
                      <button
                        onClick={() => {
                          addNewsItem({
                            title: news.title,
                            source: news.source,
                            url: news.url,
                            publishedAt: news.publishedAt,
                            summary: news.summary
                          })
                          toast.success('Article bookmarked!')
                        }}
                        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
                      >
                        <BookmarkIcon className="w-4 h-4 mr-1" />
                        Bookmark
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookmarks Tab */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Bookmarked Articles</h2>
          
          <div className="space-y-4">
            {newsItems.map((news) => (
              <div key={news.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">{news.source}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {new Date(news.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h3>
                    <p className="text-gray-700 mb-3">{news.summary}</p>
                    <div className="flex items-center space-x-3">
                      <a
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
                      >
                        Read Full Article
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
                      </a>
                      <button
                        onClick={() => {
                          deleteNewsItem(news.id)
                          toast.success('Bookmark removed!')
                        }}
                        className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {newsItems.length === 0 && (
              <div className="text-center py-12">
                <BookmarkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No bookmarked articles yet.</p>
                <p className="text-sm text-gray-400">Bookmark articles from the Live News tab to see them here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RSS Feeds Tab */}
      {activeTab === 'rss' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">RSS Feed Management</h2>
          
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New RSS Feed</h3>
            <form onSubmit={handleAddRssFeed} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">RSS Feed URL</label>
                <input
                  type="url"
                  required
                  value={newRssUrl}
                  onChange={(e) => setNewRssUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/rss-feed.xml"
                />
              </div>
              <button type="submit" className="btn-primary">
                Add Feed
              </button>
            </form>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Popular RSS Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Wall Street Journal</h4>
                <p className="text-sm text-gray-600 mb-2">Business and financial news</p>
                <button className="text-sm text-primary-600 hover:text-primary-800">
                  Add Feed
                </button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Financial Times</h4>
                <p className="text-sm text-gray-600 mb-2">Global business and economics</p>
                <button className="text-sm text-primary-600 hover:text-primary-800">
                  Add Feed
                </button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Reuters Business</h4>
                <p className="text-sm text-gray-600 mb-2">Breaking business news</p>
                <button className="text-sm text-primary-600 hover:text-primary-800">
                  Add Feed
                </button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">Bloomberg</h4>
                <p className="text-sm text-gray-600 mb-2">Markets and financial data</p>
                <button className="text-sm text-primary-600 hover:text-primary-800">
                  Add Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add RSS Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add RSS Feed</h3>
              <form onSubmit={handleAddRssFeed} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">RSS Feed URL</label>
                  <input
                    type="url"
                    required
                    value={newRssUrl}
                    onChange={(e) => setNewRssUrl(e.target.value)}
                    className="input-field"
                    placeholder="https://example.com/rss-feed.xml"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      setNewRssUrl('')
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Feed
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 