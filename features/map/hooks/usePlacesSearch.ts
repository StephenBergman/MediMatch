import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Region } from 'react-native-maps';

import { fetchPlaces, type PlaceResult } from '../api/places';
import { guard } from '@/utils/ErrorHandling/helpers/capture';

type Status = 'idle' | 'loading' | 'success' | 'error';

const MEDICAL_KEYWORDS =
	'hospital pharmacy urgent care clinic walk-in clinic after hours clinic express care immediate care optometrist optical veterinarian vet doctor health';
const METERS_PER_DEGREE = 111_000;
const MIN_MOVE_METERS = 250;
const MIN_ZOOM_DELTA = 0.02;

export function usePlacesSearch(region: Region | null) {
	const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
	const [status, setStatus] = useState<Status>('idle');
	const [places, setPlaces] = useState<PlaceResult[]>([]);
	const [error, setError] = useState<string | null>(null);
	const abortRef = useRef<AbortController | null>(null);
	const lastRegionRef = useRef<Region | null>(null);

	const canSearch = useMemo(() => Boolean(region && apiKey), [region, apiKey]);

	const guardedSearch = useMemo(
		() =>
			guard(
				async (force = false) => {
					if (!region || !apiKey) {
						setError('Google Maps API key is missing.');
						return;
					}
					const lastRegion = lastRegionRef.current;
					if (!force && lastRegion && !hasRegionChanged(lastRegion, region)) {
						return;
					}
					abortRef.current?.abort();
					const controller = new AbortController();
					abortRef.current = controller;
					lastRegionRef.current = region;

					setStatus('loading');
					setError(null);
					const types = [
						'hospital',
						'pharmacy',
						'doctor',
						'veterinary_care',
						'health',
						'optometrist',
					];

					let responses: PlaceResult[][] = [];
					try {
						responses = await Promise.all([
							...types.map((type) =>
								fetchPlaces({
									region,
									apiKey,
									keyword: MEDICAL_KEYWORDS,
									type,
									signal: controller.signal,
								}),
							),
							fetchPlaces({
								region,
								apiKey,
								keyword:
									'urgent care walk-in clinic after hours clinic express care immediate care',
								signal: controller.signal,
							}),
						]);
					} catch (err) {
						if (isAbortError(err) || controller.signal.aborted) {
							return;
						}
						throw err;
					}
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
				},
				{
					asyncFallback: (appErr) => {
						const message = appErr.message || 'Unknown places error';
						const normalized = message.toLowerCase();
						const isAbort =
							normalized.includes('aborted') ||
							normalized.includes('aborterror') ||
							normalized.includes('canceled');

						if (isAbort || abortRef.current?.signal.aborted) {
							return null;
						}
						console.warn('Places fetch failed', message);
						setError(message);
						setStatus('error');
						return null;
					},
				},
			),
		[apiKey, region],
	);

	const runSearch = useCallback(
		(force = false) => {
			guardedSearch(force);
		},
		[guardedSearch],
	);

	const forceRefetch = useCallback(() => {
		runSearch(true);
	}, [runSearch]);

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
		refetch: forceRefetch,
		canSearch,
	};
}

function isAbortError(err: unknown) {
	if (!err) return false;
	if (err instanceof Error) {
		const name = err.name.toLowerCase();
		const message = err.message.toLowerCase();
		return (
			name.includes('abort') ||
			message.includes('aborted') ||
			message.includes('aborterror') ||
			message.includes('canceled')
		);
	}
	return false;
}

function hasRegionChanged(previous: Region, next: Region) {
	const toRadians = (value: number) => (value * Math.PI) / 180;
	const latMeters = (next.latitude - previous.latitude) * METERS_PER_DEGREE;
	const lonMeters =
		(next.longitude - previous.longitude) *
		METERS_PER_DEGREE *
		Math.cos(toRadians(next.latitude));
	const distance = Math.hypot(latMeters, lonMeters);
	const zoomDelta =
		Math.abs(next.latitudeDelta - previous.latitudeDelta) +
		Math.abs(next.longitudeDelta - previous.longitudeDelta);
	return distance >= MIN_MOVE_METERS || zoomDelta >= MIN_ZOOM_DELTA;
}
