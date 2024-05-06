import React, { useEffect } from "react";
import { Button } from "@nextui-org/button";
import { ethers } from "ethers";
import { MetaMaskIcon } from "@/components/icons";
import Account from "@/types/Account";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Divider,
	Link,
	Image,
} from "@nextui-org/react";

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
		<div className="flex items-center justify-center h-full">
			<Card className="max-w-[400px]">
				<CardHeader className="flex gap-3 items-center">
					<Image
						alt="MetaMask logo"
						height={40}
						radius="sm"
						src="https://avatars.githubusercontent.com/u/11744586?s=200&v=4"
						width={40}
					/>
					<div className="flex flex-col">
						<p className="text-md">MetaMask</p>
						<p className="text-small text-default-500">Connect Your Wallet</p>
					</div>
				</CardHeader>
				<Divider />
				<CardBody>
					<div className="text-center mb-8">
						<p className="text-sm">
							Connect your MetaMask wallet to access the features of CryptoMart.
						</p>
					</div>
					<Button
						onClick={connectToWallet}
						size="lg"
						color="secondary"
						className="transition duration-200 w-full"
					>
						<MetaMaskIcon className="h-30 w-30 transform hover:-translate-y-1 hover:scale-200 transition-transform duration-200" />
						<span className="ml-2">Connect</span>
					</Button>
				</CardBody>
				<CardFooter className="justify-center">
					<Link isExternal showAnchorIcon href="https://metamask.io/">
						Official MetaMask Website
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}
