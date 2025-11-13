import Link from "next/link";
import Image from "next/image";

import Figure from "./Figure";
import { BASE, MarketPaths } from "@/database/constants";

export function PageTitle({title_text}: {title_text: string}){
    return(
        <div className="page-item-container title">
            <div className="page-title">
                <h1>{title_text}</h1>
            </div>
        </div>
    );
}

export function PageBody( { children }: Readonly<{ children: React.ReactNode; }> ){
    return(
        <div className="page-item-container body">
            <div className="page-body">
                {children}
            </div>
        </div>
    );
}

export function PageItemTitle({ item_name, item_description, item_img }: { item_name: string, item_description: string, item_img: string }){
    return(
        <div className="page-item-container title menu-item">
            <div className="breadcrumbs-container">
                <nav className="breadcrumbs">
                    <ul>
                        <li className="crumb"><Link href={MarketPaths.MENU}>Our Menu</Link><span aria-hidden="true">/</span></li>
                        <li className="crumb"><span>{item_name}</span></li>
                    </ul>
                </nav>
            </div>
            <div className="page-title">
                <Figure>
                    <Image
                        width={280}
                        height={280}
                        src={`${BASE}/images/${item_img}`}
                        alt={item_name}
                        priority={true}
                    />
                </Figure>
                <div className="info">
                    <h1 className="title">{item_name}</h1>
                    <div className="description">{item_description}</div>
                </div>
            </div>
        </div>
    );
}