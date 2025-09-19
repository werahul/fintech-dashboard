import { configureStore } from '@reduxjs/toolkit'
import watchlistReducer from './watchlistSlice'

// Add slice reducers here as your app grows
export const store = configureStore({
	reducer: {
		watchlist: watchlistReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


