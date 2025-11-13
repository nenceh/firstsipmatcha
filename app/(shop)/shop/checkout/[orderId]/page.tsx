'use server';

import { PageBody } from "@/app/components/PageMain";
import SkeletonOrder from "../components/SkeletonOrder";
import { Suspense } from "react";
import OrderHandler from "./components/OrderHandler";

export async function generateMetadata(
    // { params }: { params: Promise<{ orderId: string }> }
) {
    // const { orderId } = await params;

    return {
        title: `Checkout Fulfilled | First Sip Matcha Bar`,
        // description: ``,
    }
}

export default async function CheckoutFulfilledPage({ params }: { params: Promise<{ orderId: string }> }) {    
    const { orderId } = (await params);

    return (<div id="shop" className="page">
        <PageBody>
            <Suspense fallback={<SkeletonOrder/>}>
                <OrderHandler orderId={orderId} />
            </Suspense>
        </PageBody>
    </div>)
}