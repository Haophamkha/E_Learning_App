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
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  RootStackParamList,
  Course,
  Teacher,
  User,
  RootTabParamList,
} from "../types/type";
import { SectionBlock } from "../components/SectionBlock";
import { CourseCard } from "../components/CourseCard";
import { InspiresCourse } from "../components/InspiresCourse";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";

import { useDispatch, useSelector } from "react-redux";
import { fetchAppData } from "../auth/dataSlice";
import { RootState, AppDispatch } from "../auth/store";

type Props = BottomTabScreenProps<RootTabParamList, "Course_Searching">;
type StackNav = NativeStackNavigationProp<RootStackParamList, "MainTabs">;

const CATEGORIES = [
  { name: "Business", icon: "business-center" },
  { name: "Design", icon: "palette" },
  { name: "Code", icon: "code" },
  { name: "Movie", icon: "movie" },
  { name: "Language", icon: "language" },
  { name: "Writing", icon: "article" },
];

export const Course_SearchingScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, teachers, users, loading, error } = useSelector(
    (state: RootState) => state.data
  );

  const [keyword, setKeyword] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const stackNav = useNavigation<StackNav>();
  const inputRef = useRef<RNTextInput | null>(null);

  useEffect(() => {
    dispatch(fetchAppData());
  }, [dispatch]);

  useEffect(() => {
    if (keyword.trim() === "") {
      setFilteredCourses(courses);
      return;
    }
    const results = courses.filter((c) =>
      (c.name || "").toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredCourses(results);
  }, [keyword, courses]);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    setShowDropdown(false);
    stackNav.navigate("Course_Listing", { keyword });
  };

  const handleCategoryPress = (cat: string) => {
    setShowDropdown(false);
    stackNav.navigate("Course_Listing", { category: cat });
  };

  const handleSelectCourse = (course: Course) => {
    setKeyword(""); 
    setShowDropdown(false);
    inputRef.current?.blur(); 

    setTimeout(() => {
      stackNav.navigate("Course_Detail", {
        course,
        teachers,
        courses,
        users,
      });
    }, 100);
  };



  if (loading) {
    return (
      <View
        style={[
          styles.root,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.root,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
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

      {showDropdown && filteredCourses.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredCourses}
            keyExtractor={(item) => String(item.id)}
            horizontal={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleSelectCourse(item)}
              >
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

      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
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

export default Course_SearchingScreen;
