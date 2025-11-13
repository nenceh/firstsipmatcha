import Link from "next/link";
import { PageBody, PageTitle } from "@/app/components/PageMain";
import { MarketPaths } from "@/database/constants";

export default async function NotFound() {
    return (<>
        <PageTitle title_text="Product Not Found" />
        <PageBody>
            <section id="section-1" className="section">
                <div className="section-body">
                    <p>Sorry, this product does not exist!</p>
                    <Link
                        href={MarketPaths.SHOP}
                        className="btn-secondary"
                    >
                        Back to Shop
                    </Link>
                </div>
            </section>
        </PageBody>
    </>);
}