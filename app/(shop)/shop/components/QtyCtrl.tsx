'use client';

import { Dispatch, SetStateAction, useState } from 'react';

type Params = {
    isPending?: boolean, // local loading state
    minQty?: number, // minimum quantity allowed, default = 1
    maxQty: number, // maximum quantity allowed
    qty: number, // local quantity value, range = [minQty, maxQty]
    setQty: Dispatch<SetStateAction<number>> | ((val: number) => void), // function to set local quantity value
    pushQty?: (amount: number) => void, // function to update quantity value of cart item
    handleRemove?: () => void, // function to remove cart item
    index?: number, // index of current item in a list
}

export default function QuantityControl({ isPending = false, minQty = 1, maxQty, qty, setQty, pushQty, handleRemove, index }: Params){
    const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>(undefined); // local timer used to prevent unnecessary server actions

    const handleControl = (val: number) => {
        setQty(qty + val);

        if(pushQty){
            if(timerId){
                clearTimeout(timerId);
            }

            const newTimerId = setTimeout(() => {
                pushQty(qty+val);
            }, 300);

            setTimerId(newTimerId);
        }
    }

    return (<div className='quantity-control'>
        <button
            className='btn-icon'
            onClick={(e) => {
                e.preventDefault();
                if(qty <= minQty && pushQty && handleRemove){
                    if(timerId){
                        clearTimeout(timerId);
                    }
                    handleRemove()
                } else{
                    handleControl(-1);
                }
            }}
            aria-label={`${isPending ? 'Loading quantity minus' : (qty <= minQty && pushQty ? 'Remove cart item' : 'Quantity minus')}`}
            disabled={isPending || (pushQty ? qty <= minQty - 1 : qty <= minQty)}
        >
            <i aria-hidden={true} className={`fa fa-solid fa-${qty <= minQty && pushQty ? "trash" : "minus"}`}></i>
        </button>

        <input
            id={`product-quantity${index ? `-${index}` : ``}`}
            name="quantity"
            aria-label={`${isPending ? 'Loading p' : 'P'}roduct quantity`}
            type="number"
            value={qty}
            disabled={isPending}
            onChange={e => {
                setQty(
                    Math.max(
                        minQty,
                        Math.min(
                            maxQty,
                            Number(e.target.value)
                        )
                    )
                );
            }}
            min={minQty}
            max={maxQty}
            step="1"
            autoComplete="off"
            inputMode="numeric"
            onKeyDown={(e) => {
                if(e.key === 'Enter'){ // prevent accidentally changing quantity value
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
            {...pushQty && {
                onBlur: (e) => pushQty(Number(e.target.value)),
                onKeyUp: (e) => {
                    if(e.key === 'Enter'){
                        pushQty(Number((e.target as HTMLInputElement).value));
                    }
                }
            }}
        />                
        
        <button
            className='btn-icon'
            onClick={(e) => {
                e.preventDefault();
                handleControl(1);
            }}
            disabled={isPending || (qty >= maxQty)}
            aria-label={`${isPending ? 'Loading q' : 'Q'}uantity add`}
        >
            <i aria-hidden={true} className="fa fa-solid fa-plus"></i>
        </button>
    </div>);
}