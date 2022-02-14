import { ethers } from 'ethers'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import AppContext from '../context/AppContext'
import NFTItem from '../components/NFTItem'

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
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
    return (
        <div className="flex justify-center">
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
                    {
                        nfts.map((nft, i) => (<NFTItem nft={nft} index={i} />))
                    }
                </div>
            </div>
        </div>
    )
}