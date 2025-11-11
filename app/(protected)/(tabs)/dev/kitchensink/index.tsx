import { Pressable } from "@/components/ui/pressable";

import ScreenView from "@/components/Tools/ScreenView";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { router } from "expo-router";
import React from "react";
const index = () => {
  return (
    <ScreenView padded>
      <HStack className="mb-4 w-full" space="md">
        <Pressable
          className="w-1/3 bg-primary-500"
          onPress={() => {
            router.push("/dev/kitchensink/kitchensink");
          }}
        >
          <Image
            alt="kitchen sink"
            size="none"
            className="aspect-[4/3] w-full"
            source={{
              uri: "https://images.saymedia-content.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:eco%2Cw_1200/MTc2Mjk0OTM2ODczMjgwNjg1/turn-of-the-century-farmer-sinks.jpg",
            }}
          />
        </Pressable>
        <Pressable
          className="w-1/3 bg-primary-500"
          onPress={() => {
            router.push("/dev/errortesting");
          }}
        >
          <Image
            alt="error testing"
            size="none"
            className="aspect-[4/3] w-full"
            source={{
              uri: "https://virtualbackgrounds.site/wp-content/uploads/2020/08/blue-screen-of-death-in-windows-xp-1536x864.jpg",
            }}
          />
        </Pressable>
      </HStack>
    </ScreenView>
  );
};
export default index;
