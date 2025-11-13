'use client';

import { BASE_URL, MarketPaths } from "@/database/constants";
import Link from "next/link";
import CartItem from "./CartItem";
import { use, useEffect, useState } from "react";
import { useCart } from "@/app/contexts/CartContext";
import CartCheckout from "./CartCheckout";
import PageNote from "../../components/PageNote";
import SkeletonCartList from "./SkeletonCartList";
import { useRouter } from "next/navigation";
import SkeletonCartCheckout from "./SkeletonCartCheckout";

// Custom CartHandler component used in /shop/cart
// - handles: updating cart item quantity, removing item from cart, proceed to checkout
export default function CartHandler(
    { sessionCartPromise }: { sessionCartPromise: Promise<SessionCartState> }
) {
    const { state, isPending, pageNoteState, loadCartError, openPageNote, updateQuantitySessionCart, removeFromSessionCart, closePageNotes } = useCart();
    const cartRes = use(sessionCartPromise);
    let cart: SquareCartItem[] | undefined, outOfStock: SquareCartItem[] | undefined;
    if(cartRes){
        cart = cartRes.cart;
        outOfStock = cartRes.outOfStock;
    }
    
    const [itemsRemove, setItemsRemove] = useState<SquareCartItem[]>([]);
    const [interacted, setInteracted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if(outOfStock && outOfStock.length > 0){
            openPageNote();
            setItemsRemove(outOfStock);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [outOfStock]);

    useEffect(() => {
        if(!cartRes){
            loadCartError();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartRes]);

    useEffect(() => {
        if(state.cart && itemsRemove.length > 0){
            removeFromSessionCart(itemsRemove);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsRemove]);

    const handleUpdate = async(item: SessionCartItem, quantity: number) => {
        setInteracted(true);
        const tempItem: SessionCartItem = {
            id: item.id,
            quantity: item.quantity,
            indexModifiers: item.indexModifiers,
            indexVariation: item.indexVariation,
        };
        clearPageNotes();
        updateQuantitySessionCart(tempItem, quantity);
    }

    const handleRemove = async(item: SessionCartItem) => {
        setInteracted(true);
        const tempItem: SessionCartItem = {
            id: item.id,
            quantity: item.quantity,
            indexModifiers: item.indexModifiers,
            indexVariation: item.indexVariation,
        };
        clearPageNotes();
        removeFromSessionCart([tempItem]);
    }

    const clearPageNotes = () => {
        setItemsRemove([]);
        closePageNotes();
    }

    return (<>
        {itemsRemove.length > 0 && <PageNote outOfStock={itemsRemove} />}
        {pageNoteState.updateCartError && <PageNote updateCartError={pageNoteState.updateCartError} />}
        {pageNoteState.createOrderError && <PageNote orderError={pageNoteState.createOrderError} />}
        {cart ? <>
            {cart.length === 0 ? ( // if empty cart
                <section id="empty-cart" className="section">
                    <div className="section-heading"><h2>Your shopping cart is empty</h2></div>
                    <div className="section-body">
                        <p>Items you add to your cart will appear here.</p>
                        <Link
                            href={MarketPaths.SHOP}
                            className="btn-secondary"
                        >
                            Go to shop
                        </Link>
                    </div>
                </section>
            ):( // otherwise, show list of cart items, subtotal, and 'Proceed to Checkout' button
                <form
                    noValidate
                    onSubmit={async(e) => {
                        e.preventDefault();
                        clearPageNotes();
                        await new Promise(() => setTimeout(() => {
                            router.push(`${BASE_URL}${MarketPaths.CHECKOUT}`);
                        }, 250));
                    }}
                >
                    <section className="cart">
                        <div className="container-1">
                            {!(isPending && state.cart && interacted) ? <ul className="cart-list">
                                {cart.map((cartItem, i) => (
                                    <li className="list-item" key={i}>
                                        <CartItem
                                            cartItem={cartItem}
                                            updateQty={handleUpdate}
                                            removeFromCart={handleRemove}
                                            index={i}
                                        />
                                    </li>
                                ))}
                            </ul>:<SkeletonCartList />}
                        </div>
                        <div className="container-2">
                            <CartCheckout list={cart} />
                        </div>
                    </section>
                </form>
            )}
        </>:<>
            <PageNote />
            <section className="cart">
                <div className="container-1">
                    <SkeletonCartList />
                </div>
                <div className="container-2">
                    <SkeletonCartCheckout />
                </div>
            </section>
        </>}
    </>);
}