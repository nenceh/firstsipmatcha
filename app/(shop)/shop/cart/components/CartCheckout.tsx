'use client';

import { useCart } from '@/app/contexts/CartContext';
import SquarePaymentInfo from '../../components/SquarePaymentInfo';
import Skeleton from '@/app/components/Skeleton';
import SubmitButton from '../../components/SubmitButton';
import { FORMAT_CURRENCY_CAD } from '@/database/constants';

// Custom CartCheckout components with 'Proceed to Checkout' CTA
export default function CartCheckout({ list }: { list: SquareCartItem[] }) {
    const { state, isPending } = useCart();
    
    return (<>
        <div className="cart-total">
            <div className="subtotal">
                <div>Subtotal</div>
                <div className="cart-price">
                    {!isPending ? <>
                        {/* <span className="currency-symbol">&#36;</span> */}
                        <span className="amount">{FORMAT_CURRENCY_CAD.format(Number(list.reduce((n, { indexVariation, squareItem, quantity }) => n + squareItem.variations.list[indexVariation].price * quantity, 0).toFixed(2)))}</span>
                    </>:
                        <Skeleton><span className="amount">$00.00</span></Skeleton>
                    }
                </div>
            </div>
        </div>
        <div className="checkout">
            {state.cart ?
                <SubmitButton
                    text='Proceed to Checkout'
                    pendingText='Loading'
                    localPending={isPending}
                    
                />
            :
                <Skeleton classes='width-100'><button
                    className='btn-primary'
                    disabled
                >
                    Loading
                </button></Skeleton>
            }
            <SquarePaymentInfo />
        </div>
    </>);
}