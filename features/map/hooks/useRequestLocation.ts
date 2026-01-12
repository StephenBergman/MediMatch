import { useCallback, useState } from 'react';
import * as Location from 'expo-location';

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

	const requestLocation = useCallback(async (): Promise<RequestResult> => {
		try {
			setStatus('requesting');
			setErrorMessage(undefined);

			const permission = await Location.requestForegroundPermissionsAsync();
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
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Unknown location error';
			setStatus('unavailable');
			setErrorMessage(message);
			return { granted: false, errorMessage: message };
		}
	}, []);

	return {
		status,
		errorMessage,
		requestLocation,
	};
}
