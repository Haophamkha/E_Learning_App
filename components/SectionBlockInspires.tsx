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
  itemHeight?: number; 
}

export const SectionBlockInspires = ({
  title,
  children,
  style,
  itemHeight = 100,
}: SectionBlockProps) => {
  const [expanded, setExpanded] = useState(false);

  const childrenArray = React.Children.toArray(children);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const defaultRows = 3;
  const expandedRows = 5;

  // Giới hạn chiều cao ScrollView
  const scrollHeight = itemHeight * expandedRows + (expandedRows - 1) * 16 + 8; 

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
        <View style={styles.defaultContainer}>
          {childrenArray.slice(0, defaultRows).map((child, index) => (
            <View key={index} style={[styles.item, { height: itemHeight }]}>
              {child}
            </View>
          ))}
        </View>
      ) : (
        <ScrollView
          style={{ maxHeight: scrollHeight }}
          nestedScrollEnabled
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.expandedContainer}>
            {childrenArray.map((child, index) => (
              <View key={index} style={[styles.item, { height: itemHeight }]}>
                {child}
              </View>
            ))}
          </View>
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
  defaultContainer: {
    flexDirection: "column",
    rowGap: 16,
    paddingHorizontal: 16,
  },
  expandedContainer: {
    flexDirection: "column",
    rowGap: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  item: {
    width: "100%",
  },
});
