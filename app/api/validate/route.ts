import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/prisma";
import { getAccessTokenFromRequest } from "@/lib/session";

// GET route to validate session token data
export async function GET(req: NextRequest){
    const reqHeaders = new Headers(req.headers);
    const accessToken = await getAccessTokenFromRequest(req);

    if(accessToken){
        const sessionData = await verifySession(accessToken);
        if(sessionData) {
            reqHeaders.append('Content-Type', 'application/json');
            return NextResponse.json(sessionData, {
                status: 200,
                statusText: 'Valid session data.',
                headers: reqHeaders,
            });
        }
    }

    reqHeaders.append('Content-Type', 'text/plain');

    return NextResponse.json(null, {
        status: 401,
        statusText: 'Could not get session data with access token. Try again.',
        headers: reqHeaders,
    });
}