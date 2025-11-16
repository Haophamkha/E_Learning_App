import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SectionBlock } from "../components/SectionBlock";
import { CourseCard } from "../components/CourseCard";
import { RootStackParamList } from "../types/type";
import { useSelector } from "react-redux";
import { RootState } from "../auth/store";

type Props = NativeStackScreenProps<RootStackParamList, "TeacherProfile">;

const tabs = ["OVERVIEW", "COURSES", "REVIEW"] as const;

export const TeacherProfileScreen = ({ route }: Props) => {
  const { teacher } = route.params;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("OVERVIEW");

  const allCourses = useSelector((state: RootState) => state.data.courses);

  const teacherCourses = allCourses.filter(
    (course) => course.teacherid === teacher.id
  );

  return (
    <View style={styles.container}>
      {/* Header Background */}
      <View style={styles.headerBackground}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60",
          }}
          style={styles.headerImage}
          blurRadius={8}
        />
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: teacher.image }} style={styles.avatar} />
      </View>

      {/* Teacher Info */}
      <View style={styles.infoContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.teacherName}>{teacher.name}</Text>
          <View style={[styles.labelTeacher, { marginLeft: 8 }]}>
            <Text style={styles.labelTeacherText}>Teacher</Text>
          </View>
        </View>
        <Text style={styles.jobText}>{teacher.job}</Text>
        <Text style={styles.locationText}>
          {teacher.location} - {teacher.timework}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
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

      {/* Tab Content */}
      <View style={{ flex: 1 }}>
        {activeTab === "OVERVIEW" && (
          <ScrollView style={{ paddingHorizontal: 16 }}>
            <Text style={styles.sectionTitle}>School</Text>
            <Text style={styles.sectionContent}>{teacher.school}</Text>
          </ScrollView>
        )}

        {activeTab === "COURSES" && (
          <ScrollView style={{ paddingHorizontal: 16 }}>
            {teacherCourses.length === 0 ? (
              <Text style={styles.noDataText}>
                No courses found for this teacher.
              </Text>
            ) : (
              <>
                <SectionBlock title="UI/UX Design Courses">
                  {teacherCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      teachers={[teacher]}
                    />
                  ))}
                </SectionBlock>

                <SectionBlock title="Graphic Design Courses">
                  {teacherCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      teachers={[teacher]}
                    />
                  ))}
                </SectionBlock>
              </>
            )}
          </ScrollView>
        )}

        {activeTab === "REVIEW" && (
          <ScrollView style={{ paddingHorizontal: 16 }}>
            <Text style={styles.noDataText}>
              Reviews will be displayed here.
            </Text>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerBackground: { height: 180 },
  headerImage: { width: "100%", height: "100%" },
  avatarWrapper: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  infoContainer: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  teacherName: { fontSize: 26, fontWeight: "bold" },
  labelTeacher: {
    backgroundColor: "#00BCD4",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  labelTeacherText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  jobText: { fontSize: 18, color: "#333", marginVertical: 2 },
  locationText: { fontSize: 16, color: "#666" },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 20,
  },
  tabItem: { flex: 1, paddingVertical: 16, alignItems: "center" },
  tabItemActive: { borderBottomWidth: 3, borderBottomColor: "#00BCD4" },
  tabText: { fontSize: 18, color: "#666", fontWeight: "500" },
  tabTextActive: { fontWeight: "bold", color: "#00BCD4" },
  sectionTitle: { fontWeight: "bold", fontSize: 20, marginTop: 12 },
  sectionContent: { fontSize: 16, color: "#444", marginTop: 4 },
  noDataText: { textAlign: "center", marginVertical: 20, color: "#888" },
});

export default TeacherProfileScreen;
