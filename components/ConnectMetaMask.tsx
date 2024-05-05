import React, { useEffect } from "react";
import { Button } from "@nextui-org/button";
import { ethers } from "ethers";
import { MetaMaskIcon } from "@/components/icons";
import Account from "@/types/Account";

export default function ConnectMetaMask({
	setProvider,
	setAccount,
	setIsMetaMaskConnected,
}: {
	setProvider: React.Dispatch<
		React.SetStateAction<ethers.providers.Web3Provider>
	>;
	setAccount: React.Dispatch<React.SetStateAction<Account | null>>;
	setIsMetaMaskConnected: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	useEffect(() => {
		async function checkConnectedAccount() {
			try {
				const accounts = await (window as any)?.ethereum?.request({
					method: "eth_accounts",
				});
				if (accounts.length > 0) {
					await connectToWallet();
				} else {
					setIsMetaMaskConnected(false);
				}
			} catch (error) {
				console.error("Error checking connected account:", error);
			}
		}
		checkConnectedAccount();
	}, []);

	const connectToWallet = async () => {
		try {
			const provider = new ethers.providers.Web3Provider(
				(window as any)?.ethereum
			);
			setProvider(provider);
			const accounts = await (window as any)?.ethereum?.request({
				method: "eth_requestAccounts",
			});
			const balance = await provider.getBalance(accounts[0]);
			const formattedBalance = ethers.utils.formatEther(balance);
			setAccount({
				address: accounts[0],
				balance: formattedBalance,
			});
			setIsMetaMaskConnected(true);
		} catch (error) {
			console.error("Error connecting to wallet:", error);
		}
	};
	return (
		<div>
			<Button
				onClick={connectToWallet}
				size="lg"
				color="secondary"
				className="transition duration-200"
			>
				<MetaMaskIcon className="h-30 w-30 transform hover:-translate-y-1 hover:scale-200 transition-transform duration-200" />
				<span className="ml-2">Connect your Metamask Wallet</span>
			</Button>
		</div>
	);
}
