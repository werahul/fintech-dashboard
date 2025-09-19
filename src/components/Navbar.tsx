import React from 'react'

export const Navbar: React.FC = () => {
	return (
		<nav className="bg-[#0D0D0D] text-white px-6 py-4 flex items-center justify-between border-b border-[#1f1f1f]">
			<div className="text-xl font-bold">Token Portfolio</div>
			<button className="bg-transparent border border-[#2E2E2E] rounded-lg px-4 py-2 text-white hover:bg-[#1a1a1a] transition-colors">
				Connect Wallet
			</button>
		</nav>
	)
}

export default Navbar


