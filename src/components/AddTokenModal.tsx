import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { addToken, searchTokensThunk, clearSearchResults } from '../redux/watchlistSlice'

interface AddTokenModalProps {
  isOpen: boolean
  onClose: () => void
}

const AddTokenModal: React.FC<AddTokenModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch()
  const { searchResults, loading } = useAppSelector(state => state.watchlist)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      dispatch(searchTokensThunk(query))
    } else {
      dispatch(clearSearchResults())
    }
  }

  const handleAddToken = (token: any) => {
    dispatch(addToken({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      current_price: 0,
      price_change_percentage_24h: 0,
      market_cap: 0,
      total_volume: 0,
      image: token.large || token.thumb
    }))
    onClose()
    setSearchQuery('')
    dispatch(clearSearchResults())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Add Token</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for a token..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="max-h-64 overflow-y-auto">
          {loading && (
            <div className="text-center py-4 text-gray-400">
              Searching...
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="space-y-2">
              {searchResults.map((token) => (
                <button
                  key={token.id}
                  onClick={() => handleAddToken(token)}
                  className="w-full flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <img
                    src={token.thumb}
                    alt={token.name}
                    className="w-8 h-8 rounded-full mr-3"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="text-left">
                    <div className="text-white font-medium">{token.name}</div>
                    <div className="text-gray-400 text-sm">{token.symbol.toUpperCase()}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchQuery.length > 2 && searchResults.length === 0 && !loading && (
            <div className="text-center py-4 text-gray-400">
              No tokens found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddTokenModal
