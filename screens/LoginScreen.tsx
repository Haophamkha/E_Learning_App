import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/type";

type LoginScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

export const LoginScreen = ({
  navigation,
}: {
  navigation: LoginScreenNavProp;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hidePw, setHidePw] = useState(true);

  const handleLogin = () => {
    // TODO: Kết nối API hoặc AuthContext trong tương lai
    console.log("Login with:", { username, password });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subText}>Login to continue learning</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password Input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          secureTextEntry={hidePw}
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setHidePw(!hidePw)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={hidePw ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      {/*  Login Button  */}
      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>LOGIN</Text>
      </TouchableOpacity>

      {/*  Register Link  */}
      <TouchableOpacity
        style={{ marginTop: 14 }}
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        <Text style={styles.linkText}>
          Don’t have an account?{" "}
          <Text style={styles.linkBold}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subText: {
    color: "#555",
    marginBottom: 20,
  },

  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },

  passwordContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    marginBottom: 14,
  },

  inputPassword: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },

  btn: {
    backgroundColor: "#00BCD4",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "90%",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  linkText: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
  },
  linkBold: {
    color: "#00BCD4",
    fontWeight: "bold",
  },
});

export default LoginScreen;
