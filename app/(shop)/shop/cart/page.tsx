import { Metadata } from "next";
import { PageTitle, PageBody } from "@/app/components/PageMain";
import NavStore from "../components/NavShop";
import CartHandler from "./components/CartHandler";
import { Suspense } from 'react';
import SkeletonCartList from "./components/SkeletonCartList";
import { ApiPaths, BASE_URL, SESSION_CART } from "@/database/constants";
import SkeletonCartCheckout from "./components/SkeletonCartCheckout";
import { getAccessTokenFromRequest } from "@/lib/session";

export const metadata: Metadata = {
    title: "Cart | First Sip Matcha Bar",
    description: "Your shopping cart",
};

async function init_cart () {
    const at = await getAccessTokenFromRequest();
    const res = await fetch(`${BASE_URL}${ApiPaths.SHOP}?full=true`, {
        next: {
            tags: [SESSION_CART.tag],
            revalidate: SESSION_CART.revalidate,
        },
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${at}`,
        },
    });

    if(res.ok) return res.json();
    else if(res.status === 429) return undefined;

    return null;
}

export default async function CartPage() {
    const sessionCartPromise: Promise<SessionCartState> = init_cart();

    return (<div id='shop' className='page'>
        <NavStore
            breadcrumbs={[
                {
                    name: 'Shop',
                    link: 'shop',
                },
                {
                    name: 'Cart',
                    link: 'cart',
                },
            ]}
        />
        <PageTitle title_text={`Cart`}/>

        <PageBody>
            <Suspense fallback={
                <section className="cart">
                    <div className="container-1">
                        <SkeletonCartList />
                    </div>
                    <div className="container-2">
                        <SkeletonCartCheckout />
                    </div>
                </section>
            }>
                <CartHandler
                    sessionCartPromise={sessionCartPromise}
                />
            </Suspense>
        </PageBody>
    </div>)
}