import React, { useMemo, useState } from "react";
import { Code } from "@nextui-org/code";
import {
	Table,
	Pagination,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Chip,
	Link,
} from "@nextui-org/react";
import { ethers } from "ethers";
import PurchaseItem from "./PurchaseItem";
import Item from "@/types/Item";

export default function ItemsListTable({
	items,
	setItems,
	accountAddress,
	contract,
}: {
	items: Item[];
	setItems: React.Dispatch<React.SetStateAction<Item[]>>;
	accountAddress: string;
	contract: ethers.Contract;
}) {
	const [page, setPage] = useState(1);
	const rowsPerPage = 15;

	const pages = Math.ceil(items.length / rowsPerPage);

	const paginatedItems = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;

		return items.slice(start, end);
	}, [page, items]);
	return (
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
	);
}

