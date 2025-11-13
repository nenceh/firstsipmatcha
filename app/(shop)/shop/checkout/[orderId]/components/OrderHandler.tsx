'use server';

import { getPrismaOrderByOrderId } from "@/lib/prisma";
import SuccessHandler from "./SuccessHandler";
import { getSquareOrderByOrderId } from "@/lib/square";
import { Money, Order } from "square/legacy";
import SkeletonOrder from "../../components/SkeletonOrder";
import PageNote from "../../../components/PageNote";

const init_order = async(orderId: string) => {
    const pOrder = await getPrismaOrderByOrderId(orderId);

    if(pOrder){
        const order: OrderDetails = {
            SPL_id: pOrder.SPL_id,
            SPL_url: pOrder.SPL_url,
            status: pOrder.status,
            createdAt: pOrder.createdAt,
            totalAmount: pOrder.totalAmount,
            orderId: pOrder.orderId,
        };

        const res = await getSquareOrderByOrderId(orderId);

        if(res.ok){
            const sOrder: Order = (await res.json()).order;
            order.sOrder = {
                lineItems: sOrder?.lineItems!.map((item) => {return {
                    name: item.name as string,
                    quantity: item.quantity,
                    basePriceMoney: {
                        amount: Number((item.basePriceMoney as Money).amount),
                    },
                    modifiers: item?.modifiers!.map((mod) => {return {
                        name: mod.name as string,
                    }}),
                    variationName: item.variationName as string,
                }}),
                netAmounts: [
                    {
                        name: 'Discount',
                        amount: Number((sOrder.totalDiscountMoney as Money).amount)/100,
                    },
                    {
                        name: 'Tip',
                        amount: Number((sOrder.totalTipMoney as Money).amount)/100,
                    },
                    {
                        name: 'Tax',
                        amount: Number((sOrder.totalTaxMoney as Money).amount)/100,
                    },
                    {
                        name: 'Total',
                        amount: Number((sOrder.totalMoney as Money).amount)/100,
                    },
                ],
            }
        }
        return order;
    }

    return null;
}

export default async function OrderHandler({ orderId }: { orderId: string }) {    
    const order = await init_order(orderId);

    return (order ?<SuccessHandler order={order} /> : <>
        <PageNote orderError={true} />
        <SkeletonOrder />
    </>)
}