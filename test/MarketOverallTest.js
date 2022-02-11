const hre = require("hardhat");

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
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

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()
    console.log('listingPrice:', nftContractAddress)

    const auctionPrice = hre.ethers.utils.parseUnits('1', 'ether')

    const uriList = [
      "https://www.mytokenlocation1.com",
      "https://www.mytokenlocation2.com",
      "https://www.mytokenlocation3.com",
      "https://www.mytokenlocation4.com",
      "https://www.mytokenlocation5.com"
    ]

    const createdTokenIds = await Promise.all(uriList.map(async (uri) => {
      let transaction = await nft.createToken(uri)
      let tx = await transaction.wait()
      let event = tx.events[0]
      let value = event.args[2]
      return value.toNumber()
    }))

    console.table(createdTokenIds)

    await Promise.all(createdTokenIds.map(async (itemId) => {
      await market.createMarketItem(itemId, nftContractAddress, auctionPrice, { value: listingPrice })
    }))

      const [_, buyerAddress] = await hre.ethers.getSigners()

      await market.connect(buyerAddress).createMarketSale(nftContractAddress, createdTokenIds[0], { value: auctionPrice })
      await market.connect(buyerAddress).createMarketSale(nftContractAddress, createdTokenIds[1], { value: auctionPrice })

      let items = await market.fetchMarketItems()
      items = await Promise.all(items.map(async el => {
        const tokenUri = await nft.tokenURI(el.tokenId)
        let item = {
          price: el.price.toString(),
          tokenId: el.tokenId.toString(),
          seller: el.seller,
          owner: el.owner,
          tokenUri
        }
        return item
      }))
      console.log('market items: ')
      console.table(items)

      let buyerNfts = await market.connect(buyerAddress).fetchMyNFTs()
      buyerNfts = await Promise.all(buyerNfts.map(async i => {
        const tokenUri = await nft.tokenURI(i.tokenId)
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri
        }
        return item
      }))
      console.log('buyer Nfts:')
      console.table(buyerNfts)
  })
})
