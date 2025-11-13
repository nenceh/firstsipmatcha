import { PageBody } from "@/app/components/PageMain";
import Skeleton from "@/app/components/Skeleton";
import SkeletonProductCard from "../../components/SkeletonProductCard";

export default async function SkeletonRelatedProducts() {
    return (<PageBody>
        <section id="section-1" className="section">
            <div className="section-heading"><Skeleton><h2>Related products</h2></Skeleton></div>
            <div className="section-body">
                <ul className="related-products-list">
                    {[...Array(3)].map((_, i) => (
                        <li className="list-item" key={i}>
                            <SkeletonProductCard />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    </PageBody>);
}