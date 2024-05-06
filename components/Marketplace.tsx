import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { title } from "@/components/primitives";
import { Abi, ContractAddress } from "@/config/smart-contract";
import ListItem from "./ListItem";
import ItemsListTable from "./ItemsListTable";
import Item from "@/types/Item";
import Account from "@/types/Account";
import { Link, User } from "@nextui-org/react";
// import { MetaMaskIcon } from "@/components/icons";

export default function MarketPlace({
	account,
	provider,
}: {
	account: Account | null;
	provider: any;
}) {
	const [items, setItems] = useState<Item[]>([]);
	const [contract, setContract] = useState<any>(null);

	useEffect(() => {
		async function initContract() {
			try {
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
				<h1 className={title()}>Explore Our Marketplace</h1>
				<Link
					isExternal
					className="truncate"
					href={`https://sepolia.etherscan.io/address/${account?.address}`}
				>
					<User
						avatarProps={{
							radius: "full",
							src: "https://avatars.githubusercontent.com/u/11744586?s=200&v=4",
						}}
						name={<span className="truncate">{account?.address}</span>}
						description={account?.balance + " ETH"}
					>
						{account?.address}
					</User>
				</Link>

				<ListItem contract={contract} setItems={setItems} />
			</div>
			<ItemsListTable
				items={items}
				setItems={setItems}
				accountAddress={account?.address}
				contract={contract}
			/>
		</div>
	);
}
