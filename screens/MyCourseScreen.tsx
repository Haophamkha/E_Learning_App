import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useUserCourseStatus } from "../hooks/useUserCourseStatus";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";

import { RootStackParamList, Course } from "../types/type";
import { MyCourseCard } from "../components/MyCourseCard";
import { RootState, AppDispatch } from "../auth/store";
import { fetchAppData } from "../auth/dataSlice";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const MyCourseScreen = () => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch<AppDispatch>();

  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { courses, teachers, users, loading, error } = useSelector(
    (state: RootState) => state.data
  );

  const [filter, setFilter] = useState<"all" | "ongoing" | "completed">("all");

  useEffect(() => {
    dispatch(fetchAppData());
  }, [dispatch]);

const { ongoingCourses, completedCourses } = useUserCourseStatus(
  currentUser,
  courses
);

const filteredCourses = useMemo(() => {
  if (filter === "ongoing") return ongoingCourses;
  if (filter === "completed") return completedCourses;
  return [...ongoingCourses, ...completedCourses]; 
}, [filter, ongoingCourses, completedCourses]);


  if (!currentUser || !currentUser.id) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
            }}
            style={{ width: 120, height: 120, marginBottom: 20 }}
          />
          <Text style={styles.loginText}>
            Bạn cần đăng nhập để xem các khóa học của mình.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() =>
              (navigation.navigate as any)("MainTabs", {
                screen: "UserProfile",
              })
            }
          >
            <Text style={styles.loginBtnText}>Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00BCD4" />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>
              Course that boost your career!
            </Text>
            <TouchableOpacity style={styles.joinBtn} activeOpacity={0.7}>
              <Text style={styles.joinText}>Check Now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("../assets/teacher.png")}
            style={styles.bannerImg}
          />
        </View>

        <Text style={styles.title}>My Courses</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {["all", "ongoing", "completed"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab as any)}
              style={styles.tabItem}
            >
              <Text
                style={[styles.tabText, filter === tab && styles.tabTextActive]}
              >
                {tab.toUpperCase()}
              </Text>
              {filter === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Courses */}
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <MyCourseCard
              key={course.id}
              course={course}
              onPress={() => navigation.navigate("Learning", { course })}
            />
          ))
        ) : (
          <Text style={styles.noCourse}>Không có khóa học nào.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );

};


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 16, paddingBottom: 40 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  loginText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  loginBtn: {
    backgroundColor: "#00BCD4",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 8,
  },
  tabItem: { alignItems: "center", paddingBottom: 4 },
  tabText: { fontSize: 18, color: "#777", fontWeight: "600" },
  tabTextActive: { color: "#00BCD4" },
  tabUnderline: {
    marginTop: 6,
    width: 80,
    height: 3,
    backgroundColor: "#00BCD4",
    borderRadius: 2,
  },
  noCourse: { textAlign: "center", color: "gray", marginTop: 20 },
  banner: {
    flexDirection: "row",
    backgroundColor: "#00BCD4",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  bannerText: { flex: 5, marginRight: 10 },
  bannerImg: {
    flex: 1,
    maxWidth: 130,
    height: 120,
    resizeMode: "contain",
    borderRadius: 12,
    marginRight: 20,
  },
  

  bannerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  joinBtn: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  joinText: { color: "#00BCD4", fontWeight: "bold", fontSize: 16 },
});

export default MyCourseScreen;
