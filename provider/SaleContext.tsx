import React, { createContext, useContext, useReducer } from 'react';
import { Sale } from '../models/Sale';
import storage from './Storage';

type State = {
  sales: Sale[];
  edit: Sale; 
};

interface Add {
  type: SaleActionType.ADD;
  payload: Sale;
}
interface SET_EDIT {
    type: SaleActionType.EDIT;
    payload: Sale;
}
interface ADD_INITIAL {
    type: SaleActionType.ADD_INITIAL;
    payload: Sale;
  }

interface Update {
    type: SaleActionType.UPDATE;
    payload: Sale;
}

interface Cancel {
    type: SaleActionType.CANCEL;
    payload: number;
}

type SaleAction = Add | ADD_INITIAL | Update | Cancel | SET_EDIT;

const initialState: State = {
    sales: [],
    edit: {} as Sale,
};

const SaleContext = createContext<{
    state: State;
    dispatch: React.Dispatch<SaleAction>;
}>({ state: initialState, dispatch: () => null });
(initialState);

export const enum SaleActionType {
    ADD_INITIAL,
    ADD,
    UPDATE,
    CANCEL,
    EDIT,
}

const categoryReducer = (state:State, action: SaleAction) => {
    let sales = [] as Sale[];
    switch (action.type) {
        case SaleActionType.ADD:
            sales = [...state.sales, action.payload]
            storage.saveObject('sales', sales);
            return {
                ...state,
                sales: [...state.sales, action.payload],
            };
        case SaleActionType.ADD_INITIAL:
            return {
                ...state,
                sales: [...state.sales, action.payload],
            };
        case SaleActionType.UPDATE:
            return {
                ...state,
                sales: state.sales.map(category =>
                    category.id === action.payload.id
                        ? action.payload
                        : category
                ),
            };
        case SaleActionType.CANCEL:
            sales = state.sales.filter(category => category.id !== action.payload)
            storage.saveObject('sales', sales);
            return {
                ...state,
                sales: sales,
            };
        case SaleActionType.EDIT:
            return {
                ...state,
                edit: action.payload,
            }
        default:
            return state;
    }
}

export const SaleProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(categoryReducer, initialState);
    return (
        <SaleContext.Provider value={{ state, dispatch }}>
            {children}
        </SaleContext.Provider>
    );
}

export const useSaleContext = () => useContext(SaleContext);