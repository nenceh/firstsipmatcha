import Skeleton from '@/app/components/Skeleton';

export default function SkeletonCartCheckout() {    
    return (<>
        <div className="cart-total">
            <Skeleton classes='width-100'>
            <div className="subtotal">
                <div>Subtotal</div>
                <div className="cart-price">
                   <span className="amount">$00.00</span>
                </div>
            </div>
            </Skeleton>
        </div>
    </>);
}