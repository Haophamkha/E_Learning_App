import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/type";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InspiresCourse } from "../components/InspiresCourse";

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

export const CartScreen = ({ navigation, route }: Props) => {
  const { courses = [], user = { cart: [] } } = route.params || {};
  const cartIds = (user.cart || []) as number[];
  const cartCourses = courses.filter((course: any) =>
    cartIds.includes(course.id)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Giỏ hàng của bạn</Text>

      {cartCourses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>Chưa có khóa học nào trong giỏ hàng.</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {cartCourses.map((course) => (
            <View key={course.id} style={styles.cardContainer}>
              <View style={styles.cardContent}>
                <View style={{ flex: 1 }}>
                  <InspiresCourse
                    course={course}
                    teachers={[]}
                    onPress={() =>
                      navigation.navigate("Course_Detail", {
                        course,
                        teachers: [],
                        users: [],
                        courses: [],
                      })
                    }
                  />
                </View>

                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={() => alert(`Đã mua khóa học: ${course.name}`)}
                >
                  <Text style={styles.buyText}>Mua</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 16 },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buyBtn: {
    backgroundColor: "#00BCD4",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 12,
  },
  buyText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
