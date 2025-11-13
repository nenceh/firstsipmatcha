import { PrismaClient } from '@prisma/client';

// https://stackoverflow.com/a/73503335
export declare global {
    declare module globalThis {
        var PRISMA: PrismaClient;
    }
}