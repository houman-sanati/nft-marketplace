import { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom'
import { create as ipfsHttpClient } from 'ipfs-http-client'

import AppContext from '../context/AppContext'
import { Strings } from '../utils/Strings'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })

    const [fee, setFee] = useState('')

    const navigate = useNavigate()
    const appContext = useContext(AppContext)

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }
    async function createMarket() {
        const { name, description, price } = formInput
        if (!name || !description || !price || !fileUrl) return
        /* first, upload to IPFS */
        const data = JSON.stringify({
            name, description, image: fileUrl
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
            createSale(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    const getListingPrice = async (price) => {
        if (!price) setFee('')
        let marketContractInstance = appContext.marketContractInstance
        const priceInWei = ethers.utils.parseEther(price)
        const ListingPriceInWei = await marketContractInstance.getListingPrice(priceInWei)
        return ethers.utils.formatEther(ListingPriceInWei)
    }

    const createSale = async (url) => {
        let nftContractInstance = appContext.nftContractInstance
        let transaction = await nftContractInstance.createToken(url)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        const price = ethers.utils.parseUnits(formInput.price, 'ether')

        let marketContractInstance = appContext.marketContractInstance
        const listingPrice = (ethers.utils.parseUnits(fee, 'ether')).toString()
        console.log(listingPrice)

        transaction = await marketContractInstance.createMarketItem(tokenId, appContext.nftaddress, price, { value: listingPrice })
        transaction.wait().then(() => {
            navigate('/')
        })
    }

    return (
        <div className="flex justify-center">
            <div className="w-1/3 flex flex-col p-5 shadow-lg">
                <input
                    placeholder={Strings.assetName}
                    className="mt-8 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <textarea
                    placeholder={Strings.description}
                    className="mt-2 border rounded p-4"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input
                    placeholder={Strings.price}
                    className="mt-2 border rounded p-4"
                    onChange={e => {
                        const value = e.target.value
                        updateFormInput({ ...formInput, price: value })
                        getListingPrice(value).then(result => {
                            setFee(result)
                        })
                    }}
                />
                <div className='flex justify-between items-center text-sm text-green-600 mt-1'>
                    {fee && <span>{Strings.listingFee}: {fee} {Strings.ether}</span>}
                    <span className=''>{Strings.feePercent}</span>
                </div>
                <input
                    type="file"
                    name="Asset"
                    className="my-4"
                    onChange={onChange}
                />
                {
                    fileUrl && (
                        <img className="rounded mt-4" width="350" src={fileUrl} />
                    )
                }
                <button onClick={createMarket} className="font-bold mt-4 bg-primary text-white rounded p-4 shadow-lg">
                    {Strings.create}
                </button>
            </div>
        </div>
    )
}