import ErrorTesting from "components/_testing/error-testing";
import ScreenView from "components/Tools/ScreenView";
import React from "react";

export default function DevScreen() {
  return (
    <ScreenView padded>
      <ErrorTesting />
    </ScreenView>
  );
}
