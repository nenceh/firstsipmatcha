import { Metadata } from "next";
import { PageTitle, PageBody } from "@/app/components/PageMain";
import ProductsList from "./components/ProductsList";
import { Suspense } from "react";
import NavShop from "./components/NavShop";
import SkeletonProductsList from "./components/SkeletonProductsList";

export const revalidate = 600; // 10 mins

export const metadata: Metadata = {
    title: "Shop | First Sip Matcha Bar",
    description: "Browse the products offered at First Sip Matcha Bar!",
};

export default async function ShopPage() {
    return (<div id='shop' className='page'>
        <NavShop
            breadcrumbs={[
                {
                    name: 'Shop',
                    link: 'shop',
                },
            ]}
        />
        <PageTitle title_text="Shop"/>

        <PageBody>
            <Suspense fallback={<SkeletonProductsList />}>
                <ProductsList />
            </Suspense>
        </PageBody>
    </div>)
}