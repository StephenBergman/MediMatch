import { useMemo, useState } from 'react';
import * as Location from 'expo-location';

import { guard } from '@/utils/ErrorHandling/helpers/capture';

type RequestStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable';

type RequestResult = {
	granted: boolean;
	region?: {
		latitude: number;
		longitude: number;
		latitudeDelta: number;
		longitudeDelta: number;
	};
	errorMessage?: string;
};

/** Requests foreground location permission and returns a map-ready region. */
export function useRequestLocation() {
	const [status, setStatus] = useState<RequestStatus>('idle');
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	const requestLocation = useMemo(
		() =>
			guard(
				async (): Promise<RequestResult> => {
					setStatus('requesting');
					setErrorMessage(undefined);

					const existing =
						await Location.getForegroundPermissionsAsync();
					const permission =
						existing.status === Location.PermissionStatus.GRANTED
							? existing
							: await Location.requestForegroundPermissionsAsync();
					if (permission.status !== Location.PermissionStatus.GRANTED) {
						setStatus('denied');
						return { granted: false };
					}

					const position = await Location.getCurrentPositionAsync({
						accuracy: Location.Accuracy.Balanced,
					});

					setStatus('granted');
					const { latitude, longitude } = position.coords;
					return {
						granted: true,
						region: {
							latitude,
							longitude,
							latitudeDelta: 0.08,
							longitudeDelta: 0.08,
						},
					};
				},
				{
					asyncFallback: (appErr) => {
						const message = appErr.message || 'Unknown location error';
						setStatus('unavailable');
						setErrorMessage(message);
						return { granted: false, errorMessage: message };
					},
				},
			),
		[],
	);

	return {
		status,
		errorMessage,
		requestLocation,
	};
}
