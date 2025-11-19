# ExternalLink Component

A cross-platform React component for opening external URLs in a platform-appropriate way.

## Features

- On native (iOS/Android), opens links in an in-app browser using `expo-web-browser`.
- On web, opens links using the default browser behavior.
- Accepts all standard `Pressable` props.

## Props

| Name       | Type                               | Description                                 |
| ---------- | ---------------------------------- | ------------------------------------------- |
| `href`     | `string`                           | The URL to open when the link is pressed.   |
| `children` | `React.ReactNode`                  | Content to display inside the link.         |
| ...rest    | `ComponentProps<typeof Pressable>` | Additional props for the Pressable element. |

## Example

```tsx
<ExternalLink href="https://callstack.github.io/react-native-paper/">
  <Text>React Native Paper Docs</Text>
</ExternalLink>
```
