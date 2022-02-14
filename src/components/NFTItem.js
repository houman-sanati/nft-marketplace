import { Strings } from "../utils/Strings";

const NFTItem = ({ index, nft, onBuyClick }) => (
    <div key={index} className="flex flex-col justify-between border hover:border-4 rounded-xl shadow-md hover:shadow-2xl overflow-hidden">
        <div className="w-full h-1/2">
            <img src={nft.image} className="w-full h-full object-contain" alt="" />
        </div>
        <div className="p-4">
            {nft.name && <p className="text-xl font-semibold">{nft.name}</p>}
            {nft.description && <div className="py-1">
                <p className="text-gray-400">{nft.description}</p>
            </div>}
        </div>
        <div className="p-4 bg-black">
            <div className="text-xl mb-4 font-bold text-white flex justify-between items-center">
                <p>{`${nft.price} ${Strings.ether}`}</p>
                {nft.sold && <p className="text-sm">{Strings.sold}</p>}
            </div>

            {onBuyClick && <button className="w-full bg-primary text-white font-bold py-2 px-12 rounded" onClick={() => onBuyClick()}>{Strings.buy}</button>}
        </div>
    </div>
)

export default NFTItem;