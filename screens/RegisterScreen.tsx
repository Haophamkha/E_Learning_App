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

type RegisterScreenNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "RegisterScreen"
>;

export const RegisterScreen = ({
  navigation,
}: {
  navigation: RegisterScreenNavProp;
}) => {

  const [fullname, setFullname] = useState("");
  const [job, setJob] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hidePw, setHidePw] = useState(true);

  const handleRegister = () => {
    console.log("Register:", { fullname, job, username, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subText}>Join us and start learning</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={fullname}
        onChangeText={setFullname}
      />

      <TextInput
        style={styles.input}
        placeholder="Job (Student, Designer...)"
        placeholderTextColor="#aaa"
        value={job}
        onChangeText={setJob}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

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

      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>REGISTER</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 14 }}
        onPress={() => navigation.navigate("LoginScreen")}
      >
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkBold}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
    width: "100%",
    height: 50,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  passwordContainer: {
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
export default RegisterScreen;