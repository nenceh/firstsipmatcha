'use client';

import { useEffect, useState } from "react";
import PageNote from "../../components/PageNote";
import SquarePaymentInfo from "../../components/SquarePaymentInfo";
import { createSquarePaymentLink, resetCache } from "@/lib/serverActions";
import { useRouter } from "next/navigation";
import { BASE_URL, MarketPaths } from "@/database/constants";
import { useCart } from "@/app/contexts/CartContext";
import SkeletonOrder from "./SkeletonOrder";

export default function CreateOrder() {
    const { state, orderErrorNote, clearSessionCart, revalidate } = useCart();
    const [order, setOrder] = useState<NewOrder>();
    const router = useRouter();
    const [localLoaded, setLocalLoaded] = useState(false);
    // const [canCopy, toggleCanCopy] = useState<boolean | null>(true);

    const redirectToSquare = () => {
        if(order){
            try{
                router.replace(order.paymentLink);
            } catch(e){
                console.log(e);
            }
        }
    }

    // https://flowbite.com/docs/components/clipboard/
    /*const copyToClipboard = (order ?
        <button
            id='copy-to-clipboard'
            className={`btn-secondary${canCopy === false ? ' copied' : ''}`}
            onClick={(e) => {
                e.preventDefault();
                toggleCanCopy(null);
                navigator.clipboard.writeText(order.paymentLink);
                toggleCanCopy(false);
                setTimeout(() => toggleCanCopy(true), 5000);
            }}
            disabled={!canCopy}
        >
            {canCopy ? <>
                <i className="fa fa-solid fa-copy"></i><span>Copy Link to Clipboard</span>
            </>:(canCopy === false ? <>
                <i className="fa fa-solid fa-clipboard-check"></i><span>Copied</span>
            </>:<><i className="fa fa-solid fa-spinner fa-spin-pulse"></i><span>Copying</span></>)}
        </button>
    :<Skeleton><button className="btn-secondary" disabled>Loading</button></Skeleton>);*/

    const init = async() => {
        const res = await createSquarePaymentLink();
        if(res.status){
            clearSessionCart();
            setOrder(res.data);
            revalidate(); // api route
        } else{
            router.replace(`${BASE_URL}${MarketPaths.CART}`);
            orderErrorNote();
        }
    }

    useEffect(() => {
        if(!order && state.cart && state.cart.length > 0){
            setLocalLoaded(true);
            init();
        } else{
            setTimeout(() => router.replace(`${BASE_URL}${MarketPaths.CART}`), 200);
        }
        return() => {
            resetCache(MarketPaths.CHECKOUT); // server action
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<section id="section-1" className="section">
        {localLoaded ? (!order ? <>
            <section id="creating-order" className="section">
                <div className="section-heading"><h2>Creating your order</h2></div>
                <div className="section-body">
                    <div className="loading-spinner">
                        <i className="fa fa-solid fa-spinner fa-spin-pulse"></i>
                    </div>
                </div>
            </section>
        </>:<>
            <div className="section-heading"><h2>Your order was placed!</h2></div>
            <div className="section-body">
                <div className="order-details">
                    <div className="order-id">Order ID: <span>{order.orderId}</span></div>
                    <div className="order-createdAt">Placed on: <span>{order.createdAt}</span></div>
                </div>

                <PageNote
                    orderInfo={{
                        status: order.status,
                        redirect: redirectToSquare,
                    }}
                    // copyToClipboard={copyToClipboard}
                />

                <SquarePaymentInfo />
            </div>
        </>):<SkeletonOrder />}
    </section>);
}