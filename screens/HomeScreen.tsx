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
import { LoginScreen } from "./LoginScreen";
import { RegisterScreen } from "./RegisterScreen";
import { SectionBlockInspires } from "../components/SectionBlockInspires";
import { useEffect, useState } from "react";
import { getData } from "../hooks/useFetch";
import { NotificationModal } from "../components/NotificationModal";
import { useAuth } from "../contexts/AuthContext";

type HomeNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen = ({ navigation }: { navigation: HomeNavProp }) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
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
        const [courseData, teacherData, userData] = await Promise.all([
          getData("/courses"),
          getData("/teachers"),
          getData("/users"),
        ]);
        setCourses(courseData || []);
        setTeachers(teacherData || []);
        setUsers(userData || []);
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

            {/* Cart */}
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Cart", {
                  courses,
                  user: users && users.length > 0 ? users[0] : { cart: [] },
                })
              }
            >
              <CiShoppingCart color="white" size={30} />
            </TouchableOpacity>

            {/* Notification */}
            <TouchableOpacity
              style={{ marginLeft: 16 }}
              onPress={() => setShowNotifications(true)}
            >
              <IoIosNotificationsOutline color="white" size={30} />
            </TouchableOpacity>

            {/* Avatar + Dropdown */}
            <View style={{ marginLeft: 16 }}>
              <TouchableOpacity onPress={() => setShowUserMenu(!showUserMenu)}>
                <Image
                  source={require("../assets/avt.jpg")}
                  style={styles.avatar}
                />
              </TouchableOpacity>

              {/* Menu đổ xuống */}
              {showUserMenu && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity onPress={() => {
                    setShowUserMenu(false);
                    navigation.navigate("LoginScreen");
                  }}>
                    <Text style={styles.dropdownItem}>Login</Text>
                  </TouchableOpacity>
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

        <SectionBlockInspires title="Course that inspires">
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
                  users,
                })
              }
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
          {/* <Button
            mode="contained"
            onPress={() => navigation.navigate("Course_Listing")}
            style={styles.btn}
          >
            Đến Course Listing
          </Button> */}

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
    width: 200,
    height: 150,
    marginLeft: 10,
    marginRight: 10,
    resizeMode: "contain",
    paddingBottom : 0,
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
  authBtn: {
  marginLeft: 16,
  borderWidth: 1,
  borderColor: "#fff",
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 6,
},

authText: {
  color: "#fff",
  fontSize: 12,
  fontWeight: "600",
},
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
  elevation: 5, // Android shadow
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 3 },
},

dropdownItem: {
  paddingVertical: 8,
  paddingHorizontal: 12,
  fontSize: 14,
  color: "#333",
}

});
