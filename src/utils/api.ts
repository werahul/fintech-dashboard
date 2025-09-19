import axios from 'axios'

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

export interface CoinGeckoToken {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  image: string
  sparkline_in_7d?: {
    price: number[]
  }
}

export interface TrendingToken {
  id: string
  coin_id: string
  name: string
  symbol: string
  market_cap_rank: number
  thumb: string
  small: string
  large: string
  slug: string
  price_btc: number
  score: number
}

export interface SearchResult {
  id: string
  name: string
  symbol: string
  market_cap_rank: number
  thumb: string
  large: string
}

// Get trending tokens
export const getTrendingTokens = async (): Promise<TrendingToken[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API_BASE}/search/trending`)
    return response.data.coins.map((coin: any) => ({
      id: coin.item.id,
      coin_id: coin.item.coin_id,
      name: coin.item.name,
      symbol: coin.item.symbol,
      market_cap_rank: coin.item.market_cap_rank,
      thumb: coin.item.thumb,
      small: coin.item.small,
      large: coin.item.large,
      slug: coin.item.slug,
      price_btc: coin.item.price_btc,
      score: coin.item.score
    }))
  } catch (error) {
    console.error('Error fetching trending tokens:', error)
    throw new Error('Failed to fetch trending tokens')
  }
}

// Search for tokens
export const searchTokens = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API_BASE}/search`, {
      params: { query }
    })
    return response.data.coins.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      market_cap_rank: coin.market_cap_rank,
      thumb: coin.thumb,
      large: coin.large
    }))
  } catch (error) {
    console.error('Error searching tokens:', error)
    throw new Error('Failed to search tokens')
  }
}

// Get token prices with sparkline and 24h change
export const getTokenPrices = async (tokenIds: string[]): Promise<CoinGeckoToken[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: tokenIds.join(','),
        order: 'market_cap_desc',
        per_page: 250,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h'
      }
    })
    
    return response.data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      image: coin.image,
      sparkline_in_7d: coin.sparkline_in_7d
    }))
  } catch (error) {
    console.error('Error fetching token prices:', error)
    throw new Error('Failed to fetch token prices')
  }
}

// Get single token price
export const getTokenPrice = async (tokenId: string): Promise<CoinGeckoToken> => {
  try {
    const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: tokenId,
        order: 'market_cap_desc',
        per_page: 1,
        page: 1,
        sparkline: true,
        price_change_percentage: '24h'
      }
    })
    
    const coin = response.data[0]
    return {
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      image: coin.image,
      sparkline_in_7d: coin.sparkline_in_7d
    }
  } catch (error) {
    console.error('Error fetching token price:', error)
    throw new Error('Failed to fetch token price')
  }
}
