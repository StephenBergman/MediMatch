import { Redirect, Stack } from 'expo-router';
import React from 'react';

export const unstable_settings = {
	href: null,
};

const DevLayout = () => {
	if (process.env.NODE_ENV !== 'development') {
		return <Redirect href="/" />;
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="kitchensink/index" />
			<Stack.Screen name="kitchensink/kitchensink" />
			<Stack.Screen name="errortesting/index" />
		</Stack>
	);
};

export default DevLayout;
