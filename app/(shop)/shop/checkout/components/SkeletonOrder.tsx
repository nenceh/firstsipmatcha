import Skeleton from "@/app/components/Skeleton";

export default function SkeletonOrder() {
    return (<>
        <Skeleton classes="width-100"><div className="section-heading"><h2>Loading order</h2></div></Skeleton>
        <div className="section-body">
            <div className="order-details">
                <Skeleton><div className="order-id">Order ID: ???????????????????</div></Skeleton>
                <Skeleton><div className="order-createdAt">Placed on: ?????????????</div></Skeleton>
            </div>

            <Skeleton classes="width-100 height-lg"/>
        </div>
    </>);
}