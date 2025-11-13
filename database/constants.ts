import { CountryCode, postcodeValidator } from 'postcode-validator';
import { z } from 'zod';

export const BASE = process.env.NODE_ENV === 'development' ?
    // '/firstsipmatcha'
    ''
:   '';

export const BASE_URL = process.env.NODE_ENV === 'development' ?
    `http://localhost:3000`
    // `http://192.168.2.20:3000`
: process.env.NEXT_PUBLIC_VERCEL_URL;

export const initialState: FormState = {
    status: null,
    errors: null,
    data: null,
};

export const SESSION_CART = {
    tag: 'session-cart',
    revalidate: 200,
}
export const SHOP_PRODUCTS = {
    tag: 'shop-products',
    revalidate: 20,
};

export enum RateLimiter {
    RetryAfter = 'Retry-After',
    Limit = 'X-RateLimit-Limit',
    RemainingPoints = 'X-RateLimit-Remaining',
    Reset = 'X-RateLimit-Reset',
}

export enum LOCATIONS {
    US = 'US',
    CA = 'CA',
}

export const MAX_LOCAL_QTY = 99;

export enum InventoryState {
    ARCHIVED = 'ARCHIVED',
    NO_STOCK = 'NO_STOCK', // if invQty === 0
    LOW_STOCK = 'LOW_STOCK', // if invAlertThres && invQty < invAlertThres
    IN_STOCK = 'IN_STOCK', // else
}

export enum MarketPaths {
    HOME = '/',
    ABOUT = '/about',
    MENU = '/menu',
    SHOP = '/shop',
    CART = '/shop/cart',
    CHECKOUT = '/shop/checkout',
    PRIVACY = '/privacy-policy',
    TERMS = '/terms-and-conditions',
    TEST = '/test',
}

export enum ApiPaths {
    BASE = '/api',
    REFRESH = '/api/refresh',
    REVALIDATE = '/api/revalidate',
    SHOP = '/api/shop',
    SHOP_CHECKOUT = '/api/shop/checkout',
    VALIDATE = '/api/validate',
    VALIDATE_ORDER = '/api/validate/order',
}

export enum SquareOrderStatus {
    PROPOSED = 'PROPOSED',
    OPEN = 'OPEN',
    DRAFT = 'DRAFT',
    COMPLETED = 'COMPLETED',
}

export const FORMAT_CURRENCY_CAD = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
});

export const FORMAT_SIZE_OZ = new Intl.NumberFormat('en-CA', {
    style: 'unit',
    unit: 'ounce',
    unitDisplay: 'short',
});

export const FORMAT_WEIGHT_KG = new Intl.NumberFormat('en-CA', {
    style: 'unit',
    unit: 'kilogram',
    unitDisplay: 'short',
});

export const FORMAT_DIMENSIONS_CM = new Intl.NumberFormat('en-CA', {
    style: 'unit',
    unit: 'centimeter',
    unitDisplay: 'short',
});

export const SQUARE_ATTEMPT_LIMIT = 5;

export const EXPIRY_DURATION = 7 * 24 * 60 * 60 * 1000;

export const SESSION_TOKEN_COOKIE = 'accessToken';

export const TOKEN_REGEX_BASE = /([a-fA-F0-9]{8})([a-fA-F0-9]{4})([a-fA-F0-9]{4})([a-fA-F0-9]{4})([a-fA-F0-9]{12})/; // w/o dashes

export const TOKEN_REGEX_FORMAT = /([a-fA-F0-9]{8})\-([a-fA-F0-9]{4})\-([a-fA-F0-9]{4})\-([a-fA-F0-9]{4})\-([a-fA-F0-9]{12})\-([0-9]{10})$/; // w/ dashes

export enum SQUARE_FETCH_BASEURL {
    CatalogObject = 'https://connect.squareupsandbox.com/v2/catalog/object/',
    CatalogList = 'https://connect.squareupsandbox.com/v2/catalog/list',
    InventoryCount = 'https://connect.squareupsandbox.com/v2/inventory/',
    Orders = 'https://connect.squareupsandbox.com/v2/orders/',
    PaymentLinks = 'https://connect.squareupsandbox.com/v2/online-checkout/payment-links',
    // Customers = 'https://connect.squareupsandbox.com/v2/customers',
    // Invoices = 'https://connect.squareupsandbox.com/v2/invoices',
}

export enum SquareMethod {
    CatalogObject_GET = 'GetCatalogObject_GET',
    CatalogList_GET = 'CatalogList_GET',
    InventoryCount_GET = 'InventoryCount_GET',
    Orders_GET = 'Orders_GET',
    PaymentLinks_POST = 'PaymentLinks_POST',
    PaymentLinks_PUT = 'PaymentLinks_PUT',
    PaymentLinks_DELETE = 'PaymentLinks_DELETE',
}

