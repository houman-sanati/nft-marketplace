import { Strings } from "../utils/Strings";

const NFTItem = ({ index, nft , onBuyClick }) => (
    <div key={index} className="border rounded-xl shadow-md hover:shadow-2xl overflow-hidden">
        <img src={nft.image} />
        <div className="p-4">
            <p style={{ height: '35px' }} className="text-xl font-semibold">{nft.name}</p>
            <div style={{ height: '35px', overflow: 'hidden' }}>
                <p className="text-gray-400">{nft.description}</p>
            </div>
        </div>
        <div className="p-4 bg-black">
            <p className="text-xl mb-4 font-bold text-white">{`${nft.price} متیک`}</p>
            <button className="w-full bg-primary text-white font-bold py-2 px-12 rounded" onClick={() => onBuyClick()}>{Strings.buy}</button>
        </div>
    </div>
)

export default NFTItem;