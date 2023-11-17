import React, { createContext, useContext, useReducer } from 'react';
import { Product } from '../models/Product';
import storage from './Storage';

type State = {
  products: Product[];
  edit: Product; 
};

interface Add {
  type: ProductActionType.ADD;
  payload: Product;
}
interface SET_EDIT {
    type: ProductActionType.EDIT;
    payload: Product;
}
interface ADD_INITIAL {
    type: ProductActionType.ADD_INITIAL;
    payload: Product;
  }

interface Update {
    type: ProductActionType.UPDATE;
    payload: Product;
}

interface Cancel {
    type: ProductActionType.CANCEL;
    payload: number;
}

type ProductAction = Add | ADD_INITIAL | Update | Cancel | SET_EDIT;

const initialState: State = {
    products: [],
    edit: {} as Product,
};

const ProductContext = createContext<{
    state: State;
    dispatch: React.Dispatch<ProductAction>;
}>({ state: initialState, dispatch: () => null });
(initialState);

export const enum ProductActionType {
    ADD_INITIAL,
    ADD,
    UPDATE,
    CANCEL,
    EDIT,
}

const categoryReducer = (state:State, action: ProductAction) => {
    let products = [] as Product[];
    switch (action.type) {
        case ProductActionType.ADD:
            products = [...state.products, action.payload]
            storage.saveObject('products', products);
            return {
                ...state,
                products: [...state.products, action.payload],
            };
        case ProductActionType.ADD_INITIAL:
            return {
                ...state,
                products: [...state.products, action.payload],
            };
        case ProductActionType.UPDATE:
            return {
                ...state,
                products: state.products.map(category =>
                    category.id === action.payload.id
                        ? action.payload
                        : category
                ),
            };
        case ProductActionType.CANCEL:
            products = state.products.filter(category => category.id !== action.payload)
            storage.saveObject('products', products);
            return {
                ...state,
                products: products,
            };
        case ProductActionType.EDIT:
            return {
                ...state,
                edit: action.payload,
            }
        default:
            return state;
    }
}

export const ProductProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(categoryReducer, initialState);
    return (
        <ProductContext.Provider value={{ state, dispatch }}>
            {children}
        </ProductContext.Provider>
    );
}

export const useProductContext = () => useContext(ProductContext);