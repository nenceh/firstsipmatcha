import { PageBody } from "@/app/components/PageMain";
import { getRelatedProductItems } from "@/lib/prisma";
import { getRelatedProducts } from "@/lib/square";
import ProductCard from "../../components/ProductCard";

const init_related = async(related: RelatedItem[]) => {
    const res = await getRelatedProducts(related);

    if(res.ok){
        return await res.json();
    }

    return null;
}

export default async function RelatedProducts({ categoryId, productId }: { categoryId: string, productId: string }) {
    const related = await getRelatedProductItems(categoryId, productId);
    
    const relatedProducts: CatalogItemSimple[] = await init_related(related);

    return (relatedProducts && <PageBody>
        {relatedProducts && <section id="section-1" className="section">
            <div className="section-heading"><h2>Related products</h2></div>
            <div className="section-body">
                <ul className="related-products-list">
                    {relatedProducts.map((item, i) => (item && !item.isArchived &&
                        <li className="list-item" key={i}>
                            <ProductCard
                                name={item.name}
                                productId={item.productId}
                                price={item.price as number}
                                imageUrl={item.imageUrl}
                                invState={item.inventoryState as string}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>}
    </PageBody>);
}