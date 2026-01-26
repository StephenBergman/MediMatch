import React, { type ComponentProps } from 'react';
import { openBrowserAsync } from 'expo-web-browser';
import { Linking, Platform, Pressable } from 'react-native';

/**
 * ExternalLink component for opening external URLs in a platform-appropriate way.
 *
 * - On native (iOS/Android), opens the link in an in-app browser using expo-web-browser.
 * - On web, opens the link using the default browser behavior.
 *
 * @param {string} href - The URL to open when the link is pressed.
 * @param {React.ReactNode} children - The content to display inside the link.
 * @param {ComponentProps<typeof Pressable>} rest - Additional Pressable props.
 *
 * @example
 * <ExternalLink href="https://example.com">Visit Example</ExternalLink>
 */
export function ExternalLink({
	href,
	children,
	...rest
}: { href: string } & ComponentProps<typeof Pressable>) {
	return (
		<Pressable
			onPress={async (event) => {
				if (Platform.OS !== 'web') {
					// Prevent the default behavior of linking to the default browser on native.
					event.preventDefault();
					// Open the link in an in-app browser.
					await openBrowserAsync(href);
				} else {
					// On web, let the default behavior occur.
					Linking.openURL(href);
				}
			}}
			className="flex-row items-center gap-2 hover:underline"
			{...rest}
		>
			{children}
		</Pressable>
	);
}
