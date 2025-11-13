'use server';

import { PrismaClient } from '@prisma/client';
import { generateUUID } from './generate';
import { EXPIRY_DURATION, SquareOrderStatus } from '@/database/constants';

let PRISMA: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    PRISMA = new PrismaClient();
} else {
    if (!global.PRISMA) {
        global.PRISMA = new PrismaClient();
    }
    PRISMA = global.PRISMA;
}

export const getMenuItem = async(id: string) => {
    return await PRISMA.menuItem.findFirst({
        where: { itemId: id },
    });
};

export const getMenu = async() => {
    return await PRISMA.menuItem.findMany();
};

export const getMenuCategory = async(catId: number) => {
    return await PRISMA.menuCategory.findUnique({
        where: { id: catId }
    });
};

export const getRelatedMenuItems = async(catId: number, id: string) => {
    return await PRISMA.menuItem.findMany({
        where: {
            AND: [
                { catId: catId },
                { itemId: { not: id } }
            ]
        }
    });
};

export const getProductItem = async(id: string) => {
    return await PRISMA.productItem.findFirst({
        where:{ productId: id },
    });
};

export const getProductIdFromSquareId = async(id: string) => {
    return await PRISMA.productItem.findUnique({
        where: { id: id },
        select: { productId: true },
    });
}

export const getShop = async() => {
    return await PRISMA.productItem.findMany();
};

export const getProductCategory = async(catId: string) => {
    return await PRISMA.productCategory.findUnique({
        where: { id: catId }
    });
};

export const getRelatedProductItems = async(catId: string, id: string) => {
    return await PRISMA.productItem.findMany({
        where: {
            AND: [
                { catId: catId },
                { productId: { not: id } }
            ]
        }
    });
};

export const createPrismaOrder = async(
    accessToken: string,
    SPL: {
        iKey: string,     // UUID
        id: string,       // paymentLink?.id as string
        orderId: string,  // paymentLink?.orderId as string
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        order: any,       // relatedResources?.orders![0]
        url: string,      // paymentLink?.url as string
    },
) => {
    try{
        const res = await PRISMA.session.update({
            where: { accessToken: accessToken },
            data: {
                orders: {
                    create: {
                        orderId: SPL.orderId,
                        iKey: SPL.iKey,
                        SPL_id: SPL.id,
                        SPL_url: SPL.url, 
                        totalAmount: (Number(SPL.order.totalMoney.amount))/100,
                        status: SquareOrderStatus.DRAFT,
                        createdAt: SPL.order.createdAt, // RFC 3339 format, https://stackoverflow.com/questions/11591854/format-date-to-mm-dd-yyyy-in-javascript
                        updatedAt: SPL.order.updatedAt, // RFC 3339 format
                    }
                }
            },
            include: {
                orders: true,
            },
        });

        return res;
    } catch(e){ console.log(e); return undefined; }
}

export const deletePrismaOrderByOrderId = async(orderId: string) => {
    try{
        const res = await PRISMA.order.delete({
            where: {
                orderId: orderId,
                status: SquareOrderStatus.OPEN,
            },
        });

        return res;
    } catch(e){ console.log(e); return undefined; }
}

export const getPrismaOrderByOrderId = async(orderId: string) => {
    // const session = await PRISMA.session.findUnique({
    //     where: { accessToken: accessToken },
    // });

    try {
        const res = await PRISMA.order.findUnique({
            where: {
                orderId: orderId,
                // refreshToken: session?.refreshToken,
            },
            select: {
                orderId: true,
                SPL_id: true,
                SPL_url: true,
                status: true,
                createdAt: true,
                totalAmount: true,
            }
        });

        return res;
    } catch(e){ console.log(e); return undefined; }
}

export const getPrismaOrderBySPL_id = async (SPL_id: string) => {
    return PRISMA.order.findUnique({
        where: { SPL_id: SPL_id }
    });
}

export const updatePrismaOrder = async(orderId: string, state: string, updatedAt: string) => {
    try{
        await PRISMA.order.update({
            where: {
                // SPL_id: SPL_id,
                orderId: orderId,
            },
            data: {
                status: state,
                updatedAt: updatedAt,
            }
        });

        return true;
    } catch(e){ console.log(e); return false; }
}

export const createSession = async() => {
    const newAccessToken = generateUUID(), newRefreshToken = generateUUID(), newExpiryDate = new Date(Date.now() + EXPIRY_DURATION);
    const cart: SquareCartItem[] = [];
    try{
        await PRISMA.session.create({
            data: {
                refreshToken: newRefreshToken,
                accessToken: newAccessToken,
                // accessExpired: false,
                expiryDate: newExpiryDate,
            },
        }); 
        return { newAccessToken, newRefreshToken, newExpiryDate, cart };
    } catch(e){ console.log(e); return undefined; }
}

export const getSessionData = async(accessToken: string, firstLogin?: boolean) => {
    let newExpiryDate;
    if(firstLogin === true){
        newExpiryDate = new Date(Date.now() + EXPIRY_DURATION);
    }
    try{
        await PRISMA.session.update({
            where: { accessToken: accessToken },
            data: {
                expiryDate: newExpiryDate,
            }
        });

        return await PRISMA.session.findUnique({
            where: { accessToken: accessToken },
            select: {
                // refreshToken: false,
                cartItems: {
                    orderBy: { addedAt: 'asc' },
                    include: {
                        productItem: {
                            select: {
                                id: true,
                                productId: true,
                            }
                        }
                    },
                },
                orders: { orderBy: { createdAt: 'asc' } },
            }
        });

    } catch(e){ return undefined; }
}

