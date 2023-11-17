import * as React from "react";
import { Button, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { View } from "../../../components/Themed";

import { Category } from "../../../models/Category";
import { CategoryActionType, useCategoryContext } from "../../../provider/CategoryContext";
import { router } from 'expo-router';
import { SnackBarActionType, useSnackBarContext } from "../../../provider/SnackBarContext";
import { ScrollView } from "react-native-gesture-handler";
import { PaperSelect } from "react-native-paper-select";

const CategoryAdd = () => {
  const [categoryAdd, setCategoryAdd] = React.useState<Category>({} as Category);
  const categoryContext = useCategoryContext();
  const { state: categoryState } = useCategoryContext();

  const { dispatch: snackBarDispatch } = useSnackBarContext();

  const addCategory = () => {
    categoryAdd.id = categoryContext.state.categories.length + 1;
    categoryContext.dispatch({
      type: CategoryActionType.ADD,
      payload: categoryAdd,
    });
    router.push('/category');

    let payload = { visible: true, text: "Categorya agregado correctamente" };
    snackBarDispatch({ type: SnackBarActionType.TOGGLE, payload });
  }
  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            label="Nombre"
            value={categoryAdd.name}
            onChangeText={(text) =>
              setCategoryAdd({ ...categoryAdd, name: text })
            }
          />
        </View>
      </ScrollView>
      <Button
        icon="plus"
        mode="contained"
        onPress={addCategory}
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

export default CategoryAdd;