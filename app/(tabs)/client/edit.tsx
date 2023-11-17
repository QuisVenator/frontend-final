import * as React from "react";
import { Button, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { View } from "../../../components/Themed";

import { Client } from "../../../models/Client";
import { ClientActionType, useClientContext } from "../../../provider/ClientContext";
import { router } from 'expo-router';
import { SnackBarActionType, useSnackBarContext } from "../../../provider/SnackBarContext";
import { ScrollView } from "react-native-gesture-handler";

const ClientAdd = () => {
  const clientContext = useClientContext();

  const { dispatch: snackBarDispatch } = useSnackBarContext();

  const editClient = () => {
    clientContext.dispatch({
      type: ClientActionType.UPDATE,
      payload: clientContext.state.edit,
    });
    router.push('/client');

    let payload = { visible: true, text: "Clienta editada correctamente" };
    snackBarDispatch({ type: SnackBarActionType.TOGGLE, payload });
  }
  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            label="RUC"
            value={clientContext.state.edit.ruc}
            onChangeText={(text) =>
              clientContext.dispatch({ type: ClientActionType.EDIT, payload: { ...clientContext.state.edit, ruc: text } })
            }
          />
          <TextInput
            label="Nombre"
            value={clientContext.state.edit.name}
            onChangeText={(text) =>
              clientContext.dispatch({ type: ClientActionType.EDIT, payload: { ...clientContext.state.edit, name: text } })
            }
          />
          <TextInput
            label="Apellido"
            value={clientContext.state.edit.lastName}
            onChangeText={(text) =>
              clientContext.dispatch({ type: ClientActionType.EDIT, payload: { ...clientContext.state.edit, lastName: text } })
            }
          />
          <TextInput
            label="Email"
            value={clientContext.state.edit.email}
            onChangeText={(text) =>
              clientContext.dispatch({ type: ClientActionType.EDIT, payload: { ...clientContext.state.edit, email: text } })
            }
          />
        </View>
      </ScrollView>
      <Button
        icon="pencil"
        mode="contained"
        onPress={editClient}
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

export default ClientAdd;