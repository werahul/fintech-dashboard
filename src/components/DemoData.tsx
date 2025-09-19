import React from 'react'
import { useAppDispatch } from '../redux/hooks'
import { addToken, updateHoldings } from '../redux/watchlistSlice'

const DemoData: React.FC = () => {
  const dispatch = useAppDispatch()

  const addDemoTokens = () => {
    // Add some demo tokens
    const demoTokens = [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        current_price: 0,
        price_change_percentage_24h: 0,
        market_cap: 0,
        total_volume: 0,
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        current_price: 0,
        price_change_percentage_24h: 0,
        market_cap: 0,
        total_volume: 0,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
      },
      {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        current_price: 0,
        price_change_percentage_24h: 0,
        market_cap: 0,
        total_volume: 0,
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png'
      }
    ]

    demoTokens.forEach(token => {
      dispatch(addToken(token))
      // Add some demo holdings
      dispatch(updateHoldings({ 
        tokenId: token.id, 
        amount: Math.random() * 10 + 0.1 // Random holdings between 0.1 and 10.1
      }))
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={addDemoTokens}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
      >
        Add Demo Tokens
      </button>
    </div>
  )
}

export default DemoData
