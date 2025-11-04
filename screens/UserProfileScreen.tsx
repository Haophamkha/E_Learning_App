import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} from "../auth/authSlice";

import { addUser } from "../auth/dataSlice";

import { useUserCourseStatus } from "../hooks/useUserCourseStatus";
import { User } from "../types/type";
import { InspiresCourse } from "../components/InspiresCourse";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList, Course } from "../types/type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const UserProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavProp>();
  const { currentUser, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { courses, teachers, users } = useSelector(
    (state: RootState) => state.data
  );


  const [isRegister, setIsRegister] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [hidePw, setHidePw] = useState(true);
  const { ongoingCourses, completedCourses } = useUserCourseStatus(
    currentUser,
    courses
  );
  
  // 🧠 Login
  // 🧠 Login with full debug logs
  const handleLogin = () => {
    if (!userName || !password) {
      dispatch(loginFailure("Vui lòng nhập đầy đủ thông tin"));
      return;
    }

    dispatch(loginStart());

    const user = users.find(
      (u: User) =>
        u.username?.toLowerCase() === userName.trim().toLowerCase() &&
        u.password === password
    );

    if (!user) {
      users.find(
        (u: User) =>
          u.name?.toLowerCase() === userName.toLowerCase() &&
          u.password === password
      );
    }

    if (user) {
      dispatch(loginSuccess(user));
    } else {
      dispatch(loginFailure("Sai tài khoản hoặc mật khẩu"));
    }
  };


  // 🧠 Register
  

 const handleRegister = async () => {
   if (!userName || !password || !name) {
     dispatch(loginFailure("Vui lòng nhập đầy đủ thông tin"));
     return;
   }

   const existingUser = users.find((u) => u.username === userName);
   if (existingUser) {
     dispatch(loginFailure("Tên đăng nhập đã tồn tại"));
     return;
   }

   const newUser = await addUser({
     user_name: name,
     job,
     image: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
     username: userName,
     password,
   });

   if (!newUser) {
     dispatch(loginFailure("Đăng ký thất bại"));
     return;
   }

   // Dispatch login success
   dispatch(loginSuccess(newUser));
   setIsRegister(false);
 };



  // 🧠 Logout
  const handleLogout = () => dispatch(logout());

  // 🧩 Nếu chưa đăng nhập: render login/register UI
  if (!currentUser) {
    return (
      <View style={styles.authContainer}>
        <View style={styles.authBox}>
          <Text style={styles.title}>
            {isRegister ? "Tạo tài khoản mới" : "Chào mừng trở lại!"}
          </Text>
          <Text style={styles.subText}>
            {isRegister
              ? "Đăng ký để bắt đầu học ngay"
              : "Đăng nhập để tiếp tục học"}
          </Text>

          {isRegister && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Công việc (VD: Sinh viên, Designer...)"
                placeholderTextColor="#aaa"
                value={job}
                onChangeText={setJob}
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            placeholderTextColor="#aaa"
            value={userName}
            onChangeText={setUserName}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Mật khẩu"
              secureTextEntry={hidePw}
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setHidePw(!hidePw)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={hidePw ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.btn}
            onPress={isRegister ? handleRegister : handleLogin}
          >
            <Text style={styles.btnText}>
              {loading ? "Đang xử lý..." : isRegister ? "Đăng ký" : "Đăng nhập"}
            </Text>
          </TouchableOpacity>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.switchRow}>
            <Text style={styles.normalText}>
              {isRegister ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
            </Text>
            <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
              <Text style={styles.linkText}>
                {isRegister ? "Đăng nhập" : "Đăng ký ngay"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // 🧩 Nếu đã đăng nhập: render thông tin người dùng
  const user = currentUser as User;
  const savedCourses = courses.filter((c) =>
    user.savedcourselist?.includes(Number(c.id))
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerBackground}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60",
          }}
          style={styles.headerImage}
          blurRadius={8}
        />
      </View>

      <View style={styles.avatarWrapper}>
        <Image
          source={{
            uri:
              user.image ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.jobText}>{user.job || "Học viên"}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{savedCourses.length}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{ongoingCourses.length}</Text>
          <Text style={styles.statLabel}>On Going</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{completedCourses.length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Saved Courses</Text>
      <View style={{ paddingHorizontal: 16 }}>
        {savedCourses.length > 0 ? (
          savedCourses.map((course) => (
            <InspiresCourse
              key={course.id}
              course={course}
              teachers={teachers}
              saved={user.savedcourselist.includes(Number(course.id))}
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


// 🎨 Style
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  subText: { color: "#555", textAlign: "center", marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    marginBottom: 14,
  },
  inputPassword: { flex: 1, height: 50, paddingHorizontal: 12 },
  eyeIcon: { paddingHorizontal: 12 },
  btn: {
    backgroundColor: "#00BCD4",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  error: { color: "red", textAlign: "center", marginTop: 8 },
  // Profile
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
  logoutBtn: {
    alignSelf: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  logoutText: { color: "red", fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 22, fontWeight: "700" },
  statLabel: { fontSize: 14, color: "#777" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  emptyText: { textAlign: "center", color: "#777" },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  authBox: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  normalText: {
    color: "#000",
    fontSize: 14,
  },
  linkText: {
    color: "#007BFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default UserProfileScreen;
