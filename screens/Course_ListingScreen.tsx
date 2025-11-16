import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList, Course } from "../types/type";
import { fetchAppData } from "../auth/dataSlice";
import { InspiresCourse } from "../components/InspiresCourse";
import { RootState } from "../auth/store";

type Props = NativeStackScreenProps<RootStackParamList, "Course_Listing">;

export const Course_ListingScreen = ({ navigation, route }: Props) => {
  const { keyword = "", category } = route.params || {};

  const dispatch = useDispatch<any>();
  const { courses, teachers } = useSelector((state: RootState) => state.data);

  const [searchTerm, setSearchTerm] = useState(keyword);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    dispatch(fetchAppData());
  }, [dispatch]);

  useEffect(() => {
    let result = courses;

    if (category) {
      result = result.filter(
        (c) => c.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (searchTerm.trim()) {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(result);
  }, [courses, searchTerm, category]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search course"
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

      <Text style={styles.resultText}>{filteredCourses.length} Results</Text>

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
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  searchBar: { flexDirection: "row", gap: 10, marginBottom: 20 },
  searchInput: { flex: 1, backgroundColor: "#fff" },
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
