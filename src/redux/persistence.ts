import { type Middleware } from '@reduxjs/toolkit'
import type { RootState } from './store'

const STORAGE_KEY = 'portfolio-watchlist'

export const persistenceMiddleware: Middleware<{}, RootState, any> = (store) => (next) => (action) => {
  const result = next(action)
  
  // Save to localStorage after every action
  const state = store.getState()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.watchlist))
  } catch (error) {
    console.warn('Failed to save watchlist to localStorage:', error)
  }
  
  return result
}

export const loadStateFromStorage = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY)
    if (serializedState === null) {
      return undefined
    }
    const parsedState = JSON.parse(serializedState)
    return {
      watchlist: parsedState
    }
  } catch (error) {
    console.warn('Failed to load watchlist from localStorage:', error)
    return undefined
  }
}
