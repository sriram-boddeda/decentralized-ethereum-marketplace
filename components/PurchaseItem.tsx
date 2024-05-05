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
	Spinner,
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
	accountAddress: string | undefined;
	contract: any;
	setItems: React.Dispatch<React.SetStateAction<any[]>>;
}) {
	const [transactionHash, setTransactionHash] = useState("");
	const [isPurchasingItem, setIsPurchasingItem] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const {
		isOpen: isPurchasedOpen,
		onOpen: onPurchasedOpen,
		onClose: onPurchasedClose,
	} = useDisclosure();

	const isDisabled: boolean =
		item.owner.toString().toLowerCase() === accountAddress?.toLowerCase() ||
		item.isSold;

	async function purchaseItem(id: number) {
		if (!contract) return;
		try {
			setIsLoading(true);
			const tx = await contract.purchaseItem(id, {
				value: item.price,
			});
			await tx.wait();
			setTransactionHash(tx.hash);
			onPurchasedOpen();
			const updatedItems = await contract.getItems();
			setItems(updatedItems);
		} catch (error) {
			// Handle errors
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
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div>
			<Tooltip
				showArrow={true}
				content={
					item.owner.toString().toLowerCase() === accountAddress?.toLowerCase()
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
			{/* Render spinner overlay if isLoading is true */}
			{isLoading && (
				<div className="fixed top-0 left-0 z-50 w-screen h-screen backdrop-filter backdrop-blur-sm bg-opacity-50 flex justify-center items-center">
					<Spinner color="primary" size="lg" />
				</div>
			)}
		</div>
	);
}
