import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
  TextInput as RNTextInput,
} from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/type";
import { SectionBlock } from "../components/SectionBlock";
import { CourseCard } from "../components/CourseCard"; // hoặc InspiresCourse nếu bạn đã có
import { getData } from "../hooks/useFetch";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../types/type";
import { useNavigation } from "@react-navigation/native";
import { InspiresCourse } from "../components/InspiresCourse";

type Props = BottomTabScreenProps<RootTabParamList, "Course_Searching">;
type StackNav = NativeStackNavigationProp<RootStackParamList, "MainTabs">;

const CATEGORIES = [
  { name: "Business", icon: "business-center" },
  { name: "Design", icon: "palette" },
  { name: "Code", icon: "code" },
  { name: "Movie", icon: "movie" },
  { name: "Language", icon: "language" },
];

export const Course_SearchingScreen = ({ navigation }: Props) => {
  const [keyword, setKeyword] = useState("");
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const stackNav = useNavigation<StackNav>();
  const inputRef = useRef<RNTextInput | null>(null);

  // --- Load dữ liệu ban đầu ---
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
        console.log("❌ Không thể tải dữ liệu!", err);
      }
    };
    fetchData();
  }, []);

  // --- Lọc theo từ khóa ---
  useEffect(() => {
    if (keyword.trim() === "") {
      setFilteredCourses(courses);
      return;
    }
    const results = courses.filter((c) =>
      (c.title || c.name || "")
        .toLowerCase()
        .includes(keyword.toLowerCase())
    );
    setFilteredCourses(results);
  }, [keyword, courses]);

  // --- Xử lý khi nhấn search ---
  const handleSearch = () => {
    if (!keyword.trim()) return;
    setShowDropdown(false);
    stackNav.navigate("Course_Listing", { keyword });
  };

  // --- Chọn category ---
  const handleCategoryPress = (cat: string) => {
    setShowDropdown(false);
    stackNav.navigate("Course_Listing", { category: cat });
  };

  // --- Chọn item trong dropdown ---
  const handleSelectCourse = (course: any) => {
    setKeyword(course.title || course.name || "");
    setShowDropdown(false);
    setTimeout(() => {
      stackNav.navigate("Course_Detail", {
        course,
        teachers,
        courses,
        users,
      });
    }, 100);
  };

  return (
    <View style={styles.root}>
      {/* Search Bar */}
      <View style={styles.searchBarWrap}>
        <TextInput
          ref={(r: any) => (inputRef.current = r)}
          style={styles.searchInput}
          placeholder="Search course..."
          placeholderTextColor="#A0A0A0"
          value={keyword}
          onChangeText={setKeyword}
          mode="outlined"
          theme={{ roundness: 12 }}
          left={<TextInput.Icon icon="magnify" color="#A0A0A0" />}
          onFocus={() => {
            setShowDropdown(true);
            if (keyword.trim() === "") setFilteredCourses(courses);
          }}
          onBlur={() => {
            setTimeout(() => setShowDropdown(false), 120);
          }}
        />
        <TouchableOpacity style={styles.filterBtn} onPress={handleSearch}>
          <Feather name="filter" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Dropdown hiển thị gợi ý (InspiresCourse style) */}
      {showDropdown && filteredCourses.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredCourses}
            keyExtractor={(item) => String(item.id ?? item._id ?? item.name)}
            horizontal={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleSelectCourse(item)}
              >
                {/* Gọi component hiển thị course kiểu InspiresCourse */}
                <InspiresCourse
                  course={item}
                  teachers={teachers}
                  onPress={() => handleSelectCourse(item)}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Nội dung chính */}
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Categories */}
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.name}
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(cat.name)}
          >
            <MaterialIcons name={cat.icon as any} size={22} color="#00BCD4" />
            <Text style={styles.categoryText}>{cat.name}</Text>
            <Feather name="chevron-right" size={20} color="#777" />
          </TouchableOpacity>
        ))}

        {/* Recommended */}
        <SectionBlock title="Recommended for you">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              teachers={teachers}
              onPress={() =>
                stackNav.navigate("Course_Detail", {
                  course,
                  teachers,
                  courses,
                  users,
                })
              }
            />
          ))}
        </SectionBlock>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  searchBarWrap: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    marginBottom: 6,
    zIndex: 50,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    top: Platform.OS === "ios" ? 70 : 72,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    zIndex: 40,
    maxHeight: 340,
    paddingVertical: 6,
  },
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 14,
    color: "#111",
  },
  headerRow: {
    marginTop: 8,
    marginBottom: 6,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#F4F8FA",
    borderRadius: 12,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
    color: "#111",
  },
});
