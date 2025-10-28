import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const categories = [
  { id: 1, name: "Business", color: "#00BCD4", icon: "trending-up-outline" },
  { id: 2, name: "Design", color: "#7E57C2", icon: "color-palette-outline" },
  { id: 3, name: "Code", color: "#EF5350", icon: "code-slash-outline" },
  { id: 4, name: "Writing", color: "#42A5F5", icon: "create-outline" },
  { id: 5, name: "Movie", color: "#8E24AA", icon: "videocam-outline" },
  { id: 6, name: "Language", color: "#FB8C00", icon: "language-outline" },
];

export const CategoryGrid = () => {
  return (
    <View style={styles.grid}>
      {categories.map((cat) => (
        <TouchableOpacity key={cat.id} style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: cat.color }]}>
            <Ionicons name={cat.icon} size={20} color="#fff" />
          </View>
          <Text style={styles.text}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    elevation: 2,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
