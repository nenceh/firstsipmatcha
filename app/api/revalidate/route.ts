// on-demand revalidation route (for every page.tsx that could use revalidation for updated version)
// https://nextjs.org/docs/app/api-reference/functions/revalidatePath

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { SESSION_CART } from '@/database/constants';

export async function GET(request: NextRequest) {
    const path = request.nextUrl.searchParams.get('path') || '/shop';

    revalidatePath(path, 'page');
    revalidateTag(SESSION_CART.tag);

    return NextResponse.json(true, {
        status: 200,
        statusText: `revalidatePath(${path}, 'page')`,
    });
}