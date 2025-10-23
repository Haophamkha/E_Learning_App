import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, RootTabParamList } from "../types/type";

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen = ({ navigation }: { navigation: HomeNavProp }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Trang chủ</Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("Course_Listing")}
          style={styles.btn}
        >
          Đến Course Listing
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("Course_Detail")}
          style={styles.btn}
        >
          Đến Course Detail
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("Learning")}
          style={styles.btn}
        >
          Đến Learning
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("TeacherProfile")}
          style={styles.btn}
        >
          Đến Teacher Profile
        </Button>
      </View>
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  btn: {
    marginVertical: 8,
  },
});
