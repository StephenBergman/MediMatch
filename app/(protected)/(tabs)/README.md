## App Directory Overview

This directory contains the core app-level routing, layouts, and entry points for the MediMatch Expo application. It is responsible for navigation, protected routes, and platform-specific logic.

### Structure

- **\_layout.tsx**: Root layout for all screens. Handles navigation containers, providers, and global wrappers.
- **+not-found.tsx**: Fallback screen for unmatched routes.
- **login.tsx**: Public login screen.
- **(protected)/**: Contains routes/components that require authentication.
  - **\_layout.tsx**: Layout for protected routes.
  - **(tabs)/**: Tab navigation for authenticated users.

### Key Considerations

- **Navigation**: Uses Expo Router for file-based navigation.
- **Redirects**: Use `router.push()` to navigate between screens.
- **Authentication**: Place protected screens inside the `(protected)` folder. Use hooks like `useAuth` to manage access.
- **Platform Support**: Use `.native.tsx` for native-only logic, `.tsx` for web/native shared, and `.web.tsx` for web-only.
- **UI Library**: All shared UI components now rely on [React Native Paper](https://callstack.github.io/react-native-paper/) to stay cross-platform and consistent.
- **Error Handling**: Use the `utils/ErrorHandling` helpers for consistent error boundaries and reporting.
- **Our Tools**: A document for our in-house solutions can be found in `src/components/README.md`

### Adding Navigational Tabs/Screens

1. Create a subfolder in `(protected)/(tabs)/`.
2. Add the details in `utils/Navigation/ScreenCommonProps`, using the populated object for visible tabs, and the `display: 'none'` object for non-tab screens.

### Best Practices

- Keep navigation logic in layout files.
- Prefer functional components and TypeScript.
- Follow Expo and React Native Web compatibility guidelines.
- Refer to the dev tools `React Native Paper Kitchen Sink` for UI component usage.

### Known Issues

- `Text strings must be rendered within a <Text> component`
  - This error can falsely(?) occur when a JSX element is on the same _line_ as a `<Text/>` component.
  - To avoid this, break lines between components as follows:

```tsx
//WRONG:
<Text>Cool item: </Text> {coolItemComponent}

//RIGHT:
<Text>Cool item: </Text>
{coolItemComponent}
```

---

For more details, see the main project README and the [Expo Router documentation](https://docs.expo.dev/router/introduction/).
