// Decorative images: https://www.w3.org/WAI/tutorials/images/decorative/

import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { PageTitle, PageBody } from '@/app/components/PageMain';
import Figure from '@/app/components/Figure';

import { getMenu } from "@/lib/prisma";
import { BASE } from '@/database/constants';

export const revalidate = 86400; // 1 day

export const metadata: Metadata = {
    title: "Our Menu | First Sip Matcha Bar",
    description: "Explore all our drinks on the menu at First Sip Matcha Bar!",
};

export default async function MenuPage(){
    const menuItems = await getMenu();

    return(<div id="menu" className="page">
        <PageTitle title_text="Our Menu"/>

        <PageBody>
            <section className={'menu-category'}>
                <ul className="menu-category-list">
                    {menuItems.map((item, i: number) => ( // !item.archived &&
                        <li className="list-item" key={i}>
                            <Link
                                href={`/menu/${item.itemId}`}
                                className={'item-link'}
                                // aria-label={`${item.item_name}`}
                            >
                                <span className="sr-only">{item.name}</span>
                            </Link>
                            <Figure className="container-1">
                                <Image // decorative image
                                    width={0}
                                    height={0}
                                    sizes='100vw'
                                    src={`${BASE}/images/${item.img}`}
                                    alt=''
                                    role="presentation"
                                    {...i < 2 && { // priority for images above the fold
                                        priority: true,
                                        fetchPriority: 'high',
                                    }}
                                    placeholder='empty'
                                />
                            </Figure>
                            <div className="container-2">
                                <div className="info">
                                    <h2 className="title">{item.name}</h2>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </PageBody>
    </div>);
}