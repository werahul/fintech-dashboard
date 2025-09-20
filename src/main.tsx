import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider, http, createConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainnet } from 'wagmi/chains'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
	chains: [mainnet],
	transports: {
		[mainnet.id]: http(),
	},
})

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<WagmiProvider config={wagmiConfig}>
				<QueryClientProvider client={queryClient}>
					<RainbowKitProvider theme={darkTheme()}>
						<App />
					</RainbowKitProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</Provider>
	</StrictMode>,
)
