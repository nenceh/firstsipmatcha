// https://www.npmjs.com/package/rate-limiter-flexible

import { RateLimiter } from "@/database/constants";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

export const globalRateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 3, // seconds
});

export const sessionRateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 10,
});

export const validateRateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 10,
});

// append RateLimiter headers to successful request
export const appendRLHeaders = (reqHeaders: Headers, rateLimiterRes: RateLimiterRes) => {
    reqHeaders.append(RateLimiter.Limit, (rateLimiterRes.consumedPoints + rateLimiterRes.remainingPoints).toString());
    reqHeaders.append(RateLimiter.RemainingPoints, rateLimiterRes.remainingPoints.toString());
    reqHeaders.append(RateLimiter.Reset, Math.ceil((Date.now() + rateLimiterRes.msBeforeNext) / 1000).toString());
}

// append RateLimiter headers to rejected request
export const appendRLRejectHeaders = (rejectHeaders: Headers, rateLimiterRes: RateLimiterRes) => {
    rejectHeaders.append('Content-Type', 'text/plain');
    rejectHeaders.append(RateLimiter.RetryAfter, (rateLimiterRes.msBeforeNext / 1000).toString());
    rejectHeaders.append(RateLimiter.Reset, Math.ceil((Date.now() + rateLimiterRes.msBeforeNext) / 1000).toString());
}