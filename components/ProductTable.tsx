import * as React from 'react';
import { Button, DataTable, TextInput } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from './Themed';
import { ProductActionType, useProductContext } from '../provider/ProductContext';
import { router } from 'expo-router';
import { SnackBarActionType, useSnackBarContext } from '../provider/SnackBarContext';
import { useCategoryContext } from '../provider/CategoryContext';

const ProductTable = () => {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10, 15, 20]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1]
  );

  const { state, dispatch } = useProductContext();
  const { state: categoryState } = useCategoryContext(); 
  const [productSearch, setProductSearch] = React.useState('');

  const { dispatch: snackBarDispatch } = useSnackBarContext();

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, state.products.length);
  const filteredProducts = state.products.filter(res => res.name.includes(productSearch))

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage, filteredProducts]);

  return (
    <React.Fragment>
      <TextInput label={'Producto'} value={productSearch} onChangeText={setProductSearch} />
      <ScrollView horizontal={true} style={{ marginTop: 20 }}>
        <DataTable style={{ width: 1040 }}>
          <DataTable.Header>
            <DataTable.Title>ID</DataTable.Title>
            <DataTable.Title>Código</DataTable.Title>
            <DataTable.Title>Nombre</DataTable.Title>
            <DataTable.Title>Categoría</DataTable.Title>
            <DataTable.Title>Precio</DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>Acciones</DataTable.Title>
          </DataTable.Header>

          {filteredProducts.slice(from, to).map((prod) => (
              <DataTable.Row key={prod.id}>
                <DataTable.Cell>{prod.id}</DataTable.Cell>
                <DataTable.Cell>{prod.code}</DataTable.Cell>
                <DataTable.Cell>{prod.name}</DataTable.Cell>
                <DataTable.Cell>{categoryState.categories[prod.categoryId-1].name}</DataTable.Cell>
                <DataTable.Cell>{prod.price.toLocaleString('es')}</DataTable.Cell>
                <DataTable.Cell style={{justifyContent: 'center'}}>
                  <View style={{ flexDirection: 'row' }}>
                    <Button onPress={() => {
                      dispatch({ type: ProductActionType.CANCEL, payload: prod.id });
                      let payload = { visible: true, text: "Producta eliminada correctamente" };
                      snackBarDispatch({ type: SnackBarActionType.TOGGLE, payload });
                    }}><FontAwesome name="remove" />
                    </Button>
                    <Button onPress={() => {
                      dispatch({ type: ProductActionType.EDIT, payload: prod });
                      router.push('/product/edit');
                    }}><FontAwesome name="edit" />
                    </Button>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(filteredProducts.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${filteredProducts.length ? from + 1 : 0}-${to} of ${filteredProducts.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
          />
        </DataTable>
      </ScrollView>
    </React.Fragment>
  );
};

export default ProductTable;