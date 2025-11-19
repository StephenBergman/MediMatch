# ErrorFallback Component

This component provides a fallback UI for error boundaries in your Expo/React Native app. It is designed to be cross-platform and uses React Native Paper for consistent styling.

## Usage

Import and use `ErrorFallback` as the fallback component in your error boundary:

```tsx
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary>{/* Your app code */}</ErrorBoundary>;
```

## Features

- Displays a user-friendly error message
- Optionally shows error details for debugging on dev
- Provides a button to reload the app
- Built with React Native Paper components

## Cross-Platform Notes

- The component works on both native (iOS/Android) and web platforms.
- Uses platform-specific logic if needed for error handling or UI.
