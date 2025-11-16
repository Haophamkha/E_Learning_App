import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { User, Review } from "../types/type";

interface ReviewCardProps {
  review: Review;
  user?: User;
}

const getDaysAgo = (postDate: string) => {
  const posted = new Date(postDate);
  const now = new Date();
  const diffMs = now.getTime() - posted.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Hôm nay";
  if (diffDays === 1) return "1 ngày trước";
  return `${diffDays} ngày trước`;
};

export const ReviewCard = ({ review, user }: ReviewCardProps) => {
  const daysAgo = getDaysAgo(review.postDate);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              user?.image ||
              "https://cdn-icons-png.flaticon.com/512/147/147144.png",
          }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user?.name || "Unknown User"}</Text>
          <Text style={styles.date}>{daysAgo}</Text>
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <FontAwesome
              key={i}
              name={i < review.vote ? "star" : "star-o"}
              size={16}
              color={i < review.vote ? "#FFD700" : "#E0E0E0"}
            />
          ))}
        </View>
      </View>

      <Text style={styles.content}>{review.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(250, 246, 246, 1)",
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#222",
  },
  date: {
    color: "#777",
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
  },
  content: {
    color: "#333",
    fontSize: 13,
    lineHeight: 18,
  },
});
