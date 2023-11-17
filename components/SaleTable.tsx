import * as React from 'react';
import { Button, DataTable, TextInput } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from './Themed';
import { SaleActionType, useSaleContext } from '../provider/SaleContext';
import { router } from 'expo-router';
import { SnackBarActionType, useSnackBarContext } from '../provider/SnackBarContext';
import { useCategoryContext } from '../provider/CategoryContext';
import { Sale } from '../models/Sale';
import { Client } from '../models/Client';
import { Product } from '../models/Product';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { useClientContext } from '../provider/ClientContext';
import { useProductContext } from '../provider/ProductContext';

const SaleTable = () => {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10, 15, 20]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[1]
  );

  const { state, dispatch } = useSaleContext();
  const [saleSearch, setSaleSearch] = React.useState('');
  const { state: clientState } = useClientContext();
  const { state: productState } = useProductContext();

  const { dispatch: snackBarDispatch } = useSnackBarContext();

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, state.sales.length);
  const filteredSales = state.sales.filter(res => saleSearch || res.billId.toString().includes(saleSearch))

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage, filteredSales]);

  let createPDF = async (sale: Sale, client: Client, products: Product[]) => {
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
        return;
    }
  
    const html = `
    <html>
      <header></header>
      <title></title>
      <style>
        table, th, td {
         border:1px solid black;
        }
      </style>
      <body>
        <h3>Fecha: ${sale.date.toLocaleDateString()}</h3>
        <h3>Factura: ${sale.billId}</h3>
        <h3>Razón social: ${client.name} ${client.lastName}</h3>
        <h3>RUC: ${client.ruc}</h3>
        <h3>Detalles:</h3>
        <table style="width:8.35in">
          <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
          </thead>
          <tbody>
          ${sale.details.map((det) => {
            let prod = products[det.productId-1];
            return `
            <tr>
            <td>${prod.name}</td>
            <td>${(prod.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
            <td>${det.quantity}</td>
            <td>${(det.quantity*prod.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</td>
            </tr>`
          })}
          </tbody>
        </table>
        <h3>Total: ${sale.total.toLocaleString('es')}</h3>
      </body>
    </html>`
    console.log(html)
    const print = await Print.printToFileAsync({
       html: html,
       base64: true
    });
  
    try {
      await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, `Factura_${sale.billId}.pdf`, 'application/pdf')
          .then(async(uri) => {
            if(print.base64 !== undefined) {
              await FileSystem.writeAsStringAsync(uri, print.base64, { encoding: FileSystem.EncodingType.Base64 });
            } else {
              console.log("Error base64 did not work")
            }
          })
          .catch((e) => {
              console.log(e);
          });
    } catch (e) {
        console.log("Error")
    }
  }

  return (
    <React.Fragment>
      <TextInput label={'Venta'} value={saleSearch} onChangeText={setSaleSearch} />
      <ScrollView horizontal={true} style={{ marginTop: 20 }}>
        <DataTable style={{ width: 1040 }}>
          <DataTable.Header>
            <DataTable.Title>Número factura</DataTable.Title>
            <DataTable.Title>Fecha</DataTable.Title>
            <DataTable.Title>Total</DataTable.Title>
            <DataTable.Title style={{justifyContent: 'center'}}>Acciones</DataTable.Title>
          </DataTable.Header>

          {filteredSales.slice(from, to).map((sale) => (
              <DataTable.Row key={sale.id}>
                <DataTable.Cell>{sale.billId}</DataTable.Cell>
                <DataTable.Cell>{sale.date.toLocaleDateString()}</DataTable.Cell>
                <DataTable.Cell>{sale.total.toLocaleString('es')}</DataTable.Cell>
                <DataTable.Cell style={{justifyContent: 'center'}}>
                  <View style={{ flexDirection: 'row' }}>
                    <Button onPress={() => {
                      dispatch({ type: SaleActionType.CANCEL, payload: sale.id });
                      let payload = { visible: true, text: "Venta eliminada correctamente" };
                      snackBarDispatch({ type: SnackBarActionType.TOGGLE, payload });
                    }}><FontAwesome name="remove" />
                    </Button>
                    <Button onPress={() => {
                      createPDF(sale, clientState.clients.find(c => c.ruc == sale.clientId) as Client, productState.products);
                    }}><FontAwesome name="file" />
                    </Button>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(filteredSales.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${filteredSales.length ? from + 1 : 0}-${to} of ${filteredSales.length}`}
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

export default SaleTable;