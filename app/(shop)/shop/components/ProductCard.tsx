import Link from "next/link";
import Image from 'next/image';
import Figure from "@/app/components/Figure";
import { FORMAT_CURRENCY_CAD, InventoryState } from "@/database/constants";

type Params = {
    name: string,
    productId: string,
    price: number,
    imageUrl: string,
    invState: string,
    index?: number,
}

export default async function ProductCard({ name, productId, price, imageUrl, invState, index}: Params) {
    return (<div className="product-item">
        <Figure
            className="container-1"
        >
            {/* {invState === InventoryState.LOW_STOCK &&
                <span className='badge low-stock'></span>
            } */}
            
            {invState === InventoryState.NO_STOCK &&
                <div className="badge-container">
                    <div className='badge out-of-stock'>Sold Out</div>
                </div>
            }
            <Link
                href={`/shop/${productId}`}
                className={'item-link'}
                title={name}
            >
                <Image // decorative image
                    width={190}
                    height={237}
                    src={imageUrl}
                    alt=''
                    role="presentation"
                    {...index && index >= 0 && index < 3 && {
                        priority: true,
                        fetchPriority: 'high',
                    }}
                />
            </Link>
        </Figure>
        <div className="container-2">
            <div className="info">
                <Link
                    href={`/shop/${productId}`}
                    title={name}
                >
                    {name}
                </Link>
                <div className="product-price">
                    {/* <span className="currency-symbol">&#36;</span>
                    <span className="amount">{price.toFixed(2)}</span> */}
                    <span className="amount">{FORMAT_CURRENCY_CAD.format(price)}</span>
                </div>
            </div>
        </div>
    </div>);
}