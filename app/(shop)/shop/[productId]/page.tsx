import { notFound } from "next/navigation";
import Image from "next/image";
import Figure from "@/app/components/Figure";
import ProductController from "./components/ProductCtrl";
import { getProductItem, getShop } from "@/lib/prisma";
import NavShop from "../components/NavShop";
import PageNote from "../components/PageNote";
import { getCatalogItem } from "@/lib/square";
import { FORMAT_DIMENSIONS_CM, FORMAT_SIZE_OZ, FORMAT_WEIGHT_KG } from "@/database/constants";
import RelatedProducts from "./components/RelatedProducts";
import { Suspense } from "react";
import SkeletonRelatedProducts from "./components/SkeletonRelatedProducts";

export const revalidate = 600; // 10 mins

export async function generateStaticParams() {
    const productItems = await getShop();

    if(!productItems) return [];

    return productItems.map((item) => ({
        productId: item.productId,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;

    const productItem = await getProductItem(productId);
    const res = await getCatalogItem(productItem!.id);

    if(res.ok){
        const squareItem = await res.json();
        return {
            title: `${squareItem.name} | First Sip Matcha Bar`,
            description: `${squareItem.description}.`,
        }
    }

    return {
        title: 'Product Not Found',
        description: 'This product does not exist at First Sip Matcha Bar.'
    }
}

const init_product = async(productId: string) => {
    const res = await getCatalogItem(productId);

    if(res.ok){
        return await res.json();
    }

    return notFound();
}

export default async function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = (await params);

    const productItem = await getProductItem(productId);

    if(!productItem) notFound();

    const squareItem: SquareItem = await init_product(productItem.id);

    return (<div id='shop' className='page'>
        <NavShop
            breadcrumbs={[
                {
                    name: 'Shop',
                    link: 'shop',
                },
                {
                    name: squareItem.name,
                    link: productItem.productId,
                },
            ]}
        />

        <div className="page-item-container title product-title">
            <PageNote productName={squareItem.name} />
            <div className="page-title">
                <div className="container-1">
                    <Figure>
                        <Image // decorative image
                            width={280}
                            height={280}
                            src={squareItem.imageUrl}
                            alt=''
                            priority={true}
                            fetchPriority='high'
                        />
                    </Figure>
                </div>
                <div className="container-2">
                    <ProductController
                        modifierLists={squareItem.modifiers}
                        variations={squareItem.variations}
                        productId={productItem.productId}
                        productName={squareItem.name}
                        squareItem={squareItem}
                    />
                    <div className="more">
                        {squareItem.description &&
                            <div className="entry">
                                <div className="entry-heading">Description</div>
                                <div className="entry-body">{squareItem.description}</div>
                            </div>
                        }
                        <div className="entry">
                            <div className="entry-heading">Details</div>
                            <div className="entry-body">
                                <ul>
                                    {squareItem.ingredients.length > 0 &&
                                        <li>Contains:{squareItem.ingredients.map((ing) => (
                                            ` ${ing.charAt(0) + ing.slice(1).toLowerCase()}`
                                        ))}</li>
                                    }
                                    <li>Size: <span data-measurement="size" data-value="14" data-unit="fl oz">{FORMAT_SIZE_OZ.format(14)}</span></li>
                                    <li>Weight: <span data-measurement="weight" data-value="0.5" data-unit="kg">{FORMAT_WEIGHT_KG.format(0.5)}</span></li>
                                    <li>Dimensions: <span data-measurement="length" data-value="10.2" data-unit="cm">{FORMAT_DIMENSIONS_CM.format(10.2)}</span> &times; <span data-measurement="width" data-value="9" data-unit="cm">{FORMAT_DIMENSIONS_CM.format(9)}</span> &times; <span data-measurement="height" data-value="16" data-unit="cm">{FORMAT_DIMENSIONS_CM.format(6)}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {!squareItem.isArchived && <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts categoryId={productItem.catId} productId={productId} />
        </Suspense>}
    </div>)
}