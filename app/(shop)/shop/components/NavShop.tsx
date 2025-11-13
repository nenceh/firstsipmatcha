'use client';

import { useCart } from '@/app/contexts/CartContext';
import { MarketPaths } from '@/database/constants';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Params = {
    breadcrumbs: {
        name: string,
        link: string,
    }[],
}

// custom NavShop header component for /shop/:path* routes
export default function NavShop({ breadcrumbs }: Params) {
    const { state, isPending } = useCart();
    
    const [showCrumb, toggleShowCrumb] = useState<boolean>(breadcrumbs.length !== 1);

    useEffect(() => {
        const handleScroll = () => {
            const pageTitle = document.getElementsByClassName('page-title')[0] as HTMLElement;
            const storeNav = document.getElementsByClassName('shop-nav')[0] as HTMLElement;

            if(window.scrollY > pageTitle.offsetTop + pageTitle.offsetHeight - parseInt(getComputedStyle(pageTitle, null).getPropertyValue('padding-bottom')) - storeNav.offsetHeight){
                toggleShowCrumb(true);
            } else{
                toggleShowCrumb(false);
            }
        }

        if(breadcrumbs.length === 1){
            handleScroll(); // initial
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            if(breadcrumbs.length === 1){
                window.removeEventListener('scroll', handleScroll);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const btnCart = (<div className={`cart-container`}>
        <Link
            className={`btn-icon btn-icon-cart`}
            prefetch={false}
            
            {...!isPending && state.cart ?
                {
                    href: MarketPaths.CART,
                    'aria-label': `View your shopping cart. There ${state.cart.length === 1 ? 'is' : 'are'} ${state.cart.length} in cart.`
                }
            :
                {
                    // tabindex: -1,
                    href:'#',
                    'aria-label': 'Loading shopping cart.',
                    style: {pointerEvents: 'none'},
                }
            }
        >
            <i aria-hidden={true} className="fa fa-solid fa-bag-shopping"></i>

            {!isPending && state.cart && <span
                className={`cart-count`}
                aria-hidden={true}
            >
                {state.cart.length}

            </span>}
        </Link>
    </div>);

    return (<div className="shop-nav-container header-nav">
        <div className="shop-nav">
            <div className={`breadcrumbs-container${showCrumb ? `` : ` hide`}`}>
                <nav className="breadcrumbs anim">
                    <ul>
                        {breadcrumbs.map((crumb, i) => (
                            <li className="crumb" key={i}>
                                {i < breadcrumbs.length - 1 ? <>
                                    <Link href={`/${crumb.link}`} prefetch={false}>{crumb.name}</Link>
                                    <span aria-hidden="true">/</span>
                                </>:
                                    <span>{crumb.name}</span>
                                }                            
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {btnCart}
        </div>
    </div>);
}