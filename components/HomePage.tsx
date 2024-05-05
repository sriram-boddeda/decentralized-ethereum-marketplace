"use client";

import React, { useState } from "react";
import Marketplace from "./Marketplace";
import ConnectMetaMask from "./ConnectMetaMask";
import Account from "@/types/Account";

export default function HomePage() {
	const [account, setAccount] = useState<Account | null>(null);
	const [provider, setProvider] = useState<any>(null);
	const [isMetaMaskConnected, setIsMetaMaskConnected] =
		useState<boolean>(false);

	return (
		<div className="w-full flex flex-col items-center justify-center">
			<section className="hero flex flex-col items-center justify-center w-full">
				<div className="container mx-auto my-auto px-4 items-center">
					<h1 className="text-5xl font-bold mb-4 text-center">
						Welcome to <span className="text-purple-700">CryptoMart</span>
					</h1>
					<h2 className="text-2xl font-normal mb-4 text-center">
						Embark on a journey through our expansive marketplace, where you can
						explore a diverse range of items, from collectibles to digital
						assets, all in one convenient location.
					</h2>
					<p className="text-lg font-normal mb-4 text-center">
						CryptoMart is a revolutionary decentralized marketplace designed to
						facilitate the seamless exchange of cryptocurrencies, NFTs, and
						traditional items in a secure and transparent ecosystem. Whether
						you're buying, selling, or trading, CryptoMart ensures a reliable
						and efficient platform for all your transactions.
					</p>
				</div>
			</section>
			<div className="w-full mt-8 items-center">
				{isMetaMaskConnected ? (
					<Marketplace account={account} provider={provider} />
				) : (
					<ConnectMetaMask
						setProvider={setProvider}
						setAccount={setAccount}
						setIsMetaMaskConnected={setIsMetaMaskConnected}
					/>
				)}
			</div>
		</div>
	);
}
