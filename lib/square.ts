'use server';

import { SquareClient, SquareEnvironment } from "square";
import { createPrismaOrder, getProductIdFromSquareId } from "./prisma";
import { generateUUID } from "./generate";
import { BASE_URL, InventoryState, MarketPaths, SQUARE_ATTEMPT_LIMIT, SquareMethod } from "@/database/constants";
import { CatalogItem, CatalogItemModifierListInfo, CatalogItemOption, CatalogItemOptionForItem, CatalogItemVariation, CatalogModifier, CatalogModifierList, CatalogObject, ItemVariationLocationOverrides, Money } from "square/legacy";
import { NextResponse } from "next/server";

// Idempotency key (iKey): https://developer.squareup.com/docs/build-basics/common-api-patterns/idempotency
// Different versions of UUID: https://refine.dev/blog/node-js-uuid/#understanding-and-choosing-the-right-uuid-versions

// Square - Handling Errors: https://developer.squareup.com/docs/build-basics/general-considerations/handling-errors#rate-limiting-errors

const SQUARE = new SquareClient({
    token: process.env.NEXT_PUBLIC_SQUARE_SANDBOX_ACCESS_TOKEN,
    environment: SquareEnvironment.Sandbox,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = function () {
    return Number(this);
};

// Exponential backoff example: https://freedium.cfd/https://javascript.plainenglish.io/exponential-backoff-in-modern-javascript-f725457215b8
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSquareObject = async(method: string, config: any) => {
    const baseDelay = 1000; // 1s
    let attempt = 0;
    while(attempt <= SQUARE_ATTEMPT_LIMIT){
        let res;
        try{
            switch(method){
                case SquareMethod.CatalogObject_GET:
                    res = await SQUARE.catalog.object.get(config);
                    break;
                case SquareMethod.CatalogList_GET:
                    res = await SQUARE.catalog.list(config);
                    break;
                case SquareMethod.InventoryCount_GET:
                    res = await SQUARE.inventory.get(config);
                    break;
                case SquareMethod.Orders_GET:
                    res = await SQUARE.orders.get(config);
                    break;
                case SquareMethod.PaymentLinks_POST:
                    res = await SQUARE.checkout.paymentLinks.create(config);
                    break;
                case SquareMethod.PaymentLinks_PUT:
                    res = await SQUARE.checkout.paymentLinks.update(config);
                    break;
                case SquareMethod.PaymentLinks_DELETE:
                    res = await SQUARE.checkout.paymentLinks.delete(config);
                    break;
                default:
                    return NextResponse.json(null, {
                        status: 500,
                        statusText: 'Invalid fetch call.',
                    });
            }

            return NextResponse.json(res, { status: 200 });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch(e: any){ // Square's legacy Error object has different attribute names
            if(e.statusCode === 429){
                attempt++;

                if(attempt > SQUARE_ATTEMPT_LIMIT){ // service unavailable
                    return NextResponse.json(null, {
                        status: e.statusCode,
                        statusText: e.errors.detail,
                    });
                }

                const jitter = Math.random() * 500;
                const delay = baseDelay * Math.pow(2, attempt - 1) + jitter;

                await new Promise((res) => setTimeout(res, delay));
            } else {
                return NextResponse.json(null, {
                    status: e.statusCode,
                    statusText: e.errors ? e.errors[0].detail : e.statusText,
                });
            }
        }
    }
    
    return NextResponse.json(null, {
        status: 500,
        statusText: 'There was an unexpected error.',
    });
}

export const getRelatedProducts = async(objects: RelatedItem[]) => {
    const list = [];
    for(const item of objects){
        const res = await getCatalogItemSimple(item.id as string);
        if(!res.ok) return res;
        const temp = await res.json();
        list.push(temp); // if(temp.inventoryState !== InventoryState.ARCHIVED)
    }

    return NextResponse.json(list, { status: 200 });
}

export const getCatalogShop = async() => {
    const res_ = await fetchSquareObject(SquareMethod.CatalogList_GET, {
        types: 'ITEM',
    });

    if(!res_.ok){ return res_; }

    const res = await res_.json();
    const objects = res.data;

    const list = [];

    for(const item of objects){
        const res_ = await getCatalogItemSimple(item.id as string);
        if(!res_.ok) return res_;
        const temp = await res_.json();
        list.push(temp); // if(temp.inventoryState !== InventoryState.ARCHIVED)
    }
    return NextResponse.json(list, { status: 200 });
}

export const getCatalogItemBase = async(id: string) => {
    const res_ = await fetchSquareObject(SquareMethod.CatalogObject_GET, {
        objectId: id,
        includeRelatedObjects: true,
    });

    if(!res_.ok){ return res_; }

    const res = await res_.json();
    const object: CatalogObject = res.object as CatalogObject;
    const relatedObjects: CatalogObject[] = res.relatedObjects as CatalogObject[];
    
    const itemData: CatalogItem = object.itemData as CatalogItem;

    let imageUrl = '';

    for(const obj of relatedObjects){
        if(obj.imageData){
            imageUrl = obj.imageData.url as string;
        }
    }

    return NextResponse.json({
        itemBase: {
            name: itemData.name as string,
            productId: (await getProductIdFromSquareId(id))?.productId as string,
            description: itemData.description as string,
            imageUrl: imageUrl,
            isArchived: itemData.isArchived,
        },
        itemData: itemData,
    }, { status: 200 });
}

const getCatalogItemSimple = async(id: string) => { // used in getRelatedProducts, getCatalogShop
    let res_ = await getCatalogItemBase(id);
    if(!res_.ok) return res_;

    const { itemBase, itemData }: { itemBase: object, itemData: CatalogItem } = await res_.json();

    let invState, invStock, price, dIndex = -1;
    
    if(itemData.variations){
        price = Number(((itemData.variations[0].itemVariationData as CatalogItemVariation).priceMoney as Money).amount)/100;
    }

    for(let i = 0; itemData.variations && i < itemData.variations.length; i++){
        const vari: CatalogObject = itemData.variations[i] as CatalogObject;
        const variData: CatalogItemVariation = vari.itemVariationData as CatalogItemVariation;
        const inventory = (variData.locationOverrides as ItemVariationLocationOverrides[])[0];

        if(inventory.soldOut){
            invState = InventoryState.NO_STOCK;
            invStock = 0;
        }
        else{
            res_ = await fetchSquareObject(SquareMethod.InventoryCount_GET, {
                catalogObjectId: vari.id,
            });

            if(!res_.ok){ return res_; }

            const invObject = (await res_.json()).data[0];
            invStock = parseInt(invObject.quantity!);
            if(inventory.inventoryAlertThreshold && invStock < Number(inventory.inventoryAlertThreshold)){
                invState = InventoryState.LOW_STOCK;
            } else{
                invState = InventoryState.IN_STOCK;
            }

            price = Number((variData.priceMoney as Money).amount)/100;

            if(dIndex === -1){
                dIndex = i;
                break;
            }
        }
    }
    
    return NextResponse.json({
        ...itemBase, // name, productId, description, imageUrl, isArchived,
        // name: itemData.name as string,
        // productId: (await getProductIdFromSquareId(id))?.productId as string,
        price: price,
        inventoryState: invState,
        inventoryQuantity: invStock,
        // imageUrl: imageUrl,
        // isArchived: itemData.isArchived,
    }, { status: 200 });
}

export const getCatalogItem = async(id: string) => {
    let res_ = await getCatalogItemBase(id);
    if(!res_.ok) return res_;

    const { itemBase, itemData }: { itemBase: SquareItem_Base, itemData: CatalogItem } = await res_.json();
    
    const mods = [];
    if(itemData.modifierListInfo){
        for(const mod of itemData.modifierListInfo){
            if(mod.enabled){
                res_ = await fetchSquareObject(SquareMethod.CatalogObject_GET, {
                    objectId: mod.modifierListId,
                });

                if(!res_.ok){ return res_; }

                const list = (await res_.json()).object as CatalogObject;
                const listData: CatalogModifierList = list.modifierListData as CatalogModifierList;

                const options = [];
                const listModifiers: CatalogObject[] = listData?.modifiers as CatalogObject[];

                for(const m of listModifiers){
                    const data = m.modifierData as CatalogModifier;
                    let temp = false;
                    if("onByDefault" in data) temp = true;
                    options.push({
                        name: data.name as string,
                        id: m.id as string,
                        default: temp,
                    });
                }

                mods.push({
                    name: listData.name as string,
                    list: options,
                });
            }
        }
    }

    const ingList = itemData.foodAndBeverageDetails?.ingredients;
    const ingredients: string[] = [];

    if(ingList){
        for(const ing of ingList){
            ingredients.push(ing.standardName as string);
        }
    }

    const variations = [];

    let dIndex = -1;
    for(let i = 0; itemData.variations && i < itemData.variations.length; i++){
        const vari = itemData.variations[i];
        const variData: CatalogItemVariation = vari.itemVariationData as CatalogItemVariation;
        const inventory = (variData.locationOverrides as ItemVariationLocationOverrides[])[0];
        let invState, invStock;

        if(!itemData.isArchived){
            invState = InventoryState.IN_STOCK;
            if(inventory.soldOut){
                invState = InventoryState.NO_STOCK;
                invStock = 0;
            }
            else{
                res_ = await fetchSquareObject(SquareMethod.InventoryCount_GET, {
                    catalogObjectId: vari.id,
                });

                if(!res_.ok){ return res_; }

                const invObject = (await res_.json()).data[0];
                invStock = parseInt(invObject.quantity!);
                if(inventory.inventoryAlertThreshold && invStock < Number(inventory.inventoryAlertThreshold)){
                    invState = InventoryState.LOW_STOCK;
                }

                if(dIndex === -1) dIndex = i;
            }
        }
        
        variations.push({
            name: variData.name as string,
            price: Number((variData.priceMoney as Money).amount)/100,
            inventoryQuantity: invStock,
            inventoryState: invState,
        });
    }

    res_ = await fetchSquareObject(SquareMethod.CatalogObject_GET, {
        objectId: (itemData.itemOptions as CatalogItemOptionForItem[])[0].itemOptionId as string,
    });

    if(!res_.ok){ return res_; }
    
    const itemOptions = ((await res_.json()).object as CatalogObject).itemOptionData as CatalogItemOption;

    const variationInfo = {
        name: itemOptions.name as string,
        defaultIndex: Math.max(dIndex, 0),
        list: variations,
    };
    
    return NextResponse.json({
        ...itemBase, // name, productId, description, imageUrl, isArchived
        // name: itemData.name as string,
        // productId: (await getProductIdFromSquareId(id))?.productId as string,
        // description: itemData.description as string,
        ingredients: ingredients,
        variations: variationInfo,
        modifiers: mods,
        // imageUrl: imageUrl,
        // isArchived: itemData.isArchived,
    }, { status: 200 });
}

const createLineItem = async(catalogObjectId: string, indexVariation: number, indexModifiers: number[]) => {
    let res_ = await getCatalogItemBase(catalogObjectId);
    if(!res_.ok) return res_;

    const { itemData }: { itemData: CatalogItem } = await res_.json();

    const modLists: string[] = [], mods: string[] = [];
    
    if(indexModifiers.length > 0){
        for(const mod of itemData.modifierListInfo as CatalogItemModifierListInfo[]){
            modLists.push(mod.modifierListId);
        }

        for(let i = 0; i < modLists.length; i++){
            res_ = await fetchSquareObject(SquareMethod.CatalogObject_GET, {
                objectId: modLists[i],
            });
            if(!res_.ok) return res_;

            const res = await res_.json();

            const obj: CatalogObject = res.object as CatalogObject;
            const listData: CatalogModifierList = obj.modifierListData as CatalogModifierList;
            mods.push((listData.modifiers as CatalogObject[])[indexModifiers[i]].id);
        }
    }
    
    return NextResponse.json({
        variationId: (itemData.variations as CatalogObject[])[indexVariation].id,
        modifiers: mods,
    }, { status: 200 });
}

export const getSquareOrderByOrderId = async(orderId: string) => {
    const res = await fetchSquareObject(SquareMethod.Orders_GET, {
        orderId: orderId,
    });

    return res;
}

export const createPaymentLink = async (accessToken: string, cartItems: CartItem[]) => {
    const UUID = generateUUID();

    const res = await fetchSquareObject(SquareMethod.PaymentLinks_POST, {
        idempotencyKey: UUID,
        checkoutOptions: {
            acceptedPaymentMethods: {
                applePay: true,
                googlePay: true,
            },
            allowTipping: true,
            askForShippingAddress: true,
            enableCoupon: true,
            enableLoyalty: false,
        },
        order: {
            locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
            lineItems: await Promise.all(cartItems.map(async(item) => {
                const res_ = await createLineItem(item.productItem.id, item.indexVariation, item.indexModifiers);
                if(!res_.ok) return res_;
                const lineItem = await res_.json();
                return {
                    quantity: item.quantity.toString(),
                    catalogObjectId: lineItem.variationId,
                    itemType: "ITEM",
                    modifiers: lineItem.modifiers.map((modId: number) => ({
                        catalogObjectId: modId,
                    })),
                };
            })),
            pricingOptions: {
                autoApplyTaxes: true,
            },
        },
    });

    if(!res.ok){ return res; }

    const { paymentLink, relatedResources } = await res.json();

    await createPrismaOrder(
        accessToken,
        {
            iKey: UUID,
            id: paymentLink.id as string,
            orderId: paymentLink.orderId as string,
            order: relatedResources.orders![0],
            url: paymentLink.url as string,
        },
    );

    return NextResponse.json({ paymentLink, relatedResources }, { status: 200 });
}

export const updatePaymentLink = async (pid: string, oid: string) => {
    // edit redirect URL
    const redirect = `${BASE_URL}${MarketPaths.CHECKOUT}/${oid}`
    const res = await fetchSquareObject(SquareMethod.PaymentLinks_PUT, {
        id: pid,
        paymentLink: {
            version: 1,
            checkoutOptions: {
                redirectUrl: redirect,
            },
        },
    });
    
    return res;
}

export const deletePaymentLink = async (pid: string) => {
    const res = await fetchSquareObject(SquareMethod.PaymentLinks_DELETE, {
        id: pid,
    });
    
    return res;
}