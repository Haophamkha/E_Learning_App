import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Course, Teacher } from "../types/type";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../auth/store";
import { toggleSavedCourse } from "../auth/dataSlice";
import { updateCurrentUser } from "../auth/authSlice";

interface CourseCardProps {
  course: Course;
  teachers?: Teacher[];
  onPress?: () => void;
}

export const CourseCard = ({
  course,
  teachers = [],
  onPress,
}: CourseCardProps) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const teacher = teachers.find(
    (t) => String(t.id) === String(course.teacherid)
  );
  const teacherName = teacher ? teacher.name : "Unknown";

  const saved = currentUser?.savedcourselist?.includes(course.id);

  const handleToggleSaved = async () => {
    if (!currentUser) return;

    const updatedUser = await toggleSavedCourse(currentUser, course.id);
    if (updatedUser) {
      dispatch(updateCurrentUser(updatedUser));
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: course.image }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {course.name}
          </Text>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleToggleSaved}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={30}
              color={saved ? "#00BCD4" : "#333"}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.teacher} numberOfLines={1}>
          {teacherName}
        </Text>
        <Text style={styles.price}>
          {course.price.toLocaleString("vi-VN")}₫
        </Text>
        <View style={styles.row}>
          <FontAwesome name="star-o" color="#FFD700" size={12} />
          <Text style={styles.vote}>
            {course.vote} ({course.votecount})
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.lesson}>{course.lessoncount} bài học</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
  },
  info: {
    padding: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginRight: 6,
    lineHeight: 18,
  },
  bookmarkButton: {
    paddingLeft: 4,
  },
  teacher: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  price: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#00BCD4",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  vote: {
    fontSize: 12,
    marginLeft: 4,
    color: "#555",
  },
  dot: {
    fontSize: 14,
    color: "#999",
    marginHorizontal: 4,
  },
  lesson: {
    fontSize: 12,
    color: "#555",
  },
});
