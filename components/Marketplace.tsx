"use client";

import { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { title } from "@/components/primitives";
import { Abi, ContractAddress } from "@/config/smart-contract";
import ListItem from "./ListItem";
import ItemsListTable from "./ItemsListTable";
import Item from "@/types/Item";

export default function Home() {
	const [accountAddress, setAccountAddress] = useState<string>("");
	const [items, setItems] = useState<Item[]>([]);
	const [contract, setContract] = useState<any>(null);

	useEffect(() => {
		async function initContract() {
			try {
				const provider = new ethers.providers.Web3Provider(
					(window as any)?.ethereum
				);
				const accounts = await (window as any)?.ethereum?.request({
					method: "eth_requestAccounts",
				});
				setAccountAddress(accounts[0]);
				const signer = provider.getSigner();
				const marketplace = new ethers.Contract(ContractAddress, Abi, signer);
				setContract(marketplace);
				const items = await marketplace.getItems();
				setItems(items);
			} catch (error) {
				console.error("Error initializing contract:", error);
			}
		}
		initContract();
	}, []);

	return (
		<div>
			<div className="flex items-center justify-between">
				<h1 className={title()}>Marketplace</h1>
				<ListItem contract={contract} setItems={setItems} />
			</div>
			<ItemsListTable
				items={items}
				setItems={setItems}
				accountAddress={accountAddress}
				contract={contract}
			/>
		</div>
	);
}
