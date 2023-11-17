import * as React from "react";
import { Button, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Text, View } from "../../../components/Themed";

import { Sale } from "../../../models/Sale";
import { SaleActionType, useSaleContext } from "../../../provider/SaleContext";
import { router } from 'expo-router';
import { SnackBarActionType, useSnackBarContext } from "../../../provider/SnackBarContext";
import { ScrollView } from "react-native-gesture-handler";
import { useCategoryContext } from "../../../provider/CategoryContext";
import { DatePickerInput } from "react-native-paper-dates";
import SaleDetailTable from "../../../components/SaleDetailTable";
import { useClientContext } from "../../../provider/ClientContext";
import { PaperSelect } from "react-native-paper-select";

const SaleAdd = () => {
  const saleContext = useSaleContext();
  const { state: categoryState } = useCategoryContext();

  const { dispatch: snackBarDispatch } = useSnackBarContext();
  const { state: clientState } = useClientContext();

  const [clientName, setClientName] = React.useState('');

  const addSale = () => {
    saleContext.state.edit.id = saleContext.state.sales.length + 1;
    saleContext.dispatch({
      type: SaleActionType.ADD,
    });
    router.push('/sale');

    let payload = { visible: true, text: "Venta agregada correctamente" };
    snackBarDispatch({ type: SnackBarActionType.TOGGLE, payload });
  }
  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            label="Número de factura"
            value={saleContext.state.edit.billId ? saleContext.state.edit.billId.toString() : ''}
            onChangeText={(text) =>
              saleContext.dispatch({type: SaleActionType.EDIT, payload: { ...saleContext.state.edit, billId: parseInt(text) } })
            }
          />
          <DatePickerInput
            label="Fecha"
            onChange={(date) =>
              saleContext.dispatch({type: SaleActionType.EDIT, payload: { ...saleContext.state.edit, date: date as Date } })
            }
            inputMode="start"
            locale="es"
            value={saleContext.state.edit.date}
            presentationStyle="pageSheet"
          />
          <View style={{ width: '100%', height: 56 }}>
            <PaperSelect
              label="Cliente"
              value={clientName}
              onSelection={(value: any) => {
                setClientName(value.selectedList[0].value);
                saleContext.dispatch({
                  type: SaleActionType.EDIT,
                  payload: {
                  ...saleContext.state.edit,
                  clientId: value.selectedList[0]._id,
                }});
              }}
              arrayList={clientState.clients.map((c) => {
                return { _id: c.ruc, value: `${c.name} ${c.lastName}` };
              })}
              selectedArrayList={[]}
              multiEnable={false}
            />
          </View>
          <Text>Detalles Factura</Text>
          <View>
            <SaleDetailTable/>
          </View>
          <Text>Total: {saleContext.state.edit.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</Text>
        </View>
      </ScrollView>
      <Button
        icon="plus"
        mode="contained"
        onPress={addSale}
        children="Guardar"
      />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    width: "100%",
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "black",
    marginTop: 10,
  },
});

export default SaleAdd;