import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client } from '../models/Client';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Sale } from '../models/Sale';


export class Storage {
  loaded: boolean = false;

  constructor() {}

  saveObject(key: string, data: any) {
    AsyncStorage.setItem(key, JSON.stringify(data));
  }

  getObject(key: string) {
    return AsyncStorage.getItem(key)
  }

  clear() {
    AsyncStorage.clear();
  }
}

const storage = new Storage();

export default storage;

export const loadMockData = (): [Client[], Category[], Product[], Sale[]] => {
  let clients: Client[] = [
    { ruc: '1234567-2', name: 'Juan', lastName: 'Perez', email: 'juan@mail.com'},
    { ruc: '4685468-3', name: 'Maria', lastName: 'Perez', email: 'maria@mal.com'},
    { ruc: '1243578-4', name: 'Jose', lastName: 'Perez', email: 'jose@mail.com'},
  ]

  let categories: Category[] = [
    { id: 1, name: 'Bebidas'},
    { id: 2, name: 'Comidas'},
    { id: 3, name: 'Postres'},
  ]

  let products: Product[] = [
    { id: 1, code: 'no se que es', name: 'Coca Cola', price: 5_000, categoryId: 1},
    { id: 2, code: 'no se que es', name: 'Pepsi', price: 5_000, categoryId: 1},
    { id: 3, code: 'no se que es', name: 'Hamburguesa', price: 10_000, categoryId: 2},
    { id: 4, code: 'no se que es', name: 'Pizza', price: 15_000, categoryId: 2},
    { id: 5, code: 'no se que es', name: 'Helado', price: 5_000, categoryId: 3},
    { id: 6, code: 'no se que es', name: 'Torta', price: 10_000, categoryId: 3},
  ]

  let sales: Sale[] = [
    { id: 1, billId: 1, total: 15_000, date: new Date("2023-11-20 00:00:00"), clientId: '1234567-2',  details: [
      { productId: 1, quantity: 1},
      { productId: 3, quantity: 1},
    ]},
    { id: 2, billId: 2, total: 20_000, date: new Date("2023-11-20 00:00:00"), clientId: '1234567-2', details: [
      { productId: 2, quantity: 1},
      { productId: 4, quantity: 1},
    ]},
    { id: 3, billId: 3, total: 15_000, date: new Date("2023-11-20 00:00:00"), clientId: '1243578-4', details: [
      { productId: 5, quantity: 1},
      { productId: 6, quantity: 1},
    ]},
  ]

  storage.saveObject('clients', clients,);
  storage.saveObject('categories', categories,);
  storage.saveObject('products', products,);
  storage.saveObject('sales', sales,);

  return [clients, categories, products, sales]
}