import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/type";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InspiresCourse } from "../components/InspiresCourse";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../auth/store"; 
import { supabase } from "../auth/supabaseClient";
import { updateUser } from "../auth/authSlice";
import { addToPurchaseCourse, fetchAppData } from "../auth/dataSlice"; 

type Props = NativeStackScreenProps<RootStackParamList, "Cart">;

export const CartScreen = ({ navigation, route }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const { courses = [] } = route.params || {};

  const cartIds = (currentUser?.cart || []) as number[];
  const cartCourses = courses.filter((course: any) =>
    cartIds.includes(course.id)
  );

  // Xóa khỏi giỏ hàng
  const handleRemoveFromCart = async (courseId: number) => {
    if (!currentUser) {
      Alert.alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    try {
      const newCart = (currentUser.cart || []).filter((id) => id !== courseId);
      const { data, error } = await supabase
        .from("users")
        .update({ cart: newCart })
        .eq("id", currentUser.id)
        .select()
        .single();

      if (error) throw error;
      dispatch(updateUser(data));
      Alert.alert("🗑️ Đã xóa khỏi giỏ hàng!");
    } catch (err) {
      Alert.alert("Lỗi khi xóa khỏi giỏ hàng.");
    }
  };

  // Mua khóa học
  const handleBuyCourse = async (course: any) => {
    if (!currentUser) {
      Alert.alert("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    try {
      const data = await addToPurchaseCourse(currentUser, course);

      if (data) {
        dispatch(updateUser(data));

        // Gọi lại api để lấy user mới nhất
        const { data: freshUser, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (userError) throw userError;

        // Cập nhật lại Redux bằng user thực tế từ DB
        dispatch(updateUser(freshUser));

        // Làm mới toàn bộ dữ liệu
        await dispatch(fetchAppData());

        Alert.alert("🎉 Thành công", `Bạn đã mua khóa học: ${course.name}`);
      }
    } catch (err) {
      Alert.alert("Lỗi khi mua khóa học.");
    }
  };

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
                        courses,
                      })
                    }
                    saved={false}
                  />
                </View>

                <View style={styles.btnGroup}>
                  <TouchableOpacity
                    style={styles.buyBtn}
                    onPress={() => handleBuyCourse(course)}
                  >
                    <Text style={styles.buyText}>Mua</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemoveFromCart(course.id)}
                  >
                    <Text style={styles.removeText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
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
  btnGroup: {
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 12,
    gap: 8,
  },
  buyBtn: {
    backgroundColor: "#00BCD4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buyText: { color: "#fff", fontWeight: "bold", fontSize: 15 },

  removeBtn: {
    backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  removeText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
