'use client';

import { useState } from "react";
import { FORMAT_CURRENCY_CAD, InventoryState, MAX_LOCAL_QTY } from "@/database/constants";
import Figure from "@/app/components/Figure";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/contexts/CartContext";
import QuantityControl from "../../components/QtyCtrl";

type Params = {
    cartItem: SquareCartItem,
    updateQty: (item: SessionCartItem, amount: number) => void,
    removeFromCart: (item: SessionCartItem) => void,
    index: number,
}

export default function CartItem({cartItem, updateQty, removeFromCart, index}: Params) {
    const { state, isPending } = useCart();

    const [localQty, setLocalQty] = useState(cartItem.quantity);
    
    const setQuantity = (amount: number) => {
        if(amount !== cartItem.quantity){
            updateQty(cartItem, amount);
        }
    };

    const handleRemove = () => {
        if(localQty <= 1){
            removeFromCart(cartItem);
        }
    }

    return (<div className="cart-item">
        <div className="cart-item-img">
            <Link href={`/shop/${cartItem.id}`} title={cartItem.squareItem.name}><Figure>
                <Image // decorative image
                    width={80}
                    height={80}
                    src={cartItem.squareItem.imageUrl}
                    alt=''
                    role='presentation'
                />
            </Figure></Link>
        </div>
        <div className="cart-item-info">
            <div className="product">
                <div className="product-name"><Link href={`/shop/${cartItem.id}`}>{cartItem.squareItem.name}</Link></div>
                <div className="product-modifiers">
                    {cartItem.indexModifiers.length > 0 &&
                        cartItem.indexModifiers.map((modindex, listindex) => (
                            <div key={listindex}>{cartItem.squareItem.modifiers[listindex].list[modindex].name}</div>
                        ))
                    }
                    <div>{cartItem.squareItem.variations.list[cartItem.indexVariation].name}</div>
                </div>
            </div>
            <div className={`product-quantity-price${isPending || !state.cart ? ' loading' : ''}`}>
                <QuantityControl
                    maxQty={Math.min(
                        cartItem.squareItem.variations.list[cartItem.indexVariation].inventoryQuantity,
                        MAX_LOCAL_QTY,
                    )}
                    qty={localQty}
                    setQty={setLocalQty}
                    pushQty={setQuantity}
                    handleRemove={handleRemove}
                    index={index}
                    isPending={isPending}
                />
                <div className="price">
                    {cartItem.squareItem.variations.list[cartItem.indexVariation].inventoryState !== InventoryState.NO_STOCK ? <>
                        {/* <span className="currency-symbol">&#36;</span> */}
                        <span className="amount">{FORMAT_CURRENCY_CAD.format(Number((cartItem.squareItem.variations.list[cartItem.indexVariation].price * cartItem.quantity).toFixed(2)))}</span>
                    </>:<>
                        Sold Out
                    </>}
                </div>
            </div>
        </div>
    </div>);
}