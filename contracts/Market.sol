// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address owner;
    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = msg.sender;
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated(
        uint256 itemId,
        address nftContract,
        uint256 tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketItem(
        uint256 tokenId,
        address nftContract,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }

    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(
            address(this),
            msg.sender,
            tokenId
        );
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    //return unsold items
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 unsoldItemsNumber = _itemIds.current() - _itemsSold.current();

        MarketItem[] memory unsoldMarketItmes = new MarketItem[](
            unsoldItemsNumber
        );
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= _itemIds.current(); i++) {
            if (!idToMarketItem[i].sold) {
                MarketItem storage marketItem = idToMarketItem[i];
                unsoldMarketItmes[currentIndex] = marketItem;
                currentIndex++;
            }
        }
        return unsoldMarketItmes;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 myNFTsNumber = 0;
        for (uint256 i = 1; i <= _itemIds.current(); i++) {
            if (idToMarketItem[i].owner == msg.sender) {
                myNFTsNumber++;
            }
        }

        MarketItem[] memory myNFTs = new MarketItem[](myNFTsNumber);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= _itemIds.current(); i++) {
            if (idToMarketItem[i].owner == msg.sender) {
                MarketItem storage item = idToMarketItem[i];
                myNFTs[currentIndex] = item;
                currentIndex++;
            }
        }
        return myNFTs;
    }

    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint256 createdItemsNumber = 0;
        for (uint256 i = 1; i <= _itemIds.current(); i++) {
            if (idToMarketItem[i].seller == msg.sender) {
                createdItemsNumber++;
            }
        }

        MarketItem[] memory createdItems = new MarketItem[](createdItemsNumber);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= _itemIds.current(); i++) {
            if (idToMarketItem[i].seller == msg.sender) {
                MarketItem storage item = idToMarketItem[i];
                createdItems[currentIndex] = item;
                currentIndex++;
            }
        }
        return createdItems;
    }
}
