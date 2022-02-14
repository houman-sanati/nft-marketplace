import axios from 'axios';
import { ethers } from 'ethers'
import { useContext, useEffect, useState } from "react";
import ConnectYourWallet from '../components/ConnectYourWallet';
import Loader from '../components/Loader';
import NFTItem from '../components/NFTItem';
import AppContext from "../context/AppContext";
import { Strings } from '../utils/Strings';

const CreatorDashboard = () => {
    const [nfts, setNfts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const appContext = useContext(AppContext)

    const loadDashboard = async () => {
        const nftContractInstance = appContext.nftContractInstance
        const marketContractInstance = appContext.marketContractInstance

        const tempUserNfts = await marketContractInstance.fetchItemsCreated()

        const userNfts = await Promise.all(tempUserNfts.map(async (el) => {
            const tokenUri = await nftContractInstance.tokenURI(el.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(el.price.toString(), 'ether')
            return {
                price,
                itemId: el.itemId.toNumber(),
                seller: el.seller,
                owner: el.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
                sold: el.sold
            }
        }))
        setNfts(userNfts)
        setIsLoading(false)
    }

    useEffect(() => {
        appContext.walletIsConnected && loadDashboard()
    }, [appContext.walletIsConnected])

    if (!isLoading && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">{Strings.noItemsFound}</h1>)
    if (!appContext.walletIsConnected) return <ConnectYourWallet />
    return (
            <div className="flex">
                <div>
                    {isLoading ? <Loader /> :
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 mx-5">
                            {nfts.map((nft, i) => <NFTItem nft={nft} index={i} />)}
                        </div>
                    }

                </div>
            </div>
    );
}

export default CreatorDashboard