import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Text, View } from "../../../components/Themed";
import { Link } from "expo-router";
import React from "react";
import ProductTable from "../../../components/ProductTable";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Productos</Text>
      <View>
        <Link href="/product/add" asChild>
          <Button icon="plus">Agregar</Button>
        </Link>
        <ProductTable />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "8%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
