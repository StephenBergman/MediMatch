# ErrorTesting

The `ErrorTesting` component provides a UI for triggering and testing various error handling flows in the MediMatch project. It is intended for development and QA to verify error boundaries, logging, and user feedback mechanisms.

## Features

- Triggers different error types: auth, network (404/500), validation, invariant, vanilla JS, and render errors
- Demonstrates use of error handling helpers: `guardAsync`, `captureException`, `notifyUx`, `promoteToBoundary`, and `decideUx`
- Includes a buggy component to test React render errors
- Sandbox API buttons surface success/failure toasts and log the upstream payload, making it easy to verify end-to-end behavior of the `useAPI` hook
- Uses gluestack-ui primitives for consistent UI

## Implementation Notes

- Each button triggers a different error scenario for testing boundaries and UX
- Integrates with the app's error handling utilities in `src/utils/ErrorHandling/`
