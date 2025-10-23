import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { HomeScreen } from "./screens/HomeScreen";  
import { UserProfileScreen } from "./screens/UserProfileScreen";
import { TeacherProfileScreen } from "./screens/TeacherProfileScreen";
import { MyCourseScreen } from "./screens/MyCourseScreen";
import { LearningScreen } from "./screens/LearningScreen";
import { Course_SearchingScreen } from "./screens/Course_SearchingScreen";
import { Course_ListingScreen } from "./screens/Course_ListingScreen";
import { Course_DetailScreen } from "./screens/Course_DetailScreen";

export type RootStackParamList = {
  Home: undefined;
  UserProfile: undefined;
  TeacherProfile: undefined;
  MyCourse: undefined;
  Learning: undefined;
  Course_Searching: undefined;
  Course_Listing: undefined;
  Course_Detail: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen
            name="TeacherProfile"
            component={TeacherProfileScreen}
          />
          <Stack.Screen name="MyCourse" component={MyCourseScreen} />
          <Stack.Screen name="Learning" component={LearningScreen} />
          <Stack.Screen
            name="Course_Searching"
            component={Course_SearchingScreen}
          />
          <Stack.Screen
            name="Course_Listing"
            component={Course_ListingScreen}
          />
          <Stack.Screen name="Course_Detail" component={Course_DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
