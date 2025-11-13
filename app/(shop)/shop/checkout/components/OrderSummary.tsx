export default function OrderSummary({ order, total }: { order: OrderDetails, total: boolean }) {
    return (order.sOrder ? <div className="order-summary">
        <div className="heading">Summary</div>
        <ul className="items">
            {order.sOrder.lineItems!.map((item, i) => (
                <li key={i}><div className='cart-item'>
                    <div className="cart-item-info">
                        <div className="product">
                            <div className="product-name">{item.name}</div>
                            <div className="product-modifiers">
                                {item.modifiers && item.modifiers.length > 0 && item.modifiers.map((mod, k) => (
                                    <div key={k}>{mod.name}</div>
                                ))}
                                {item.variationName && <div>{item.variationName}</div>}
                            </div>
                            <div className="quantity">Qty: {item.quantity}</div>
                        </div>
                        <div className="product-quantity-price">
                            <div className="price">
                                <div className="cart-price">
                                    <span className="currency-symbol">&#36;</span>
                                    <span className="amount">{(Number(item.basePriceMoney.amount)/100 * parseInt(item.quantity)).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div></li>
            ))}
        </ul>
        <div className="net-amounts">
            {(!total || order.totalAmount !== order.sOrder.netAmounts[order.sOrder.netAmounts.length - 1].amount) &&
                <div className="category subtotal">
                    <div className="name">Subtotal</div>
                    <div className="dotted-underline"></div>
                    <div className="amount">
                        <span className="currency-symbol">&#36;</span>
                        <span className="amount">{order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            }
            {total && order.sOrder.netAmounts.map((cat, i) => (cat.amount > 0 &&
                <div className={`category ${cat.name.toLowerCase()}`} key={i}>
                    <div className="name">{cat.name}</div>
                    <div className="dotted-underline"></div>
                    <div className="amount">
                        <span className="currency-symbol">&#36;</span>
                        <span className="amount">{cat.amount.toFixed(2)}</span>
                    </div>
                </div>
            ))}
        </div>      
    </div>:<></>);
}