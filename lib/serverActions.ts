'use server';

import { CheckoutSchema, MarketPaths, SESSION_CART, SquareOrderStatus } from "@/database/constants";
import { createPaymentLink, updatePaymentLink } from "./square";
import { addToSessionCart, clearSessionCart, getSessionData, removeFromSessionCart, updateSessionCart } from "@/lib/prisma";
import z from "zod"; // form validation
import { revalidatePath, revalidateTag } from "next/cache";
import { getAccessTokenFromRequest } from "./session";

export async function resetCache(path: string){
    revalidatePath(path, 'page');
}

let result: FormState = {
    status: false,
    data: null,
    errors: null,
}

export async function createSquarePaymentLink(){
    const accessToken = await getAccessTokenFromRequest();
    if(accessToken){
        const sessionData = await getSessionData(accessToken);

        let res = await createPaymentLink(accessToken, sessionData?.cartItems as CartItem[]);

        if(res.ok){
            const { paymentLink, relatedResources } = await res.json();

            if(paymentLink && relatedResources.orders){
                res = await updatePaymentLink(paymentLink.id, paymentLink.orderId);
                if(!res.ok) result.errors = res.statusText;

                await clearSessionCart(accessToken);

                result.data = {
                    orderId: paymentLink.orderId as string,
                    paymentLink: paymentLink.url as string,
                    createdAt: new Date(paymentLink.createdAt as string).toLocaleString('en-US', {
                        timeZone: 'America/Toronto',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        timeZoneName: 'short',
                    }),
                    status: relatedResources.orders[0].state as string || SquareOrderStatus.OPEN,
                }

                result.status = true;
            }
        }
    }

    return result;
}

export async function handleCheckout(prevState: FormState, data: FormData) {
    result = {
        ...prevState,
        status: false,
    };
    
    const validated = CheckoutSchema.safeParse(Object.fromEntries(data));

    if(!validated.success){
        result.errors = z.flattenError(validated.error);
    }

    await new Promise((resolve) => setTimeout(resolve, 250));

    return result;
}

export async function handleAddCart(item: SessionCartItem){
    result.status = false;

    const accessToken = await getAccessTokenFromRequest();

    if(accessToken){
        result.status = await addToSessionCart(accessToken, item);
        revalidateCart();
        resetCache(MarketPaths.CHECKOUT);
    }

    return result;
}

export const revalidateCart = async() => {
    revalidateTag(SESSION_CART.tag);
}

export async function handleUpdateQuantity(item: SessionCartItem, quantity: number){
    result.status = false;

    const accessToken = await getAccessTokenFromRequest();
    if(quantity >= 1 && accessToken){
        result.status = await updateSessionCart(accessToken, item, quantity);
        revalidateCart(); // needed
    }

    return result;
}

export async function handleRemoveFromCart(items: SessionCartItem[]){
    result.status = false;

    const accessToken = await getAccessTokenFromRequest();
    if(accessToken){
        for(const item of items){
            await removeFromSessionCart(accessToken, item);
        }
        result.status = true;
        revalidateCart(); // needed
    }

    return result;
}
