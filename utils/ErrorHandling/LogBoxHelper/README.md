# LogBoxHelper

An app-level utility for configuring React Native LogBox in Expo apps. Allows you to ignore specific warning messages and optionally hide console messages containing those warnings during development. Current functionality is "all-or-nothing" regarding which logs to ignore.

## Features

- Ignore specific warning logs (e.g., "Text strings must be rendered within a <Text> component").
- Optionally hide console messages containing ignored warnings in development mode.

## Usage

```
import { LogBoxHelper } from './LogBoxHelper';

// Ignore specific warning logs
LogBoxHelper({ ignoreLogs: true });

// Ignore and hide console messages for specific warnings
LogBoxHelper({ ignoreLogs: true, hideConsoleMessages: true });
```

## API

### LogBoxHelper(options)

| Option                | Type    | Default | Description                                                         |
| --------------------- | ------- | ------- | ------------------------------------------------------------------- |
| `ignoreLogs`          | boolean | false   | If true, ignores predefined warning logs.                           |
| `hideConsoleMessages` | boolean | false   | If true, hides console messages containing ignored warnings in dev. |

## Example

```
LogBoxHelper({
  ignoreLogs: true,
  hideConsoleMessages: true,
});
```
