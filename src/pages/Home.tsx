import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchTokenPrices, fetchTrendingTokens, updateHoldingsAndSave, removeTokenAndSave } from '../redux/watchlistSlice'
import AddTokenModal from '../components/AddTokenModal'
import DemoData from '../components/DemoData'
import WatchlistRow from '../components/WatchlistRow'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

// Default portfolio data for initial display
const defaultPortfolioData = [
	{ name: 'Bitcoin', value: 21.0, color: '#F7931A' },
	{ name: 'Ethereum', value: 64.6, color: '#627EEA' },
	{ name: 'Solana', value: 14.4, color: '#9945FF' },
	{ name: 'Dogecoin', value: 14.4, color: '#C2A633' },
]

// Default watchlist data for initial display (unused but kept for reference)
/*
	{
		id: 1,
		name: 'Ethereum',
		symbol: 'ETH',
		iconColor: '#627EEA',
		iconText: '♦',
		price: 43250.67,
		change24h: 2.30,
		holdings: 0.0500,
		value: 2162.53,
		sparklineData: [
			{ day: 1, price: 42000 },
			{ day: 2, price: 42500 },
			{ day: 3, price: 41800 },
			{ day: 4, price: 43000 },
			{ day: 5, price: 42800 },
			{ day: 6, price: 43500 },
			{ day: 7, price: 43250 }
		]
	},
	{
		id: 2,
		name: 'Bitcoin',
		symbol: 'BTC',
		iconColor: '#F7931A',
		iconText: 'B',
		price: 2654.32,
		change24h: -1.20,
		holdings: 2.5000,
		value: 6635.80,
		sparklineData: [
			{ day: 1, price: 2700 },
			{ day: 2, price: 2680 },
			{ day: 3, price: 2720 },
			{ day: 4, price: 2690 },
			{ day: 5, price: 2670 },
			{ day: 6, price: 2660 },
			{ day: 7, price: 2654 }
		]
	},
	{
		id: 3,
		name: 'Solana',
		symbol: 'SOL',
		iconColor: '#9945FF',
		iconText: 'S',
		price: 98.45,
		change24h: 4.70,
		holdings: 15.0000,
		value: 1476.75,
		sparklineData: [
			{ day: 1, price: 90 },
			{ day: 2, price: 92 },
			{ day: 3, price: 88 },
			{ day: 4, price: 95 },
			{ day: 5, price: 93 },
			{ day: 6, price: 96 },
			{ day: 7, price: 98.45 }
		]
	},
	{
		id: 4,
		name: 'Dogecoin',
		symbol: 'DOGE',
		iconColor: '#C2A633',
		iconText: '🐕',
		price: 0.15,
		change24h: 2.30,
		holdings: 10000.0000,
		value: 1500.00,
		sparklineData: [
			{ day: 1, price: 0.14 },
			{ day: 2, price: 0.145 },
			{ day: 3, price: 0.142 },
			{ day: 4, price: 0.148 },
			{ day: 5, price: 0.146 },
			{ day: 6, price: 0.149 },
			{ day: 7, price: 0.15 }
		]
	},
	{
		id: 5,
		name: 'USDC',
		symbol: 'USDC',
		iconColor: '#2775CA',
		iconText: 'USDC',
		price: 1.00,
		change24h: -1.20,
		holdings: 2500.0000,
		value: 2500.00,
		sparklineData: [
			{ day: 1, price: 1.01 },
			{ day: 2, price: 1.005 },
			{ day: 3, price: 1.008 },
			{ day: 4, price: 1.002 },
			{ day: 5, price: 0.998 },
			{ day: 6, price: 0.995 },
			{ day: 7, price: 1.00 }
		]
	},
	{
		id: 6,
		name: 'Stellar',
		symbol: 'XLM',
		iconColor: '#7D00FF',
		iconText: 'S',
		price: 0.098,
		change24h: 4.70,
		holdings: 15000.0000,
		value: 1470.00,
		sparklineData: [
			{ day: 1, price: 0.09 },
			{ day: 2, price: 0.092 },
			{ day: 3, price: 0.088 },
			{ day: 4, price: 0.095 },
			{ day: 5, price: 0.093 },
			{ day: 6, price: 0.096 },
			{ day: 7, price: 0.098 }
		]
	}
]
*/

