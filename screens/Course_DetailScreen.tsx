import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/type";
import { ReviewCard } from "../components/ReviewCard";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../auth/store";
import { supabase } from "../auth/supabaseClient";
import { updateUser } from "../auth/authSlice";

type Props = NativeStackScreenProps<RootStackParamList, "Course_Detail">;

const tabs = ["OVERVIEW", "LESSONS", "REVIEW"] as const;

export const Course_DetailScreen = ({ route, navigation }: Props) => {
  const { course, teachers, courses, users = [] } = route.params;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("OVERVIEW");
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const discountPercent = course.discount || 0;
  const finalPrice = discountPercent
    ? Math.round(course.price * (1 - discountPercent / 100))
    : course.price;

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

  const [showAll, setShowAll] = useState(false);
  type FilterType = number | "All";
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filteredReviews =
    activeFilter === "All"
      ? course.reviews || []
      : (course.reviews || []).filter((r) => r.vote === activeFilter);

  // ADD TO CART
  const handleAddToCart = async () => {
    if (!currentUser) {
      alert("Please log in to add this course to your cart.");
      return;
    }

    try {
      let cart = Array.isArray(currentUser.cart) ? [...currentUser.cart] : [];
      const isInCart = cart.includes(course.id);

      if (isInCart) {
        cart = cart.filter((id) => id !== course.id);
      } else {
        cart.push(course.id);
      }

      const { data, error } = await supabase
        .from("users")
        .update({ cart })
        .eq("id", currentUser.id)
        .select()
        .single();

      if (error) {
        alert("Failed to update cart.");
        return;
      }

      dispatch(updateUser(data));

      alert(
        isInCart
          ? `Xóa "${course.name}" khỏi cart.`
          : `Thêm "${course.name}" vào cart thành công.`
      );
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  const isInCart = currentUser?.cart?.includes(course.id);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <Image source={{ uri: course.image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.title}>{course.name}</Text>

          {/* Rating & Lessons */}
          <View style={styles.row}>
            <FontAwesome name="star-o" color="#FFD700" size={16} />
            <Text style={styles.vote}>{course.vote.toFixed(1)}</Text>
            <Text style={styles.voteCount}>({course.votecount})</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.lessonCount}>{course.lessoncount}</Text>
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

          <View style={styles.tabContent}>
            {/* OVERVIEW TAB */}
            {activeTab === "OVERVIEW" && (
              <>
                {teachers &&
                  (() => {
                    const teacher = teachers.find(
                      (t) => t.id === course.teacherid
                    );
                    if (!teacher) return null;
                    return (
                      <View style={styles.teacherContainer}>
                        <Image
                          source={{ uri: teacher.image }}
                          style={styles.teacherImage}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.teacherName}>{teacher.name}</Text>
                          <Text style={styles.teacherJob}>{teacher.job}</Text>
                        </View>
                        <TouchableOpacity style={styles.followButton}>
                          <Text style={styles.followText}>Follow</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })()}

                <Text style={styles.sectionTitle}>Description</Text>
                <Text
                  style={styles.sectionText}
                  numberOfLines={isExpanded ? undefined : 4}
                >
                  {course.description || "No description available."}
                </Text>
                {course.description && course.description.length > 150 && (
                  <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                    <Text style={styles.viewMoreBtn}>
                      {isExpanded ? "View less" : "View more"}
                    </Text>
                  </TouchableOpacity>
                )}

                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                  Benefits
                </Text>
                <View style={styles.benefitContainer}>
                  <View style={styles.benefitItem}>
                    <MaterialIcons
                      name="video-collection"
                      color="#00BCD4"
                      size={20}
                    />
                    <Text style={styles.benefitText}>
                      14 hours on-demand video
                    </Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <MaterialIcons name="public" color="#00BCD4" size={20} />
                    <Text style={styles.benefitText}>Native teacher</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons
                      name="document-text-outline"
                      color="#00BCD4"
                      size={20}
                    />
                    <Text style={styles.benefitText}>100% free document</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons name="time-outline" color="#00BCD4" size={20} />
                    <Text style={styles.benefitText}>Full lifetime access</Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <MaterialIcons
                      name="military-tech"
                      color="#00BCD4"
                      size={20}
                    />
                    <Text style={styles.benefitText}>
                      Certificate of complete
                    </Text>
                  </View>
                  <View style={styles.benefitItem}>
                    <Ionicons
                      name="checkmark-done-outline"
                      color="#00BCD4"
                      size={20}
                    />
                    <Text style={styles.benefitText}>24/7 support</Text>
                  </View>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                  Similar courses
                </Text>

                {courses &&
                  courses
                    .filter(
                      (item) =>
                        item.category === course.category &&
                        item.id !== course.id
                    )
                    .slice(0, 3)
                    .map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() =>
                          navigation.navigate("Course_Detail", {
                            course: item,
                            teachers,
                          })
                        }
                      >
                        {/* Dùng TouchableOpacity để bọc InspiresCourse nếu cần */}
                        <Text>{item.name}</Text>
                      </TouchableOpacity>
                    ))}
              </>
            )}

            {/* LESSONS TAB */}
            {activeTab === "LESSONS" && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {course.chapters?.map((chapter, chapterIndex) => {
                  const roman = romanNumerals[chapterIndex] || chapterIndex + 1;
                  const expanded = expandedChapters[chapter.order] ?? true;

                  return (
                    <View key={chapter.order} style={{ marginBottom: 10 }}>
                      <TouchableOpacity
                        onPress={() => toggleChapter(chapter.order)}
                        style={styles.chapterHeader}
                      >
                        <Text style={styles.chapterTitle}>
                          {`${roman} - ${chapter.title}`}
                        </Text>
                        {expanded ? (
                          <MaterialIcons
                            name="keyboard-arrow-up"
                            size={22}
                            color="#666"
                          />
                        ) : (
                          <MaterialIcons
                            name="keyboard-arrow-down"
                            size={22}
                            color="#666"
                          />
                        )}
                      </TouchableOpacity>

                      {expanded &&
                        chapter.lessons.map((lesson, index) => {
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
                                <Text style={styles.lessonDuration}>
                                  {lesson.duration}
                                </Text>
                              </View>

                              {/* {lesson.status === "completed" && (
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
                              )} */}
                            </TouchableOpacity>
                          );
                        })}
                    </View>
                  );
                })}
              </ScrollView>
            )}

            {/* REVIEW TAB */}
            {activeTab === "REVIEW" && (
              <>
                <View style={styles.reviewHeader}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome name="star-o" color="#FFD700" size={20} />
                    <Text style={styles.reviewScore}>
                      {course.vote.toFixed(1)}/5
                    </Text>
                    <Text style={styles.reviewCount}>
                      ({course.votecount}+ reviews)
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                    <Text style={styles.viewAllBtn}>
                      {showAll ? "View less" : "View all"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.filterRow}>
                  {(["All", 5, 4, 3, 2, 1] as const).map((star) => (
                    <TouchableOpacity
                      key={star.toString()}
                      style={[
                        styles.filterBtn,
                        activeFilter === star && styles.filterBtnActive,
                      ]}
                      onPress={() => setActiveFilter(star)}
                    >
                      <View style={styles.starWithNumber}>
                        <Text
                          style={[
                            styles.filterText,
                            activeFilter === star && styles.filterTextActive,
                          ]}
                        >
                          {star}
                        </Text>
                        <FontAwesome
                          name="star-o"
                          size={14}
                          color={activeFilter === star ? "#fff" : "#00BCD4"}
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                <ScrollView
                  style={{ marginTop: 10 }}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  {filteredReviews.length === 0 ? (
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#888",
                        marginTop: 10,
                      }}
                    >
                      No reviews yet.
                    </Text>
                  ) : (
                    filteredReviews
                      .slice(0, showAll ? 5 : 3)
                      .map((rev, idx) => {
                        const user = users.find(
                          (u) => String(u.id) === String(rev.userId)
                        );
                        return (
                          <ReviewCard key={idx} review={rev} user={user} />
                        );
                      })
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
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

        {(() => {
          const isPurchased =
            currentUser?.purchasecourse &&
            Object.prototype.hasOwnProperty.call(
              currentUser.purchasecourse,
              course.id
            );

          return (
            <TouchableOpacity
              style={[
                styles.cartButton,
                isPurchased
                  ? { backgroundColor: "#9E9E9E" }
                  : isInCart
                  ? { backgroundColor: "#f44336" }
                  : { backgroundColor: "#00BCD4" },
              ]}
              activeOpacity={isPurchased ? 1 : 0.8}
              onPress={!isPurchased ? handleAddToCart : undefined}
              disabled={isPurchased}
            >
              {isPurchased ? (
                <Ionicons
                  name="checkmark-circle-outline"
                  color="white"
                  size={20}
                />
              ) : (
                <Ionicons name="cart-outline" color="white" size={20} />
              )}
              <Text style={styles.cartText}>
                {isPurchased
                  ? "Đã mua"
                  : isInCart
                  ? "Xóa khỏi giỏ hàng"
                  : "Thêm vào giỏ hàng"}
              </Text>
            </TouchableOpacity>
          );
        })()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 230, resizeMode: "cover" },
  content: { padding: 16 },
  title: { fontSize: 25, fontWeight: "bold", color: "#222" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 4 },
  vote: { fontSize: 18, fontWeight: "bold", color: "#333" },
  voteCount: { fontSize: 18, color: "#888" },
  dot: { fontSize: 18, color: "#aaa" },
  lessonCount: { fontSize: 18, fontWeight: "bold", color: "#333" },
  lessonText: { fontSize: 18, color: "#888" },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginTop: 20,
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabItemActive: { borderBottomWidth: 3, borderBottomColor: "#00BCD4" },
  tabText: { fontSize: 16, color: "#666" },
  tabTextActive: { color: "#00BCD4", fontWeight: "bold" },
  tabContent: { marginTop: 20, paddingBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
  },
  sectionText: { fontSize: 15, color: "#444", marginTop: 6, lineHeight: 22 },
  viewMoreBtn: {
    color: "#00BCD4",
    marginTop: 4,
    fontWeight: "500",
    fontSize: 15,
  },
  chapterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    marginTop: 10,
  },
  chapterTitle: { fontSize: 17, fontWeight: "bold", color: "#222" },
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  lessonRowSelected: { backgroundColor: "#E3F2FD", borderColor: "#00BCD4" },
  lessonIndex: { fontSize: 15, fontWeight: "600", color: "#888", width: 30 },
  lessonTitle: { fontSize: 15, color: "#333", fontWeight: "500" },
  lessonTitleSelected: { color: "#00BCD4" },
  lessonDuration: { fontSize: 13, color: "#888" },
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
  priceContainer: { flexDirection: "column" },
  price: { fontSize: 20, fontWeight: "bold", color: "#222" },
  discountText: { fontSize: 13, color: "#888" },
  originalPrice: { textDecorationLine: "line-through" },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 6,
  },
  cartText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  teacherContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  teacherImage: {
    width: 45,
    height: 45,
    borderRadius: 30,
    marginRight: 10,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  teacherJob: {
    fontSize: 14,
    color: "#777",
  },
  followButton: {
    backgroundColor: "#E0F7FA",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 6,
  },
  followText: {
    color: "#00BCD4",
    fontWeight: "500",
    fontSize: 14,
  },
  benefitContainer: {
    marginTop: 8,
    gap: 10,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  benefitText: {
    fontSize: 15,
    color: "#333",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewScore: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  reviewCount: { fontSize: 14, color: "#777" },
  viewAllBtn: { color: "#00BCD4", fontWeight: "600", fontSize: 14 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  filterBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#00BCD4",
  },
  filterBtnActive: {
    backgroundColor: "#00BCD4",
    borderColor: "#00BCD4",
  },
  starWithNumber: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00BCD4",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});
