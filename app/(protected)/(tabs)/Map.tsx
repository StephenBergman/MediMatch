import React from 'react';
import { useLocalSearchParams } from 'expo-router';

import { MapExperience } from '@/features/map/components/MapExperience/MapExperience';

export default function MapScreen() {
	const { route, mode, care } = useLocalSearchParams<{
		route?: string;
		mode?: string;
		care?: string;
	}>();
	const autoRouteToNearest = route === 'nearest';
	const routeMode = mode === 'walking' ? 'walking' : 'driving';
	const routePreference =
		care === 'emergency' ? 'emergency' : care === 'urgent' ? 'urgent' : 'any';

	return (
		<MapExperience
			autoRouteToNearest={autoRouteToNearest}
			routeMode={routeMode}
			routePreference={routePreference}
		/>
	);
}
