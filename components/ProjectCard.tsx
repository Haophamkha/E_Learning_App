import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { User, StudentProject } from "../types/type";

interface ProjectCardProps {
  project: StudentProject;
  user?: User;
  onPress?: () => void;
}

export const ProjectCard = ({ project, user, onPress }: ProjectCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: project.imageprj }} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {project.nameprj}
        </Text>
        <Text style={styles.username}>{user?.name || "Unknown"}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  info: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  username: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
});

export default ProjectCard;
