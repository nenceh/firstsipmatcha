import { NextRequest, NextResponse } from 'next/server';
import { getSquareOrderByOrderId } from '@/lib/square';
import { getPrismaOrderByOrderId, updatePrismaOrder } from '@/lib/prisma';
import { SquareOrderStatus } from '@/database/constants';

// PUT route to validate an order
export async function PUT(req: NextRequest){
    const reqHeaders = new Headers(req.headers);
    const orderId: string = await req.json();

    const pOrder = await getPrismaOrderByOrderId(orderId);

    if(pOrder){
        const res = await getSquareOrderByOrderId(orderId);
        if(!res.ok) return res;

        const sOrder = (await res.json()).order;
        
        if(sOrder.state as string !== pOrder.status && sOrder.state === SquareOrderStatus.OPEN){
            await updatePrismaOrder(sOrder?.id as string, sOrder?.state as string, sOrder?.updatedAt as string);
            pOrder.status = sOrder?.state as string; // update pOrder state

            return NextResponse.json(true, {
                status: 200,
                statusText: 'Order validated!',
                headers: reqHeaders
            });
        }

        return NextResponse.json(false, {
            status: 307,
            statusText: 'Order already validated',
            headers: reqHeaders
        });
    }

    reqHeaders.append('Content-Type', 'text/plain');

    return NextResponse.json(null, {
        status: 500,
        statusText: 'Error fetching Square Order. Try again.',
        headers: reqHeaders
    });
}