import { NextRequest } from "next/server";
import { ApiPaths, BASE_URL, SESSION_CART, SESSION_TOKEN_COOKIE, TOKEN_REGEX_FORMAT } from "@/database/constants";
import { headers } from "next/headers";

export const getAccessTokenFromRequest = async(req?: NextRequest) => {
    const reqHeaders = req ? new Headers(req.headers) : await headers();

    const cookieString = reqHeaders.get('authorization') ? reqHeaders.get('authorization') : (reqHeaders.get('cookie') ? reqHeaders.get('cookie') : reqHeaders.get('set-cookie'));

    const accessToken = cookieString?.substring(cookieString.indexOf(`${SESSION_TOKEN_COOKIE}=`)).split(/[=]+|[;\s]+|[\s]+/)[1];

    if(regexTestAccessToken(accessToken)) return accessToken;
    return '';
}

function regexTestAccessToken(token: string | undefined){
    if(!token) return false;
    return TOKEN_REGEX_FORMAT.test(token as string);
}

export const getSessionCart = async() => {
    const res = await fetch(`${BASE_URL}${ApiPaths.SHOP}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        next: {
            tags: [SESSION_CART.tag],
            revalidate: SESSION_CART.revalidate,
        },
    });

    if(res.ok){
        return await res.json();
    }

    return {
        cart: undefined,
        outOfStock: undefined,
    };
}