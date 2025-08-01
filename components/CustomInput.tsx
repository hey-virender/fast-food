import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { CustomInputProps } from "@/type";
import cn from "clsx";



const CustomInput = ({ placeholder = "Enter text", value, onChangeText,label,secureTextEntry=false,keyboardType="default" }:CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View className="w-full">
      <Text>{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor='#888'
        className={cn('input',isFocused ? 'border-primary' : 'border-gray-300')}
        
      />
    </View>
  );
};

export default CustomInput;
