import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Text, View } from "../../../components/Themed";
import { Link } from "expo-router";
import React from "react";
import ProductTable from "../../../components/ProductTable";
import SaleTable from "../../../components/SaleTable";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ventas</Text>
      <View>
        <Link href="/sale/add" asChild>
          <Button icon="plus">Agregar</Button>
        </Link>
        <SaleTable />
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
