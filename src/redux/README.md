# Redux Watchlist Implementation

This directory contains the Redux implementation for the portfolio watchlist functionality.

## Files

- `store.ts` - Main Redux store configuration with persistence
- `watchlistSlice.ts` - Watchlist state and reducers
- `persistence.ts` - localStorage persistence middleware
- `hooks.ts` - Typed Redux hooks for components

## State Structure

```typescript
interface WatchlistState {
  tokens: Token[]           // Array of watched tokens
  holdings: { [id: string]: number }  // User's token holdings
  prices: { [id: string]: number }    // Current token prices
}
```

## Available Actions

- `addToken(token)` - Add a token to the watchlist
- `removeToken(tokenId)` - Remove a token from the watchlist
- `updateHoldings({ tokenId, amount })` - Update holdings for a token
- `setPrices(prices)` - Set multiple token prices at once
- `updateTokenPrice({ tokenId, price })` - Update a single token price
- `clearWatchlist()` - Clear all watchlist data

## Usage in Components

```typescript
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { addToken, removeToken, updateHoldings } from '../redux/watchlistSlice'

function MyComponent() {
  const dispatch = useAppDispatch()
  const { tokens, holdings, prices } = useAppSelector(state => state.watchlist)
  
  const handleAddToken = (token) => {
    dispatch(addToken(token))
  }
  
  const handleUpdateHoldings = (tokenId: string, amount: number) => {
    dispatch(updateHoldings({ tokenId, amount }))
  }
  
  return (
    // Your component JSX
  )
}
```

## Persistence

The Redux state is automatically persisted to localStorage and rehydrated on app load. The persistence is handled by the `persistenceMiddleware` and `loadStateFromStorage` function.

## TypeScript Support

All Redux state and actions are fully typed. Use the provided hooks (`useAppDispatch`, `useAppSelector`) for type safety.
