// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract Marketplace {
    struct Item {
        uint256 id;
        string name;
        uint256 price;
        string description;
        address payable owner;
        uint256 timestamp;
        bool isSold;
    }

    event ItemAdded(uint256 indexed itemId, string name, uint256 price, string description, address owner);
    event ItemPurchased(uint256 indexed itemId, address buyer, uint256 price);

    uint256 private itemIdCounter;
    mapping(uint256 => Item) public items;

    constructor() {
        // Initialize items
        // addItem("Laptop", 50000000, "Brand new laptop with high performance specs.");
        // addItem("Headphones", 2000000000, "Wireless headphones with noise cancellation feature.");
        // addItem("Smartphone", 3000000000, "Latest smartphone model with advanced camera technology.");
        // addItem("Smart Watch", 1000000000, "Fitness tracker and smartwatch with heart rate monitor.");
        // addItem("Gaming Console", 4000000000, "Next-gen gaming console with 4K resolution support.");
        addItem("Rubber Chicken", 10000000000, "Classic rubber chicken for all your comedic needs.");
        addItem("Whoopie Cushion", 5000000000, "Fart noise maker disguised as a cushion.");
        addItem("Glow-in-the-Dark Toilet Paper", 300000000, "Never miss the toilet again with this glowing toilet paper.");
        addItem("Invisible Ink Pen", 2000000, "Write secret messages that only reveal themselves under UV light.");
        addItem("Fake Mustache Kit", 1500000000, "Instantly become someone else with this collection of fake mustaches.");
    }

    function addItem(string memory _name, uint256 _price, string memory _description) public {
        require(bytes(_name).length > 0, "Item name cannot be empty");
        require(_price > 0, "Item price must be greater than zero");
        require(bytes(_description).length > 0, "Item description cannot be empty");

        uint256 itemId = itemIdCounter++;
        items[itemId] = Item(itemId, _name, _price, _description, payable(msg.sender), block.timestamp, false);

        emit ItemAdded(itemId, _name, _price, _description, msg.sender);
    }

    function getItems() public view returns (Item[] memory) {
        uint256 itemCount = itemIdCounter;
        Item[] memory itemsArray = new Item[](itemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            itemsArray[i] = items[i];
        }

        return itemsArray;
    }

    function purchaseItem(uint256 _id) public payable {
        Item storage item = items[_id];
        require(item.id != 0, "Item not found");
        require(!item.isSold, "Item is already sold");
        require(msg.value >= item.price, "Insufficient funds");
        require(item.owner != msg.sender, "You cannot purchase your own item");

        // Transfer amount to the seller before changing the owner of the item!
        item.owner.transfer(msg.value);

        item.owner = payable(msg.sender);
        item.timestamp = block.timestamp;
        item.isSold = true;

        emit ItemPurchased(_id, msg.sender, item.price);
    }

    function relistItem(uint256 _id) public {
        Item storage item = items[_id];
        require(item.id != 0, "Item not found");
        require(item.owner == msg.sender, "You can only relist your own items");
        require(item.isSold, "Item is not sold");

        item.isSold = false;
    }

    function getItem(uint256 _id) public view returns (Item memory) {
        require(items[_id].id != 0, "Item not found");
        return items[_id];
    }
}
