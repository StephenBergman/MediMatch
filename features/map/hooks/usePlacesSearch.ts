import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Region } from 'react-native-maps';

import { fetchPlaces, type PlaceResult } from '../api/places';

type Status = 'idle' | 'loading' | 'success' | 'error';

const MEDICAL_KEYWORDS =
	'hospital pharmacy urgent care clinic optometrist optical veterinarian vet doctor health';

export function usePlacesSearch(region: Region | null) {
	const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
	const [status, setStatus] = useState<Status>('idle');
	const [places, setPlaces] = useState<PlaceResult[]>([]);
	const [error, setError] = useState<string | null>(null);
	const abortRef = useRef<AbortController | null>(null);

	const canSearch = useMemo(() => Boolean(region && apiKey), [region, apiKey]);

	const runSearch = useCallback(async () => {
		if (!region || !apiKey) {
			setError('Google Maps API key is missing.');
			return;
		}
		abortRef.current?.abort();
		const controller = new AbortController();
		abortRef.current = controller;

		setStatus('loading');
		setError(null);
		try {
			const types = [
				'hospital',
				'pharmacy',
				'doctor',
				'veterinary_care',
				'health',
				'optometrist',
			];

			const responses = await Promise.all(
				types.map((type) =>
					fetchPlaces({
						region,
						apiKey,
						keyword: MEDICAL_KEYWORDS,
						type,
					}),
				),
			);
			const merged = new Map<string, PlaceResult>();
			responses.flat().forEach((place) => {
				if (!merged.has(place.id)) {
					merged.set(place.id, place);
				}
			});
			const results = Array.from(merged.values());
			if (controller.signal.aborted) return;
			setPlaces(results);
			setStatus('success');
		} catch (err) {
			if (controller.signal.aborted) return;
			const message = err instanceof Error ? err.message : 'Unknown places error';
			console.warn('Places fetch failed', message);
			setError(message);
			setStatus('error');
		}
	}, [apiKey, region]);

	useEffect(() => {
		if (!canSearch) return;
		const id = setTimeout(runSearch, 350);
		return () => clearTimeout(id);
	}, [canSearch, runSearch, region]);

	useEffect(() => () => abortRef.current?.abort(), []);

	return {
		places,
		status,
		error,
		refetch: runSearch,
		canSearch,
	};
}
