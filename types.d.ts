type NewOrder = {
  orderId: string,
  paymentLink: string,
  createdAt: string,
  status: string,
}

type SessionCartState = {
  cart: SquareCartItem[],
  outOfStock: SquareCartItem[],
  loaded?: boolean | null,
}

type CartContextState = {
  cart: SessionCartItem[] | undefined,
  error: Error | null,
  generateOrder: boolean,
}

type CartContextPageNote = {
  toggle: boolean,
  productQuantity: number, // add to cart confirmation
  outOfStock: SquareCartItem[],
  addItemError: boolean,
  loadCartError: boolean,
  updateCartError: boolean,
  createOrderError: boolean,
}

type FormState = {
  status: boolean | null,
  data: any,
  errors: z.core.$ZodFlattenedError<SquareCustomer>,
}

type CheckoutInputs = {
  nameGiven: string,
  nameLast: string,
  email: string,
  birthday?: Date,
  referenceId?: string,
  // addressLine: [string, (string | undefined)?, (string | undefined)?],
  addressLine1: string,
  addressLine2?: string,
  // adminDistrict: [string, (string | undefined)?, (string | undefined)?],
  locality: string,
  postalCode: string,
  adminDistrict: string,
  country: string,
}

type SquareCustomer = {
  firstName: string,
  lastName: string,
  email: string,
  referenceId?: string,
  addressLine1: string,
  addressLine2?: string,
  city: string,
  postalCode: string,
  region: string,
  countryCode: any,
}

type SquareAddress = { // https://developer.squareup.com/docs/build-basics/common-data-types/working-with-addresses
  // check for maximum lengths: https://developer.squareup.com/docs/customers-api/use-the-api/keep-records#considerations
  addressLine: [string, string?, string?],
  locality: string, // city/town/suburb
  adminDistrict: [string, string?, string?], // state/province
  postalCode: string,
  country: string,
}

type OrderDetails = {
  SPL_id: string,
  SPL_url: string,
  status: string,
  orderId: string,
  createdAt: Date,
  totalAmount: number,
  sOrder?: {
    lineItems: undefined | {
      name: string,
      quantity: string,
      basePriceMoney: {
        amount: number,
      },
      modifiers: {
        name: string,
      }[],
      variationName: string,
    }[],
    netAmounts: {
      name: string,
      amount: number,
    }[],
  },
}

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
};

interface SquareItem_Base {
  name: string,
  productId: string,
  description: string,
  imageUrl: string,
}

interface SquareItem {
  name: string;
  productId: string;
  description: string;
  ingredients: string[];
  variations: {
    name: string;
    defaultIndex: number;
    list: {
      name: string;
      price: number;
      inventoryQuantity: number;
      inventoryState: string;
    }[];
  };
  modifiers: {
    name: string;
    list: {
      name: string;
      id: string;
      default: boolean;
    }[];
  }[];
  imageUrl: string;
  isArchived: boolean;
}

// Cart Item interface
interface CartItem {
  id: string;
  indexVariation: number;
  indexModifiers: number[];
  quantity: number;
  productItem: ProductItem;
}

interface SessionCartItem {
  id: string;
  indexVariation: number;
  indexModifiers: number[];
  quantity: number;
}

interface SquareCartItem {
  id: string;
  indexVariation: number;
  indexModifiers: number[];
  quantity: number;
  squareItem: SquareItem;
  isArchived?: boolean;
}

interface CatalogItemSimple {
  name: string;
  productId: string;
  price: number;
  inventoryState: InventoryState;
  inventoryQuantity: number;
  imageUrl: string;
  isArchived: boolean;
}

type RelatedItem = {
  id: string,
  productId: string,
  catId: string,
}

type ProductItem = {
  id: string,
  productId: string;
};

type MenuItem = {
  itemId: string;
  name: string;
  description: string;
  price: number;
  img: string;
  catId: number;
};

type Tag = {
  tagId: string;
  icon?: string;
};

type MenuCat = {
  id: number;
  name: string;
  description?: string;
  list: MenuItem[];
};

type AboutInfo = {
  id?: string;
  label: string;
  description: string;
  icon_className?: string;
};