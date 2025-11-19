import React, { ReactNode } from "react";
import { Platform, ScrollView } from "react-native";

/**
 * Props for the ScreenView component.
 * @property children - Content to render inside the screen.
 * @property padded - Adds padding to the screen edges (horizontal and top).
 * @property centered - Vertically and horizontally centers the content.
 * @property responsive - Enables responsive design for the screen content.
 * @property className - Additional custom styles for the container (optional).
 */
interface ScreenViewProps {
  /** Content to render inside the screen */
  children?: ReactNode;
  /** Adds padding to the screen edges (horizontal and top) */
  padded?: boolean;
  /** Vertically and horizontally centers the content */
  centered?: boolean;
  /** Enables responsive design for the screen content */
  responsive?: boolean;
  /** Additional custom styles for the container (optional). */
  className?: string;
}

/**
 * A cross-platform, flexible wrapper for app screens. Uses Expo/React Native primitives
 * so it plays nicely with React Native Paper components.
 *
 * @param {ScreenViewProps} props - Props for ScreenView.
 * @param {React.ReactNode} [props.children] - Content to render inside the screen.
 * @param {boolean} [props.padded=false] - Adds padding to the screen edges (horizontal and top).
 * @param {boolean} [props.centered=false] - Vertically and horizontally centers the content. Use sparingly for layouts like lists or forms.
 * @param {boolean} [props.responsive=true] - Enables responsive design for the screen content.
 * @param {string} [props.className] - Additional custom styles for the container.
 * @returns {JSX.Element} The wrapped screen content, safe-area aware and scrollable.
 */
const ScreenView: React.FC<ScreenViewProps> = ({
  children,
  padded = false,
  centered = false,
  responsive = true,
  className = "",
}) => {
  const paddingValue = padded ? 16 : 0;

  return (
    <ScrollView
      className={`bg-background-0 ${className}`}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={[
        {
          flexGrow: 1,
          width: "auto",
          flexDirection: "column",
          justifyContent: centered ? "center" : "flex-start",
          alignItems: "flex-start",
          paddingHorizontal: paddingValue,
          paddingTop: paddingValue,
          paddingBottom:
            Platform.OS === "ios" ? 40 : Platform.OS === "android" ? 0 : 16, // Prevents content from being covered by tab bar
        },
        centered ? { alignItems: "center" } : {},
        responsive
          ? {
              maxWidth: 900,
              width: "100%",
              // alignSelf: 'center', // This might work instead?
              alignSelf: Platform.OS === "web" ? "center" : "stretch",
            }
          : {},
      ]}
    >
      {children}
    </ScrollView>
  );
};

export default ScreenView;
