import * as Location from 'expo-location';
import { useMemo, useState } from 'react';
import { Platform } from 'react-native';

import { guard } from '@/utils/ErrorHandling/helpers/capture';

type RequestStatus =
	| 'idle'
	| 'requesting'
	| 'granted'
	| 'denied'
	| 'unavailable';

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

					const existing = await Location.getForegroundPermissionsAsync();

					const permission =
						existing.status === Location.PermissionStatus.GRANTED
							? existing
							: await Location.requestForegroundPermissionsAsync();

					if (permission.status !== Location.PermissionStatus.GRANTED) {
						setStatus('denied');

						return { granted: false };
					}

					let servicesEnabled = await Location.hasServicesEnabledAsync();

					if (!servicesEnabled && Platform.OS === 'android') {
						try {
							await Location.enableNetworkProviderAsync();
							servicesEnabled = await Location.hasServicesEnabledAsync();
						} catch {
							// ignore and fall through to unavailable message
						}
					}

					if (!servicesEnabled) {
						setStatus('unavailable');
						const message =
							'Current location is unavailable. Make sure that location services are enabled.';
						setErrorMessage(message);

						return { granted: false, errorMessage: message };
					}

					let position: Location.LocationObject | null = null;

					try {
						position = await Location.getCurrentPositionAsync({
							accuracy: Location.Accuracy.Balanced,
						});
					} catch (err) {}

					if (!position) {
						position = await Location.getLastKnownPositionAsync({});
						if (position) {
						}
					}

					if (!position) {
						setStatus('unavailable');
						const message =
							'Current location is unavailable. Try again or enable GPS.';
						setErrorMessage(message);

						return { granted: false, errorMessage: message };
					}

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
