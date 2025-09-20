import React, { memo } from 'react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

interface SparklineProps {
  data: Array<{ day: number; price: number }>
  isPositive: boolean
}

const Sparkline: React.FC<SparklineProps> = memo(({ data, isPositive }) => {
  const color = isPositive ? '#10B981' : '#EF4444'

  return (
    <motion.div 
      className="w-16 h-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={1000}
          />
          <XAxis hide />
          <YAxis hide />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
})

Sparkline.displayName = 'Sparkline'

export default Sparkline
