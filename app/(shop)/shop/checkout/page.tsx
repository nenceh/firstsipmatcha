import NavStore from "../components/NavShop";
import { PageBody, PageTitle } from "@/app/components/PageMain";
import CreateOrder from "./components/CreateOrder";
import { Metadata } from "next";

// export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Checkout | First Sip Matcha Bar",
    // description: "",
};

export default async function CheckoutPage({
//     searchParams,
// }: {
//     searchParams?: { [key: string]: string };
}) {
    return (<div id="shop" className="page">
        <NavStore
            breadcrumbs={[
                {
                    name: 'Shop',
                    link: 'shop',
                },
                {
                    name: 'Checkout',
                    link: 'checkout',
                },
            ]}
        />
        <PageTitle title_text='Checkout' />
        <PageBody>
            <CreateOrder />
        </PageBody>
    </div>);
}