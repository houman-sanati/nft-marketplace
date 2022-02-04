import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import AppContext from '../context/AppContext'
import { Strings } from '../utils/Strings'

export default function Home() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const appContext = useContext(AppContext)

    useEffect(() => {
        loadMarketItems()
    }, [])

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
        setLoadingState('loaded')
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
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
    return (
        <div className="flex justify-center">
            <div className="px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="border rounded-xl shadow-md hover:shadow-2xl overflow-hidden">
                                <img src={nft.image} />
                                <div className="p-4">
                                    <p style={{ height: '35px' }} className="text-xl font-semibold">{nft.name}</p>
                                    <div style={{ height: '35px', overflow: 'hidden' }}>
                                        <p className="text-gray-400">{nft.description}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-black">
                                    <p className="text-xl mb-4 font-bold text-white">{nft.price} ETH</p>
                                    <button className="w-full bg-primary text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>{Strings.buy}</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
