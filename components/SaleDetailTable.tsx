import * as React from 'react';
import { Button, DataTable, TextInput } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from './Themed';
import { SaleActionType, useSaleContext } from '../provider/SaleContext';
import { router } from 'expo-router';
import { SnackBarActionType, useSnackBarContext } from '../provider/SnackBarContext';
import { useProductContext } from '../provider/ProductContext';
import { PaperSelect } from 'react-native-paper-select';
import { Product } from '../models/Product';
import { SaleDetail } from '../models/Sale';

const SaleDetailTable = () => {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10, 15, 20]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1]
  );

  const { state, dispatch } = useSaleContext();
  const { state: productState } = useProductContext();
  const [ productAdd, setProductAdd ] = React.useState<Product>({} as Product);
  const [ cuantityAdd, setCuantityAdd ] = React.useState<number>(0);
  const [ cuantityAddtext, setCuantityAddText ] = React.useState<string>('');

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage, state.edit]);

  return (
    <React.Fragment>
      <ScrollView horizontal={true} style={{ marginTop: 20 }}>
        <View style={{flexDirection: "column"}}>
          <View style={{flexDirection: "row"}}>
            <View style={{ width: 200, height: 56 }}>
              <PaperSelect
                label="Producto"
                value={productAdd.name ? productAdd.name : ''}
                onSelection={(value: any) => {
                  setProductAdd(productState.products[value.selectedList[0]._id-1]);
                }}
                arrayList={productState.products.map((c) => {
                  return { _id: c.id.toString(), value: c.name };
                })}
                selectedArrayList={[]}
                multiEnable={false}
              />
            </View>
            <TextInput
            label="Cantidad"
            value={cuantityAddtext}
            onChangeText={(text) => {
              setCuantityAddText(text);
            }}
            onBlur={() => {
              setCuantityAdd(parseInt(cuantityAddtext) || 0);
              setCuantityAddText((parseInt(cuantityAddtext) || 0).toString());
            }}
            keyboardType='numeric'
            ></TextInput>
            <Button
              icon="plus"
              mode="contained"
              onPress={() => {
                if (productAdd.id && cuantityAdd) {
                  dispatch({
                    type: SaleActionType.ADD_DETAIL,
                    payload: [{
                      productId: productAdd.id,
                      quantity: cuantityAdd,
                    } as SaleDetail, productAdd.price],
                  });
                  setProductAdd({} as Product);
                  setCuantityAdd(0);
                  setCuantityAddText('');
                }
              }}
              children=""
              labelStyle={{ fontSize: 28 }}
              style={{ alignItems: 'center', justifyContent: 'center' }}
            />
          </View>
          <DataTable style={{ width: 1040 }}>
            <DataTable.Header>
              <DataTable.Title>ID</DataTable.Title>
              <DataTable.Title>Nombre</DataTable.Title>
              <DataTable.Title>Precio</DataTable.Title>
              <DataTable.Title>Subtotal</DataTable.Title>
            </DataTable.Header>

            {state.edit.details.map((det, i) => (
                <DataTable.Row key={i}>
                  <DataTable.Cell>{productState.products[det.productId-1].name}</DataTable.Cell>
                  <DataTable.Cell>{det.quantity}</DataTable.Cell>
                  <DataTable.Cell>{productState.products[det.productId-1].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</DataTable.Cell>
                  <DataTable.Cell>{(productState.products[det.productId-1].price*det.quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</DataTable.Cell>
                </DataTable.Row>
              ))}
          </DataTable>
        </View>
      </ScrollView>
    </React.Fragment>
  );
};

export default SaleDetailTable;