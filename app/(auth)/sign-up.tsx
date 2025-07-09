import { View, Text, Button, Alert } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { createUser } from "@/lib/appwrite";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async () => {
    const { email, password, name } = form;
    if (email === "" || password === "" || name === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await createUser({ name, email, password });
      Alert.alert("Success", "User signed up successfully");
      router.replace("/");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white reounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your name"
        label="Name"
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        keyboardType="default"
        secureTextEntry={false}
      />
      <CustomInput
        placeholder="Enter your email"
        label="Email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        keyboardType="email-address"
        secureTextEntry={false}
      />
      <CustomInput
        placeholder="Enter your password"
        label="Password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        keyboardType="default"
        secureTextEntry={true}
      />
      <CustomButton
        title="Sign Up"
        onPress={handleSubmit}
        isLoading={isSubmitting}
      />
      <View className="flex-center flex-row gap-2 mt-5">
        <Text className="base-regular text-gray-500">
          Already have an account?
        </Text>
        <Link href={"/sign-in"} className="base-semibold text-primary">
          Sign In
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
