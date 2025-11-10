# Tools

This folder contains shared utility components that enhance the MediMatch development experience. These tools are designed for cross-platform compatibility and follow Expo/React Native best practices.

## Our Tools

### ExternalLink

- **Purpose:** Opens external URLs in a platform-appropriate way.
- **How it works:**
  - On native (iOS/Android), opens links in an in-app browser using `expo-web-browser`.
  - On web, opens links in a new browser tab.
- **Usage:**
  ```tsx
  <ExternalLink href="https://example.com">Visit Example</ExternalLink>
  ```

### ScreenView

- **Purpose:** Provides a consistent, cross-platform screen container with built-in padding, safe area handling, and optional scroll support.
- **How it works:**
  - Handles safe area insets automatically
  - Supports scrollable and non-scrollable layouts
  - Integrates with theming and color schemes
- **Usage:**
  ```tsx
  <ScreenView>{/* Your screen content here */}</ScreenView>
  ```

---

For more details, see the individual component `README.md` files in each tool's folder.
