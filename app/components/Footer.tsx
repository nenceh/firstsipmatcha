'use client';

import Link from "next/link";
import { MarketPaths } from "@/database/constants";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Footer(){
    const location = usePathname();
    const [pathname, setPathname] = useState(location);
    
    useEffect(() => {
        setPathname(location);
    }, [location]);

    return(<div className="footer-container"><footer className="footer"> 
        <nav className="footer-sitemap">
            <div className="nav-menu">
                <span className="heading">First Sip Matcha</span>
                <ul>
                    <li>
                        <Link 
                            className="footer-link"
                            href={MarketPaths.HOME}
                            // aria-label='Home, First Sip Matcha Bar'
                            {...pathname === MarketPaths.HOME && { 'aria-current': 'page' }}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="footer-link"
                            href={MarketPaths.MENU}
                            {...pathname === MarketPaths.MENU && { 'aria-current': 'page' }}
                        >
                            Our Menu
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="footer-link"
                            href={MarketPaths.ABOUT}
                            {...pathname === MarketPaths.ABOUT && { 'aria-current': 'page' }}
                        >
                            About Us
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="nav-menu">
                <span className="heading">Shop</span>
                <ul>
                    <li>
                        <Link 
                            className="footer-link"
                            href={MarketPaths.SHOP}
                            aria-label='Shop'
                            {...pathname === MarketPaths.SHOP && { 'aria-current': 'page' }}
                            // prefetch={false}
                        >
                            Shop All
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="footer-link"
                            href={MarketPaths.CART}
                            {...pathname === MarketPaths.CART && { 'aria-current': 'page' }}
                            prefetch={false}
                        >
                            Shopping Cart
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="nav-menu">
                <span className="heading">Site Policy</span>
                <ul>
                    <li>
                        <Link 
                            className="footer-link"
                            href={MarketPaths.PRIVACY}
                            aria-label='Privacy Policy'
                            {...pathname === MarketPaths.PRIVACY && { 'aria-current': 'page' }}
                        >
                            Privacy Policy
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="footer-link"
                            href={MarketPaths.TERMS}
                            {...pathname === MarketPaths.TERMS && { 'aria-current': 'page' }}
                        >
                            Terms and Conditions
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="nav-menu">
                <span className="heading">Follow Us</span>
                <ul>
                    <li>
                        <Link
                            aria-label={"Instagram"}
                            className="footer-link"
                            id="ig-link"
                            href="https://www.instagram.com/firstsipmatcha/"
                            rel='noopener noreferrer'
                        >
                            <i aria-hidden={true} className="fa fa-brands fa-instagram"></i>
                            Instagram
                        </Link>
                    </li>
                    <li>
                        <Link
                            aria-label={"TikTok"}
                            className="footer-link"
                            id="tt-link"
                            href="https://www.tiktok.com/@firstsipmatcha"
                            rel='noopener noreferrer'
                        >
                            <i aria-hidden={true} className="fa fa-brands fa-tiktok"></i>
                            TikTok
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    </footer></div>);
}