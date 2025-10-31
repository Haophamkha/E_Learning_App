import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RootStackParamList, Lesson } from "../types/type";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<RootStackParamList, "LessonDetail">;

export const LessonDetailScreen = ({ route, navigation }: Props) => {
  const { title, lesson, learning } = route.params;

  const handleCompleteLesson = async () => {
    const updatedLesson: Lesson = { ...lesson, status: "completed" };
    const chapters = learning.chapters || [];
    let nextLesson: Lesson | null = null;

    // Cập nhật bài học đã hoàn thành và xác định bài tiếp theo
    for (let i = 0; i < chapters.length; i++) {
      const lessons = chapters[i].lessons;
      const index = lessons.findIndex((l) => l.id === lesson.id);

      if (index !== -1) {
        lessons[index] = updatedLesson;

        if (index + 1 < lessons.length) {
          nextLesson = lessons[index + 1];
        } else if (i + 1 < chapters.length) {
          nextLesson = chapters[i + 1].lessons[0];
        }
        break;
      }
    }

    // Cập nhật trạng thái bài học kế tiếp
    if (nextLesson && nextLesson.status === "not_started") {
      nextLesson.status = "inprogress";
    }

    // Lưu tiến trình vào AsyncStorage
    await AsyncStorage.setItem(`course_${learning.id}`, JSON.stringify(chapters));

    // Quay lại màn hình Learning và cập nhật trạng thái
    navigation.navigate("Learning", {
      learning: { ...learning, chapters },
      updatedLesson,
    });

    Alert.alert("✅ Hoàn thành", `Bạn đã hoàn thành "${title}"!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.info}>⏱ Thời lượng: {lesson.duration}</Text>

      <Text style={styles.status}>
        Trạng thái:{" "}
        <Text
          style={{
            color:
              lesson.status === "completed"
                ? "#00C853"
                : lesson.status === "inprogress"
                ? "#00BCD4"
                : "#FF7043",
          }}
        >
          {lesson.status}
        </Text>
      </Text>

      <View style={styles.content}>
        <Text style={styles.desc}>Nội dung bài học sẽ được hiển thị ở đây.</Text>
      </View>

      {/* Nút hoàn thành bài học */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            lesson.status === "completed" && styles.disabledButton,
          ]}
          disabled={lesson.status === "completed"}
          onPress={handleCompleteLesson}
        >
          <Text style={styles.buttonText}>
            {lesson.status === "completed"
              ? "Đã hoàn thành"
              : "Hoàn thành bài học"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#222" },
  info: { marginTop: 8, fontSize: 16, color: "#555" },
  status: { fontSize: 16, color: "#888", marginTop: 10, marginBottom: 20 },
  content: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    flex: 1,
  },
  desc: { fontSize: 15, color: "#333" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 12,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#00BCD4",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  disabledButton: { backgroundColor: "#BDBDBD" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

export default LessonDetailScreen;
