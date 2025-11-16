import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompositeNavigationProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList, RootTabParamList } from "../types/type";

import { SectionBlock } from "../components/SectionBlock";
import { CourseCard } from "../components/CourseCard";
import { TeacherCard } from "../components/TeacherCard";
import { InspiresCourse } from "../components/InspiresCourse";
import { SectionBlockInspires } from "../components/SectionBlockInspires";
import { NotificationModal } from "../components/NotificationModal";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../auth/store";
import { fetchAppData } from "../auth/dataSlice";
import { logout } from "../auth/authSlice";

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen = ({ navigation }: { navigation: HomeNavProp }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { users, courses, teachers, loading, error } = useSelector(
    (state: RootState) => state.data
  );

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, message: "Bạn đã mua khóa học A.", time: "2 giờ trước" },
    {
      id: 2,
      message: "Giảng viên B đã đăng khóa học mới!",
      time: "5 giờ trước",
    },
  ];

  useEffect(() => {
    dispatch(fetchAppData());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <NotificationModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00BCD4" />
          <Text>Đang tải dữ liệu...</Text>
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {currentUser ? `Hello, ${currentUser.name}!` : "Hello!"}
              </Text>
              <Text style={styles.subText}>
                What do you want to learn today?
              </Text>
            </View>

            <View style={styles.iconContainer}>
              {/* Cart */}
              <TouchableOpacity
                onPress={() => {
                  if (!currentUser) {
                    Alert.alert(
                      "Yêu cầu đăng nhập",
                      "Bạn cần đăng nhập để xem giỏ hàng của mình.",
                      [{ text: "OK" }]
                    );
                    return;
                  }

                  navigation.navigate("Cart", {
                    courses,
                    user: currentUser,
                  });
                }}
              >
                <Ionicons name="cart-outline" size={30} color="white" />
              </TouchableOpacity>

              {/* Notification */}
              <TouchableOpacity
                style={{ marginLeft: 16 }}
                onPress={() => setShowNotifications(true)}
              >
                <Ionicons
                  name="notifications-outline"
                  size={30}
                  color="white"
                />
              </TouchableOpacity>

              {/* Avatar + Dropdown */}
              <View style={{ marginLeft: 16 }}>
                <TouchableOpacity
                  onPress={() => setShowUserMenu(!showUserMenu)}
                >
                  <Image
                    source={
                      currentUser?.image
                        ? { uri: currentUser.image }
                        : require("../assets/avt.jpg")
                    }
                    style={styles.avatar}
                  />
                </TouchableOpacity>

                {showUserMenu && (
                  <View style={styles.dropdownMenu}>
                    {!currentUser ? (
                      <TouchableOpacity
                        onPress={() => {
                          setShowUserMenu(false);
                          navigation.navigate("UserProfile" as never);
                        }}
                      >
                        <Text style={styles.dropdownItem}>Login</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={handleLogout}>
                        <Text style={[styles.dropdownItem, { color: "red" }]}>
                          Logout
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>PROJECT MANAGEMENT</Text>
              <Text style={styles.bannerDiscount}>20% OFF</Text>
              <TouchableOpacity style={styles.joinBtn}>
                <Text style={styles.joinText}>JOIN NOW</Text>
              </TouchableOpacity>
            </View>

            <Image
              source={require("../assets/teacher.png")}
              style={styles.bannerImg}
            />
          </View>

          {/* Categories */}
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Categories</Text>

            <View style={styles.grid}>
              {[
                { name: "Business", icon: "business-center" },
                { name: "Design", icon: "palette" },
                { name: "Code", icon: "code" },
                { name: "Movie", icon: "movie" },
                { name: "Language", icon: "language" },
                { name: "Writing", icon: "article" },
              ].map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  style={styles.categoryItem}
                  onPress={() =>
                    navigation.navigate("Course_Listing", {
                      category: cat.name,
                    })
                  }
                >
                  <MaterialIcons
                    name={cat.icon as any}
                    size={26}
                    color="#00BCD4"
                  />
                  <Text style={styles.categoryText}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Popular Courses */}
          <SectionBlock title="Popular Courses">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                teachers={teachers}
                onPress={() =>
                  navigation.navigate("Course_Detail", {
                    course,
                    teachers,
                    courses,
                    users,
                  })
                }
              />
            ))}
          </SectionBlock>

          {/* Recommended for you */}
          <SectionBlock title="Recommended for you">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                teachers={teachers}
                onPress={() =>
                  navigation.navigate("Course_Detail", {
                    course,
                    teachers,
                    courses,
                    users,
                  })
                }
              />
            ))}
          </SectionBlock>

          {/* Inspires */}
          <SectionBlockInspires title="Courses that inspire">
            {courses.map((course) => (
              <InspiresCourse
                key={course.id}
                course={course}
                teachers={teachers}
                onPress={() =>
                  navigation.navigate("Course_Detail", {
                    course,
                    teachers,
                    courses,
                    users: [],
                  })
                }
              />
            ))}
          </SectionBlockInspires>

          {/* Teachers */}
          <SectionBlock title="Top Teachers">
            {teachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onPress={() =>
                  navigation.navigate("TeacherProfile", { teacher, courses })
                }
              />
            ))}
          </SectionBlock>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#00BCD4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  greeting: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  subText: { color: "#E0F7FA", fontSize: 14, marginTop: 4 },
  iconContainer: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#fff",
  },
  dropdownMenu: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingVertical: 6,
    width: 120,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333",
  },
  banner: {
    flexDirection: "row",
    backgroundColor: "#9C27B0",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerText: { flex: 1 },
  bannerTitle: { color: "#fff", fontSize: 14, fontWeight: "600" },
  bannerDiscount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  joinBtn: {
    backgroundColor: "#00BCD4",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  joinText: { color: "#fff", fontWeight: "bold" },
  bannerImg: { width: 200, height: 150, resizeMode: "contain" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red", textAlign: "center", marginTop: 20 },
  categorySection: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#111",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "48%",
    backgroundColor: "#F4F8FA",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 15,
    marginLeft: 10,
    color: "#111",
    fontWeight: "500",
  },
});

export default HomeScreen;
