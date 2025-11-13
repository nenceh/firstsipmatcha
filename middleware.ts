'use server';

import { NextResponse, userAgent } from 'next/server';
import { NextRequest } from 'next/server'
import { ApiPaths, BASE_URL, MarketPaths, SESSION_TOKEN_COOKIE } from './database/constants';
import { cookies } from 'next/headers';
import { getAccessTokenFromRequest } from './lib/session';
import { appendRLHeaders, appendRLRejectHeaders, globalRateLimiter, sessionRateLimiter, validateRateLimiter } from '@/app/api/config/limiter';
import { RateLimiterRes } from 'rate-limiter-flexible';

async function validateSessionToken(reqHeaders: Headers){
    const validateResponse = await fetch(`${BASE_URL}${ApiPaths.VALIDATE}`, {
        method: 'GET',
        headers: reqHeaders,
    });

    if(validateResponse.ok){
        const {
            // accessToken,
            accessExpired,
            // refreshToken,
            expiryDate,
            // cartItems
        } = await validateResponse.json();
        
        if(!(new Date() > new Date(expiryDate) || accessExpired)){
            return true;
        }
    }

    return false;
}

async function refreshSessionToken(reqHeaders: Headers){
    const refreshResponse = await fetch(`${BASE_URL}${ApiPaths.REFRESH}`, {
        method: 'POST',
        credentials: 'include',
        headers: reqHeaders,
    });

    if(!refreshResponse.ok) return refreshResponse;

    const newAccessToken = await refreshResponse.json();

    const cookieStore = await cookies();
    cookieStore.set(SESSION_TOKEN_COOKIE, newAccessToken as string, { // session
        path: '/',
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day ???
        // expires: new Date()
        secure: process.env.NODE_ENV === "production",
    });

    return newAccessToken;
}

