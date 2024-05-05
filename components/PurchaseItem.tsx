import {
	Tooltip,
	useDisclosure,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Link,
	Code,
	Button,
} from "@nextui-org/react";
import React, { useState } from "react";
import { PurchaseIcon } from "./icons";

export default function PurchaseItem({
	item,
	accountAddress,
	contract,
	setItems,
}: {
	item: any;
	accountAddress: string;
	contract: any;
	setItems: React.Dispatch<React.SetStateAction<any[]>>;
}) {
	const [transactionHash, setTransactionHash] = useState("");
	const [isPurchasingItem, setIsPurchasingItem] = useState(false);
	const {
		isOpen: isPurchasedOpen,
		onOpen: onPurchasedOpen,
		onClose: onPurchasedClose,
	} = useDisclosure();

	const isDisabled: boolean =
		item.owner.toString().toLowerCase() === accountAddress.toLowerCase() ||
		item.isSold;

	async function purchaseItem(id: number) {
		if (!contract) return;
		try {
			const tx = await contract.purchaseItem(id, {
				value: item.price,
			});
			await tx.wait();
			setTransactionHash(tx.hash);
			onPurchasedOpen();
			const updatedItems = await contract.getItems();
			setItems(updatedItems);
		} catch (error) {
			const errMessage = (error as Error).message;
			if (errMessage.includes("user rejected transaction")) {
				console.error("User rejected the transaction");
			} else if (errMessage.includes("insufficient funds")) {
				console.log("Insufficient funds!");
			} else if (errMessage.includes("You cannot purchase your own item")) {
				console.error("You cannot purchase your own item!");
			} else if (errMessage.includes("Item is already sold")) {
				console.error("Item is already sold!");
			} else {
				console.error("Error purchasing item:", errMessage);
			}
		}
	}
	return (
		<div>
			<Tooltip
				showArrow={true}
				content={
					item.owner.toString().toLowerCase() === accountAddress.toLowerCase()
						? "Cannot purchase your own item"
						: item.isSold
						? "Item is already sold!"
						: "Buy Item"
				}
				color={isDisabled ? "danger" : "primary"}
			>
				<button
					disabled={isDisabled}
					onClick={() => purchaseItem(item.id)}
					className="text-lg text-default-400 cursor-pointer active:opacity-50"
				>
					<PurchaseIcon
						color={isDisabled ? "danger" : "primary"}
						className={!isDisabled ? "stroke-blue-500" : ""}
					/>
				</button>
			</Tooltip>
			<Modal isOpen={isPurchasedOpen} onClose={onPurchasedClose}>
				<ModalContent>
					<ModalHeader>Purchased item successfully!</ModalHeader>
					<ModalBody>
						Transaction hash:{" "}
						<Link
							isExternal
							href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
						>
							<Code className="truncate">{transactionHash}</Code>
						</Link>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onPress={onPurchasedClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
