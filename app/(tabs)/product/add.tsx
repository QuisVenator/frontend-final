import * as React from "react";
import { Button, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { View } from "../../../components/Themed";

import { Product } from "../../../models/Product";
import { ProductActionType, useProductContext } from "../../../provider/ProductContext";
import { router } from 'expo-router';
import { SnackBarActionType, useSnackBarContext } from "../../../provider/SnackBarContext";
import { ScrollView } from "react-native-gesture-handler";
import { PaperSelect } from "react-native-paper-select";
import { useCategoryContext } from "../../../provider/CategoryContext";

const ProductAdd = () => {
  const [productAdd, setProductAdd] = React.useState<Product>({} as Product);
  const productContext = useProductContext();
  const { state: categoryState } = useCategoryContext();

  const { dispatch: snackBarDispatch } = useSnackBarContext();

  const addProduct = () => {
    productAdd.id = productContext.state.products.length + 1;
    productContext.dispatch({
      type: ProductActionType.ADD,
      payload: productAdd,
    });
    router.push('/product');

    let payload = { visible: true, text: "Producta agregado correctamente" };
    snackBarDispatch({ type: SnackBarActionType.TOGGLE, payload });
  }
  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            label="Código"
            value={productAdd.code}
            onChangeText={(text) =>
              setProductAdd({ ...productAdd, code: text })
            }
          />
          <TextInput
            label="Nombre"
            value={productAdd.name}
            onChangeText={(text) =>
              setProductAdd({ ...productAdd, name: text })
            }
          />
          <View style={{ width: '100%', height: 56 }}>
            <PaperSelect
              label="Seleccione la categoría"
              value={productAdd.categoryId ? categoryState.categories[productAdd.categoryId-1].name : ''}
              onSelection={(value: any) => {
                setProductAdd({
                  ...productAdd,
                  categoryId: value.selectedList[0]._id,
                });
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
            value={productAdd.price.toString()}
            onChangeText={(text) =>
              setProductAdd({ ...productAdd, price: parseInt(text) })
            }
          />
        </View>
      </ScrollView>
      <Button
        icon="plus"
        mode="contained"
        onPress={addProduct}
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