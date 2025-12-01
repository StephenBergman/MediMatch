# ScreenView Component

A flexible, reusable wrapper for your app screens, providing safe area handling, optional padding, centering, responsive width, and scroll support.  
Styled with React Native Paper + NativeWind utilities.

## Features

- Optionally adds horizontal and top padding (`padded` prop)
- Optionally centers content vertically and horizontally (`centered` prop)
- Responsive width for web and large screens (`responsive` prop)
- Scrollable by default (uses `ScrollView`)
- Full width by default
- Accepts custom styles via `className`

## Usage

```tsx
import ScreenView from "components/ScreenView";

export default function MyScreen() {
  return (
    <ScreenView padded centered responsive>
      <Text>Hello, world!</Text>
    </ScreenView>
  );
}
```

## Props

| Prop       | Type      | Default | Description                                      |
| ---------- | --------- | ------- | ------------------------------------------------ |
| children   | ReactNode | —       | Content to render inside the screen              |
| padded     | boolean   | false   | Adds padding to the screen edges                 |
| centered   | boolean   | false   | Vertically and horizontally centers the content  |
| responsive | boolean   | true    | Enables responsive design for the screen content |
| className  | string    | ""      | Additional custom styles for the container       |

## Notes

- The `ScrollView` ensures content is scrollable on smaller screens.
- Combine `padded` and `centered` for most common layouts.
- The `responsive` prop centers content and sets a max width on web and large screens.
- The `centered` prop should be used sparingly. It is best for single-message or loading screens, and may not be suitable for lists, forms, or complex layouts.

**Cross-platform:**  
ScreenView is compatible with iOS, Android, and Web. All UI is built with Expo primitives so it plays nicely with React Native Paper components.
