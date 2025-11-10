# ErrorBoundary Component

This component provides a React error boundary for catching uncaught errors in your app's component tree. It displays a fallback UI and logs errors for further analysis.

## Features

- Catches errors in child components
- Displays a user-friendly fallback UI using `ErrorFallback`
- Logs error details via a logging client
- Reports errors to external services

## Usage

Import and use `ErrorBoundary` to wrap parts of your app:

```tsx
import ErrorBoundary from "./ErrorBoundary";

<ErrorBoundary>{/* Your app code */}</ErrorBoundary>;
```

## Props

- `children`: React nodes to render inside the boundary

## Fallback UI

The fallback UI is rendered by the `ErrorFallback` component.

## Error Logging

Errors are logged using a custom logging client and reported via `captureException`. This helps with debugging and monitoring in production.

## File Structure

- `index.tsx`: Main ErrorBoundary implementation
