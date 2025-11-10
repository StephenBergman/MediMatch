# errors

This folder contains error classes, types, and utilities for handling errors throughout the MediMatch app.

## Purpose

- Centralizes error definitions and handling logic
- Supports custom error types for different domains (e.g., policy, network, validation)
- Enables consistent error reporting and boundary handling

## Usage

Import error classes or helpers from this folder to throw, catch, or process errors in your features, hooks, or components.

```ts
import { AuthError } from "./errors/types/auth";

// Example: Throwing an error
function authenticateUser(user) {
  if (!user.isAuthenticated) {
    throw new AuthError("User is not authenticated");
  }
  // ...rest of logic...
}

try {
  // ...code...
} catch (error) {
  if (error instanceof AuthError) {
    // handle policy error
  }
}
```

## Structure

- `index.ts`: Definition for `AppError`
- `policy.ts`: Takes in an `AppError` and returns a `UXDecision`
- `normalize.ts`: Converts an error instance to a normalized `AppError` as defined in `index.ts`

## Best Practices

- Extend built-in Error for custom error classes
- Document error types and expected usage
- Use error boundaries for uncaught errors in UI
