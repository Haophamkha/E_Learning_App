import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface SectionBlockProps {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SectionBlock = ({ title, children, style }: SectionBlockProps) => {
  const [expanded, setExpanded] = useState(false);

  const childrenArray = React.Children.toArray(children);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.section, style]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={handleToggle}>
          <Text style={styles.viewMore}>
            {expanded ? "View less" : "View more"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {!expanded ? (
        //Scroll 1-1
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalContainer}
        >
          {childrenArray}
        </ScrollView>
      ) : (
        // Scroll sau khi viewmore
        <ScrollView
          style={styles.verticalScroll}
          nestedScrollEnabled
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.gridContainer}>{childrenArray}</View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  viewMore: {
    fontSize: 13,
    color: "#00BCD4",
  },
  horizontalContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    columnGap: 12,
  },
  verticalScroll: {
    maxHeight: 700, 
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    columnGap: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});
