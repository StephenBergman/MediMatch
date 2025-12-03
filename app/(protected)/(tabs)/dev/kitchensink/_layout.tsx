import { Redirect, Stack } from "expo-router";
import React from "react";

const _layout = () => {
  if (process.env.NODE_ENV !== "development") {
    return <Redirect href="/" />;
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="kitchensink" options={{ headerShown: false }} />
      <Stack.Screen name="errortesting" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _layout;
