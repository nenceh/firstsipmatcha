import { MarketPaths } from "@/database/constants";
import Link from "next/link";

type Params = {
    classname?: string,
    modal?: boolean,
    pathname?: string,
}

export function MainNav({ classname, modal, pathname }: Params) {
    return (<ul className="primary-nav">
        {modal && <li>
            <Link
                className={classname}
                href={MarketPaths.HOME}
                {...pathname === MarketPaths.HOME && {"aria-current": "page"}}
                // aria-current={pathname === '/'}
            >
                Home
            </Link>
        </li>}
        <li><Link className={classname} href={MarketPaths.SHOP} {...pathname === MarketPaths.SHOP && {"aria-current": "page"}}>Shop</Link></li>
        <li><Link className={classname} href={MarketPaths.MENU} {...pathname === MarketPaths.MENU && {"aria-current": "page"}}>Our Menu</Link></li>
        <li><Link className={classname} href={MarketPaths.ABOUT} {...pathname === MarketPaths.ABOUT && {"aria-current": "page"}}>About Us</Link></li>
    </ul>);
}

export function SocialNav({}){
    return (<ul className='social'>
        <li>
            <Link aria-label={"Instagram"} className="btn-icon link" id="ig-link" href="https://www.instagram.com/firstsipmatcha/" rel='noopener noreferrer'>
                <i aria-hidden={true} className="fa fa-brands fa-instagram"></i>
                {/* <span className='sr-only'>Instagram</span> */}
            </Link>
        </li>
        <li>
            <Link aria-label={"TikTok"} className="btn-icon link" id="tt-link" href="https://www.tiktok.com/@firstsipmatcha" rel='noopener noreferrer'>
                <i aria-hidden={true} className="fa fa-brands fa-tiktok"></i>
                {/* <span className='sr-only'>TikTok</span> */}
            </Link>
        </li>
    </ul>);
}