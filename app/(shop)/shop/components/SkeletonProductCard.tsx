import Skeleton from '@/app/components/Skeleton';

export default function SkeletonProductCard() {
    return (
        <div
            className="product-item loading"
            style={{
                'width': '100%',
            }}
        >
            <Skeleton classes='width-100'><div className="container-1"></div></Skeleton>
            
            <div className="container-2">
                <Skeleton><div className="info">Loading Name</div></Skeleton>
                <Skeleton><div className="product-price">$0.00</div></Skeleton>
            </div>
        </div>
    );
}