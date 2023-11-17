import * as React from 'react';
import { Button, DataTable, TextInput } from 'react-native-paper';
import { Client } from '../models/Client';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from './Themed';
import { ClientActionType, useClientContext } from '../provider/ClientContext';
import { SelectList } from 'react-native-dropdown-select-list'
import { router } from 'expo-router';
import { SnackBarActionType, useSnackBarContext } from '../provider/SnackBarContext';

const ClientTable = () => {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10, 15, 20]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1]
  );

  const { state, dispatch } = useClientContext();
  const [clientSearch, setClientSearch] = React.useState('');
  const [selected, setSelected] = React.useState("");

  const { dispatch: snackBarDispatch } = useSnackBarContext();

  const optionsDoctor = [
    { key: 'ALL', value: 'Doctor o Paciente' },
    { key: 'true', value: 'Doctor' },
    { key: 'false', value: 'Paciente' },
  ]

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, state.clients.length);
  const filteredClients = state.clients.filter(res => (res.name + ' ' + res.lastName).includes(clientSearch) 
                          && res.ruc != '')

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage, filteredClients]);

  return (
    <React.Fragment>
      <TextInput label={'Nombre y Apellido'} value={clientSearch} onChangeText={setClientSearch} />
      <ScrollView horizontal={true} style={{ marginTop: 20 }}>
        <DataTable style={{ width: 1040 }}>
          <DataTable.Header>
            <DataTable.Title>RUC</DataTable.Title>
            <DataTable.Title>Nombre</DataTable.Title>
            <DataTable.Title>Apellido</DataTable.Title>
            <DataTable.Title>Email</DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>Acciones</DataTable.Title>
          </DataTable.Header>

          {filteredClients.slice(from, to).map((res) => (
              <DataTable.Row key={res.ruc}>
                <DataTable.Cell>{res.ruc}</DataTable.Cell>
                <DataTable.Cell>{res.name}</DataTable.Cell>
                <DataTable.Cell>{res.lastName}</DataTable.Cell>
                <DataTable.Cell>{res.email}</DataTable.Cell>
                <DataTable.Cell style={{justifyContent: 'center'}}>
                  <View style={{ flexDirection: 'row' }}>
                    <Button onPress={() => {
                      dispatch({ type: ClientActionType.CANCEL, payload: res.ruc });
                      let payload = { visible: true, text: "Clienta eliminada correctamente" };
                      snackBarDispatch({ type: SnackBarActionType.TOGGLE, payload });
                    }}><FontAwesome name="remove" />
                    </Button>
                    <Button onPress={() => {
                      dispatch({ type: ClientActionType.EDIT, payload: res });
                      router.push('/client/edit');
                    }}><FontAwesome name="edit" />
                    </Button>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(filteredClients.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${filteredClients.length ? from + 1 : 0}-${to} of ${filteredClients.length}`}
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

export default ClientTable;