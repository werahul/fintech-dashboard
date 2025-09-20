import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { addTokenAndSave, searchTokensThunk, clearSearchResults, fetchTrendingTokens } from '../redux/watchlistSlice'
import type { SearchResult, TrendingToken } from '../utils/api'
import LoadingSpinner from './LoadingSpinner'
import EmptyState from './EmptyState'
// import ErrorState from './ErrorState'

interface AddTokenModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch()
  const { searchResults, trendingTokens, loading } = useAppSelector(state => state.watchlist)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'search' | 'trending'>('trending')

  // Fetch trending tokens when modal opens
  useEffect(() => {
    if (isOpen && trendingTokens.length === 0) {
      dispatch(fetchTrendingTokens())
    }
  }, [isOpen, dispatch, trendingTokens.length])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      dispatch(searchTokensThunk(query))
      setActiveTab('search')
    } else {
      dispatch(clearSearchResults())
      setActiveTab('trending')
    }
  }, [dispatch])

  const handleTokenSelect = useCallback((tokenId: string) => {
    const newSelected = new Set(selectedTokens)
    if (newSelected.has(tokenId)) {
      newSelected.delete(tokenId)
    } else {
      newSelected.add(tokenId)
    }
    setSelectedTokens(newSelected)
  }, [selectedTokens])

  const handleAddToWatchlist = useCallback(() => {
    const tokensToAdd: SearchResult[] = []
    
    // Add selected search results
    searchResults.forEach(token => {
      if (selectedTokens.has(token.id)) {
        tokensToAdd.push(token)
      }
    })
    
    // Add selected trending tokens
    trendingTokens.forEach(token => {
      if (selectedTokens.has(token.id)) {
        tokensToAdd.push({
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          market_cap_rank: token.market_cap_rank,
          thumb: token.thumb,
          large: token.large
        })
      }
    })

    // Add tokens to Redux store
    tokensToAdd.forEach(token => {
      dispatch(addTokenAndSave({
        id: token.id,
        symbol: token.symbol,
        name: token.name,
        current_price: 0,
        price_change_percentage_24h: 0,
        market_cap: 0,
        total_volume: 0,
        image: token.large || token.thumb
      }))
    })

    // Reset state and close modal
    setSelectedTokens(new Set())
    setSearchQuery('')
    dispatch(clearSearchResults())
    onClose()
  }, [searchResults, selectedTokens, trendingTokens, dispatch, onClose])

  const handleClose = useCallback(() => {
    setSelectedTokens(new Set())
    setSearchQuery('')
    dispatch(clearSearchResults())
    onClose()
  }, [dispatch, onClose])

  // Define renderTokenRow before early return to avoid hooks order violation
  const renderTokenRow = (token: SearchResult | TrendingToken, isTrending = false) => {
    const tokenId = token.id
    const isSelected = selectedTokens.has(tokenId)
    
    return (
      <motion.div
        key={tokenId}
        className="flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
        onClick={() => handleTokenSelect(tokenId)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
      >
        <motion.input
          type="checkbox"
          checked={isSelected}
          onChange={() => handleTokenSelect(tokenId)}
          className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          whileTap={{ scale: 0.9 }}
        />
        <motion.img
          src={isTrending ? (token as TrendingToken).thumb : (token as SearchResult).thumb}
          alt={token.name}
          className="w-8 h-8 rounded-full mr-3"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        />
        <div className="flex-1 text-left">
          <div className="text-white font-medium">{token.name}</div>
          <div className="text-gray-400 text-sm">{token.symbol.toUpperCase()}</div>
        </div>
        {isTrending && (
          <motion.div 
            className="text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            #{token.market_cap_rank}
          </motion.div>
        )}
      </motion.div>
    )
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.96 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-[#212124] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <motion.h2 
                className="text-[18px] text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Add Tokens to Watchlist
              </motion.h2>
              <motion.button
                onClick={handleClose}
                className="text-gray-400 hover:text-white cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Search Input */}
            <motion.div 
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <input
                type="text"
                placeholder="Search for a token..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 bg-[] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </motion.div>

            {/* Tab Navigation */}
            <motion.div 
              className="flex mb-4 border-b border-gray-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <motion.button
                onClick={() => setActiveTab('trending')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'trending'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Trending
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'search'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Search Results
              </motion.button>
            </motion.div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4 text-blue-400" />
                    <p className="text-gray-400">Loading tokens...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Trending Section */}
                  {activeTab === 'trending' && (
                    <div className="space-y-2">
                      {trendingTokens.length > 0 ? (
                        <AnimatePresence>
                          {trendingTokens.map((token) => renderTokenRow(token, true))}
                        </AnimatePresence>
                      ) : (
                        <EmptyState
                          icon={
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          }
                          title="No trending tokens available"
                          description="Unable to load trending tokens at the moment"
                        />
                      )}
                    </div>
                  )}

                  {/* Search Results Section */}
                  {activeTab === 'search' && (
                    <div className="space-y-2">
                      {searchResults.length > 0 ? (
                        <AnimatePresence>
                          {searchResults.map((token) => renderTokenRow(token, false))}
                        </AnimatePresence>
                      ) : searchQuery.length > 2 ? (
                        <EmptyState
                          icon={
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          }
                          title="No tokens found"
                          description={`No results for "${searchQuery}"`}
                        />
                      ) : (
                        <EmptyState
                          icon={
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          }
                          title="Search for tokens"
                          description="Enter at least 3 characters to search"
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <motion.div 
              className="mt-4 pt-4 border-t border-gray-600 flex justify-between items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="text-sm text-gray-400">
                {selectedTokens.size} token{selectedTokens.size !== 1 ? 's' : ''} selected
              </div>
              <motion.button
                onClick={handleAddToWatchlist}
                disabled={selectedTokens.size === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedTokens.size > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={selectedTokens.size > 0 ? { scale: 1.02 } : {}}
                whileTap={selectedTokens.size > 0 ? { scale: 0.98 } : {}}
              >
                Add to Watchlist
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddTokenModal
