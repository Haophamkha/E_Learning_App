import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Course } from "../types/type";
import { useMemo } from "react";
type Props = {
  course: Course & {
    time_watched?: number;
  };
  onPress?: () => void;
};

export const MyCourseCard = ({ course, onPress }: Props) => {
  const watched = course.time_watched ?? 0;

  // Chuyển giờ h sang phút
  const parseDuration = (duration: string | number): number => {
    if (!duration) return 0;

    if (typeof duration === "number") return duration;

    const hourMatch = duration.match(/(\d+)\s*h/);
    const minuteMatch = duration.match(/(\d+)\s*m/);

    const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;

    return hours * 60 + minutes;
  };

  // Chuyển phút sang chuỗi kiểu "3 hrs 25 mins"
  const formatDuration = (totalMinutes: number) => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs > 0 ? hrs + " hrs " : ""}${
      mins > 0 ? mins + " mins" : ""
    }`.trim();
  };

const totalDuration = useMemo(
  () => parseDuration(course.duration || ""),
  [course.duration]
);

const progress = useMemo(
  () =>
    totalDuration
      ? Math.min(100, Math.round((watched / totalDuration) * 100))
      : 0,
  [watched, totalDuration]
);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {course.image && (
        <Image source={{ uri: course.image }} style={styles.image} />
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {course.name}
        </Text>
        <Text style={styles.duration}>
          {totalDuration > 0 ? formatDuration(totalDuration) : "N/A"}
        </Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <Text style={styles.complete}>{progress}% Complete</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 100, 
    height: 100,
    borderRadius: 12,
    resizeMode: "cover",
    backgroundColor: "#f5f5f5",
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 20, 
    fontWeight: "bold",
    color: "#333",
  },
  duration: {
    fontSize: 15, 
    color: "#666",
    marginTop: 2,
  },
  complete: {
    fontSize: 15, 
    color: "#00BCD4",
    marginTop: 6,
    fontWeight: "600",
  },
  progressContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#D7F6FF",
    borderRadius: 4,
    marginTop: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#00BCD4",
    borderRadius: 4,
  },
});

