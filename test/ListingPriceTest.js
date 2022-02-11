const hre = require("hardhat");

describe("listing price test", () => {
    it("Should calculate listing price", async () => {
        const Market = await hre.ethers.getContractFactory("NFTMarket")
        const market = await Market.deploy()
        await market.deployed()
        const marketAddress = market.address
        console.log('marketAddress:', marketAddress)
    
        const NFT = await hre.ethers.getContractFactory("NFT")
        const nft = await NFT.deploy(marketAddress)
        await nft.deployed()
        const nftContractAddress = nft.address
        console.log('nftContractAddress:', nftContractAddress)
    
        let listingPrice = await market.getListingPrice(hre.ethers.utils.parseUnits('1000', 'wei'))
        console.log("listingPrice:", hre.ethers.utils.formatEther(listingPrice))
      })
})