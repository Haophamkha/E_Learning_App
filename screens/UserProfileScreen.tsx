import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  CompositeNavigationProp,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  RootStackParamList,
  RootTabParamList,
  User,
  Course,
} from "../types/type";
import { getData } from "../hooks/useFetch";
import { InspiresCourse } from "../components/InspiresCourse";

// ✅ Navigation Type cho Tab + Stack
type UserProfileNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, "UserProfile">,
  NativeStackNavigationProp<RootStackParamList>
>;

export const UserProfileScreen = () => {
  const navigation = useNavigation<UserProfileNavProp>();

  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "SAVE" | "ONGOING" | "COMPLETED"
  >("SAVE");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, courseData, teacherData] = await Promise.all([
          getData("/users"),
          getData("/courses"),
          getData("/teachers"),
        ]);

        const currentUser = userData.find(
          (u: User) => String(u.id) === String(currentUserId)
        );

        setUser(currentUser || null);
        setCourses(courseData);
        setTeachers(teacherData);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );

  if (error || !user)
    return (
      <View style={styles.center}>
        <Text>{error ?? "User không tồn tại"}</Text>
      </View>
    );

  // ✅ Lọc danh sách theo tiến độ
  // Lấy danh sách khóa học đã lưu
  const savedCourses = courses.filter((course) =>
    user.savedCourseList.includes(Number(course.id))
  );

  // Lấy danh sách khóa học đang học
  const ongoingCourses = Object.keys(user.purchaseCourse || {})
    .map((id) => Number(id))
    .map((courseId) => courses.find((c) => c.id === courseId))
    .filter((c): c is Course => c !== undefined);

  const tabLabels = {
    SAVE: "Save",
    ONGOING: "On Going",
    COMPLETED: "Completed",
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerBackground}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60",
          }}
          style={styles.headerImage}
          blurRadius={8}
        />
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: user.image }} style={styles.avatar} />
      </View>

      {/* User Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.jobText}>{user.job}</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        {(["SAVE", "ONGOING", "COMPLETED"] as const).map((tab) => (
          <View key={tab} style={styles.statItem}>
            <Text style={styles.statNumber}>
              {tab === "SAVE"
                ? savedCourses.length
                : tab === "ONGOING"
                ? ongoingCourses.length
                : 0}
            </Text>
            <Text style={styles.statLabel}>{tabLabels[tab]}</Text>
          </View>
        ))}
      </View>

      {/* Courses Section */}
      <Text style={styles.sectionTitle}>Saved Courses</Text>

      <View style={{ paddingHorizontal: 16 }}>
        {savedCourses.length > 0 ? (
          savedCourses.map((course) => (
            <InspiresCourse
              key={course.id}
              course={course}
              teachers={teachers}
              onPress={() => navigation.navigate("Course_Detail", { course })}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Không có khóa học nào.</Text>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerBackground: { height: 180 },
  headerImage: { width: "100%", height: "100%" },

  avatarWrapper: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatar: { width: 120, height: 120, borderRadius: 60 },

  infoContainer: { marginTop: 70, alignItems: "center" },
  userName: { fontSize: 26, fontWeight: "bold" },
  jobText: { fontSize: 16, color: "#777", marginTop: 4 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 22, fontWeight: "700" },
  activeStat: { color: "#00BCD4" },
  statLabel: { fontSize: 14, color: "#777" },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  emptyText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
    color: "#777",
  },
});

export default UserProfileScreen;
