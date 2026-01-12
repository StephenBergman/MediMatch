import { useCallback, useEffect, useState } from 'react';
import type { Region } from 'react-native-maps';

import { useRequestLocation } from './useRequestLocation';

let cachedRegion: Region | null = null;

/** Fetches (and caches) the user's location; reuses the cached value across mounts. */
export function useCachedUserLocation() {
	const { status, errorMessage, requestLocation } = useRequestLocation();
	const [region, setRegion] = useState<Region | null>(cachedRegion);

	const refresh = useCallback(async () => {
		const result = await requestLocation();
		if (result.region) {
			cachedRegion = result.region;
			setRegion(result.region);
		}
		return result;
	}, [requestLocation]);

	useEffect(() => {
		if (cachedRegion) {
			return;
		}
		refresh();
	}, [refresh]);

	return {
		status,
		errorMessage,
		region,
		refresh,
	};
}
