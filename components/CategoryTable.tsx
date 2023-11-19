import * as React from 'react';
import { Button, DataTable, TextInput } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from './Themed';
import { CategoryActionType, useCategoryContext } from '../provider/CategoryContext';
import { router } from 'expo-router';
import { SnackBarActionType, useSnackBarContext } from '../provider/SnackBarContext';

const CategoryTable = () => {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10, 15, 20]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1]
  );

  const { state, dispatch } = useCategoryContext();
  const { state: categoryState } = useCategoryContext(); 
  const [productSearch, setCategorySearch] = React.useState('');

  const { dispatch: snackBarDispatch } = useSnackBarContext();

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, state.categories.length);
  const filteredCategorys = state.categories.filter(res => res.name.includes(productSearch))

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage, filteredCategorys]);

  return (
    <React.Fragment>
      <TextInput label={'Categoria'} value={productSearch} onChangeText={setCategorySearch} />
      <ScrollView horizontal={true} style={{ marginTop: 20 }}>
        <DataTable style={{ width: 1040 }}>
          <DataTable.Header>
            <DataTable.Title>ID</DataTable.Title>
            <DataTable.Title>Nombre</DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>Acciones</DataTable.Title>
          </DataTable.Header>

          {filteredCategorys.slice(from, to).map((prod) => (
              <DataTable.Row key={prod.id}>
                <DataTable.Cell>{prod.id}</DataTable.Cell>
                <DataTable.Cell>{prod.name}</DataTable.Cell>
                <DataTable.Cell style={{justifyContent: 'center'}}>
                  <View style={{ flexDirection: 'row' }}>
                    <Button onPress={() => {
                      dispatch({ type: CategoryActionType.CANCEL, payload: prod.id });
                      let payload = { visible: true, text: "Categoria eliminada correctamente" };
                      snackBarDispatch({ type: SnackBarActionType.TOGGLE, payload });
                    }}><FontAwesome name="remove" />
                    </Button>
                    <Button onPress={() => {
                      dispatch({ type: CategoryActionType.EDIT, payload: prod });
                      router.push('/product/edit');
                    }}><FontAwesome name="edit" />
                    </Button>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(filteredCategorys.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${filteredCategorys.length ? from + 1 : 0}-${to} of ${filteredCategorys.length}`}
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

export default CategoryTable;