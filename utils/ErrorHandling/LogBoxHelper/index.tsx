import { LogBox } from "react-native";

type InitLogBoxOptions = {
  ignoreLogs?: boolean;
  hideConsoleMessages?: boolean;
};

/**
 * Utility to configure React Native LogBox for Expo apps.
 * Allows ignoring specific warning messages and optionally hides console messages containing those warnings.
 *
 * @param {InitLogBoxOptions} options - Configuration options.
 * @param {boolean} [options.ignoreLogs] - If true, ignores predefined warning logs.
 * @param {boolean} [options.hideConsoleMessages] - If true, hides console messages containing ignored warnings in development mode.
 *
 * @example
 * // Ignore "Text strings must be rendered within a <Text> component" warnings
 * LogBoxHelper({ ignoreLogs: true });
 *
 * @example
 * // Ignore and hide console messages for specific warnings
 * LogBoxHelper({ ignoreLogs: true, hideConsoleMessages: true });
 */
export function LogBoxHelper(options: InitLogBoxOptions = {}) {
  const IGNORED_LOGS = [
    "Text strings must be rendered within a <Text> component",
  ];

  if (options.ignoreLogs) {
    LogBox.ignoreLogs(IGNORED_LOGS);
  }

  // Workaround for hiding specific log messages in development mode
  if (__DEV__ && options.hideConsoleMessages) {
    const withoutIgnored =
      (logger: (...args: any[]) => void) =>
      (...args: any[]) => {
        const output = args.join(" ");

        if (!IGNORED_LOGS.some((log) => output.includes(log))) {
          logger(...args);
        }
      };

    console.log = withoutIgnored(console.log);
    console.info = withoutIgnored(console.info);
    console.warn = withoutIgnored(console.warn);
    console.error = withoutIgnored(console.error);
  }
}
