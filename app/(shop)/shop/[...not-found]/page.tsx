import Link from "next/link";
import { PageBody, PageTitle } from "@/app/components/PageMain";
import { MarketPaths } from "@/database/constants";

export default function NotFound() {
    return (<div id="page" className="page">
        <PageTitle title_text="404 Page Not Found" />
        <PageBody>
            <section id="section-1" className="section">
                <div className="section-body">
                    <p>This page could not be found.</p>
                    <Link
                        href={MarketPaths.SHOP}
                        className="btn-secondary"
                    >
                        Back to Shop
                    </Link>
                </div>
            </section>
        </PageBody>
    </div>);
}