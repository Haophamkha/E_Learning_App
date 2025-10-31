import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, Chapter, Lesson, User } from "../types/type";
import { FaRegHeart, FaShareAlt } from "react-icons/fa";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import data from "../data/data.json";



type Props = NativeStackScreenProps<RootStackParamList, "Learning">;

const tabs = ["LESSONS", "PROJECTS", "Q&A"] as const;
const {users} = data;

export const LearningScreen = ({ route, navigation }: Props) => {
  const { learning } = route.params;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("LESSONS");
  const [chapters, setChapters] = useState<Chapter[]>(learning.chapters || []);

  // 🔹 Load tiến trình khi mở màn hình
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const saved = await AsyncStorage.getItem(`course_${learning.id}`);
        if (saved) {
          setChapters(JSON.parse(saved));
        }
      } catch (err) {
        console.error("❌ Lỗi khi load tiến trình:", err);
      }
    };
    loadProgress();
  }, []);

  // 🔹 Cập nhật khi quay lại từ LessonDetail
  useFocusEffect(
    useCallback(() => {
      if (route.params?.updatedLesson) {
        const updatedLesson = route.params.updatedLesson;
        setChapters((prev) => {
          const updated = prev.map((chapter) => ({
            ...chapter,
            lessons: chapter.lessons.map((lesson) =>
              lesson.id === updatedLesson.id ? updatedLesson : lesson
            ),
          }));
          AsyncStorage.setItem(`course_${learning.id}`, JSON.stringify(updated));
          return updated;
        });
      }
    }, [route.params?.updatedLesson])
  );

  const handleLessonPress = (lesson: Lesson) => {
    navigation.navigate("LessonDetail", {
      title: lesson.title,
      lesson,
      learning: { ...learning, chapters },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: learning.image }} style={styles.courseImage} />
          <Text style={styles.courseTitle}>{learning.name}</Text>

          <View style={styles.iconRow}>
            <FaRegHeart color="#ff0000ff" />
            <Text style={styles.likeCount}>.... Like</Text>
            <Text style={styles.dot}>•</Text>
            <FaShareAlt color="#1100ffff" />
            <Text style={styles.likeCount}>.... Share</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabItem,
                activeTab === tab && styles.tabItemActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LESSONS */}
        {activeTab === "LESSONS" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Lessons</Text>

            {chapters.map((chapter, idx) => (
              <View key={idx} style={styles.chapterBlock}>
                <Text style={styles.chapterTitle}>
                  {chapter.order}. {chapter.title}
                </Text>

                {chapter.lessons.map((lesson, index) => {
                  const isDisabled = lesson.status === "not_started";

                  return (
                    <TouchableOpacity
                      key={lesson.id}
                      disabled={isDisabled}
                      style={[
                        styles.lessonItem,
                        lesson.status === "inprogress" &&
                          styles.lessonItemInProgress,
                        lesson.status === "completed" &&
                          styles.lessonItemCompleted,
                        isDisabled && styles.lessonItemDisabled,
                      ]}
                      onPress={() => !isDisabled && handleLessonPress(lesson)}
                    >
                      <Text
                        style={[
                          styles.lessonIndex,
                          isDisabled && { color: "#999" },
                          lesson.status === "inprogress" && { color: "#00BCD4" },
                        ]}
                      >
                        {(index + 1).toString().padStart(2, "0")}
                      </Text>

                      <View style={styles.lessonContent}>
                        <Text
                          style={[
                            styles.lessonTitle,
                            isDisabled && { color: "#999" },
                          ]}
                        >
                          {lesson.title}
                        </Text>
                        <Text
                          style={[
                            styles.lessonDuration,
                            isDisabled && { color: "#aaa" },
                          ]}
                        >
                          {lesson.duration}
                        </Text>
                      </View>

                      {lesson.status === "completed" && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color="#00C853"
                          style={{ marginLeft: 6 }}
                        />
                      )}
                      {lesson.status === "inprogress" && (
                        <Ionicons
                          name="play"
                          size={18}
                          color="#00BCD4"
                          style={{ marginLeft: 6 }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            <View style={{ marginTop: 16 }}>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    await AsyncStorage.removeItem(`course_${learning.id}`);
                    setChapters(learning.chapters || []); // 🔄 reset về data gốc
                    alert("🔁 Đã reset tiến trình học!");
                  } catch (err) {
                    console.error("❌ Lỗi khi reset:", err);
                  }
                }}
                style={styles.resetButton}
              >
                <Text style={styles.resetText}>Reset Progress</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* PROJECTS */}
        {activeTab === "PROJECTS" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <Text style={styles.sectionText}>
              Project details will be displayed here soon.
            </Text>
          </View>
        )}

        {/* Q&A */}
        {activeTab === "Q&A" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Question & Answer</Text>

            {learning.QA && learning.QA.length > 0 ? (
              learning.QA.map((item, index) => {
                // 🔹 Lấy thông tin user từ learning.users (nếu có)
                const user = users.find((u) => u.id === item.userId);

                return (
                  <View key={index} style={styles.qaCard}>
                    {/* Header */}
                    <View style={styles.qaHeader}>
                      <Image
                        source={{
                          uri:
                            user?.image ||
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                        }}
                        style={styles.qaAvatar}
                      />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.qaUser}>{user?.name || "Ẩn danh"}</Text>
                        <Text style={styles.qaDate}>{item.postDate}</Text>
                      </View>
                    </View>

                    {/* Nội dung Q&A */}
                    <Text style={styles.qaContent}>{item.content}</Text>

                    {/* Like + Comment */}
                    <View style={styles.qaFooter}>
                      <TouchableOpacity style={styles.qaStat}>
                        <Ionicons name="heart-outline" size={18} color="#ff4081" />
                        <Text style={styles.qaStatText}>{item.like}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.qaStat}>
                        <Ionicons name="chatbubble-outline" size={18} color="#00BCD4" />
                        <Text style={styles.qaStatText}>{item.commentCount}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.sectionText}>Chưa có câu hỏi nào.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  resetButton: {
    backgroundColor: "#ff6b6b",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
  },
  resetText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  header: { alignItems: "center", padding: 16 },
  courseImage: { width: "100%", height: 220, borderRadius: 12 },
  courseTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginTop: 12,
    textAlign: "center",
  },
  iconRow: { flexDirection: "row", marginTop: 12, gap: 16 },
  likeCount: { fontSize: 15, color: "#000000ff", marginHorizontal: 6 },
  dot: { fontSize: 18, color: "#888", marginHorizontal: 4 },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabItemActive: { borderBottomWidth: 3, borderBottomColor: "#00BCD4" },
  tabText: { fontSize: 16, color: "#666" },
  tabTextActive: { color: "#00BCD4", fontWeight: "bold" },
  tabContent: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  sectionText: { fontSize: 15, color: "#555", marginBottom: 10 },
  chapterBlock: { marginTop: 16 },
  chapterTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  lessonItemInProgress: {
    backgroundColor: "#E0F7FA",
    borderColor: "#00BCD4",
  },
  lessonItemCompleted: {
    backgroundColor: "#fff",
    borderColor: "#eee",
  },
  lessonItemDisabled: {
    backgroundColor: "#F3F3F3",
    borderColor: "#ddd",
    opacity: 0.6,
  },
  lessonIndex: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00BCD4",
    width: 28,
  },
  lessonContent: { flex: 1, marginLeft: 10 },
  lessonTitle: { fontSize: 16, fontWeight: "500", color: "#222" },
  lessonDuration: { fontSize: 13, color: "#666" },
  qaCard: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 14,
  marginBottom: 12,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
  borderWidth: 1,
  borderColor: "#f0f0f0",
},
qaHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
qaAvatar: { width: 40, height: 40, borderRadius: 20 },
qaUser: { fontSize: 15, fontWeight: "bold", color: "#222" },
qaJob: { fontSize: 13, color: "#666", marginTop: 2 },
qaDate: { fontSize: 12, color: "#999", marginTop: 2 },
qaContent: {
  fontSize: 15,
  color: "#333",
  lineHeight: 20,
  marginBottom: 10,
},
qaFooter: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 4,
  gap: 20,
},
qaStat: { flexDirection: "row", alignItems: "center" },
qaStatText: { fontSize: 14, color: "#555", marginLeft: 6 },

});

export default LearningScreen;
