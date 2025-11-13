'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import QuantityControl from '@/app/(shop)/shop/components/QtyCtrl';
import Skeleton from '@/app/components/Skeleton';
import SquarePaymentInfo from '@/app/(shop)/shop/components/SquarePaymentInfo';
import ModifierList from './ModifierList';
import { FORMAT_CURRENCY_CAD, InventoryState, MAX_LOCAL_QTY } from '@/database/constants';
import SubmitButton from '@/app/(shop)/shop/components/SubmitButton';

type Params = {
    minQty?: number, // minimum quantity allowed, default = 1
    productId: string, // product id
    productName: string, // product name
    modifierLists: { // product modifiers
        name: string,
        list: {
            default: boolean,
            name: string,
            id: string,
        }[],
    }[],
    variations: { // product variations
        name: string,
        defaultIndex: number,
        list: {
            name: string,
            price: number,
            inventoryState: string,
            inventoryQuantity: number,
        }[],
    },
    squareItem: SquareItem, // contains information directly from Square
}

// Custom ProductController component to handle display price, quantity selection and 'Add to Cart' CTA
export default function ProductController({ minQty = 1, productName, productId, modifierLists, variations, squareItem }: Params) {
    const [quantity, setQuantity] = useState(minQty);
    const { state, addToSessionCart, isPending } = useCart();
    const [indexModifiers, setModifiers] = useState<(number)[]>(new Array(modifierLists.length).fill(-1));
    const [indexVariation, setIndexVariation] = useState(variations.defaultIndex);
    const [localLoaded, toggleLocalLoaded] = useState(true); // local loading state

    const handleSubmit = () => {
        const item: SessionCartItem = {
            id: productId,
            indexModifiers: indexModifiers,
            indexVariation: indexVariation,
            quantity: quantity,
        };

        addToSessionCart(item);
    }

    useEffect(() => { // find default selected values
        for(let i = 0; i < indexModifiers.length; i++){
            if(modifierLists[i].list.find(mod => mod.default === true)){
                selectModifier(i, modifierLists[i].list.findIndex(mod => mod.default === true));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const selectModifier = (listIdx: number, modIdx: number) => {
        setModifiers((mods) =>
            mods.map((idx, i) => (i === listIdx) ? modIdx : idx)
        );
    }

    const handleVariation = (idx: number) => {
        toggleLocalLoaded(false);
        setIndexVariation(idx);
        setTimeout(() => toggleLocalLoaded(true), 300);
    }

    const handleQuantity = (amount: number) => {
        if(amount < 1) return;
        setQuantity(amount);
    }

    return (<div className={`main${isPending && localLoaded ? ' loading' : ''}`}>
        <div className="info">
            <h1 className="product-title">{productName}</h1>
            <div className="product-price">{localLoaded !== true ?
                <Skeleton><span className="amount">00.00</span></Skeleton>
            :<>
                {/* <span className="currency-symbol">&#36;</span> */}
                <span className="amount">{FORMAT_CURRENCY_CAD.format(Number(variations.list[indexVariation].price.toFixed(2)))}</span>
                {variations.list[indexVariation].inventoryState === InventoryState.NO_STOCK &&
                    <div className="badge-container">
                        <div className='badge out-of-stock'>Sold Out</div>
                    </div>
                }
                {squareItem.isArchived &&
                    <div className="badge-container">
                        <div className='badge unavailable'>Unavailable</div>
                    </div>
                }
            </>}</div>
        </div>

        {(modifierLists.length > 0 || variations.list.length > 1) &&
            <fieldset className={`selection`}>
                {variations.list.length > 1 && <>
                    <div className="variations">
                        <div className="selection-heading">{variations.name}:</div>
                        {variations.list.map((variation, i) => (<React.Fragment key={i}>
                            <input
                                type="radio"
                                id={`${variations.name.toLowerCase().replaceAll(' ','-')}-${i}`}
                                name={variations.name.toLowerCase()}
                                value={variation.name}
                                defaultChecked={i === indexVariation}
                                onChange={() => handleVariation(i)}
                                form='add-cart'
                            />
                            <label
                                htmlFor={`${variations.name.toLowerCase().replaceAll(' ','-')}-${i}`}
                                {...variation.inventoryState === InventoryState.NO_STOCK && {className: 'out-of-stock'}}
                            >
                                <span>{variation.name}</span>
                            </label>
                        </React.Fragment>))}
                    </div>
                </>}

                {modifierLists.length > 0 && <div className="modifiers">
                    {modifierLists.map((list, i) => (<React.Fragment key={i}>
                        <div className="selection-heading">Options:</div>
                        <ModifierList
                            listIdx={i}
                            modifierList={list}
                            selectModifier={selectModifier}
                        />
                    </React.Fragment>))}
                </div>}
            </fieldset>
        }
        <div className="add-to-cart">
            <form
                className="action"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                noValidate
                id='add-cart'
            >
                {localLoaded === true ? <>
                    {variations.list[indexVariation].inventoryQuantity > 0 && <>
                        <div className="quantity">
                            {variations.list[indexVariation].inventoryState === InventoryState.LOW_STOCK &&
                                <div className='notice'>Only {variations.list[indexVariation].inventoryQuantity} left!</div>
                            }
                            {variations.list[indexVariation].inventoryState !== InventoryState.NO_STOCK && !squareItem.isArchived &&
                                <QuantityControl
                                    minQty={minQty}
                                    maxQty={Math.min(variations.list[indexVariation].inventoryQuantity, MAX_LOCAL_QTY)}
                                    qty={quantity}
                                    setQty={handleQuantity}
                                />
                            }
                        </div>
                    </>}

                    {squareItem.isArchived ?
                        <button
                            className='btn-secondary'
                            disabled
                        >Unavailable</button>
                    :(variations.list[indexVariation].inventoryQuantity === 0 && variations.list[indexVariation].inventoryState === InventoryState.NO_STOCK ?
                        <button
                            className='btn-secondary'
                            disabled
                        >Sold Out</button>
                    :
                        <SubmitButton
                            text={'Add to Cart'}
                            pendingText={'Loading'}
                            localPending={state.cart === undefined || isPending}
                            // props={{
                            //     'autoFocus': true
                            // }}
                        />
                    )}
                    
                </>:<Skeleton classes='width-100'>
                    <button
                        className='btn-secondary'
                        disabled
                    >Loading</button>
                </Skeleton>}
            </form>
            <SquarePaymentInfo />
        </div>
    </div>);
}