import React, { memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import Sparkline from './Sparkline'

interface WatchlistRowProps {
  token: {
    id: number
    tokenId: string
    name: string
    symbol: string
    iconColor: string
    iconText: string
    price: number
    change24h: number
    holdings: number
    value: number
    sparklineData: Array<{ day: number; price: number }>
  }
  showMenu: boolean
  onMenuToggle: (tokenId: string, event: React.MouseEvent) => void
  onEditHoldings: (tokenId: string) => void
  onRemoveToken: (tokenId: string) => void
  isDesktop?: boolean
  isTablet?: boolean
}

const WatchlistRow: React.FC<WatchlistRowProps> = memo(({
  token,
  showMenu,
  onMenuToggle,
  onEditHoldings,
  onRemoveToken,
  isDesktop = false,
  isTablet = false
}) => {
  const handleMenuToggle = useCallback((e: React.MouseEvent) => {
    onMenuToggle(token.tokenId, e)
  }, [onMenuToggle, token.tokenId])

  const handleEditHoldings = useCallback(() => {
    onEditHoldings(token.tokenId)
  }, [onEditHoldings, token.tokenId])

  const handleRemoveToken = useCallback(() => {
    onRemoveToken(token.tokenId)
  }, [onRemoveToken, token.tokenId])

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      backgroundColor: 'rgba(31, 41, 55, 0.3)',
      transition: { duration: 0.2 }
    }
  }

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  }

  if (isDesktop) {
    return (
      <motion.tr
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="border-b border-gray-800 transition-colors"
      >
        <td className="py-4 px-4">
          <div className="flex items-center">
            <motion.div 
              className="w-8 h-8 rounded mr-3 flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: token.iconColor }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {token.iconText}
            </motion.div>
            <div>
              <div className="font-medium text-white">{token.name}</div>
              <div className="text-sm text-gray-400">({token.symbol})</div>
            </div>
          </div>
        </td>
        <td className="py-4 px-4 text-right text-white font-medium">
          ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
        <td className={`py-4 px-4 text-right font-medium ${
          token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
        </td>
        <td className="py-4 px-4 text-center">
          <Sparkline data={token.sparklineData} isPositive={token.change24h >= 0} />
        </td>
        <td className="py-4 px-4 text-right text-white">
          {token.holdings.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
        </td>
        <td className="py-4 px-4 text-right text-white font-medium">
          ${token.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
        <td className="py-4 px-4 text-center relative">
          <motion.button 
            onClick={handleMenuToggle}
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </motion.button>
          
          {showMenu && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
            >
              <div className="py-1">
                <motion.button
                  onClick={handleEditHoldings}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(55, 65, 81, 1)' }}
                >
                  Edit Holdings
                </motion.button>
                <motion.button
                  onClick={handleRemoveToken}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(55, 65, 81, 1)' }}
                >
                  Remove Token
                </motion.button>
              </div>
            </motion.div>
          )}
        </td>
      </motion.tr>
    )
  }

  if (isTablet) {
    return (
      <motion.tr
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="border-b border-gray-800 transition-colors"
      >
        <td className="py-4 px-4">
          <div className="flex items-center">
            <motion.div 
              className="w-8 h-8 rounded mr-3 flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: token.iconColor }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {token.iconText}
            </motion.div>
            <div>
              <div className="font-medium text-white">{token.name}</div>
              <div className="text-sm text-gray-400">({token.symbol})</div>
            </div>
          </div>
        </td>
        <td className="py-4 px-4 text-right text-white font-medium">
          ${token.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
        <td className={`py-4 px-4 text-right font-medium ${
          token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
        </td>
        <td className="py-4 px-4 text-right text-white font-medium">
          {token.holdings.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 })}
        </td>
        <td className="py-4 px-4 text-right text-white font-medium">
          ${token.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
        <td className="py-4 px-4 text-center relative">
          <motion.button 
            onClick={handleMenuToggle}
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </motion.button>
          
          {showMenu && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
            >
              <div className="py-1">
                <motion.button
                  onClick={handleEditHoldings}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(55, 65, 81, 1)' }}
                >
                  Edit Holdings
                </motion.button>
                <motion.button
                  onClick={handleRemoveToken}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(55, 65, 81, 1)' }}
                >
                  Remove Token
                </motion.button>
              </div>
            </motion.div>
          )}
        </td>
      </motion.tr>
    )
  }

  // Mobile card view
  return (
    <motion.div
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <motion.div 
            className="w-8 h-8 rounded mr-3 flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: token.iconColor }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {token.iconText}
          </motion.div>
          <div>
            <div className="font-medium text-white">{token.name}</div>
            <div className="text-sm text-gray-400">({token.symbol})</div>
          </div>
        </div>
        <div className="relative">
          <motion.button 
            onClick={handleMenuToggle}
            className="text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </motion.button>
          
          {showMenu && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10"
            >
              <div className="py-1">
                <motion.button
                  onClick={handleEditHoldings}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(55, 65, 81, 1)' }}
                >
                  Edit Holdings
                </motion.button>
                <motion.button
                  onClick={handleRemoveToken}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(55, 65, 81, 1)' }}
                >
                  Remove Token
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <div className="text-sm text-gray-400">Price</div>
          <div className="text-white font-medium">${token.price.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">24h %</div>
          <div className={`font-medium ${
            token.change24h >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Holdings</div>
          <div className="text-white">{token.holdings.toFixed(6)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Value</div>
          <div className="text-white font-medium">${token.value.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">7d Chart</div>
        <Sparkline data={token.sparklineData} isPositive={token.change24h >= 0} />
      </div>
    </motion.div>
  )
})

WatchlistRow.displayName = 'WatchlistRow'

export default WatchlistRow
