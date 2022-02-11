import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import AppContext from '../context/AppContext'
import { Strings } from '../utils/Strings'
import Loader from '../components/Loader'
import ConnectYourWallet from '../components/ConnectYourWallet'
import NFTItem from '../components/NFTItem'

export default function Home() {
    const [nfts, setNfts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const appContext = useContext(AppContext)

    useEffect(() => {
        appContext.walletIsConnected && loadMarketItems()
    }, [appContext.walletIsConnected])

    const loadMarketItems = async () => {
        const nftContractInstance = appContext.nftContractInstance
        const marketContractInstance = appContext.marketContractInstance
        const data = await marketContractInstance.fetchMarketItems()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await nftContractInstance.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                itemId: i.itemId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
            }
            return item
        }))
        setNfts(items)
        setIsLoading(false)
    }
    const buyNft = async (nft) => {
        const marketContractInstance = appContext.marketContractInstance

        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        const transaction = await marketContractInstance.createMarketSale(appContext.nftaddress, nft.itemId, {
            value: price
        })
        await transaction.wait()
        loadMarketItems()
    }
    if (!isLoading && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">{Strings.noItemsFound}</h1>)
    if (!appContext.walletIsConnected) return <ConnectYourWallet />
    return (
        <>
            <div className="flex">
                <div>
                    {isLoading ? <Loader /> :
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mx-5">
                            {nfts.map((nft, i) => <NFTItem nft={nft} index={i} onBuyClick={() => buyNft(nft)} />)}
                        </div>
                    }

                </div>
            </div>
        </>
    )
}
