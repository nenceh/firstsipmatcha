import { BASE } from "@/database/constants";
import Figure from "@/app/components/Figure";
import Image from "next/image";
import Skeleton from "@/app/components/Skeleton";

export default function SkeletonItem({}){
    return(<div className="cart-item">
        <Skeleton><div className="cart-item-img">
            <Figure>
                <Image // decorative image
                    width={1}
                    height={1}
                    src={`${BASE}/images/menu/temp.png`}
                    alt=''
                    role="presentation"
                />
            </Figure>
        </div></Skeleton>
        <div className="cart-item-info">
            <div className="product">
                <Skeleton><div className="product-name">Loading</div></Skeleton>
                <div className="product-modifiers">
                    <Skeleton><div>Loading</div></Skeleton>
                </div>
            </div>
            <div className="product-quantity-price">
                <Skeleton><div className="quantity-control">
                    Loading
                </div></Skeleton>
                <Skeleton><div className="price">
                    <span className="currency-symbol">&#36;</span>
                    <span className="amount">00.00</span>
                </div></Skeleton>
            </div>
        </div>
    </div>);
}