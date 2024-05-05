"use client";

import { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { title } from "@/components/primitives";
import {
	Table,
	TableHeader,
	TableColumn,
	TableRow,
	TableCell,
} from "@nextui-org/table";
import { Link, TableBody, Chip, Code, Pagination } from "@nextui-org/react";
import { Abi, ContractAddress } from "@/config/smart-contract";
import ListItem from "./ListItem";
import PurchaseItem from "./PurchaseItem";

export default function Home() {
	const [accountAddress, setAccountAddress] = useState<string>("");
	const [items, setItems] = useState<any[]>([]);
	const [contract, setContract] = useState<any>(null);

	const [page, setPage] = useState(1);
	const rowsPerPage = 15;

	const pages = Math.ceil(items.length / rowsPerPage);

	const paginatedItems = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return items.slice(start, end);
	}, [page, items]);
	useEffect(() => {
		async function initContract() {
			try {
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				const accounts = await window.ethereum.request({
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

			<Table
				selectionMode="single"
				className="mt-4"
				aria-label="Listed items table"
				bottomContent={
					<div className="flex w-full justify-end">
						<Pagination
							isCompact
							showControls
							showShadow
							color="secondary"
							page={page}
							total={pages}
							onChange={(page) => setPage(page)}
						/>
					</div>
				}
			>
				<TableHeader>
					<TableColumn>Name</TableColumn>
					<TableColumn>Price</TableColumn>
					<TableColumn>Description</TableColumn>
					<TableColumn>Owned By</TableColumn>
					<TableColumn>Time</TableColumn>
					<TableColumn>Status</TableColumn>
					<TableColumn>Action</TableColumn>
				</TableHeader>
				<TableBody emptyContent={"No items to display."}>
					{paginatedItems.map((item) => (
						<TableRow key={item.id}>
							<TableCell>{item.name}</TableCell>
							<TableCell>
								{ethers.utils.formatEther(item.price.toString())} ETH
							</TableCell>
							<TableCell>{item.description}</TableCell>
							<TableCell>
								<Link
									isExternal
									href={`https://sepolia.etherscan.io/address/${item.owner.toString()}`}
								>
									<Code>{item.owner.toString()}</Code>
								</Link>
							</TableCell>
							<TableCell>{item.timestamp.toString()}</TableCell>
							<TableCell>
								<Chip
									color={item.isSold ? "danger" : "success"}
									size="sm"
									variant="flat"
								>
									{item.isSold ? "Sold" : "Live"}
								</Chip>
							</TableCell>
							<TableCell>
								<PurchaseItem
									item={item}
									accountAddress={accountAddress}
									contract={contract}
									setItems={setItems}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
