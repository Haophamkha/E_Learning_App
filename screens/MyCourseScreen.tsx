import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootTabParamList } from "../types/type";

type Props = NativeStackScreenProps<RootTabParamList, "MyCourse">;

export const MyCourseScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView>
      <Text>MyCourse</Text>
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
