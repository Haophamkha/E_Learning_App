import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/type";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

export const Cart = ({ navigation }: Props) => {
  return (
    <SafeAreaView>
      <Text>Cart</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    color: "black",
  },
});
