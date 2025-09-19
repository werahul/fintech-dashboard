import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { getTokenPrices, getTokenPrice, searchTokens, getTrendingTokens, type CoinGeckoToken, type SearchResult, type TrendingToken } from '../utils/api'

export interface Token {
  id: string
  symbol: string
  name: string
  current_price?: number
  price_change_percentage_24h?: number
  market_cap?: number
  total_volume?: number
  image?: string
}

export interface WatchlistState {
  tokens: Token[]
  holdings: { [id: string]: number }
  prices: { [id: string]: number }
  portfolioValue: number
  totalValue: number
  loading: boolean
  error: string | null
  searchResults: SearchResult[]
  trendingTokens: TrendingToken[]
}

const initialState: WatchlistState = {
  tokens: [],
  holdings: {},
  prices: {},
  portfolioValue: 0,
  totalValue: 0,
  loading: false,
  error: null,
  searchResults: [],
  trendingTokens: []
}

// Async thunks
export const fetchTokenPrices = createAsyncThunk(
  'watchlist/fetchTokenPrices',
  async (tokenIds: string[], { rejectWithValue }) => {
    try {
      return await getTokenPrices(tokenIds)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch prices')
    }
  }
)

export const fetchSingleTokenPrice = createAsyncThunk(
  'watchlist/fetchSingleTokenPrice',
  async (tokenId: string, { rejectWithValue }) => {
    try {
      return await getTokenPrice(tokenId)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch price')
    }
  }
)

export const searchTokensThunk = createAsyncThunk(
  'watchlist/searchTokens',
  async (query: string, { rejectWithValue }) => {
    try {
      return await searchTokens(query)
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to search tokens')
    }
  }
)

export const fetchTrendingTokens = createAsyncThunk(
  'watchlist/fetchTrendingTokens',
  async (_, { rejectWithValue }) => {
    try {
      return await getTrendingTokens()
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch trending tokens')
    }
  }
)

export const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToken: (state, action: PayloadAction<Token>) => {
      const token = action.payload
      const existingToken = state.tokens.find(t => t.id === token.id)
      
      if (!existingToken) {
        state.tokens.push(token)
      }
    },
    
    removeToken: (state, action: PayloadAction<string>) => {
      const tokenId = action.payload
      state.tokens = state.tokens.filter(token => token.id !== tokenId)
      delete state.holdings[tokenId]
      delete state.prices[tokenId]
    },
    
    updateHoldings: (state, action: PayloadAction<{ tokenId: string; amount: number }>) => {
      const { tokenId, amount } = action.payload
      if (amount <= 0) {
        delete state.holdings[tokenId]
      } else {
        state.holdings[tokenId] = amount
      }
    },
    
    setPrices: (state, action: PayloadAction<{ [tokenId: string]: number }>) => {
      state.prices = { ...state.prices, ...action.payload }
    },
    
    updateTokenPrice: (state, action: PayloadAction<{ tokenId: string; price: number }>) => {
      const { tokenId, price } = action.payload
      state.prices[tokenId] = price
      
      // Also update the token's current_price if it exists in the tokens array
      const token = state.tokens.find(t => t.id === tokenId)
      if (token) {
        token.current_price = price
      }
    },
    
    clearWatchlist: (state) => {
      state.tokens = []
      state.holdings = {}
      state.prices = {}
      state.portfolioValue = 0
      state.totalValue = 0
    },
    
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    
    calculatePortfolioValue: (state) => {
      let totalValue = 0
      let portfolioValue = 0
      
      state.tokens.forEach(token => {
        const price = state.prices[token.id] || 0
        const holdings = state.holdings[token.id] || 0
        const value = price * holdings
        
        totalValue += price
        portfolioValue += value
      })
      
      state.totalValue = totalValue
      state.portfolioValue = portfolioValue
    }
  },
  extraReducers: (builder) => {
    // Fetch token prices
    builder
      .addCase(fetchTokenPrices.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTokenPrices.fulfilled, (state, action) => {
        state.loading = false
        action.payload.forEach(token => {
          state.prices[token.id] = token.current_price
          // Update token in tokens array if it exists
          const existingToken = state.tokens.find(t => t.id === token.id)
          if (existingToken) {
            existingToken.current_price = token.current_price
            existingToken.price_change_percentage_24h = token.price_change_percentage_24h
            existingToken.market_cap = token.market_cap
            existingToken.total_volume = token.total_volume
            existingToken.image = token.image
          }
        })
        // Recalculate portfolio value
        watchlistSlice.caseReducers.calculatePortfolioValue(state)
      })
      .addCase(fetchTokenPrices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // Fetch single token price
    builder
      .addCase(fetchSingleTokenPrice.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSingleTokenPrice.fulfilled, (state, action) => {
        state.loading = false
        const token = action.payload
        state.prices[token.id] = token.current_price
        // Update token in tokens array if it exists
        const existingToken = state.tokens.find(t => t.id === token.id)
        if (existingToken) {
          existingToken.current_price = token.current_price
          existingToken.price_change_percentage_24h = token.price_change_percentage_24h
          existingToken.market_cap = token.market_cap
          existingToken.total_volume = token.total_volume
          existingToken.image = token.image
        }
        // Recalculate portfolio value
        watchlistSlice.caseReducers.calculatePortfolioValue(state)
      })
      .addCase(fetchSingleTokenPrice.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // Search tokens
    builder
      .addCase(searchTokensThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchTokensThunk.fulfilled, (state, action) => {
        state.loading = false
        state.searchResults = action.payload
      })
      .addCase(searchTokensThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
    
    // Fetch trending tokens
    builder
      .addCase(fetchTrendingTokens.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTrendingTokens.fulfilled, (state, action) => {
        state.loading = false
        state.trendingTokens = action.payload
      })
      .addCase(fetchTrendingTokens.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const {
  addToken,
  removeToken,
  updateHoldings,
  setPrices,
  updateTokenPrice,
  clearWatchlist,
  clearSearchResults,
  calculatePortfolioValue
} = watchlistSlice.actions

export default watchlistSlice.reducer
