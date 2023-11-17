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

type ClientAdd = {
  ruc: string;
  name: string;
  lastName: string;
  email: string;
}

const ClientAdd = () => {
  const [clientAdd, setClientAdd] = React.useState<ClientAdd>({} as ClientAdd);
  const clientContext = useClientContext();

  const { dispatch: snackBarDispatch } = useSnackBarContext();

  const addClient = () => {
    const { ruc, name, lastName, email } = clientAdd;
    const id = clientContext.state.clients.length + 1;
    const client: Client = {
      ruc,
      name,
      lastName,
      email,
    };
    clientContext.dispatch({
      type: ClientActionType.ADD,
      payload: client,
    });
    router.push('/client');

    let payload = { visible: true, text: "Clienta agregado correctamente" };
    snackBarDispatch({ type: SnackBarActionType.TOGGLE, payload });
  }
  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            label="RUC"
            value={clientAdd.ruc}
            onChangeText={(text) =>
              setClientAdd({ ...clientAdd, ruc: text })
            }
          />
          <TextInput
            label="Nombre"
            value={clientAdd.name}
            onChangeText={(text) =>
              setClientAdd({ ...clientAdd, name: text })
            }
          />
          <TextInput
            label="Apellido"
            value={clientAdd.lastName}
            onChangeText={(text) =>
              setClientAdd({ ...clientAdd, lastName: text })
            }
          />
          <TextInput
            label="Email"
            value={clientAdd.email}
            onChangeText={(text) =>
              setClientAdd({ ...clientAdd, email: text })
            }
          />
        </View>
      </ScrollView>
      <Button
        icon="plus"
        mode="contained"
        onPress={addClient}
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