export const verifySession = async(accessToken: string) => {
    try{
        return await PRISMA.session.findUnique({
            where: { accessToken: accessToken },
            select: {
                accessToken: true,
                accessExpired: true,
                refreshToken: true,
                expiryDate: true,
                cartItems: true,
                orders: false,
            }
        });

    } catch(e){ console.log(e); return undefined; }
}

export const getSessionCart = async(accessToken: string) => {
    try{
        return await PRISMA.session.findUnique({
            where: { accessToken: accessToken },
            select: {
                cartItems: {
                    orderBy: { addedAt: 'asc' },
                    include: { productItem: true },
                },
            }
        });

    } catch(e){ console.log(e); return undefined; }
}

export const updateAccessToken = async(refreshToken: string) => {
    const newAccessToken = generateUUID(), newExpiryDate = new Date(Date.now() + EXPIRY_DURATION);
    try {
        await PRISMA.session.update({
            where: {
                refreshToken: refreshToken,
            },
            data: {
                accessToken: newAccessToken,
                accessExpired: false,
                expiryDate: newExpiryDate,
            }
        });
        return newAccessToken;
    } catch(e){ console.log(e); return undefined; }
}

export const addToSessionCart = async(accessToken: string, item: SessionCartItem) => {
    try{
        const session = await PRISMA.session.findUnique({
            where: { accessToken: accessToken },
        });

        const res = await PRISMA.session.update({
            where: {
                accessToken: accessToken,
                refreshToken: session?.refreshToken,
            },
            data: {
                // accessExpired: true,
                cartItems: {
                    upsert: {
                        where: {
                            refreshToken_productId_indexVariation_indexModifiers: {
                                productId: item.id,
                                refreshToken: session?.refreshToken as string,
                                indexVariation: item.indexVariation,
                                indexModifiers: item.indexModifiers,
                            }
                        },
                        update: {
                            quantity: { increment: item.quantity },
                            updatedAt: new Date(),
                        },
                        create: {
                            quantity: item.quantity,
                            productId: item.id,
                            indexVariation: item.indexVariation,
                            indexModifiers: item.indexModifiers,
                            // updatedAt: new Date(),
                        }
                    }
                }
            },
            select: {
                refreshToken: false,
                accessToken: true,
                accessExpired: false,
                expiryDate: false,
                cartItems: {
                    select: {
                        id: false,
                        refreshToken: false,
                        quantity: true,
                        productId: true,
                        indexModifiers: true,
                        indexVariation: true,
                    },
                    orderBy: { addedAt: 'asc' },
                }
            },
        });

        return true;
    } catch(e){ console.log(e); return false; }
}

export const updateSessionCart = async(accessToken: string, item: SessionCartItem, quantity: number) => {
    try{
        const session = await PRISMA.session.findUnique({
            where: { accessToken: accessToken }
        });

        await PRISMA.session.update({
            where: {
                accessToken: accessToken,
                refreshToken: session?.refreshToken,
            },
            data: {
                // accessExpired: true,
                cartItems: {
                    update: {
                        where: {
                            refreshToken_productId_indexVariation_indexModifiers: {
                                productId: item.id,
                                refreshToken: session?.refreshToken as string,
                                indexVariation: item.indexVariation,
                                indexModifiers: item.indexModifiers,
                            }
                        },
                        data:{
                            quantity: quantity,
                            updatedAt: new Date(),
                        },
                    }
                }
            },
            select: {
                refreshToken: false,
                accessToken: true,
                accessExpired: false,
                expiryDate: false,
                cartItems: {
                    select: {
                        id: false,
                        refreshToken: false,
                        quantity: true,
                        productId: true,
                        indexModifiers: true,
                        indexVariation: true,
                    },
                    orderBy: { addedAt: 'asc' },
                }
            }
        });

        return true;
    } catch(e){ console.log(e); return false; }
}

export const removeFromSessionCart = async(accessToken: string, item: SessionCartItem) => {
    try{
        const session = await PRISMA.session.findUnique({
            where: {
                accessToken: accessToken,
                cartItems: { some: { productId: item.id } }
            }
        });

        await PRISMA.session.update({
            where: {
                accessToken: accessToken,
                refreshToken: session?.refreshToken,
            },
            data: {
                // accessExpired: true,
                cartItems: {
                    delete: {
                        refreshToken_productId_indexVariation_indexModifiers: {
                            productId: item.id,
                            refreshToken: session?.refreshToken as string,
                            indexVariation: item.indexVariation,
                            indexModifiers: item.indexModifiers,
                        }
                    },
                },
            },
        });

        return true;
    } catch(e){ console.log(e); return false; }
}

export const clearSessionCart = async(accessToken: string) => {
    try{
        const session = await PRISMA.session.findUnique({
            where: { accessToken: accessToken }
        });

        await PRISMA.session.update({
            where: {
                refreshToken: session?.refreshToken as string,
                cartItems: { some: {} },
            },
            data: {
                // accessExpired: true,
                cartItems: { deleteMany: {} },
            }
        });

        return true;
    } catch(e){ console.log(e); return false; }
}

export const deleteSession = async(refreshToken: string) => {
    try{
        await PRISMA.session.delete({
            where: { refreshToken: refreshToken }
        });
        return true;
    } catch(e){ console.log(e); return false; }
}