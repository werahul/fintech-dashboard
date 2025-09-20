import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const Navbar: React.FC = () => {
	return (
		<nav className="bg-[#0D0D0D] text-white px-6 py-4 flex items-center justify-between border-b border-[#1f1f1f]">
			<div className="text-xl font-bold">Token Portfolio</div>
			<ConnectButton />
		</nav>
	)
}

export default Navbar


