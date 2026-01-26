import React from 'react';
import { useLocalSearchParams } from 'expo-router';

import { MapExperience } from '@/features/map/components/MapExperience/MapExperience';

export default function MapScreen() {
	const { route, mode, care, routeRequestId } = useLocalSearchParams<{
		route?: string;
		mode?: string;
		care?: string;
		routeRequestId?: string;
	}>();
	const autoRouteToNearest = route === 'nearest';
	const routeMode = mode === 'walking' ? 'walking' : 'driving';
	const routePreference =
		care === 'emergency'
			? 'emergency'
			: care === 'routine'
				? 'routine'
				: care === 'urgent'
					? 'urgent'
					: 'any';

	return (
		<MapExperience
			autoRouteToNearest={autoRouteToNearest}
			routeMode={routeMode}
			routePreference={routePreference}
			routeRequestId={routeRequestId}
		/>
	);
}
