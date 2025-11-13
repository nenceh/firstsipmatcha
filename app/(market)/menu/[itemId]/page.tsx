// Decorative images: https://www.w3.org/WAI/tutorials/images/decorative/

import { notFound } from "next/navigation"; // good for dynamic routes -> not-found.tsx
import Link from "next/link";
import Image from "next/image";
import Figure from "@/app/components/Figure";
import { PageBody, PageItemTitle } from "@/app/components/PageMain";
import { getMenuCategory, getMenuItem, getMenu, getRelatedMenuItems } from "@/lib/prisma";
import { BASE } from "@/database/constants";

export const revalidate = 86400; // 1 day

export async function generateStaticParams() {
	const menuItems = await getMenu();

	if(!menuItems) return[];

	return menuItems.map((item) => ({
		itemId: item.itemId,
	}));
}

export async function generateMetadata({
  	params,
}: {
  	params: Promise<{ itemId: string }>;
}) {
	const { itemId } = await params;

	const menuItem = await getMenuItem(itemId);

	if (!menuItem) {
		return {
			title: "Item Not Found",
			description: "This item does not exist at First Sip Matcha Bar.",
		};
	}

	return {
		title: `${menuItem.name} | First Sip Matcha Bar`,
		description: `${menuItem.description}.`,
	};
}

export default async function MenuItem({ params }: { params: Promise<{ itemId: string }> }) {
	const { itemId } = await params;

	const menuItem = await getMenuItem(itemId);

	if (!menuItem) notFound();

	const categoryName = (await getMenuCategory(menuItem.catId))?.name;

	const relatedItems = await getRelatedMenuItems(menuItem.catId, itemId);

	return (<div id="menu" className="page">
		<PageItemTitle
			item_name={menuItem.name}
			item_description={menuItem.description}
			item_img={menuItem.img}
		/>
		<PageBody>
			<section id="section-1" className="section">
				<div className="section-body">
					<p>{menuItem.archived && 'This drink is currently unavailable. '}More information to be added! Stay tuned!</p>
				</div>
			</section>
			
			<section id="section-2" className="section">
				<div className="section-heading">
					<h2>{`More ${categoryName!.toLowerCase()}s`}</h2>
				</div>
				<div className="section-body">
					<ul className="more-items-list">
					{relatedItems!.map((item, i) => ( // !item.archived &&
						<li className="list-item" key={i}>
						<Link href={`/menu/${item.itemId}`} className={"item-link"}>
							<span className="sr-only">{item.name}</span>
						</Link>
						<Figure className="container-1">
							<Image // decorative image
								width={115}
								height={140}
								src={`${BASE}/images/${item.img}`}
								alt=""
								role="presentation"
							/>
						</Figure>
						<div className="container-2">
							<div className="info">
							<h3 className="title">{item.name}</h3>
							</div>
						</div>
						</li>
					))}
					</ul>
				</div>
			</section>
		</PageBody>
	</div>);
}
