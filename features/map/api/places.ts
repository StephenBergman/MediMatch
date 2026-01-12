import type { Region } from 'react-native-maps';

const GOOGLE_PLACES_BASE_URL =
	'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

const METERS_PER_DEGREE = 111_000;

export type PlaceResult = {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	types: string[];
	address?: string;
};

type NearbySearchResponse = {
	results: {
		place_id: string;
		name: string;
		geometry?: { location?: { lat: number; lng: number } };
		types?: string[];
		vicinity?: string;
		formatted_address?: string;
	}[];
	status: string;
	error_message?: string;
};

export type FetchPlacesParams = {
	region: Region;
	apiKey: string;
	keyword?: string;
	type?: string;
};

/** Fetch places from Google Places Nearby Search for a given region. */
export async function fetchPlaces({
	region,
	apiKey,
	keyword,
	type,
}: FetchPlacesParams): Promise<PlaceResult[]> {
	const radiusMeters = clampRadius(
		Math.max(region.latitudeDelta, region.longitudeDelta) *
			METERS_PER_DEGREE *
			0.5
	);
	const query = new URLSearchParams({
		location: `${region.latitude},${region.longitude}`,
		radius: String(radiusMeters),
		key: apiKey,
	});

	if (keyword) {
		query.set('keyword', keyword);
	}
	if (type) {
		query.set('type', type);
	}

	const response = await fetch(`${GOOGLE_PLACES_BASE_URL}?${query.toString()}`);
	if (!response.ok) {
		throw new Error(`Places request failed (${response.status})`);
	}
	const json = (await response.json()) as NearbySearchResponse;
	if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
		throw new Error(
			json.error_message || `Places request error: ${json.status}`
		);
	}

	return (json.results ?? [])
		.filter((result) => Boolean(result.geometry?.location))
		.map((result) => ({
			id: result.place_id,
			name: result.name,
			latitude: result.geometry!.location!.lat,
			longitude: result.geometry!.location!.lng,
			types: result.types ?? [],
			address: result.formatted_address ?? result.vicinity,
		}));
}

function clampRadius(radius: number) {
	const min = 500; // meters
	const max = 50_000; // meters
	if (Number.isNaN(radius) || !Number.isFinite(radius)) return 2000;
	return Math.min(Math.max(radius, min), max);
}
