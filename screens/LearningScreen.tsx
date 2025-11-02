import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/type";
import { FaRegHeart, FaShareAlt } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { IoPlayOutline } from "react-icons/io5";
import { MdOutlineLock } from "react-icons/md";
import data from "../data/data.json";

type Props = NativeStackScreenProps<RootStackParamList, "Learning">;

const tabs = ["LESSONS", "PROJECTS", "Q&A"] as const;
const { users } = data;

export const LearningScreen = ({ route }: Props) => {
  const { learning } = route.params;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("LESSONS");
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const romanNumerals = [
    "I", "II", "III", "IV", "V",
    "VI", "VII", "VIII", "IX", "X",
  ];

  const [newComment, setNewComment] = useState(""); // state cho comment mới
  const [qaList, setQaList] = useState(learning.QA || []); // state QA hiện tại

  const handleAddComment = () => {
    if (!newComment.trim()) return; // không thêm comment rỗng
    const newQA = {
      userId: 0, // giả sử user hiện tại là admin
      postDate: new Date().toLocaleDateString(),
      content: newComment,
      like: 0,
      commentCount: 0,
    };
    setQaList([newQA, ...qaList]); // thêm comment mới lên đầu
    setNewComment(""); // reset input
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
            <Text style={styles.likeCount}> {learning.like} Like</Text>
            <Text style={styles.dot}>•</Text>
            <FaShareAlt color="#1100ffff" />
            <Text style={styles.likeCount}> {learning.share} Share</Text>
          </View>
        </View>

        {/* Tabs  */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* LESSONS */}
        {activeTab === "LESSONS" && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {learning.chapters?.map((chapter, chapterIndex) => (
              <View key={chapter.order} style={{ marginBottom: 10 }}>
                {/* Tiêu đề chương */}
                <View style={styles.chapterHeader}>
                  <Text style={styles.chapterTitle}>
                    {`Chương ${romanNumerals[chapterIndex] || chapterIndex + 1}: ${chapter.title}`}
                  </Text>
                </View>

                {/* Danh sách bài học */}
                {chapter.lessons.map((lesson, index) => {
                  const isSelected = selectedLessonId === lesson.id;
                  return (
                    <TouchableOpacity
                      key={lesson.id}
                      style={[
                        styles.lessonRow,
                        isSelected && styles.lessonRowSelected,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setSelectedLessonId(lesson.id)}
                    >
                      <Text style={styles.lessonIndex}>
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </Text>

                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.lessonTitle,
                            isSelected && styles.lessonTitleSelected,
                          ]}
                        >
                          {lesson.title}
                        </Text>
                        <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                      </View>

                      {lesson.status === "completed" && (
                        <TiTick size={20} color="#0055FF" />
                      )}
                      {lesson.status === "inprogress" && (
                        <IoPlayOutline size={20} color="#00BCD4" />
                      )}
                      {lesson.status === "not_started" && (
                        <MdOutlineLock size={20} color="#AAA" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        )}

        {/* PROJECTS */}
        {activeTab === "PROJECTS" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <Text style={styles.sectionText}>
              Các bài tập / dự án thực hành sẽ được hiển thị ở đây.
            </Text>
          </View>
        )}

        {/* Q&A */}
        {activeTab === "Q&A" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Question & Answer</Text>

            {qaList.length > 0 ? (
              qaList.map((item, index) => {
                const user = users.find((u) => u.id === item.userId);
                return (
                  <View key={index} style={styles.qaCard}>
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

                    <Text style={styles.qaContent}>{item.content}</Text>

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
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Question..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleAddComment}>
                <Text style={styles.sendButtonText}>Gửi</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

/* Styles */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
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

  chapterHeader: { paddingVertical: 8 },
  chapterTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },

  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  lessonRowSelected: {
    borderColor: "#00BCD4",
    backgroundColor: "#E0F7FA",
  },
  lessonIndex: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00BCD4",
    width: 28,
  },
  lessonTitle: { fontSize: 16, fontWeight: "500", color: "#222" },
  lessonTitleSelected: { color: "#00BCD4" },
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
  qaDate: { fontSize: 12, color: "#999", marginTop: 2 },
  qaContent: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
    marginBottom: 10,
  },
  qaFooter: { flexDirection: "row", alignItems: "center", gap: 20 },
  qaStat: { flexDirection: "row", alignItems: "center" },
  qaStatText: { fontSize: 14, color: "#555", marginLeft: 6 },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#00BCD4",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default LearningScreen;
