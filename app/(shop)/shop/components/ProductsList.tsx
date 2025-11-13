import { getCatalogShop } from '@/lib/square';
import SkeletonProductCard from './SkeletonProductCard';
import dynamic from 'next/dynamic';
import PageNote from './PageNote';
import SkeletonProductsList from './SkeletonProductsList';

const ProductCard = dynamic(() => import('./ProductCard'), {
    loading: () => <SkeletonProductCard />,
});

export default async function ProductsList() {
    const res = await getCatalogShop();
    let productItems: CatalogItemSimple[] | undefined;

    if(res.ok) productItems = await res.json();

    return (productItems ? <section className={'shop-category'}>
        <ul className="shop-category-list">
            {productItems.map((item, i: number) => (item && !item.isArchived &&
                <li className="list-item" key={i}>
                    <ProductCard
                        name={item.name}
                        productId={item.productId}
                        price={item.price as number}
                        imageUrl={item.imageUrl}
                        invState={item.inventoryState as string}
                        index={i}
                    />
                </li>
            ))}
        </ul>
    </section>:<>
        <PageNote loadShopError={true} />
        <SkeletonProductsList />
    </>);
}
