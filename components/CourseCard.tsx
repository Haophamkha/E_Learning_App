import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FaRegStar } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";

interface Teacher {
  id: number;
  name: string;
}

interface Course {
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
  const teacher = teachers.find(
    (t) => String(t.id) === String(course.teacherId)
  );
  const teacherName = teacher ? teacher.name : "Unknown";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      
      <Image source={{ uri: course.image }} style={styles.image} />

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {course.name}
          </Text>

          <TouchableOpacity style={styles.bookmarkButton}>
            <CiBookmark size={30} color="#333" />
          </TouchableOpacity>
        </View>

        <Text style={styles.teacher} numberOfLines={1}>
          {teacherName}
        </Text>

        <Text style={styles.price}>
          {course.price.toLocaleString("vi-VN")}₫
        </Text>

        <View style={styles.row}>
          <FaRegStar color="#FFD700" size={12} />
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
