import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FaRegStar } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
interface InspireCourse {
  id: number;
  name: string;
  teacherId: number;
  price: number;
  vote: number;
  voteCount: number;
  lessonCount: number;
  category: string;
  image: string;
}

interface Teacher {
  id: number;
  name: string;
}

interface InspiresCourseProps {
  course: InspireCourse;
  teachers?: Teacher[];
  onPress?: () => void;
  saved?: boolean; // 🔹 Thêm prop saved
}

export const InspiresCourse = ({
  course,
  teachers = [],
  onPress,
  saved = false, // mặc định false
}: InspiresCourseProps) => {
  const teacher = teachers.find(
    (t) => String(t.id) === String(course.teacherId)
  );
  const teacherName = teacher ? teacher.name : "Unknown";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: course.image }} style={styles.image} />

      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {course.name}
          </Text>
          <CiBookmark
            size={30}
            style={{
              ...styles.bookmark, 
              color: saved ? "#00BCD4" : "#777", 
            }}
          />
        </View>

        <Text style={styles.teacher}>{teacherName}</Text>
        <Text style={styles.price}>
          {course.price.toLocaleString("vi-VN")}₫
        </Text>

        <View style={styles.row}>
          <FaRegStar color="#FFD700" />
          <Text style={styles.vote}>
            {course.vote} ({course.voteCount})
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.lesson}>{course.lessonCount} bài học</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 6,
    resizeMode: "cover",
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    flexShrink: 1,
  },
  teacher: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  price: {
    color: "#00BCD4",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  vote: {
    fontSize: 12,
    color: "#555",
    marginLeft: 4,
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
  bookmark: {
    position: "relative",
    top: 20, 
  },
});
