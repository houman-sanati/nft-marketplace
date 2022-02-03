import { Link, Outlet } from 'react-router-dom';
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'

import { nftaddress, nftmarketaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import { useState } from 'react';
import { Strings } from './utils/Strings';
import AppContext from './context/AppContext';

const App = () => {

  const [accountAddress, setAccountAddress] = useState(null)
  const [nftContractInstance, setNftContractInstance] = useState(null)
  const [marketContractInstance, setMarketContractInstance] = useState(null)

  const connectWallet = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    signer.getAddress().then(address => setAccountAddress(address))
    let nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    setNftContractInstance(nftContract)
    setMarketContractInstance(marketContract)
  }

  const getValues = () => ({
    nftContractInstance,
    marketContractInstance,
    nftaddress,
    nftmarketaddress
  })

  return (
    <>
      <div>
        <nav className="flex p-5 bg-primary text-white items-center justify-between">
          <div className='flex'>
            <h2 className="text-xl font-bold">{Strings.marketName}</h2>
            <div className="grid grid-flow-col gap-4 mr-10">
              <Link to="/">{Strings.home}</Link>
              <Link to="/create-item">{Strings.createItem} </Link>
              <Link to="/my-assets">{Strings.myAssets}</Link>
              <Link to="/creator-dashboard">{Strings.dashboard}</Link>
            </div>
          </div>
          <div>
            {accountAddress ? <span>{Strings.connectedAddress}: {accountAddress}</span> :
              <button onClick={connectWallet} type='button' className='border-2 p-2 rounded-full shadow-lg'>{Strings.connectWallet}</button>}
          </div>
        </nav>
        <AppContext.Provider value={getValues()}>
          <Outlet />
        </AppContext.Provider>
      </div>
    </>
  );
}

export default App;
