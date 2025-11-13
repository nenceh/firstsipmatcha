import SkeletonItem from './SkeletonCartItem';

export default function SkeletonCartList() {
    return (<ul className="cart-list">
        {[...Array(3)].map((_, i) => (
            <li className="list-item" key={i}>
                <SkeletonItem />
            </li>
        ))}
    </ul>);
}