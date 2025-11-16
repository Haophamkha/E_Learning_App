import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { store, AppDispatch } from "./auth/store";
import Icon from "react-native-vector-icons/Ionicons";


import { HomeScreen } from "./screens/HomeScreen";
import { MyCourseScreen } from "./screens/MyCourseScreen";
import { Course_SearchingScreen } from "./screens/Course_SearchingScreen";
import { UserProfileScreen } from "./screens/UserProfileScreen";
import { Course_DetailScreen } from "./screens/Course_DetailScreen";
import { Course_ListingScreen } from "./screens/Course_ListingScreen";
import { LearningScreen } from "./screens/LearningScreen";
import { TeacherProfileScreen } from "./screens/TeacherProfileScreen";
import { CartScreen } from "./screens/CartScreen";

import { RootStackParamList, RootTabParamList } from "./types/type";
import { fetchAppData } from "./auth/dataSlice";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// 🧭 Tạo 4 tab
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home")
            return <Icon name="home-outline" size={size} color={color} />;
          if (route.name === "MyCourse")
            return <Icon name="book-outline" size={size} color={color} />;
          if (route.name === "Course_Searching")
            return <Icon name="search-outline" size={size} color={color} />;
          if (route.name === "UserProfile")
            return <Icon name="person-outline" size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyCourse" component={MyCourseScreen} />
      <Tab.Screen name="Course_Searching" component={Course_SearchingScreen} />
      <Tab.Screen name="UserProfile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
}

// ⚙️ Component khởi tạo data chung
const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAppData());
  }, [dispatch]);

  return <>{children}</>;
};

// 🌍 App chính
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppInitializer>
            <Stack.Navigator>
              <Stack.Screen
                name="MainTabs"
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Course_Detail"
                component={Course_DetailScreen}
                options={{ title: "Chi tiết khóa học" }}
              />
              <Stack.Screen
                name="Course_Listing"
                component={Course_ListingScreen}
                options={{ title: "Danh sách khóa học" }}
              />
              <Stack.Screen
                name="Learning"
                component={LearningScreen}
                options={{ title: "Học tập" }}
              />
              <Stack.Screen
                name="TeacherProfile"
                component={TeacherProfileScreen}
                options={{ title: "Hồ sơ giảng viên" }}
              />
              <Stack.Screen
                name="Cart"
                component={CartScreen}
                options={{ title: "Giỏ hàng" }}
              />
              
            </Stack.Navigator>
          </AppInitializer>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
