import { NextRequest, NextResponse } from "next/server";
import { getCatalogItem } from "@/lib/square";
import { getAccessTokenFromRequest } from "@/lib/session";
import { InventoryState } from "@/database/constants";
import { getSessionData } from "@/lib/prisma";
import { handleAddCart, handleRemoveFromCart, handleUpdateQuantity } from "@/lib/serverActions";

// GET route to obtain session data
export async function GET(req: NextRequest){
    const reqHeaders = new Headers(req.headers);
    const accessToken = await getAccessTokenFromRequest(req);

    if(accessToken){
        const res = await getSessionData(accessToken, true);
        if(res){
            const data: SessionCartState = {
                cart: [],
                outOfStock: [],
            };

            if('cartItems' in res){
                for(const item of res.cartItems){
                    const itemRes = await getCatalogItem(item.productItem.id);
                    if(!itemRes.ok) return itemRes;
                    const squareItem = await itemRes.json();
                    
                    if(squareItem.variations.list[item.indexVariation].inventoryState === InventoryState.NO_STOCK || squareItem.isArchived){
                        if(req.nextUrl.searchParams.get('full')){
                            const temp: SquareCartItem = {
                                id: item.productId,
                                quantity: item.quantity,
                                squareItem: squareItem,
                                indexVariation: item.indexVariation,
                                indexModifiers: item.indexModifiers,
                            };

                            if(squareItem.isArchived){
                                temp.isArchived = true;
                            }
                            
                            data.outOfStock.push(temp);
                        }
                    } else{
                        data.cart.push({
                            id: item.productId,
                            quantity: item.quantity,
                            squareItem: squareItem as SquareItem,
                            indexVariation: item.indexVariation,
                            indexModifiers: item.indexModifiers,
                        });
                    }
                }
            }

            reqHeaders.append('Content-Type', 'application/json');

            return NextResponse.json(data, {
                status: 200,
                headers: reqHeaders,
            });
        }
    }

    reqHeaders.append('Content-Type', 'text/plain');

    return NextResponse.json(null, {
        status: 500,
        statusText: 'Cannot find session.',
        headers: reqHeaders,
    });
}

// POST route to update session data
export async function POST(req: NextRequest) {
    const data = await req.json();
    const reqHeaders = new Headers(req.headers);
    reqHeaders.append('Content-Type', 'text/plain');
    const accessToken = await getAccessTokenFromRequest(req);

    const action = req.nextUrl.searchParams.get('action');

    if(accessToken){
        let res;
        switch (action){
            case 'add':
                res = await handleAddCart(data.item);
                break;
            case 'update':
                res = await handleUpdateQuantity(data.item, data.quantity);
                break;
            case 'delete':
                res = await handleRemoveFromCart(data.items);
                break;
            default:
                //
                break;
        }
        
        if(res?.status){
            reqHeaders.set('Content-Length', JSON.stringify(req.body).length.toString());
            return NextResponse.json(true, {
                status: 200,
                statusText: 'Successfully updated session cart in database.',
                headers: reqHeaders,
            });
        }
    }

    return NextResponse.json(null, {
        status: 500,
        statusText: 'Error updating session cart in database. Try again.',
        headers: reqHeaders,
    });
}