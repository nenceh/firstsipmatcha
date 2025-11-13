'use client';

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useReducer, useState, useTransition } from 'react';
import Modal from '../components/Modal';
import { ApiPaths, BASE_URL, MarketPaths, SESSION_CART } from '@/database/constants';
import { usePathname, useRouter } from 'next/navigation';

interface CartContextType {
    state: CartContextState;
    revalidate: (pathInput?: string) => void;
    addToSessionCart: (item: SessionCartItem) => void;
    updateQuantitySessionCart: (item: SessionCartItem, amount: number) => void;
    removeFromSessionCart: (items: SessionCartItem[]) => void;
    clearSessionCart: () => void;
    toggleModalSquare: Dispatch<SetStateAction<boolean>>,
    pageNoteState: CartContextPageNote;
    routerRefresh: () => void;
    openPageNote: () => void;
    loadCartError: () => void;
    updateCartError: () => void;
    closePageNotes: () => void;
    closeCartError: () => void;
    closeOutOfStock: () => void;
    closeOrderError: () => void;
    outOfStockNote: () => void;
    orderErrorNote: () => void;
    isPending: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartContextState = {
    cart: undefined,
    error: null,
    generateOrder: false,
}

enum DispatchActionType{
    ADD_ITEM = 'ADD_ITEM',
    REMOVE_ITEM = 'REMOVE_ITEM',
    UPDATE_ITEM = 'UPDATE_ITEM',
    CLEAR_CART = 'CLEAR_CART',
    INITIALIZE = 'INITIALIZE',
    SET_CART_CONFIRMATION = 'SET_CART_CONFIRMATION',
    SET_ADD_ITEM_ERROR = 'SET_ADD_ITEM_ERROR',
    SET_LOAD_CART_ERROR = 'SET_LOAD_CART_ERROR',
    SET_UPDATE_CART_ERROR = 'SET_UPDATE_CART_ERROR',
    SET_OUT_OF_STOCK = 'SET_OUT_OF_STOCK',
    SET_ORDER_ERROR = 'SET_ORDER_ERROR',
    OPEN_NOTE = 'OPEN_NOTE',
    CLEAR_OUT_OF_STOCK = 'CLEAR_OUT_OF_STOCK',
    TOGGLE_SQUARE_INFO = 'TOGGLE_SQUARE_INFO',
    GENERATE_ORDER = 'GENERATE_ORDER',
    FINISH_ORDER = 'FINISH_ORDER',
    CLOSE_PAGE_NOTES = 'CLOSE_PAGES_NOTES',
    CLOSE_CART_CONFIRMATION = 'CLOSE_CART_CONFIRMATION',
    CLOSE_OUT_OF_STOCK = 'CLOSE_OUT_OF_STOCK',
    CLOSE_ADD_ITEM_ERROR = 'CLOSE_ADD_ITEM_ERROR',
    CLOSE_CART_ERROR = 'CLOSE_CART_ERROR',
    CLOSE_ORDER_ERROR = 'CLOSE_ORDER_ERROR',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = (state: any, action: any) => {
    const { type, payload } = action;

    switch(type){
        case DispatchActionType.ADD_ITEM:
            const existingItem = state.cart.findIndex((item: SessionCartItem) => item.id === payload.id && item.indexVariation === payload.indexVariation && JSON.stringify(item.indexModifiers) === JSON.stringify(payload.indexModifiers));

            if(existingItem >= 0){
                return {
                    ...state,
                    cart: state.cart.map((cartItem: SessionCartItem, i: number) =>
                        (i === existingItem)
                        ?
                            {
                                ...cartItem,
                                quantity: cartItem.quantity + payload.quantity,
                            }
                        : cartItem
                    ),
                    loaded: true,
                };
            }

            return {
                ...state,
                cart: [
                    ...state.cart,
                    {
                        ...payload,
                        quantity: payload.quantity
                    },
                ],
            };
        case DispatchActionType.REMOVE_ITEM:
            return {
                ...state,
                cart: state.cart.filter((item: SessionCartItem) => !payload.some((oos: SessionCartItem) =>
                    (item.id + item.indexVariation + JSON.stringify(item.indexModifiers)) === (oos.id + oos.indexVariation + JSON.stringify(oos.indexModifiers))
                )),
            };
        case DispatchActionType.UPDATE_ITEM:
            return {
                ...state,
                cart: state.cart.map((cartItem: SessionCartItem) =>
                    cartItem.id === payload.item.id && cartItem.indexVariation === payload.item.indexVariation && JSON.stringify(cartItem.indexModifiers) === JSON.stringify(payload.item.indexModifiers) ? {
                        ...cartItem,
                        quantity: payload.quantity,
                    } : cartItem
                ),
            };
        case DispatchActionType.CLEAR_CART:
            return {
                ...state,
                cart: [],
            };
        case DispatchActionType.INITIALIZE:
            return {
                cart: payload.cart,
                error: null,
            };
        case DispatchActionType.GENERATE_ORDER:
            return{
                ...state,
                generateOrder: true,
            }
        case DispatchActionType.FINISH_ORDER:
            return{
                ...state,
                generateOrder: false,
            }
        default:
            return { ...state };
    }
}

const pageNoteInitial: CartContextPageNote = {
    toggle: false,
    productQuantity: -1,
    outOfStock: [],
    addItemError: false,
    loadCartError: false,
    updateCartError: false,
    createOrderError: false,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pageNoteReducer = (state: CartContextPageNote, action: any) => {
    const { type, payload } = action;

    switch(type){
        case DispatchActionType.OPEN_NOTE:
            return{
                ...state,
                toggle: true,
            }
        case DispatchActionType.SET_OUT_OF_STOCK:
            return {
                ...state,
                outOfStock: payload,
            }
        case DispatchActionType.SET_ADD_ITEM_ERROR:
            return {
                ...state,
                addItemError: true,
            }
        case DispatchActionType.SET_LOAD_CART_ERROR:
            return {
                ...state,
                loadCartError: true,
            }
        case DispatchActionType.SET_UPDATE_CART_ERROR:
            return {
                ...state,
                updateCartError: true,
            }
        case DispatchActionType.SET_ORDER_ERROR:
            return {
                ...state,
                createOrderError: true,
            }
        case DispatchActionType.SET_CART_CONFIRMATION:
            return {
                ...state,
                productQuantity: payload.quantity,
            };
        case DispatchActionType.CLEAR_OUT_OF_STOCK:
            return {
                ...state,
                outOfStock: [],
            }
        case DispatchActionType.CLOSE_PAGE_NOTES:
            return pageNoteInitial;
        case DispatchActionType.CLOSE_OUT_OF_STOCK:
            return {
                ...state,
                toggle: false,
                outOfStock: [],
            };
        case DispatchActionType.CLOSE_ORDER_ERROR:
            return {
                ...state,
                toggle: false,
                createOrderError: false,
            };
        case DispatchActionType.CLOSE_ADD_ITEM_ERROR:
            return {
                ...state,
                toggle: false,
                addItemError: false,
            };
        case DispatchActionType.CLOSE_CART_ERROR:
            return {
                ...state,
                toggle: false,
                updateCartError: false,
                loadCartError: false,
            };
        default:
            return { ...state };
    }
}

export const CartProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [pageNoteState, pageNoteDispatch] = useReducer(pageNoteReducer, pageNoteInitial);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const pathname = usePathname();
    const [modalSquare, toggleModalSquare] = useState<boolean>(false);
    const [loadingCursor, toggleLoadingCursor] = useState<boolean>(false);
    const [dateHidden, setDateHidden] = useState<Date>();

    useEffect(() => {
        if(modalSquare){
            document.body.classList.add('modal-open');
        } else{ document.body.classList.remove('modal-open');}
    }, [modalSquare]);

    useEffect(() => {
        if(loadingCursor){
            document.body.classList.add('loading');
        } else{
            document.body.classList.remove('loading');
            if(pageNoteState.toggle){
                window.scrollTo(0,0);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingCursor]);

    useEffect(() => {
        init_context();
    }, []);

    const init_context = () => {
        startTransition(async() => {
            const res = await fetch(`${BASE_URL}${ApiPaths.SHOP}`, {
                next: {
                    tags: [SESSION_CART.tag],
                    revalidate: SESSION_CART.revalidate,
                },
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if(res.ok){
                const data = await res.json();
                dispatch({
                    type: DispatchActionType.INITIALIZE,
                    payload: data,
                });
            }
        });
    }

    const revalidate = (pathInput?: string) => { // refresh entire /shop site
        const path = pathInput || '(shop)';
        startTransition(() => {
            fetch(`${BASE_URL}${ApiPaths.REVALIDATE}?path=${path}`, {
                method: 'GET',
            });
        });
    }

    const routerRefresh = () => { // refresh current page
        router.refresh();
    }

    const handleVisibilityChange = () => {
        if(document.visibilityState === 'visible'){
            if(dateHidden){
                const secondsPast = (new Date().getTime() - dateHidden.getTime())/1000;
                if(secondsPast > SESSION_CART.revalidate && pathname !== MarketPaths.CHECKOUT){
                    startTransition(() => {
                        routerRefresh();
                        revalidate();
                    });
                }
            }
        }
        else{
            const cur = new Date();
            setDateHidden(cur);
        }
    };
    
    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (typeof window !== 'undefined') {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateHidden]);

    const addToSessionCart = (item: SessionCartItem) => {
        toggleLoadingCursor(true);
        startTransition(async() => {
            const res = await fetch(`${BASE_URL}${ApiPaths.SHOP}?action=add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    item: item,
                }),
            });

            if(res.ok){
                dispatch({
                    type: DispatchActionType.ADD_ITEM,
                    payload: item,
                });

                pageNoteDispatch({
                    type: DispatchActionType.SET_CART_CONFIRMATION,
                    payload: item,
                });
            } else{
                pageNoteDispatch({
                    type: DispatchActionType.SET_ADD_ITEM_ERROR,
                });
            }

            openPageNote();
            toggleLoadingCursor(false);
        });
    }

    const updateQuantitySessionCart = (item: SessionCartItem, quantity: number) => {
        startTransition(async() => {
            const res = await fetch(`${BASE_URL}${ApiPaths.SHOP}?action=update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain',
                },
                body: JSON.stringify({
                    item: item,
                    quantity: quantity,
                }),
            });

            if(res.ok){
                dispatch({
                    type: DispatchActionType.UPDATE_ITEM,
                    payload: {
                        item: item,
                        quantity: quantity,
                    },
                });
                router.refresh();
            } else{
                updateCartError();
            }
        });
    }

    const removeFromSessionCart = (items: SessionCartItem[]) => {
        startTransition(async() => {
            const res = await fetch(`${BASE_URL}${ApiPaths.SHOP}?action=delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain',
                },
                body: JSON.stringify({
                    items: items,
                }),
            });
            if(res.ok){
                dispatch({
                    type: DispatchActionType.REMOVE_ITEM,
                    payload: items,
                });
                router.refresh();
            } else{
                updateCartError();
            }
        });
    }

    const clearSessionCart = () => {
        startTransition(async() => {
            dispatch({ type: DispatchActionType.CLEAR_CART });
        });
    }

    const openPageNote = () => {
        pageNoteDispatch({
            type: DispatchActionType.OPEN_NOTE,
        });
    }

    const loadCartError = () => {
        pageNoteDispatch({
            type: DispatchActionType.SET_LOAD_CART_ERROR,
        });
    }

    const updateCartError = () => {
        pageNoteDispatch({
            type: DispatchActionType.SET_UPDATE_CART_ERROR,
        });
    }

    const closePageNotes = () => {
        pageNoteDispatch({
            type: DispatchActionType.CLOSE_PAGE_NOTES,
        });
    }

    const closeOutOfStock = () => {
        pageNoteDispatch({
            type: DispatchActionType.CLOSE_OUT_OF_STOCK,
        });
    }

    const closeCartError = () => {
        pageNoteDispatch({
            type: DispatchActionType.CLOSE_CART_ERROR,
        });
    }

    const closeOrderError = () => {
        pageNoteDispatch({
            type: DispatchActionType.CLOSE_ORDER_ERROR,
        });
    }

    const outOfStockNote = () => {
        pageNoteDispatch({
            type: DispatchActionType.SET_OUT_OF_STOCK,
        });
    }

    const orderErrorNote = () => {
        pageNoteDispatch({
            type: DispatchActionType.SET_ORDER_ERROR,
        });
    }

    return (
        <CartContext.Provider
            value={{
                revalidate,
                addToSessionCart,
                updateQuantitySessionCart,
                removeFromSessionCart,
                clearSessionCart,
                state,
                toggleModalSquare,
                pageNoteState,
                openPageNote,
                routerRefresh,
                loadCartError,
                updateCartError,
                closePageNotes,
                closeCartError,
                outOfStockNote,
                closeOutOfStock,
                closeOrderError,
                orderErrorNote,
                isPending,
            }}
        >
            {modalSquare &&
                <Modal
                    type='SQUARE_PAYMENT'
                    primaryBtn={toggleModalSquare}
                />
            }
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};