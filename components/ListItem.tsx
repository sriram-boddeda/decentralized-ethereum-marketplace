import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import {
	Input,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Code,
	Link,
} from "@nextui-org/react";
import { button as buttonStyles } from "@nextui-org/theme";
import { ethers } from "ethers";
import { Spinner } from "@nextui-org/react";

export default function ListItem({
	contract,
	setItems,
}: {
	contract: any;
	setItems: React.Dispatch<React.SetStateAction<any[]>>;
}) {
	const [itemName, setItemName] = useState("");
	const [itemPrice, setItemPrice] = useState("");
	const [itemDescription, setItemDescription] = useState("");
	const [transactionHash, setTransactionHash] = useState("");
	const [isAddingItem, setIsAddingItem] = useState(false);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		isOpen: isAddedOpen,
		onOpen: onAddedOpen,
		onClose: onAddedClose,
	} = useDisclosure();

	async function addItem() {
		if (!contract) return;
		try {
			setIsAddingItem(true); // Show loader
			const tx = await contract.addItem(
				itemName,
				ethers.utils.parseEther(itemPrice),
				itemDescription
			);
			await tx.wait();
			setTransactionHash(tx.hash);
			onAddedOpen();
			const updatedItems = await contract.getItems();
			setItems(updatedItems);
		} catch (error) {
			console.error("Error adding item:", error);
		} finally {
			setIsAddingItem(false); // Hide loader
		}
	}

	return (
		<div>
			<Button
				onPress={onOpen}
				className={buttonStyles({
					color: "primary",
					radius: "full",
					variant: "shadow",
				})}
			>
				List new item
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								New item
							</ModalHeader>
							<ModalBody>
								<Input
									label="Item name"
									value={itemName}
									onChange={(e) => setItemName(e.target.value)}
								/>
								<Input
									label="Item price (ETH)"
									value={itemPrice}
									onChange={(e) => setItemPrice(e.target.value)}
								/>
								<Input
									label="Item description"
									value={itemDescription}
									onChange={(e) => setItemDescription(e.target.value)}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary" onPress={onClose} onClick={addItem}>
									{isAddingItem ? <Spinner /> : "List item"}{" "}
									{/* Show loader or button text */}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<Modal isOpen={isAddedOpen} onClose={onAddedClose}>
				<ModalContent>
					<ModalHeader>Item added successfully!</ModalHeader>
					<ModalBody>
						<p>Item name: {itemName}</p>
						<p>Item price: {itemPrice} ETH</p>
						<p>Item description: {itemDescription}</p>
						Transaction hash:{" "}
						<Link
							isExternal
							href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
						>
							<Code className="truncate">{transactionHash}</Code>
						</Link>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onPress={onAddedClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
