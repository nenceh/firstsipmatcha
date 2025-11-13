import { NextRequest, NextResponse } from "next/server";
import { createSession, deleteSession, updateAccessToken, verifySession } from "@/lib/prisma";
import { getAccessTokenFromRequest } from "@/lib/session";

// POST route to refresh session token data
export async function POST(req: NextRequest) {
    const reqHeaders = new Headers(req.headers);
    reqHeaders.append('Content-Type', 'application/json');
    const accessToken = await getAccessTokenFromRequest(req);
    let newAccessToken: string | undefined = ''
        // newRefreshToken: string | undefined = '',
        // newExpiryDate: Date | undefined
    ;

    if(accessToken){
        const data = await verifySession(accessToken);

        if(data && new Date() > data.expiryDate){
            await deleteSession(data.refreshToken);
            const newData = await createSession();
            newAccessToken = newData?.newAccessToken;
            // newRefreshToken = newData?.newRefreshToken;
            // newExpiryDate = newData?.newExpiryDate;
        } else if(data?.accessExpired){
            newAccessToken = await updateAccessToken(data.refreshToken);
            // newRefreshToken = data.refreshToken;
            // newExpiryDate = data.expiryDate;
        } else{
            const newData = await createSession();
            newAccessToken = newData?.newAccessToken;
            // newRefreshToken = newData?.newRefreshToken;
            // newExpiryDate = newData?.newExpiryDate;
        }
    } else{
        const newData = await createSession();
        newAccessToken = newData?.newAccessToken;
        // newRefreshToken = newData?.newRefreshToken;
        // newExpiryDate = newData?.newExpiryDate;
    }

    const response = NextResponse.json(newAccessToken, { status: 200 });

    return response;
}