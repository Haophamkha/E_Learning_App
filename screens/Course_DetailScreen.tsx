import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/type";
import { FaRegStar } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
type Props = NativeStackScreenProps<RootStackParamList, "Course_Detail">;

const tabs = ["OVERVIEW", "LESSONS", "REVIEW"] as const;

export const Course_DetailScreen = ({ route }: Props) => {
  const { course } = route.params;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("OVERVIEW");

  //Tính giá sau giảm
  const discountPercent = course.discount || 0;
  const finalPrice = discountPercent
    ? Math.round(course.price * (1 - discountPercent / 100))
    : course.price;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <Image source={{ uri: course.image }} style={styles.image} />

        {/*TT Course*/}
        <View style={styles.content}>
          <Text style={styles.title}>{course.name}</Text>

          <View style={styles.row}>
            <FaRegStar color="#FFD700" />
            <Text style={styles.vote}>{course.vote.toFixed(1)}</Text>
            <Text style={styles.voteCount}>({course.voteCount})</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.lessonCount}>{course.lessonCount}</Text>
            <Text style={styles.lessonText}> lessons</Text>
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

          {/* tab */}
          <View style={styles.tabContent}>
            {activeTab === "OVERVIEW" && (
              <>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.sectionText}>
                  {course.description || "No description available."}
                </Text>
              </>
            )}

            {activeTab === "LESSONS" && (
              <>
                <Text style={styles.sectionTitle}>Lessons</Text>
                <Text style={styles.sectionText}>
                  {course.lessonCount} lessons will be shown here.
                </Text>
              </>
            )}

            {activeTab === "REVIEW" && (
              <>
                <Text style={styles.sectionTitle}>Reviews</Text>
                <Text style={styles.sectionText}>
                  Reviews will be displayed here.
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* AddToCart Btn*/}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${finalPrice}</Text>
          {discountPercent > 0 && (
            <Text style={styles.discountText}>
              {discountPercent}% Disc.{" "}
              <Text style={styles.originalPrice}>${course.price}</Text>
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          activeOpacity={0.8}
          onPress={() => console.log(`Added course "${course.name}" to cart`)}
        >
          <CiShoppingCart color="white" />
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 230, resizeMode: "cover" },
  content: { padding: 16 },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#222",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  vote: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 4,
  },
  voteCount: {
    fontSize: 18,
    color: "#888",
    marginLeft: 2,
  },
  dot: {
    fontSize: 18,
    color: "#aaa",
    marginHorizontal: 6,
  },
  lessonCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  lessonText: {
    fontSize: 18,
    color: "#888",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 20,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  tabItemActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#00BCD4",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  tabTextActive: {
    color: "#00BCD4",
    fontWeight: "bold",
  },
  tabContent: {
    marginTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 15,
    color: "#555",
  },

  // 🔹 Phần Add to Cart dưới cùng
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  priceContainer: {
    flexDirection: "column",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  discountText: {
    fontSize: 13,
    color: "#888",
  },
  originalPrice: {
    textDecorationLine: "line-through",
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00BCD4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cartText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 6,
  },
});
