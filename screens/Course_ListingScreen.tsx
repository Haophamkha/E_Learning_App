import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { TextInput } from "react-native-paper";
import { RootStackParamList } from "../types/type";
import { getData } from "../hooks/useFetch";
import { InspiresCourse } from "../components/InspiresCourse";

type Props = NativeStackScreenProps<RootStackParamList, "Course_Listing">;

export const Course_ListingScreen = ({ navigation, route }: Props) => {
  const { keyword, category } = route.params || {};
  const [searchTerm, setSearchTerm] = useState(keyword || "");
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  // Load dữ liệu khóa học và giáo viên
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, teacherData] = await Promise.all([
          getData("/courses"),
          getData("/teachers"),
        ]);
        setCourses(courseData || []);
        setTeachers(teacherData || []);
      } catch (err) {
        console.log("Lỗi tải dữ liệu:", err);
      }
    };
    fetchData();
  }, []);

  // Lọc khóa học theo category và searchTerm
  useEffect(() => {
    let result = courses;
    if (category) {
      result = result.filter(
        (course) =>
          course.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (searchTerm.trim()) {
      result = result.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCourses(result);
  }, [courses, searchTerm, category]);

  return (
    <ScrollView style={styles.container}>
      {/* Thanh tìm kiếm + Filter */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search course"
          placeholderTextColor="#A0A0A0"
          value={searchTerm}
          onChangeText={setSearchTerm}
          mode="outlined"
          theme={{ roundness: 12 }}
          left={<TextInput.Icon icon="magnify" color="#A0A0A0" />}
        />
        <TouchableOpacity style={styles.filterBtn}>
          <Feather name="filter" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tổng số kết quả */}
      <Text style={styles.resultText}>
        {filteredCourses.length} Results
      </Text>

      {/* Danh sách khóa học */}
      <View style={{ marginTop: 10 }}>
        {filteredCourses.map((course) => (
          <InspiresCourse
            key={course.id}
            course={course}
            teachers={teachers}
            onPress={() =>
              navigation.navigate("Course_Detail", {
                course,
                teachers,
                courses,
              })
            }
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
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
  resultText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 10,
  },
});

export default Course_ListingScreen;
