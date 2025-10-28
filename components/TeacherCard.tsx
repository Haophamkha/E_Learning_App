import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FaRegStar } from "react-icons/fa";

import { Teacher } from "../types/type";

export const TeacherCard = ({
  teacher,
  onPress,
}: {
  teacher: Teacher;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Avatar */}
      <Image source={{ uri: teacher.image }} style={styles.avatar} />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {teacher.name}
        </Text>
        <Text style={styles.school} numberOfLines={1} ellipsizeMode="tail">
          {teacher.school}
        </Text>

        {teacher.vote !== undefined && (
          <View style={styles.voteRow}>
            <FaRegStar color="#FFD700" />
            <Text style={styles.voteText}>
              {teacher.vote.toFixed(1)} ({teacher.voteCount || 0})
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginBottom: 12,
  },
  info: {
    alignItems: "flex-start",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  school: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
  voteRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  voteText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 6,
  },
});