// Portfolio loading component
const PortfolioLoading: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4 text-blue-400" />
      <p className="text-gray-400">Loading portfolio data...</p>
    </div>
  </div>
)

// Portfolio error component
const PortfolioError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex items-center justify-center py-12">
    <ErrorState
      title="Failed to load portfolio"
      message="Unable to fetch your portfolio data. Please try again."
      onRetry={onRetry}
    />
  </div>
)

const Home: React.FC = () => {
	const dispatch = useAppDispatch()
	const { tokens, holdings, prices, loading, error } = useAppSelector(state => state.watchlist)
	const [isAddTokenModalOpen, setIsAddTokenModalOpen] = useState(false)
	const [editingToken, setEditingToken] = useState<string | null>(null)
	const [editingHoldings, setEditingHoldings] = useState<string>('')
	const [showMenuForToken, setShowMenuForToken] = useState<string | null>(null)
	const [showEditModal, setShowEditModal] = useState(false)
	
	// Load trending tokens on component mount
	useEffect(() => {
		dispatch(fetchTrendingTokens())
	}, [dispatch])
	
	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = () => {
			if (showMenuForToken) {
				setShowMenuForToken(null)
			}
		}
		
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [showMenuForToken])
	
	// Optimized handlers with useCallback
	const handleRefreshPrices = useCallback(() => {
		const tokenIds = tokens.map(token => token.id)
		if (tokenIds.length > 0) {
			dispatch(fetchTokenPrices(tokenIds))
		}
	}, [dispatch, tokens])
	
	const handleEditHoldings = useCallback((tokenId: string) => {
		const currentHoldings = holdings[tokenId] || 0
		setEditingToken(tokenId)
		setEditingHoldings(currentHoldings.toString())
		setShowMenuForToken(null)
		setShowEditModal(true)
	}, [holdings])
	
	const handleSaveHoldings = useCallback(() => {
		if (editingToken) {
			const amount = parseFloat(editingHoldings) || 0
			dispatch(updateHoldingsAndSave({ tokenId: editingToken, amount }))
			setEditingToken(null)
			setEditingHoldings('')
			setShowEditModal(false)
		}
	}, [dispatch, editingToken, editingHoldings])
	
	const handleCancelEdit = useCallback(() => {
		setEditingToken(null)
		setEditingHoldings('')
		setShowEditModal(false)
	}, [])
	
	const handleRemoveToken = useCallback((tokenId: string) => {
		dispatch(removeTokenAndSave(tokenId))
		setShowMenuForToken(null)
	}, [dispatch])
	
	const handleMenuToggle = useCallback((tokenId: string, event: React.MouseEvent) => {
		event.stopPropagation()
		setShowMenuForToken(showMenuForToken === tokenId ? null : tokenId)
	}, [showMenuForToken])
	
	// Memoized portfolio data calculation
	const portfolioData = useMemo(() => {
		if (tokens.length === 0) return defaultPortfolioData
		
		return tokens.map(token => {
			const price = prices[token.id] || 0
			const holding = holdings[token.id] || 0
			const value = price * holding
			return {
				name: token.symbol,
				value: value,
				color: getTokenColor(token.symbol)
			}
		}).filter(item => item.value > 0)
	}, [tokens, prices, holdings])
	
	// Memoized watchlist data calculation
	const watchlistData = useMemo(() => {
		return tokens.map((token, index) => {
			const price = prices[token.id] || 0
			const holding = holdings[token.id] || 0
			const value = price * holding
			const change24h = token.price_change_percentage_24h || 0
			
			return {
				id: index + 1,
				tokenId: token.id,
				name: token.name,
				symbol: token.symbol,
				iconColor: getTokenColor(token.symbol),
				iconText: getTokenIcon(token.symbol),
				price: price,
				change24h: change24h,
				holdings: holding,
				value: value,
				sparklineData: generateSparklineData(price, change24h)
			}
		})
	}, [tokens, prices, holdings])
	
	// Helper function to get token color
	function getTokenColor(symbol: string): string {
		const colors: { [key: string]: string } = {
			'BTC': '#F7931A',
			'ETH': '#627EEA',
			'SOL': '#9945FF',
			'DOGE': '#C2A633',
			'ADA': '#0033AD',
			'MATIC': '#8247E5',
			'AVAX': '#E84142',
			'DOT': '#E6007A'
		}
		return colors[symbol.toUpperCase()] || '#6B7280'
	}
	
	// Helper function to get token icon
	function getTokenIcon(symbol: string): string {
		const icons: { [key: string]: string } = {
			'BTC': 'B',
			'ETH': '♦',
			'SOL': 'S',
			'DOGE': 'D',
			'ADA': 'A',
			'MATIC': 'M',
			'AVAX': 'A',
			'DOT': 'D'
		}
		return icons[symbol.toUpperCase()] || symbol.charAt(0).toUpperCase()
	}
	
	// Helper function to generate sparkline data
	function generateSparklineData(price: number, change24h: number): Array<{ day: number; price: number }> {
		const days = 7
		const basePrice = price / (1 + change24h / 100)
		const data = []
		
		for (let i = 0; i < days; i++) {
			const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
			const dayPrice = basePrice * (1 + variation) * (1 + (change24h / 100) * (i / days))
			data.push({ day: i + 1, price: Math.round(dayPrice * 100) / 100 })
		}
		
		return data
	}
	
	// Memoized total portfolio value calculation
	const totalPortfolioValue = useMemo(() => {
		return portfolioData.reduce((sum, item) => sum + item.value, 0)
	}, [portfolioData])
	
	return (
		<div className="min-h-screen bg-[#0D0D0D] text-white px-6 py-8">
			{/* Tailwind Test - Remove this after confirming it works 
			<div className="bg-red-500 text-white p-4 mb-4 rounded-lg">
				✅ Tailwind CSS is working! This red box should be visible.
			</div>*/}
			{/* Portfolio Total Section */}
			<motion.div 
				className="mb-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<motion.h1 
					className="text-2xl font-bold mb-6"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.4, delay: 0.1 }}
				>
					Portfolio Total
				</motion.h1>
				
				{loading && tokens.length === 0 ? (
					<PortfolioLoading />
				) : error && tokens.length === 0 ? (
					<PortfolioError onRetry={handleRefreshPrices} />
				) : (
					<div className="flex flex-col xl:flex-row gap-8">
						{/* Left: Portfolio Value */}
						<motion.div 
							className="flex-1"
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<motion.div 
								className="text-4xl sm:text-5xl font-bold mb-2"
								key={totalPortfolioValue}
								initial={{ scale: 0.9 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.3 }}
							>
								${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</motion.div>
							<div className="text-sm text-gray-400">
								Last updated: {new Date().toLocaleTimeString()}
								{loading && <span className="ml-2 text-yellow-400">Updating...</span>}
								{error && <span className="ml-2 text-red-400">Error: {error}</span>}
							</div>
						</motion.div>
						
						{/* Right: Donut Chart */}
						<motion.div 
							className="flex-1 flex items-center justify-center"
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<div className="w-64 h-64 sm:w-80 sm:h-80 relative">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={portfolioData}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={100}
											paddingAngle={2}
										>
											{portfolioData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Pie>
										<Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff' }} />
									</PieChart>
								</ResponsiveContainer>
								{/* Custom Legend */}
								<motion.div 
									className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-2 sm:space-y-3"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.4, delay: 0.5 }}
								>
									{portfolioData.map((entry, index) => (
										<motion.div 
											key={index} 
											className="flex items-center space-x-2"
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
										>
											<div 
												className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
												style={{ backgroundColor: entry.color }}
											></div>
											<span className="text-xs sm:text-sm text-gray-300">
												{entry.name}: {entry.value}%
											</span>
										</motion.div>
									))}
								</motion.div>
							</div>
						</motion.div>
					</div>
				)}
			</motion.div>

			{/* Watchlist Section */}
			<motion.div 
				className="mt-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
			>
				<div className="bg-[#121212] border border-[#1f1f1f] rounded-xl p-6">
					{/* Header */}
					<motion.div 
						className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.5 }}
					>
						<div className="flex items-center">
							<motion.span 
								className="text-green-400 text-xl mr-2"
								animate={{ rotate: [0, 10, -10, 0] }}
								transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
							>
								★
							</motion.span>
							<h2 className="text-xl font-semibold text-white">Watchlist</h2>
						</div>
						<div className="flex flex-col sm:flex-row gap-3">
							<motion.button 
								onClick={handleRefreshPrices}
								disabled={loading || tokens.length === 0}
								className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-lg text-white text-sm transition-colors"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								{loading ? (
									<LoadingSpinner size="sm" className="mr-2" />
								) : (
									<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
									</svg>
								)}
								{loading ? 'Refreshing...' : 'Refresh Prices'}
							</motion.button>
							<motion.button 
								onClick={() => setIsAddTokenModalOpen(true)}
								className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-colors"
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
								+ Add Token
							</motion.button>
						</div>
					</motion.div>

					{/* Desktop Table */}
					<div className="hidden lg:block overflow-x-auto">
						{loading && watchlistData.length === 0 ? (
							<div className="flex items-center justify-center py-12">
								<div className="text-center">
									<LoadingSpinner size="lg" className="mx-auto mb-4 text-blue-400" />
									<p className="text-gray-400">Loading watchlist...</p>
								</div>
							</div>
						) : error && watchlistData.length === 0 ? (
							<ErrorState
								title="Failed to load watchlist"
								message="Unable to fetch your watchlist data. Please try again."
								onRetry={handleRefreshPrices}
							/>
						) : watchlistData.length === 0 ? (
							<EmptyState
								icon={
									<svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
									</svg>
								}
								title="No tokens in watchlist"
								description="Add tokens to start tracking your portfolio"
								action={
									<motion.button
										onClick={() => setIsAddTokenModalOpen(true)}
										className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										+ Add Your First Token
									</motion.button>
								}
							/>
						) : (
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-700">
										<th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Token</th>
										<th className="text-right py-4 px-4 text-sm font-medium text-gray-400">Price</th>
										<th className="text-right py-4 px-4 text-sm font-medium text-gray-400">24h %</th>
										<th className="text-center py-4 px-4 text-sm font-medium text-gray-400">Sparkline (7d)</th>
										<th className="text-right py-4 px-4 text-sm font-medium text-gray-400">Holdings</th>
										<th className="text-right py-4 px-4 text-sm font-medium text-gray-400">Value</th>
										<th className="text-center py-4 px-4 text-sm font-medium text-gray-400"></th>
									</tr>
								</thead>
								<tbody>
									<AnimatePresence>
										{watchlistData.map((token) => (
											<WatchlistRow
												key={token.id}
												token={token}
												showMenu={showMenuForToken === token.tokenId}
												onMenuToggle={handleMenuToggle}
												onEditHoldings={handleEditHoldings}
												onRemoveToken={handleRemoveToken}
												isDesktop={true}
											/>
										))}
									</AnimatePresence>
								</tbody>
							</table>
						)}
					</div>

					{/* Tablet Table */}
					<div className="hidden md:block lg:hidden overflow-x-auto">
						{loading && watchlistData.length === 0 ? (
							<div className="flex items-center justify-center py-12">
								<div className="text-center">
									<LoadingSpinner size="lg" className="mx-auto mb-4 text-blue-400" />
									<p className="text-gray-400">Loading watchlist...</p>
								</div>
							</div>
						) : error && watchlistData.length === 0 ? (
							<ErrorState
								title="Failed to load watchlist"
								message="Unable to fetch your watchlist data. Please try again."
								onRetry={handleRefreshPrices}
							/>
						) : watchlistData.length === 0 ? (
							<EmptyState
								icon={
									<svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
									</svg>
								}
								title="No tokens in watchlist"
								description="Add tokens to start tracking your portfolio"
								action={
									<motion.button
										onClick={() => setIsAddTokenModalOpen(true)}
										className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										+ Add Your First Token
									</motion.button>
								}
							/>
						) : (
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-700">
										<th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Token</th>
										<th className="text-right py-4 px-4 text-sm font-medium text-gray-400">Price</th>
										<th className="text-right py-4 px-4 text-sm font-medium text-gray-400">24h %</th>
										<th className="text-right py-4 px-4 text-sm font-medium text-gray-400">Holdings</th>
										<th className="text-right py-4 px-4 text-sm font-medium text-gray-400">Value</th>
										<th className="text-center py-4 px-4 text-sm font-medium text-gray-400"></th>
									</tr>
								</thead>
								<tbody>
									<AnimatePresence>
										{watchlistData.map((token) => (
											<WatchlistRow
												key={token.id}
												token={token}
												showMenu={showMenuForToken === token.tokenId}
												onMenuToggle={handleMenuToggle}
												onEditHoldings={handleEditHoldings}
												onRemoveToken={handleRemoveToken}
												isTablet={true}
											/>
										))}
									</AnimatePresence>
								</tbody>
							</table>
						)}
					</div>

					{/* Mobile Cards */}
					<div className="md:hidden space-y-4">
						{loading && watchlistData.length === 0 ? (
							<div className="flex items-center justify-center py-12">
								<div className="text-center">
									<LoadingSpinner size="lg" className="mx-auto mb-4 text-blue-400" />
									<p className="text-gray-400">Loading watchlist...</p>
								</div>
							</div>
						) : error && watchlistData.length === 0 ? (
							<ErrorState
								title="Failed to load watchlist"
								message="Unable to fetch your watchlist data. Please try again."
								onRetry={handleRefreshPrices}
							/>
						) : watchlistData.length === 0 ? (
							<EmptyState
								icon={
									<svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
									</svg>
								}
								title="No tokens in watchlist"
								description="Add tokens to start tracking your portfolio"
								action={
									<motion.button
										onClick={() => setIsAddTokenModalOpen(true)}
										className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										+ Add Your First Token
									</motion.button>
								}
							/>
						) : (
							<AnimatePresence>
								{watchlistData.map((token) => (
									<WatchlistRow
										key={token.id}
										token={token}
										showMenu={showMenuForToken === token.tokenId}
										onMenuToggle={handleMenuToggle}
										onEditHoldings={handleEditHoldings}
										onRemoveToken={handleRemoveToken}
									/>
								))}
							</AnimatePresence>
						)}
					</div>

					{/* Pagination Footer */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-700 gap-4">
						<div className="text-sm text-gray-400">
							1 - 10 of 100 results
						</div>
						<div className="flex items-center justify-center sm:justify-end space-x-4">
							<button className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50" disabled>
								Prev
							</button>
							<span className="text-sm text-white">1 of 10 pages</span>
							<button className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors">
								Next
							</button>
						</div>
					</div>
				</div>
			</motion.div>
			
			{/* Add Token Modal */}
			<AddTokenModal 
				isOpen={isAddTokenModalOpen} 
				onClose={() => setIsAddTokenModalOpen(false)} 
			/>

			{/* Edit Holdings Modal */}
			{showEditModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-semibold text-white">Holdings</h2>
							<button
								onClick={handleCancelEdit}
								className="text-gray-400 hover:text-white"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						<div className="space-y-4">
							{/* Current Holdings List */}
							<div className="space-y-2">
								{watchlistData.map((token) => (
									<div key={token.id} className="text-white text-sm">
										{token.holdings.toFixed(6)}
									</div>
								))}
							</div>

							{/* Edit Input */}
							<div className="flex items-center space-x-3">
								<div className="flex-1">
									<input
										type="number"
										value={editingHoldings}
										onChange={(e) => setEditingHoldings(e.target.value)}
										className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
										placeholder="Select"
										step="0.000001"
										min="0"
									/>
								</div>
								<button
									onClick={handleSaveHoldings}
									className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
								>
									Save
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			
			{/* Demo Data Button */}
			<DemoData />
		</div>
	)
}

export default Home


