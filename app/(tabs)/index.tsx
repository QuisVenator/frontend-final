import { StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import { Button } from 'react-native-paper';
import { loadMockData } from '../../provider/Storage';
import { SaleActionType, useSaleContext } from '../../provider/SaleContext';
import { ClientActionType, useClientContext } from '../../provider/ClientContext';
import { CategoryActionType, useCategoryContext } from '../../provider/CategoryContext';
import { ProductActionType, useProductContext } from '../../provider/ProductContext';
import React from 'react';
import { SnackBarActionType, useSnackBarContext } from '../../provider/SnackBarContext';

export default function TabOneScreen() {
  const {state: saleState, dispatch: saleDispatch} = useSaleContext();
  const {state: clientState, dispatch: clientDispatch} = useClientContext();
  const {state: categoryState, dispatch: categoryDispatch} = useCategoryContext();
  const {state: productState, dispatch: productDispatch} = useProductContext();

  const { dispatch: snackBarDispatch } = useSnackBarContext();

  function resetState() {
    for (let sale of saleState.sales) {
      saleDispatch({type: SaleActionType.CANCEL, payload: sale.id});
    }
    for (let product of productState.products) {
      productDispatch({type: ProductActionType.CANCEL, payload: product.id});
    }
    for (let client of clientState.clients) {
      clientDispatch({type: ClientActionType.CANCEL, payload: client.ruc});
    }
    for (let category of categoryState.categories) {
      categoryDispatch({type: CategoryActionType.CANCEL, payload: category.id});
    }
    const [clients, categories, products, sales] = loadMockData();
    for (let res of sales) {
      saleDispatch({type: SaleActionType.ADD_INITIAL, payload: res});
    }
    for (let res of products) {
      productDispatch({type: ProductActionType.ADD_INITIAL, payload: res});
    }
    for (let client of clients) {
      clientDispatch({type: ClientActionType.ADD_INITIAL, payload: client});
    }
    for (let category of categories) {
      categoryDispatch({type: CategoryActionType.ADD_INITIAL, payload: category});
    }

    let payload = { visible: true, text: "Datos cargados correctamente" };
    snackBarDispatch({ type: SnackBarActionType.TOGGLE, payload });
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TP Frontend</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button onPress={resetState}>Cargar datos prueba</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
