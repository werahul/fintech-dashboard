import { configureStore } from '@reduxjs/toolkit'
import watchlistReducer from './watchlistSlice'
import { persistenceMiddleware, loadStateFromStorage } from './persistence'

// Load state from localStorage on app initialization
const preloadedState = loadStateFromStorage()

// Add slice reducers here as your app grows
export const store = configureStore({
	reducer: {
		watchlist: watchlistReducer,
	},
	preloadedState,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(persistenceMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


