import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import AppContext from '../context/AppContext'

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    const appContext = useContext(AppContext)

    useEffect(() => {
        loadNFTs()
    }, [])
    
    async function loadNFTs() {
        const marketContractInstance = appContext.marketContractInstance
        const nftContractInstance = appContext.nftContractInstance
        const data = await marketContractInstance.fetchMyNFTs()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await nftContractInstance.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
            }
            return item
        }))
        setNfts(items)
        setLoadingState('loaded')
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
    return (
        <div className="flex justify-center">
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="border shadow rounded-xl overflow-hidden">
                                <img src={nft.image} className="rounded" />
                                <div className="p-4 bg-black">
                                    <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}