export enum FETCH_METHOD {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum SQUARE_CONSTRAINTS {
    CUSTOMER_NAME_GIVEN = 300,
    CUSTOMER_NAME_FAMILY = 300,
    CUSTOMER_EMAIL_ADDRESS = 254,
    CUSTOMER_ADDRESS_LINE = 500,
    CUSTOMER_ADDRESS_ADMIN_DISTRICT = 200,
    CUSTOMER_ADDRESS_LOCALITY = 300,
    CUSTOMER_ADDRESS_POSTAL_CODE = 12,
}

export enum SQUARE_CONSTANTS {
    CUSTOMER_NAME_GIVEN = 'First Name',
    CUSTOMER_NAME_FAMILY = 'Last Name',
    CUSTOMER_EMAIL_ADDRESS = 'Email Address',
    CUSTOMER_ADDRESS_LINE = 'Address Line',
    CUSTOMER_ADDRESS_ADMIN_DISTRICT = 'Province/State',
    CUSTOMER_ADDRESS_LOCALITY = 'City',
    CUSTOMER_ADDRESS_POSTAL_CODE = 'Postal/Zip Code',
}

// export const Customer = z.object({
//     nameGiven: z.string()
//         .max(SQUARE_CONSTRAINTS.CUSTOMER_NAME_GIVEN, { message: `Your name must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_NAME_GIVEN} characters long`})
//         .regex(/^[A-Za-z]+$/, { message: `Enter a valid name` }),
    
//     nameLast: z.string()
//         .max(SQUARE_CONSTRAINTS.CUSTOMER_NAME_FAMILY, { message: `Your name must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_NAME_FAMILY} characters long`})
//         .regex(/^[A-Za-z]+$/, { message: `Enter a valid name` }),
    
//     email: z.email({ message: 'Invalid email format' }),
    
//     // squareAddress: z.string().optional(),
    
//     birthday: z.date().optional(),
    
//     referenceId: z.string().optional(),
// });

// export const Address = z.object({
//     addressLine: z.tuple([
//         z.string()
//             .trim()
//             .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LINE, { message: `Address line must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LINE} characters long` })
//             .refine(line => line.length > 0 , { message: 'Address line 1 cannot be empty' }),
//         z.string()
//             .trim()
//             .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LINE, { message: `Address line must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LINE} characters long` })
//             .optional(),
//         z.string()
//             .trim()
//             .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LINE, { message: `Address line must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LINE} characters long` })
//             .optional(),
//     ]),

//     adminDistrict: z.tuple([
//         z.string()
//             .trim()
//             .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_ADMIN_DISTRICT, { message: `Address line must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_ADMIN_DISTRICT} characters long` }),
        
//         z.string()
//             .trim()
//             .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_ADMIN_DISTRICT, { message: `Address line must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_ADMIN_DISTRICT} characters long` })
//             .optional(),
        
//         z.string()
//             .trim()
//             .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_ADMIN_DISTRICT, { message: `Address line must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_ADMIN_DISTRICT} characters long` })
//             .optional(),
//     ]),

//     locality: z.string()
//         .trim()
//         .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LOCALITY, { message: `City must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LOCALITY} characters long` }),

//     postalCode: z.string()
//         .trim()   
//         .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_POSTAL_CODE, { message: `Zip/postal code must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_POSTAL_CODE} characters long` }),
    
//     country: z.string()
//         .trim(),
// });

// export const LOCATIONS = [ // https://www.html-code-generator.com/code-highlight.html
//   {
//     country: 'Canada',
//     countryCode: 'CA',
//     regionList: [{"name":"Alberta","code":"AB"},{"name":"British Columbia","code":"BC"},{"name":"Manitoba","code":"MB"},{"name":"New Brunswick","code":"NB"},{"name":"Newfoundland and Labrador","code":"NL"},{"name":"Northwest Territories","code":"NT"},{"name":"Nova Scotia","code":"NS"},{"name":"Nunavut","code":"NU"},{"name":"Ontario","code":"ON"},{"name":"Prince Edward Island","code":"PE"},{"name":"Quebec","code":"QC"},{"name":"Saskatchewan","code":"SK"},{"name":"Yukon","code":"YT"}],
//   },
//   {
//     country: 'United States',
//     countryCode: 'US',
//     regionList: [{"name":"Alabama","code":"AL"},{"name":"Alaska","code":"AK"},{"name":"American Samoa","code":"AS"},{"name":"Arizona","code":"AZ"},{"name":"Arkansas","code":"AR"},{"name":"Baker Island","code":"UM-81"},{"name":"California","code":"CA"},{"name":"Colorado","code":"CO"},{"name":"Connecticut","code":"CT"},{"name":"Delaware","code":"DE"},{"name":"District of Columbia","code":"DC"},{"name":"Florida","code":"FL"},{"name":"Georgia","code":"GA"},{"name":"Guam","code":"GU"},{"name":"Hawaii","code":"HI"},{"name":"Howland Island","code":"UM-84"},{"name":"Idaho","code":"ID"},{"name":"Illinois","code":"IL"},{"name":"Indiana","code":"IN"},{"name":"Iowa","code":"IA"},{"name":"Jarvis Island","code":"UM-86"},{"name":"Johnston Atoll","code":"UM-67"},{"name":"Kansas","code":"KS"},{"name":"Kentucky","code":"KY"},{"name":"Kingman Reef","code":"UM-89"},{"name":"Louisiana","code":"LA"},{"name":"Maine","code":"ME"},{"name":"Maryland","code":"MD"},{"name":"Massachusetts","code":"MA"},{"name":"Michigan","code":"MI"},{"name":"Midway Atoll","code":"UM-71"},{"name":"Minnesota","code":"MN"},{"name":"Mississippi","code":"MS"},{"name":"Missouri","code":"MO"},{"name":"Montana","code":"MT"},{"name":"Navassa Island","code":"UM-76"},{"name":"Nebraska","code":"NE"},{"name":"Nevada","code":"NV"},{"name":"New Hampshire","code":"NH"},{"name":"New Jersey","code":"NJ"},{"name":"New Mexico","code":"NM"},{"name":"New York","code":"NY"},{"name":"North Carolina","code":"NC"},{"name":"North Dakota","code":"ND"},{"name":"Northern Mariana Islands","code":"MP"},{"name":"Ohio","code":"OH"},{"name":"Oklahoma","code":"OK"},{"name":"Oregon","code":"OR"},{"name":"Palmyra Atoll","code":"UM-95"},{"name":"Pennsylvania","code":"PA"},{"name":"Puerto Rico","code":"PR"},{"name":"Rhode Island","code":"RI"},{"name":"South Carolina","code":"SC"},{"name":"South Dakota","code":"SD"},{"name":"Tennessee","code":"TN"},{"name":"Texas","code":"TX"},{"name":"United States Minor Outlying Islands","code":"UM"},{"name":"United States Virgin Islands","code":"VI"},{"name":"Utah","code":"UT"},{"name":"Vermont","code":"VT"},{"name":"Virginia","code":"VA"},{"name":"Wake Island","code":"UM-79"},{"name":"Washington","code":"WA"},{"name":"West Virginia","code":"WV"},{"name":"Wisconsin","code":"WI"},{"name":"Wyoming","code":"WY"}],
//   }
// ]

export const CheckoutSchema = z.object({
    firstName: z.string({ message: 'Enter a valid name' })
        .trim()
        .max(SQUARE_CONSTRAINTS.CUSTOMER_NAME_GIVEN, { message: `Your name must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_NAME_GIVEN} characters long`})
        .regex(/^[\p{Letter}\s-]+$/u, { message: `Enter a valid name` }),
    
    lastName: z.string({ message: 'Enter a valid name' })
        .trim()
        .max(SQUARE_CONSTRAINTS.CUSTOMER_NAME_FAMILY, { message: `Your name must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_NAME_FAMILY} characters long`})
        .regex(/^[\p{Letter}\s-]+$/u, { message: `Enter a valid name` }),
    
    email: z.email({ message: 'Enter a valid email' }),
    
    // birthday: z.date().optional(),
    
    referenceId: z.string().optional(),

    addressLine1: z.string({ message: 'Enter a valid address' })
        .trim()
        .min(1, { message: 'Enter a valid address' })
        .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LINE, { message: `Address must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LINE} characters long` }),
        // .refine(line => line.length > 0 , { message: 'Enter a valid address' }),

    addressLine2: z.string()
        .trim()
        // .min(1, { message: 'Enter a valid address' })
        .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LINE, { message: `Address must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LINE} characters long` })
        .optional(),

    city: z.string({ message: 'Enter a valid city' })
        .trim()
        .min(1, { message: 'Enter a valid city' })
        .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LOCALITY, { message: `City must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_LOCALITY} characters long` }),

    postalCode: z.string({ message: 'Enter a valid postal / ZIP code' })
        .trim(),
        // .max(SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_POSTAL_CODE, { message: `Postal / ZIP code must be at most ${SQUARE_CONSTRAINTS.CUSTOMER_ADDRESS_POSTAL_CODE} characters long` }),
    
    region: z.string()
        .refine(val => val, { message: 'Select a province / state' }),
    
    countryCode: z.string()
        .refine(val => val && ['US', 'CA'].includes(val), { message: 'Select a country' }),
}).refine(data => data.countryCode && data.postalCode && postcodeValidator(data.postalCode, data.countryCode), { message: 'Enter a valid postal / ZIP code', path: ['postalCode'] });