import type { LatLng } from 'react-native-maps';

const GOOGLE_DIRECTIONS_BASE_URL =
	'https://maps.googleapis.com/maps/api/directions/json';

type DirectionsLeg = {
	distance?: { value: number };
	duration?: { value: number };
	steps?: {
		html_instructions?: string;
		distance?: { value: number };
		duration?: { value: number };
		end_location?: { lat: number; lng: number };
	}[];
};

type DirectionsRoute = {
	overview_polyline?: { points: string };
	legs?: DirectionsLeg[];
};

type DirectionsResponse = {
	status: string;
	error_message?: string;
	routes?: DirectionsRoute[];
};

export type TravelMode = 'driving' | 'walking';

export type DirectionsResult = {
	polyline: string;
	distanceMeters: number;
	durationSeconds: number;
	steps: {
		instruction: string;
		distanceMeters: number;
		durationSeconds: number;
		endLocation?: LatLng;
	}[];
};

export type FetchDirectionsParams = {
	origin: LatLng;
	destination: LatLng;
	apiKey: string;
	mode: TravelMode;
};

/** Fetch turn-by-turn directions from Google Directions API. */
export async function fetchDirections({
	origin,
	destination,
	apiKey,
	mode,
}: FetchDirectionsParams): Promise<DirectionsResult> {
	const query = new URLSearchParams({
		origin: `${origin.latitude},${origin.longitude}`,
		destination: `${destination.latitude},${destination.longitude}`,
		key: apiKey,
		mode,
	});

	if (mode === 'driving') {
		query.set('departure_time', 'now');
		query.set('traffic_model', 'best_guess');
	}

	const response = await fetch(
		`${GOOGLE_DIRECTIONS_BASE_URL}?${query.toString()}`
	);
	if (!response.ok) {
		throw new Error(`Directions request failed (${response.status})`);
	}

	const json = (await response.json()) as DirectionsResponse;
	if (json.status !== 'OK' || !json.routes?.length) {
		throw new Error(
			json.error_message || `Directions request error: ${json.status}`
		);
	}

	const route = json.routes[0];
	const leg = route.legs?.[0];
	const polyline = route.overview_polyline?.points ?? '';
	if (!polyline) {
		throw new Error('Directions response missing polyline.');
	}
	const steps =
		leg?.steps?.map((step) => ({
			instruction: sanitizeInstruction(step.html_instructions ?? ''),
			distanceMeters: step.distance?.value ?? 0,
			durationSeconds: step.duration?.value ?? 0,
			endLocation: step.end_location
				? { latitude: step.end_location.lat, longitude: step.end_location.lng }
				: undefined,
		})) ?? [];

	return {
		polyline,
		distanceMeters: leg?.distance?.value ?? 0,
		durationSeconds: leg?.duration?.value ?? 0,
		steps,
	};
}

/** Decode a Google polyline string into map coordinates. */
export function decodePolyline(encoded: string): LatLng[] {
	let index = 0;
	let latitude = 0;
	let longitude = 0;
	const coordinates: LatLng[] = [];

	while (index < encoded.length) {
		let shift = 0;
		let result = 0;
		let byte = 0;
		do {
			byte = encoded.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);
		const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
		latitude += deltaLat;

		shift = 0;
		result = 0;
		do {
			byte = encoded.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);
		const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
		longitude += deltaLng;

		coordinates.push({
			latitude: latitude / 1e5,
			longitude: longitude / 1e5,
		});
	}

	return coordinates;
}

function sanitizeInstruction(raw: string) {
	const withoutTags = raw.replace(/<[^>]*>/g, ' ');
	return withoutTags
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, ' ')
		.trim();
}
