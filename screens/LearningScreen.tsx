import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { addStudentProjectToCourse } from "../auth/dataSlice";
import { supabase } from "../auth/supabaseClient";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../auth/store";
import { RootStackParamList, Course } from "../types/type";
import { addQAtoCourse, updateCourseQA } from "../auth/dataSlice";
import ProjectCard from "../components/ProjectCard";
import type { AppDispatch } from "../auth/store";

type Props = NativeStackScreenProps<RootStackParamList, "Learning">;
const tabs = ["LESSONS", "PROJECTS", "Q&A"] as const;

export const LearningScreen = ({ route }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { course } = route.params as {
    course: Course & { time_watched?: number };
  };
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("LESSONS");
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [studentProjects, setStudentProjects] = useState(
    course.project?.studentproject || []
  );
  const romanNumerals = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
  ];
  const [newComment, setNewComment] = useState("");
  const [qaList, setQaList] = useState<any[]>(
    Array.isArray(course.qa) ? course.qa : []
  );

  const users = useSelector((state: RootState) => state.data.users);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  // File & Image states
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const enrichedQAList = qaList.map((item) => {
    const user = users.find((u) => Number(u.id) === item.userid);
    return {
      ...item,
      userName: user?.name || "Ẩn danh",
      userAvatar:
        user?.image ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    };
  });

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUser) return;

    const updatedQAList = await addQAtoCourse(
      course.id,
      Number(currentUser.id),
      newComment
    );

    if (updatedQAList) {
      setQaList(updatedQAList);
      dispatch(updateCourseQA({ courseId: course.id, qa: updatedQAList }));
      setNewComment("");
    }
  };

  const getFileIconComponent = (ext?: string) => {
    switch (ext?.toLowerCase()) {
      case "pdf":
        return (
          <MaterialIcons name="picture-as-pdf" size={28} color="#2B579A" />
        );
      case "txt":
        return <MaterialIcons name="description" size={28} color="#FF0000" />;
      default:
        return (
          <MaterialIcons name="insert-drive-file" size={28} color="#666" />
        );
    }
  };

  // Upload file to Supabase 
  const uploadFile = async (
    file: any,
    folder: string,
    userId: number,
    projectName: string
  ) => {
    const response = await fetch(file.uri);
    const blob = await response.blob();

    const originalName = file.name;
    const cleanName = originalName.replace(/\s+/g, "_"); 

    // Tạo đường dẫn: folder/userId/projectName/cleanName
    const safeProjectName = projectName.replace(/[^a-zA-Z0-9_-]/g, "_");
    const filePath = `${folder}/${userId}/${safeProjectName}/${cleanName}`;

    const { error } = await supabase.storage
      .from("E_Learning_App")
      .upload(filePath, blob, {
        contentType: file.mimeType || "application/octet-stream",
        upsert: true,
      });

    if (error) {
      if (error.message.includes("duplicate")) {
        const ext = cleanName.includes(".") ? cleanName.split(".").pop() : "";
        const nameWithoutExt = cleanName.replace(`.${ext}`, "");
        const timestamp = Date.now().toString().slice(-4);
        const newName = `${nameWithoutExt}_${timestamp}.${ext}`;
        return uploadFile(file, folder, userId, projectName);
      }
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("E_Learning_App")
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      size: file.size
        ? file.size >= 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : file.size >= 1024
          ? `${(file.size / 1024).toFixed(2)} KB`
          : `${file.size} bytes`
        : "unknown",
      originalName,
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: course.image }} style={styles.courseImage} />
          <Text style={styles.courseTitle}>{course.name}</Text>
          <View style={styles.iconRow}>
            <View style={styles.iconGroup}>
              <Ionicons name="heart-outline" size={20} color="#ff4081" />
              <Text style={styles.likeCount}>{course.likes || 0} Like</Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <View style={styles.iconGroup}>
              <Ionicons name="share-social-outline" size={20} color="#00BCD4" />
              <Text style={styles.likeCount}>{course.share || 0} Share</Text>
            </View>
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
          <ScrollView showsVerticalScrollIndicator={false}>
            {Array.isArray(course.chapters) && course.chapters.length > 0 ? (
              course.chapters.map((chapter, chapterIndex) => (
                <View
                  key={chapter.order ?? 100 + chapterIndex}
                  style={{ marginBottom: 10 }}
                >
                  <View style={styles.chapterHeader}>
                    <Text style={styles.chapterTitle}>
                      {`Chương ${
                        romanNumerals[chapterIndex] || chapterIndex + 1
                      }: ${chapter.title || "Untitled"}`}
                    </Text>
                  </View>

                  {Array.isArray(chapter.lessons) &&
                  chapter.lessons.length > 0 ? (
                    chapter.lessons.map((lesson, index) => {
                      const isSelected = selectedLessonId === lesson.id;
                      return (
                        <TouchableOpacity
                          key={lesson.id}
                          style={[
                            styles.lessonRow,
                            isSelected && styles.lessonRowSelected,
                          ]}
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
                            <Text style={styles.lessonDuration}>
                              {lesson.duration || "00:00"}
                            </Text>
                          </View>
                          {lesson.status === "completed" && (
                            <Ionicons
                              name="checkmark-circle-outline"
                              size={20}
                              color="#0055FF"
                            />
                          )}
                          {lesson.status === "inprogress" && (
                            <Ionicons
                              name="play-outline"
                              size={20}
                              color="#00BCD4"
                            />
                          )}
                          {lesson.status === "not_started" && (
                            <MaterialIcons
                              name="lock-outline"
                              size={20}
                              color="#AAA"
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <Text style={styles.sectionText}>Chưa có bài học nào.</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.sectionText}>Chưa có chương nào.</Text>
            )}
          </ScrollView>
        )}

        {/* PROJECTS */}
        {activeTab === "PROJECTS" && (
          <View style={styles.tabContent}>
            {/* Upload box */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Upload your Project
            </Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="cloud-upload-outline" size={28} color="#00BCD4" />
              <Text style={styles.uploadText}>Upload your project here</Text>
            </TouchableOpacity>

            {/* Student Projects */}
            <Text style={styles.sectionTitle}>
              {course.project?.studentproject?.length || 0} Student Projects
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {studentProjects.map((proj, index) => {
                const user = users.find((u) => u.id === proj.userid);
                return (
                  <ProjectCard
                    key={index}
                    project={proj}
                    user={user}
                    onPress={() =>
                      console.log("Project clicked:", proj.nameprj)
                    }
                  />
                );
              })}
            </ScrollView>

            {/* Modal Upload */}
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Upload Project</Text>

                  {/* Project Name */}
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Tên dự án *"
                    value={projectName}
                    onChangeText={setProjectName}
                  />

                  {/* Choose Image */}
                  <TouchableOpacity
                    style={[
                      styles.modalUploadButton,
                      { backgroundColor: "#FF9800" },
                    ]}
                    onPress={async () => {
                      try {
                        const result = await DocumentPicker.getDocumentAsync({
                          type: "image/*",
                          copyToCacheDirectory: true,
                        });
                        if (!result.canceled) {
                          setSelectedImage(result.assets[0]);
                        }
                      } catch (err) {
                        Alert.alert("Lỗi", "Không thể chọn ảnh");
                      }
                    }}
                  >
                    <Ionicons name="image-outline" size={24} color="#fff" />
                    <Text style={styles.modalUploadButtonText}>
                      Chọn ảnh dự án
                    </Text>
                  </TouchableOpacity>

                  {/* Image Preview */}
                  {selectedImage && (
                    <Image
                      source={{ uri: selectedImage.uri }}
                      style={styles.previewImage}
                    />
                  )}

                  {/* Choose File */}
                  <TouchableOpacity
                    style={styles.modalUploadButton}
                    onPress={async () => {
                      try {
                        const result = await DocumentPicker.getDocumentAsync({
                          type: "*/*",
                          copyToCacheDirectory: true,
                        });
                        if (!result.canceled) {
                          setSelectedFile(result.assets[0]);
                        }
                      } catch (err) {
                        Alert.alert("Lỗi", "Không thể chọn file");
                      }
                    }}
                  >
                    <Ionicons name="attach-outline" size={24} color="#fff" />
                    <Text style={styles.modalUploadButtonText}>
                      Chọn file đính kèm
                    </Text>
                  </TouchableOpacity>

                  {/* File Info */}
                  {selectedFile && (
                    <View style={styles.fileInfoBox}>
                      <Text style={{ fontWeight: "bold" }}>File:</Text>
                      <Text numberOfLines={1}>{selectedFile.name}</Text>
                      <Text style={{ fontSize: 12, color: "#666" }}>
                        {selectedFile.size
                          ? selectedFile.size >= 1024 * 1024
                            ? `${(selectedFile.size / (1024 * 1024)).toFixed(
                                2
                              )} MB`
                            : `${(selectedFile.size / 1024).toFixed(2)} KB`
                          : "Unknown"}
                      </Text>
                    </View>
                  )}

                  {/* Upload Button */}
                  <TouchableOpacity
                    style={[
                      styles.modalUploadButton,
                      { backgroundColor: "#4CAF50", marginTop: 16 },
                    ]}
                    onPress={async () => {
                      if (!projectName.trim()) {
                        Alert.alert("Lỗi", "Vui lòng nhập tên dự án");
                        return;
                      }
                      if (!currentUser) {
                        Alert.alert("Lỗi", "Bạn chưa đăng nhập!");
                        return;
                      }

                      setUploading(true);
                      try {
                        let imageUrl =
                          "https://cdn-icons-png.flaticon.com/512/906/906343.png";
                        let resourseData: any[] = [];

                        if (selectedImage) {
                          const imgData = await uploadFile(
                            selectedImage,
                            "project_thumbnails",
                            Number(currentUser.id),
                            projectName
                          );
                          imageUrl = imgData.url;
                        }

                        if (selectedFile) {
                          const fileData = await uploadFile(
                            selectedFile,
                            "student_projects",
                            Number(currentUser.id),
                            projectName
                          );
                          resourseData.push(fileData);
                        }

                        const newProject = {
                          userid: Number(currentUser.id),
                          nameprj: projectName,
                          imageprj: imageUrl,
                          resourse: resourseData,
                        };

                        const updatedCourse = await dispatch(
                          addStudentProjectToCourse({
                            courseId: course.id,
                            studentProject: newProject,
                          })
                        ).unwrap();

                        if (!course.project)
                          course.project = {
                            description: "",
                            studentproject: [],
                          };
                        course.project = updatedCourse.project;
                        setStudentProjects(
                          updatedCourse.project.studentproject
                        );

                        setProjectName("");
                        setSelectedImage(null);
                        setSelectedFile(null);
                        setModalVisible(false);
                        Alert.alert("Thành công", "Upload dự án thành công!");
                      } catch (err: any) {
                        Alert.alert("Lỗi", err.message || "Upload thất bại");
                      } finally {
                        setUploading(false);
                      }
                    }}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Ionicons
                          name="checkmark-outline"
                          size={24}
                          color="#fff"
                        />
                        <Text style={styles.modalUploadButtonText}>
                          Upload Project
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedImage(null);
                      setSelectedFile(null);
                    }}
                  >
                    <Text style={{ color: "#00BCD4", fontWeight: "bold" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Project Description */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Project Description
            </Text>
            {course.project?.description ? (
              <>
                <Text
                  style={styles.sectionText}
                  numberOfLines={showFullDescription ? undefined : 3}
                >
                  {course.project.description}
                </Text>
                {course.project.description.length > 150 && (
                  <TouchableOpacity
                    onPress={() => setShowFullDescription(!showFullDescription)}
                  >
                    <Text style={{ color: "#00BCD4", marginTop: 4 }}>
                      {showFullDescription ? "See less" : "See more"}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <Text style={styles.sectionText}>
                No project description available.
              </Text>
            )}

            {/* Resources */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Resources (
              {course.project?.studentproject?.reduce(
                (sum, s) => sum + (s.resourse?.length || 0),
                0
              ) || 0}
              )
            </Text>

            {course.project?.studentproject
              ?.flatMap((s) => s.resourse || [])
              .map((res, idx) => {
                const filename =
                  res.url.split("/").pop()?.split("?")[0] || "Unknown";
                return (
                  <View key={idx} style={styles.resourceRow}>
                    <View style={styles.left}>
                      <View style={styles.fileIcon}>
                        {getFileIconComponent(filename.split(".").pop())}
                      </View>
                      <View>
                        <Text style={styles.fileName} numberOfLines={1}>
                          {filename}
                        </Text>
                        <Text style={styles.fileSize}>{res.size || "--"}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        console.log("Downloading:", res.url);
                      }}
                    >
                      <Ionicons
                        name="download-outline"
                        size={22}
                        color="#00BCD4"
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
          </View>
        )}

        {/* Q&A */}
        {activeTab === "Q&A" && (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Question & Answer</Text>

            {Array.isArray(enrichedQAList) && enrichedQAList.length > 0 ? (
              enrichedQAList.map((item, index) => (
                <View key={item.id || index} style={styles.qaCard}>
                  <View style={styles.qaHeader}>
                    <Image
                      source={{ uri: item.userAvatar }}
                      style={styles.qaAvatar}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.qaUser}>{item.userName}</Text>
                      <Text style={styles.qaDate}>
                        {new Date(item.postdate).toLocaleString("vi-VN", {
                          hour12: false,
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.qaContent}>{item.content}</Text>

                  <View style={styles.qaFooter}>
                    <TouchableOpacity style={styles.qaStat}>
                      <Ionicons
                        name="heart-outline"
                        size={18}
                        color="#ff4081"
                      />
                      <Text style={styles.qaStatText}>{item.like || 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.qaStat}>
                      <Ionicons
                        name="chatbubble-outline"
                        size={18}
                        color="#00BCD4"
                      />
                      <Text style={styles.qaStatText}>
                        {item.commentcount || 0}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.sectionText}>Chưa có câu hỏi nào.</Text>
            )}

            <View style={styles.commentInputWrapper}>
              <Image
                source={{
                  uri:
                    currentUser?.image ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                }}
                style={styles.currentUserAvatar}
              />
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a Q&A..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleAddComment}
                >
                  <Text style={styles.sendButtonText}>Gửi</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: { alignItems: "flex-start", padding: 16 },
  courseImage: { width: "100%", height: 220, borderRadius: 12 },
  courseTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginTop: 12,
  },
  iconRow: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
    gap: 10,
  },
  iconGroup: { flexDirection: "row", alignItems: "center" },
  likeCount: { fontSize: 15, color: "#000", marginLeft: 4 },
  dot: { fontSize: 18, color: "#888", marginHorizontal: 6 },
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
  lessonRowSelected: { borderColor: "#00BCD4", backgroundColor: "#E0F7FA" },
  lessonIndex: { fontSize: 16, fontWeight: "600", color: "#00BCD4", width: 28 },
  lessonTitle: { fontSize: 16, fontWeight: "500", color: "#222" },
  lessonTitleSelected: { color: "#00BCD4" },
  lessonDuration: { fontSize: 13, color: "#666" },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#00BCD4",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadText: { color: "#00BCD4", fontWeight: "bold", marginTop: 8 },
  resourceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  left: { flexDirection: "row", alignItems: "center" },
  fileIcon: { width: 28, height: 28, marginRight: 8 },
  fileName: { fontWeight: "500", color: "#222" },
  fileSize: { color: "#777", fontSize: 13 },
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
  qaContent: { fontSize: 15, color: "#333", lineHeight: 20, marginBottom: 10 },
  qaFooter: { flexDirection: "row", alignItems: "center", gap: 20 },
  qaStat: { flexDirection: "row", alignItems: "center" },
  qaStatText: { fontSize: 14, color: "#555", marginLeft: 6 },
  commentInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  currentUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  commentInput: { flex: 1, fontSize: 14, maxHeight: 80 },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#00BCD4",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00BCD4",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalUploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalCloseButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  previewImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  fileInfoBox: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default LearningScreen;
