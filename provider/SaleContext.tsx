import React, { createContext, useContext, useReducer } from 'react';
import { Sale, SaleDetail } from '../models/Sale';
import storage from './Storage';

type State = {
  sales: Sale[];
  edit: Sale; 
};

interface Add {
  type: SaleActionType.ADD;
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

interface AddDetail {
    type: SaleActionType.ADD_DETAIL;
    payload: [SaleDetail, number];
}

type SaleAction = Add | ADD_INITIAL | Update | Cancel | SET_EDIT | AddDetail;

const initialState: State = {
    sales: [],
    edit: {details: [] as SaleDetail[], total: 0} as Sale,
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
    ADD_DETAIL,
}

const categoryReducer = (state:State, action: SaleAction) => {
    let sales = [] as Sale[];
    switch (action.type) {
        case SaleActionType.ADD:
            sales = [...state.sales, state.edit]
            storage.saveObject('sales', sales);
            state.edit = {details: [] as SaleDetail[], total: 0} as Sale;
            return {
                ...state,
                sales: sales,
            };
        case SaleActionType.ADD_INITIAL:
            return {
                ...state,
                date: new Date(action.payload.date),
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
        case SaleActionType.ADD_DETAIL:
            return {
                ...state,
                edit: {
                    ...state.edit,
                    total: state.edit.total + action.payload[0].quantity * action.payload[1],
                    details: [...state.edit.details, action.payload[0]]
                }
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