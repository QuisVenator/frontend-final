import React, { createContext, useContext, useReducer } from 'react';
import { Client } from '../models/Client';
import storage from './Storage';

type State = {
  clients: Client[];
  edit: Client;
};

interface Add {
    type: ClientActionType.ADD;
    payload: Client;
  }
  interface SET_EDIT {
    type: ClientActionType.EDIT;
    payload: Client;
  }
interface ADD_INITIAL {
    type: ClientActionType.ADD_INITIAL;
    payload: Client;
  }

interface Update {
    type: ClientActionType.UPDATE;
    payload: Client;
}

interface Cancel {
    type: ClientActionType.CANCEL;
    payload: string;
}

type ClientAction = Add | ADD_INITIAL | Update | Cancel | SET_EDIT;

const initialState: State = {
    clients: [],
    edit: {} as Client,
};

const ClientContext = createContext<{
    state: State;
    dispatch: React.Dispatch<ClientAction>;
}>({ state: initialState, dispatch: () => null });
(initialState);

export const enum ClientActionType {
    ADD_INITIAL,
    ADD,
    UPDATE,
    CANCEL,
    EDIT,
}

const clientReducer = (state:State, action: ClientAction) => {
    let clients = [] as Client[];
    switch (action.type) {
        case ClientActionType.ADD:
            clients = [...state.clients, action.payload]
            storage.saveObject('clients', clients);
            return {
                ...state,
                clients: [...state.clients, action.payload],
            };
        case ClientActionType.ADD_INITIAL:
            return {
                ...state,
                clients: [...state.clients, action.payload],
            };
        case ClientActionType.UPDATE:
            return {
                ...state,
                clients: state.clients.map(client =>
                    client.ruc === action.payload.ruc
                        ? action.payload
                        : client
                ),
            };
        case ClientActionType.CANCEL:
            clients = state.clients.filter(client => client.ruc !== action.payload)
            storage.saveObject('clients', clients);
            return {
                ...state,
                clients: clients,
            };
        case ClientActionType.EDIT:
            return {
                ...state,
                edit: action.payload,
            }
        default:
            return state;
    }
}

export const ClientProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(clientReducer, initialState);
    return (
        <ClientContext.Provider value={{ state, dispatch }}>
            {children}
        </ClientContext.Provider>
    );
}

export const useClientContext = () => useContext(ClientContext);