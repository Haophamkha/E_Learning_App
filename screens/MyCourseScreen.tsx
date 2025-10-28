import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/type"; 
import { getData } from "../hooks/useFetch";
import { MyCourseCard } from "../components/MyCourseCard";
import { Course, User } from "../types/type";

export const MyCourseScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "ongoing" | "completed">("all");

  // Mặc định user = 1 do chưa có đăng nhập
  const currentUserId = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, courseData] = await Promise.all([
          getData("/users"),
          getData("/courses"),
        ]);

        const currentUser = userData.find(
          (u: User) => String(u.id) === String(currentUserId)
        );
        setUser(currentUser || null);

        let coursesList: Course[] = [];
        if (Array.isArray(courseData)) {
          coursesList = courseData;
        } else if (courseData.courses && Array.isArray(courseData.courses)) {
          coursesList = courseData.courses;
        }
        console.log("coursesList:", coursesList);

        setCourses(coursesList);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chuyển giờ sang phút 
  const parseDuration = (duration: string | number): number => {
    if (!duration) return 0;
    if (typeof duration === "number") return duration;

    const cleanDuration = duration.replace(/\s+/g, "");
    const hourMatch = cleanDuration.match(/(\d+)h/);
    const minuteMatch = cleanDuration.match(/(\d+)m/);
    const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
    return hours * 60 + minutes;
  };

  // Ghép course với time_watched
  const userCourses = React.useMemo(() => {
    console.log("🧮 Calculating userCourses...");
    if (!user) return [];
    const result = Object.entries(user.purchaseCourse || {})
      .map(([courseId, progressData]) => {
        const course = courses.find((c) => String(c.id) === String(courseId));
        if (course) {
          return {
            ...course,
            time_watched: progressData.time_watched,
          };
        }
        return null;
      })
      .filter(Boolean) as (Course & { time_watched: number })[];

    console.log("📊 userCourses:", result);
    return result;
  }, [user, courses]);


  // Lọc khóa học theo tab
  const filteredCourses = React.useMemo(() => {
    return userCourses.filter((c) => {
      const totalMinutes = parseDuration(c.duration || "");
      if (!totalMinutes) return false;
      const watched = c.time_watched || 0;
      const progress = Math.round((watched / totalMinutes) * 100);
      if (filter === "ongoing") return progress > 0 && progress < 100;
      if (filter === "completed") return progress >= 100;
      return true;
    });
  }, [userCourses, filter]);

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
            source={require("../assets/teacher.jpg")}
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
              activeOpacity={0.7}
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

        {/*DS khóa học*/}
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <MyCourseCard
              key={course.id}
              course={course}
              onPress={() => navigation.navigate("Course_Detail", { course })}
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  tabText: { fontSize: 20, color: "#777", fontWeight: "600" },
  tabTextActive: { color: "#00BCD4" },
  tabUnderline: {
    marginTop: 6,
    width: 100,
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
  bannerText: { flex: 1 },
  bannerTitle: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 4,
  },
  joinBtn: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  joinText: { color: "#00BCD4", fontWeight: "bold", fontSize: 20 },
  bannerImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: "cover",
    marginLeft: 12,
  },
});
