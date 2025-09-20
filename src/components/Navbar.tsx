import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet } from "lucide-react"; // Icon library

export const Navbar: React.FC = () => {
	return (
		<nav className="bg-[#212124] text-white px-6 py-4 flex items-center justify-between border-b border-[#1f1f1f]">
			<div className="sm:text-xl text-[16px] font-semibold flex items-center justify-center gap-3"> <span> <img src="/greenLogo.png" alt="" /> </span> Token Portfolio</div>
			{/* Custom Connect Button */}
			<ConnectButton.Custom>
				{({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
					return (
						<div
							{...(!mounted && {
								"aria-hidden": true,
								style: {
									opacity: 0,
									pointerEvents: "none",
									userSelect: "none",
								},
							})}
						>
							{(() => {
								if (!mounted || !account || !chain) {
									return (
										<button
											onClick={openConnectModal}
											type="button"
											className="flex items-center sm:text-[18px] text-[14px] gap-2 px-5 sm:py-2 py-1 sm:px-4 rounded-[100px] bg-[#a9e851] text-black font-semibold hover:opacity-90 transition"
										>
											<Wallet size={18} />
											Connect Wallet
										</button>
									);
								}

								if (chain.unsupported) {
									return (
										<button
											onClick={openChainModal}
											type="button"
											className="flex items-center gap-2 px-5 py-2 rounded-[100px] bg-red-500 text-white font-semibold hover:bg-red-600 transition"
										>
											<Wallet size={18} />
											Wrong Network
										</button>
									);
								}

								return (
									<div className="flex items-center gap-3">
										<button
											onClick={openChainModal}
											className="px-3 py-1 rounded-[100px] bg-gray-700 hover:bg-gray-600 text-white"
											type="button"
										>
											{chain.name}
										</button>

										<button
											onClick={openAccountModal}
											type="button"
											className="flex items-center gap-2 px-5 py-2 rounded-[100px] bg-[#a9e851] text-black font-semibold hover:opacity-90 transition"
										>
											<Wallet size={18} />
											{account.displayName}
											{account.displayBalance ? ` (${account.displayBalance})` : ""}
										</button>
									</div>
								);
							})()}
						</div>
					);
				}}
			</ConnectButton.Custom>
		</nav>
	)
}

export default Navbar