export async function middleware(req: NextRequest) {
    // console.log(req.nextUrl.pathname, req.headers.get('referer'), req.headers.get('next-action'));

    const reqHeaders = new Headers(req.headers);
    
    const isPrefetch = reqHeaders.get('Purpose') ? reqHeaders.get('Purpose')?.match(/prefetch/i) : (
        // https://github.com/vercel/next.js/discussions/37736#discussioncomment-11985169
        reqHeaders.get('next-url') !== null &&
        reqHeaders.get('sec-fetch-dest') === 'empty' &&
        // reqHeaders.get('sec-fetch-mode') === 'cors'
        ['cors', 'navigate'].includes(req.headers.get('sec-fetch-mode') || '')
    );

    const isBot = userAgent(req).isBot;

    const accessToken = await getAccessTokenFromRequest(req);
    const nextAction = reqHeaders.get('next-action');
    const referer = reqHeaders.get('referer')?.startsWith(`${BASE_URL}`);

    if(req.nextUrl.pathname.startsWith(ApiPaths.BASE)){
        const pathname = req.nextUrl.pathname;
        const apiPaths: string[] = Object.values(ApiPaths);
        const corsFetch = reqHeaders.get('sec-fetch-mode') === 'cors';

        if(apiPaths.includes(pathname) && (referer || corsFetch)){
            try{
                let rateLimiterRes;
                if(accessToken){
                    if(pathname.startsWith(ApiPaths.SHOP)){
                        rateLimiterRes = await sessionRateLimiter.consume(accessToken, 1);
                    } else if(pathname.startsWith(ApiPaths.VALIDATE)){
                        rateLimiterRes = await validateRateLimiter.consume(accessToken, 1);
                    } else{
                        rateLimiterRes = await globalRateLimiter.consume(accessToken, 1);
                    }
                } else{
                    //  https://github.com/vercel/next.js/discussions/55037
                    const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || userAgent(req).ua;
                    rateLimiterRes = await globalRateLimiter.consume(ip, 1);
                }

                appendRLHeaders(reqHeaders, rateLimiterRes);

                if(pathname.startsWith(ApiPaths.SHOP)){
                    const validateResponse = await validateSessionToken(reqHeaders);

                    if(!validateResponse){
                        const newAccessToken = await refreshSessionToken(reqHeaders);
                        reqHeaders.set('Authorization', `Bearer=${newAccessToken}`);
                    }
                }

                return NextResponse.next({
                    request: { headers: reqHeaders },
                });
            } catch(rateLimiterRes){
                const rejectHeaders = reqHeaders;
                if(rateLimiterRes instanceof RateLimiterRes){
                    appendRLRejectHeaders(rejectHeaders, rateLimiterRes);
                }

                return new NextResponse(null, {
                    status: 429,
                    statusText: 'Too many requests.',
                    headers: rejectHeaders,
                });
            }
        } else{
            return NextResponse.json(null, {
                status: 404,
                statusText: 'Invalid API access.',
            });
        }
    }

    if(!isPrefetch && !isBot){
        if(req.nextUrl.pathname.startsWith(MarketPaths.CHECKOUT)){ // /shop/checkout/:path?
            const pathname = req.nextUrl.pathname.split('/').filter(str => str !== '');
            if(pathname.length === 2 && (req.headers.get('referer') === `${BASE_URL}${MarketPaths.CART}` && !req.headers.get('next-action')) || (req.headers.get('referer') === `${BASE_URL}${MarketPaths.CHECKOUT}` && req.headers.get('next-action'))){
                return NextResponse.next({
                    // headers: reqHeaders,
                    request: { // https://github.com/vercel/next.js/issues/50659#issuecomment-2211256368
                        headers: reqHeaders,
                    },
                });
            }
            else if(pathname.length >= 3){ // check if redirect from square
                const orderId = pathname[2];

                const orderResponse = await fetch(`${BASE_URL}${ApiPaths.VALIDATE_ORDER}`, {
                    method: 'PUT',
                    headers: reqHeaders,
                    body: JSON.stringify(orderId),
                });

                if(orderResponse.ok || (BASE_URL + req.nextUrl.pathname) === req.headers.get('referer')){
                    return NextResponse.next({
                        request: {
                            headers: reqHeaders,
                        },
                    }); 
                }
            }

            return NextResponse.redirect(new URL(`${BASE_URL}${MarketPaths.CART}`, req.url));
        }
        else if(req.nextUrl.pathname.startsWith(MarketPaths.SHOP)) {
            if(accessToken){
                console.log(SESSION_TOKEN_COOKIE, accessToken);

                if(nextAction || !referer){
                    reqHeaders.set('Authorization', `Bearer ${accessToken}`);

                    const validateResopnse = await validateSessionToken(reqHeaders);
                    if(validateResopnse){
                        return NextResponse.next({
                            request: {
                                headers: reqHeaders,
                            },
                        });
                    } else{
                        console.log('else: expired...');
                        // cookieStore.delete('accessToken');
                    }
                } else{
                    return NextResponse.next({
                        request: {
                            headers: reqHeaders,
                        },
                    });
                }
            }

            const newAccessToken = await refreshSessionToken(reqHeaders);

            if(!req.nextUrl.pathname.startsWith(MarketPaths.CHECKOUT)){
                reqHeaders.set('Authorization', `Bearer=${newAccessToken}`)
                const response = NextResponse.next({
                    request: {
                        headers: reqHeaders,
                    },
                });

                return response;
            }

            return NextResponse.redirect(new URL(`${BASE_URL}${MarketPaths.CART}`, req.url));
        }
    }
    
    const response = NextResponse.next({
        request: { headers: reqHeaders },
    });

    return response;
}

// for more rules like 'has cookies': https://nextjs.org/docs/app/api-reference/file-conventions/middleware
export const config = {
    matcher: [
        // '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/api/:path?',
        '/shop/:path?',
        '/shop/checkout/:path?',
        '/:path?',
    ],
}