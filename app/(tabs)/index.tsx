import { images, offers } from "@/constants";
import React from "react";
import {
  Button,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cn from "clsx";
import CartButton from "@/components/CartButton";
import * as Sentry from "@sentry/react-native";
import useAuthStore from "@/store/auth.store";

export default function App() {
  const {user} = useAuthStore();
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
       
        ListHeaderComponent={() => {
          return (
            <View className="flex-between flex-row w-full my-5">
              <View className="flex-start">
                <Text className="samll-bold text-primary">DELIVER TO</Text>
                <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                  <Image
                    source={images.arrowDown}
                    className="size-3"
                    resizeMode="contain"
                  />
                  <Text className="paragraph-bold text-dark-100">Shimla</Text>
                </TouchableOpacity>
              </View>
              <CartButton />
            </View>
          );
        }}
        data={offers}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;
          return (
            <View>
              <Pressable
                className={cn(
                  "offer-card",
                  isEven ? "flex-row-reverse" : "flex-row",
                )}
                style={{
                  backgroundColor: item.color,
                }}
                android_ripple={{ color: "#fffff22" }}
              >
                {({ pressed }) => (
                  <React.Fragment>
                    <View className="h-full w-1/2">
                      <Image
                        source={item.image}
                        className="size-full"
                        resizeMode="contain"
                      />
                    </View>
                    <View
                      className={cn(
                        "offer-card__info",
                        isEven ? "pl-10" : "pr-10",
                      )}
                    >
                      <Text className="h1-bold text-white leading-tight">
                        {item.title}
                      </Text>
                      <Image
                        source={images.arrowRight}
                        className="size-10"
                        resizeMode="contain"
                        tintColor="#ffffff"
                      />
                    </View>
                  </React.Fragment>
                )}
              </Pressable>
            </View>
          );
        }}
        contentContainerClassName="pb-28 px-5"
      />
    </SafeAreaView>
  );
}
