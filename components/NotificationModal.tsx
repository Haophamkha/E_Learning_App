import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { IoDocumentTextOutline } from "react-icons/io5";

interface Notification {
  id: number;
  message: string;
  time: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export const NotificationModal = ({
  visible,
  onClose,
  notifications,
}: Props) => {
  if (!visible) return null;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onClose}
      style={styles.wrapper}
    >
      <View style={styles.popup}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.header}>Thông báo</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Thông báo List */}
        <ScrollView style={styles.scroll}>
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <View key={item.id} style={styles.item}>
                <View style={styles.row}>
                  <IoDocumentTextOutline size={18} color="#d84315" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.text}>{item.message}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>Không có thông báo mới</Text>
          )}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 55, 
    right: 10,
    zIndex: 100,
  },
  popup: {
    width: 300,
    maxHeight: 350,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  header: {
    fontSize: 16,
    fontWeight: "700",
    color: "#d84315",
  },
  closeIcon: {
    fontSize: 18,
    color: "#888",
  },
  scroll: {
    maxHeight: 300,
    paddingHorizontal: 14,
  },
  item: {
    borderBottomWidth: 0.6,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  time: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  empty: {
    textAlign: "center",
    color: "#999",
    fontSize: 13,
    marginVertical: 20,
  },
});
