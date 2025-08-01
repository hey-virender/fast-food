import { View, Text, Button, Alert } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { signIn } from "@/lib/appwrite";
import * as Sentry from "@sentry/react-native";

const SignIn =() => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit =  async() => {
    const {email, password} = form;
    if(email === "" || password === ""){
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
  try {
    const session = await signIn({email, password});
    Alert.alert("Success", "User signed in successfully");
    router.reload();
  } catch (error:any) {
    Alert.alert("Error", "Something went wrong");
    Sentry.captureEvent(error);
    
  }finally{
    setIsSubmitting(false);
  }
  }

  return (
    <View className="gap-10 bg-white reounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        label="Email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({...prev, email: text}))}
        keyboardType="email-address"
        secureTextEntry={false}
      />
      <CustomInput
        placeholder="Enter your password"
        label="Password"
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({...prev, password: text}))}
        keyboardType="default"
        secureTextEntry={true}
      />
      <CustomButton title="Sign In" onPress={handleSubmit} isLoading={isSubmitting} />
      <View className="flex-center flex-row gap-2 mt-5">
        <Text className="base-regular text-gray-500">
          Don't have an account?{" "}
        </Text>
        <Link href={"/sign-up"} className="base-semibold text-primary">
          Sign Up
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
