import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Pressable, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";
import { ClientActionType, useClientContext } from "../../provider/ClientContext";
import { SaleActionType,useSaleContext } from "../../provider/SaleContext";
import { CategoryActionType, useCategoryContext } from "../../provider/CategoryContext";
import { ProductActionType, useProductContext } from "../../provider/ProductContext";
import storage, { loadMockData } from "../../provider/Storage";
import React, { useEffect } from "react";
import { Snackbar } from "react-native-paper";
import { SnackBarActionType, useSnackBarContext } from "../../provider/SnackBarContext";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { state, dispatch } = useClientContext();
  const {state: saleState, dispatch: saleDispatch} = useSaleContext();
  const {state: categoryState, dispatch: categoryDispatch} = useCategoryContext();
  const {state: productState, dispatch: productDispatch} = useProductContext();

  const { state: snackBarState, dispatch: snackBarDispatch } = useSnackBarContext();

  useEffect( () => {
      storage
        .getObject("clients")
        .then((result) => {
          const clients = JSON.parse(result || "[]");
          for (let client of clients) {
            client.date = new Date(client.date);
            dispatch({ type: ClientActionType.ADD_INITIAL, payload: client });
          }
          storage.loaded = true;
        })
        .catch((err) => {
          console.log(err.message);
        });

      storage.getObject("sales")
      .then((result) => {
        const sales = JSON.parse(result || "[]");
        for (let sale of sales) {
          saleDispatch({ type: SaleActionType.ADD_INITIAL, payload: sale });
        }
        storage.loaded = true;
      })
      .catch((err) => {
        console.log(err.message);
      });

      storage.getObject("categories")
      .then((result) => {
        const categories = JSON.parse(result || "[]");
        for (let category of categories) {
          categoryDispatch({ type: CategoryActionType.ADD_INITIAL, payload: category });
        }
        storage.loaded = true;
      })
      .catch((err) => {
        console.log(err.message);
      });

      storage.getObject("products")
      .then((result) => {
        const products = JSON.parse(result || "[]");
        for (let product of products) {
          productDispatch({ type: ProductActionType.ADD_INITIAL, payload: product });
        }
        storage.loaded = true;
      })
      .catch((err) => {
        console.log(err.message);
      });

    }, []);

  return (
    <React.Fragment>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            title: "Inicio",
            drawerIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Drawer.Screen
          name="sale"
          options={{
            title: "Ventas",
          }}
        />
        <Drawer.Screen
          name="product"
          options={{
            title: "Productos",
          }}
        />
        <Drawer.Screen
          name="client"
          options={{
            title: "Clientes",
          }}
        />
        <Drawer.Screen
          name="category"
          options={{
            title: "Categorias",
          }}
        />
      </Drawer>
        <Snackbar
            visible={snackBarState.visible}
            onDismiss={() =>
              snackBarDispatch({
                type: SnackBarActionType.DISABLE,
              })
            }
            action={{
              label: "Cerrar",
            }}
            duration={3000}>
            {snackBarState.text}
        </Snackbar>
    </React.Fragment>
  );
}
