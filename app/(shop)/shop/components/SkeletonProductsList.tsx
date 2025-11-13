import SkeletonProductCard from "./SkeletonProductCard";

const NUM_SKELETON_ITEMS = 20;

export default function SkeletonProductsList() {
    return (<ul className="shop-category-list" style={{width: '100%'}}>
        {[...Array(NUM_SKELETON_ITEMS)].map((_, i) => (
            <li className="list-item" key={i}>
                <SkeletonProductCard />
            </li>
        ))}
    </ul>);
}