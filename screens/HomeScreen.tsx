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
import { CiShoppingCart } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, RootTabParamList } from "../types/type";

import { SectionBlock } from "../components/SectionBlock";
import { CourseCard } from "../components/CourseCard";
import { TeacherCard } from "../components/TeacherCard";
import { InspiresCourse } from "../components/InspiresCourse";
import { SectionBlockInspires } from "../components/SectionBlockInspires";
import { useEffect, useState } from "react";
import { getData } from "../hooks/useFetch";
import { NotificationModal } from "../components/NotificationModal";

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen = ({ navigation }: { navigation: HomeNavProp }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Viết tạm
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = [
    {
      id: 1,
      message: "Bạn đã mua sách 1.",
      time: "10 ngày 15 giờ trước",
    },
    {
      id: 2,
      message: "Bạn đã mua sách 2.",
      time: "10 ngày 15 giờ trước",
    },
    {
      id: 3,
      message: "Bạn đã mua sách 3.",
      time: "10 ngày 15 giờ trước",
    },
    {
      id: 4,
      message: "Bạn đã mua sách 1.",
      time: "10 ngày 15 giờ trước",
    },
  ];

  // Gọi api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, teacherData] = await Promise.all([
          getData("/courses"),
          getData("/teachers"),
        ]);
        setCourses(courseData || []);
        setTeachers(teacherData || []);
      } catch (err: any) {
        setError("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <NotificationModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Rosie!</Text>
            <Text style={styles.subText}>What do you want to learn today?</Text>
          </View>

          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Cart")}
            >
              <CiShoppingCart color="white" size={30} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginLeft: 16 }}
              onPress={() => setShowNotifications(true)}
            >
              <IoIosNotificationsOutline color="white" size={30} />
            </TouchableOpacity>
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
            source={require("../assets/teacher.jpg")}
            style={styles.bannerImg}
          />
        </View>

        {/* Popular Courses */}

        <SectionBlock title="Popular Courses">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              teachers={teachers}
              onPress={() => navigation.navigate("Course_Detail", { course })}
            />
          ))}
        </SectionBlock>

        <SectionBlock title="Recommended for you">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              teachers={teachers}
              onPress={() => navigation.navigate("Course_Detail", { course })}
            />
          ))}
        </SectionBlock>

        <SectionBlockInspires title="Course that inspires">
          {courses.map((course) => (
            <InspiresCourse
              key={course.id}
              course={course}
              teachers={teachers}
              onPress={() => navigation.navigate("Course_Detail", { course })}
            />
          ))}
        </SectionBlockInspires>

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

        {/* Navigation Buttons */}
        <View style={styles.container}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Course_Listing")}
            style={styles.btn}
          >
            Đến Course Listing
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.navigate("Learning", { learning: courses[0] })}
            style={styles.btn}
          >
            Đến Learning
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// STYLES
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#00BCD4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  greeting: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  subText: {
    color: "#E0F7FA",
    fontSize: 14,
    marginTop: 4,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
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
  joinText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bannerImg: {
    width: 90,
    height: 90,
    marginLeft: 10,
    resizeMode: "contain",
  },
  container: {
    padding: 16,
  },
  btn: {
    marginVertical: 8,
  },
  teachersContainer: {
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
