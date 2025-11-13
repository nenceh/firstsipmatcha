'use client';

import { resetCache } from "@/lib/serverActions";
import PageNote from "../../../components/PageNote";
import OrderSummary from "../../components/OrderSummary";
import { useEffect } from "react";
import { MarketPaths } from "@/database/constants";

type Params = {
    order: OrderDetails,
}

export default function SuccessHandler({ order }: Params) {
    useEffect(() => {
        return() => {
            resetCache(MarketPaths.CHECKOUT); // server action
        }
    }, []);
    
    return (<section id="section-1" className="section">
        <div className="section-heading"><h2>Your order was confirmed!</h2></div>
        <div className="section-body">
            <div className="order-details">
                <div className="order-id">Order ID: <span>{order.orderId}</span></div>
                <div className="order-createdAt">Placed on: <span>{new Date(order.createdAt).toLocaleString('en-US', {
                    timeZone: 'America/Toronto',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    timeZoneName: 'short',
                })}</span></div>
            </div>
            <PageNote orderInfo={{
                status: order.status,
            }} />

            {order.sOrder && <OrderSummary order={order} total={true} />}
        </div>
    </section>);
}