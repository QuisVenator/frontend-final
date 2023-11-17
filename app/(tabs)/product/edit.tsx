import * as React from "react";
import { Button, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { View } from "../../../components/Themed";

import { ProductActionType, useProductContext } from "../../../provider/ProductContext";
import { router } from 'expo-router';
import { SnackBarActionType, useSnackBarContext } from "../../../provider/SnackBarContext";
import { ScrollView } from "react-native-gesture-handler";
import { PaperSelect } from "react-native-paper-select";
import { useCategoryContext } from "../../../provider/CategoryContext";

const ProductAdd = () => {
  const productContext = useProductContext();

  const { dispatch: snackBarDispatch } = useSnackBarContext();
  const { state: categoryState } = useCategoryContext();

  const editProduct = () => {
    productContext.dispatch({
      type: ProductActionType.UPDATE,
      payload: productContext.state.edit,
    });
    router.push('/product');

    let payload = { visible: true, text: "Producta editada correctamente" };
    snackBarDispatch({ type: SnackBarActionType.TOGGLE, payload });
  }
  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            label="Código"
            value={productContext.state.edit.code}
            onChangeText={(text) =>
              productContext.dispatch({ type: ProductActionType.EDIT, payload: { ...productContext.state.edit, code: text }})
            }
          />
          <TextInput
            label="Nombre"
            value={productContext.state.edit.name}
            onChangeText={(text) =>
              productContext.dispatch({ type: ProductActionType.EDIT, payload: { ...productContext.state.edit, name: text }})
            }
          />
          <View style={{ width: '100%', height: 56 }}>
            <PaperSelect
              label="Seleccione la categoría"
              value={productContext.state.edit.categoryId ? categoryState.categories[productContext.state.edit.categoryId-1].name : ''}
              onSelection={(value: any) => {
                productContext.dispatch({ type: ProductActionType.EDIT, payload: {
                  ...productContext.state.edit,
                  categoryId: value.selectedList[0]._id,
                }});
              }}
              arrayList={categoryState.categories.map((c) => {
                return { _id: c.id.toString(), value: c.name };
              })}
              selectedArrayList={[]}
              multiEnable={false}
            />
          </View>
          <TextInput
            label="Precio"
            value={productContext.state.edit.price.toString()}
            onChangeText={(text) =>
              productContext.dispatch({ type: ProductActionType.EDIT, payload: { ...productContext.state.edit, price: parseInt(text) }})
            }
          />
        </View>
      </ScrollView>
      <Button
        icon="pencil"
        mode="contained"
        onPress={editProduct}
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

export default ProductAdd;