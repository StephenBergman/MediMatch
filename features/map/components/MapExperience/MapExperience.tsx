import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, {
	Marker,
	Polyline,
	PROVIDER_GOOGLE,
	type LatLng,
	type Region,
} from 'react-native-maps';
import { Icon, IconButton, Surface, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { PlaceMarker } from '@/features/map/components/PlaceMarker';
import type { PlaceResult } from '@/features/map/api/places';
import {
	decodePolyline,
	fetchDirections,
	type TravelMode,
} from '@/features/map/api/routes';
import { useCachedUserLocation } from '@/features/map/hooks/useCachedUserLocation';
import { usePlacesSearch } from '@/features/map/hooks/usePlacesSearch';
import { MapToolsPanel } from '@/features/map/components/MapToolsPanel/MapToolsPanel';
import { PlacesTray } from '@/features/map/components/PlacesTray/PlacesTray';
import { SelectedPlaceBar } from '@/features/map/components/SelectedPlaceBar/SelectedPlaceBar';
import {
	TurnByTurnDrawer,
	type TurnByTurnStep,
} from '@/features/map/components/TurnByTurnDrawer/TurnByTurnDrawer';
import { useAppToast } from '@/components/contexts/AppToastProvider';

const initialRegion: Region = {
	latitude: 37.7749,
	longitude: -122.4194,
	latitudeDelta: 0.08,
	longitudeDelta: 0.08,
};

const mapProvider = Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined;

/** Fullscreen map experience with a starter marker. */
type MapExperienceProps = {
	autoRouteToNearest?: boolean;
	routeMode?: TravelMode;
	routePreference?: 'urgent' | 'emergency' | 'any';
};

const toLatLng = (region: Region): LatLng => ({
	latitude: region.latitude,
	longitude: region.longitude,
});

const getDistanceMeters = (from: LatLng, to: LatLng) => {
	const toRadians = (value: number) => (value * Math.PI) / 180;
	const earthRadius = 6371000;
	const dLat = toRadians(to.latitude - from.latitude);
	const dLon = toRadians(to.longitude - from.longitude);
	const lat1 = toRadians(from.latitude);
	const lat2 = toRadians(to.latitude);

	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return earthRadius * c;
};

const getNearestPlace = (places: PlaceResult[], origin: LatLng) => {
	let nearest: PlaceResult | null = null;
	let nearestDistance = Number.POSITIVE_INFINITY;

	for (const place of places) {
		const distance = getDistanceMeters(origin, {
			latitude: place.latitude,
			longitude: place.longitude,
		});
		if (distance < nearestDistance) {
			nearest = place;
			nearestDistance = distance;
		}
	}

	return nearest;
};

const urgentKeywords = [
	'urgent care',
	'express care',
	'walk-in',
	'walk in',
	'after hours',
	'immediate care',
	'clinic',
];

const emergencyKeywords = ['emergency', 'er', 'emergency room', 'hospital'];

const isEmergencyPlace = (place: PlaceResult) => {
	const normalized = `${place.name} ${place.address} ${place.types.join(' ')}`.toLowerCase();
	if (place.types.includes('hospital')) return true;
	return emergencyKeywords.some((keyword) => normalized.includes(keyword));
};

const isUrgentPlace = (place: PlaceResult) => {
	const normalized = `${place.name} ${place.address} ${place.types.join(' ')}`.toLowerCase();
	if (place.types.includes('hospital')) return false;
	if (place.types.includes('doctor') || place.types.includes('health')) return true;
	return urgentKeywords.some((keyword) => normalized.includes(keyword));
};

export function MapExperience({
	autoRouteToNearest = false,
	routeMode = 'driving',
	routePreference = 'any',
}: MapExperienceProps) {
	const theme = useTheme();
	const colors = theme.colors;
	const insets = useSafeAreaInsets();
	const tabBarHeight = useBottomTabBarHeight();
	const mapRef = useRef<MapView | null>(null);
	const directionsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
	const { region: cachedUserRegion, refresh } = useCachedUserLocation();
	const hasCenteredOnUser = useRef(false);
	const [mapRegion, setMapRegion] = useState<Region>(initialRegion);
	const [userRegion, setUserRegion] = useState<Region | null>(null);
	const [activeRouteMode, setActiveRouteMode] =
		useState<TravelMode>(routeMode);
	const [routeOrigin, setRouteOrigin] = useState<LatLng | null>(null);
	const [routeDestination, setRouteDestination] = useState<PlaceResult | null>(
		null,
	);
	const [routePath, setRoutePath] = useState<LatLng[] | null>(null);
	const [routeSteps, setRouteSteps] = useState<TurnByTurnStep[]>([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const { showToast } = useAppToast();
	const [routeStatus, setRouteStatus] = useState<
		'idle' | 'loading' | 'success' | 'fallback'
	>('idle');
	const [routeSource, setRouteSource] = useState<'auto' | 'manual' | null>(
		null,
	);
	const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [isRouteActive, setIsRouteActive] = useState(false);
	const [autoRouteEnabled, setAutoRouteEnabled] = useState(true);
	const nextStep =
		routeSteps.length > currentStepIndex
			? routeSteps[currentStepIndex]?.instruction ?? null
			: null;
	const {
		places,
		status: placesStatus,
		error: placesError,
		refetch,
	} = usePlacesSearch(mapRegion);

	useEffect(() => {
		setActiveRouteMode(routeMode);
	}, [routeMode]);

	useEffect(() => {
		if (!autoRouteToNearest && routeDestination && routeSource === 'auto') {
			setRouteDestination(null);
			setRoutePath(null);
			setRouteOrigin(null);
			setRouteStatus('idle');
			setRouteSource(null);
			setRouteSteps([]);
			setIsDrawerOpen(false);
			setCurrentStepIndex(0);
			setIsRouteActive(false);
			setAutoRouteEnabled(true);
			return;
		}
		if (
			!autoRouteToNearest ||
			!autoRouteEnabled ||
			routeDestination ||
			places.length === 0
		) {
			return;
		}
		const originRegion = userRegion ?? cachedUserRegion ?? mapRegion;
		const origin = toLatLng(originRegion);
		let candidatePlaces = places;
		if (routePreference === 'emergency') {
			candidatePlaces = places.filter(isEmergencyPlace);
		} else if (routePreference === 'urgent') {
			candidatePlaces = places.filter(isUrgentPlace);
		}
		if (candidatePlaces.length === 0) {
			candidatePlaces = places;
		}
		const nearest = getNearestPlace(candidatePlaces, origin);
		if (nearest) {
			setRouteDestination(nearest);
			setRouteOrigin(origin);
			setRouteStatus('loading');
			setRouteSource('auto');
		}
	}, [
		autoRouteEnabled,
		autoRouteToNearest,
		cachedUserRegion,
		mapRegion,
		places,
		routeDestination,
		routePreference,
		routeSource,
		userRegion,
	]);

	useEffect(() => {
		if (!routeDestination || !routeOrigin) {
			setRoutePath(null);
			setRouteStatus('idle');
			setRouteSteps([]);
			setIsDrawerOpen(false);
			setCurrentStepIndex(0);
			setIsRouteActive(false);
			return;
		}
		if (!directionsApiKey) {
			setRoutePath(null);
			setRouteStatus('fallback');
			setRouteSteps([]);
			setIsDrawerOpen(false);
			setCurrentStepIndex(0);
			setIsRouteActive(false);
			return;
		}
		const destination = {
			latitude: routeDestination.latitude,
			longitude: routeDestination.longitude,
		};
		let isActive = true;

		setRoutePath(null);
		setRouteStatus('loading');
		setRouteSteps([]);
		setIsDrawerOpen(false);
		setCurrentStepIndex(0);
		setIsRouteActive(false);
		fetchDirections({
			origin: routeOrigin,
			destination,
			apiKey: directionsApiKey,
			mode: activeRouteMode,
		})
			.then((result) => {
				if (!isActive) return;
				const decoded = decodePolyline(result.polyline);
				setRoutePath(decoded.length ? decoded : [routeOrigin, destination]);
				setRouteStatus('success');
				setRouteSteps(result.steps);
				setCurrentStepIndex(0);
			})
			.catch(() => {
				if (!isActive) return;
				setRoutePath([routeOrigin, destination]);
				setRouteStatus('fallback');
				setRouteSteps([]);
				setIsDrawerOpen(false);
				setCurrentStepIndex(0);
				setIsRouteActive(false);
			});

		return () => {
			isActive = false;
		};
	}, [activeRouteMode, directionsApiKey, routeDestination, routeOrigin]);

	useEffect(() => {
		if (!routeDestination || !routeOrigin) return;
		const destination = {
			latitude: routeDestination.latitude,
			longitude: routeDestination.longitude,
		};
		mapRef.current?.fitToCoordinates([routeOrigin, destination], {
			edgePadding: {
				top: 90,
				right: 70,
				bottom: 120 + insets.bottom,
				left: 70,
			},
			animated: true,
		});
	}, [insets.bottom, routeDestination, routeOrigin]);

	useEffect(() => {
		if (!cachedUserRegion || hasCenteredOnUser.current) {
			return;
		}
		setUserRegion(cachedUserRegion);
		setMapRegion(cachedUserRegion);
		mapRef.current?.animateToRegion(cachedUserRegion, 300);
		hasCenteredOnUser.current = true;
	}, [cachedUserRegion]);

	const handleCenterOnUser = useCallback(async () => {
		const existingRegion = cachedUserRegion;
		if (existingRegion) {
			setUserRegion(existingRegion);
			mapRef.current?.animateToRegion(existingRegion, 300);
			return;
		}

		const result = await refresh();
		if (result.region) {
			setUserRegion(result.region);
			mapRef.current?.animateToRegion(result.region, 300);
		}
	}, [cachedUserRegion, refresh]);

	const handleRegionChange = useCallback((region: Region) => {
		setMapRegion(region);
	}, []);

	const handleMapPress = useCallback(() => {
		if (routeDestination) return;
		setSelectedPlace(null);
	}, [routeDestination]);

	const handleSelectPlace = useCallback((place: PlaceResult) => {
		setSelectedPlace(place);
	}, []);

	const handleRouteToPlace = useCallback((place: PlaceResult) => {
		const originRegion = userRegion ?? cachedUserRegion ?? mapRegion;
		setRouteDestination(place);
		setRouteOrigin(toLatLng(originRegion));
		setRoutePath(null);
		setRouteStatus('loading');
		setRouteSource('manual');
		setSelectedPlace(null);
		setRouteSteps([]);
		setIsDrawerOpen(false);
		setCurrentStepIndex(0);
		setIsRouteActive(false);
	}, [cachedUserRegion, mapRegion, userRegion]);

	const resetMapState = useCallback(() => {
		const fallbackRegion = cachedUserRegion ?? initialRegion;
		setRouteDestination(null);
		setRouteOrigin(null);
		setRoutePath(null);
		setRouteSteps([]);
		setRouteStatus('idle');
		setRouteSource(null);
		setSelectedPlace(null);
		setActiveRouteMode(routeMode);
		setIsDrawerOpen(false);
		setCurrentStepIndex(0);
		setIsRouteActive(false);
		setAutoRouteEnabled(false);
		setUserRegion(cachedUserRegion ?? null);
		setMapRegion(fallbackRegion);
		mapRef.current?.animateToRegion(fallbackRegion, 280);
	}, [cachedUserRegion, routeMode]);

	useEffect(() => {
		if (!isRouteActive) return;
		let isMounted = true;

		const tick = async () => {
			const result = await refresh();
			if (!isMounted || !result.region) return;
			setUserRegion(result.region);
			const zoomed: Region = {
				latitude: result.region.latitude,
				longitude: result.region.longitude,
				latitudeDelta: 0.02,
				longitudeDelta: 0.02,
			};
			setMapRegion(zoomed);
			mapRef.current?.animateToRegion(zoomed, 280);

			const activeStep = routeSteps[currentStepIndex];
			if (!activeStep?.endLocation) return;
			const distance = getDistanceMeters(
				{
					latitude: result.region.latitude,
					longitude: result.region.longitude,
				},
				activeStep.endLocation,
			);
			if (distance <= 40 && currentStepIndex < routeSteps.length - 1) {
				setCurrentStepIndex((prev) => prev + 1);
			}
		};

		tick();
		const intervalId = setInterval(tick, 6000);
		return () => {
			isMounted = false;
			clearInterval(intervalId);
		};
	}, [currentStepIndex, isRouteActive, refresh, routeSteps]);

	const handleStartRoute = useCallback(async () => {
		if (!routeDestination || routeStatus === 'idle') return;
		setIsRouteActive(true);
		const focusRegion = userRegion ?? cachedUserRegion;
		if (focusRegion) {
			const zoomed: Region = {
				latitude: focusRegion.latitude,
				longitude: focusRegion.longitude,
				latitudeDelta: 0.02,
				longitudeDelta: 0.02,
			};
			setMapRegion(zoomed);
			mapRef.current?.animateToRegion(zoomed, 320);
			return;
		}
		const result = await refresh();
		if (result.region) {
			const zoomed: Region = {
				latitude: result.region.latitude,
				longitude: result.region.longitude,
				latitudeDelta: 0.02,
				longitudeDelta: 0.02,
			};
			setUserRegion(result.region);
			setMapRegion(zoomed);
			mapRef.current?.animateToRegion(zoomed, 320);
		}
	}, [cachedUserRegion, refresh, routeDestination, routeStatus, userRegion]);

	const handleClearMap = useCallback(() => {
		if (routeDestination) {
			showToast('Clear the current route and reset the map?', {
				actionLabel: 'Okay',
				onAction: resetMapState,
			});
			return;
		}
		resetMapState();
	}, [resetMapState, routeDestination, showToast]);

	const fallbackCoordinates =
		routeDestination && routeOrigin
			? [
					routeOrigin,
					{
						latitude: routeDestination.latitude,
						longitude: routeDestination.longitude,
					},
				]
			: null;
	const routeCoordinates =
		routeStatus === 'success'
			? routePath
			: routeStatus === 'fallback'
				? fallbackCoordinates
				: null;

	return (
		<Surface
			style={[styles.container, { backgroundColor: colors.background }]}
			elevation={0}
		>
			<MapView
				ref={mapRef}
				provider={mapProvider}
				style={StyleSheet.absoluteFillObject}
				initialRegion={initialRegion}
				toolbarEnabled={false}
				showsMyLocationButton={false}
				onRegionChangeComplete={handleRegionChange}
				onPress={handleMapPress}
			>
				{routeCoordinates ? (
					<Polyline
						coordinates={routeCoordinates}
						strokeColor={colors.primary}
						strokeWidth={4}
						lineDashPattern={
							activeRouteMode === 'walking' ? [10, 6] : undefined
						}
					/>
				) : null}
				{places.map((place) => (
					<PlaceMarker
						key={place.id}
						place={place}
						onRoute={handleRouteToPlace}
						onSelect={handleSelectPlace}
					/>
				))}
				<Marker
					coordinate={userRegion ?? cachedUserRegion ?? initialRegion}
					title="Your location"
					description="Current position"
					pinColor={colors.primary}
				/>
				{routeDestination ? (
					<Marker
						coordinate={{
							latitude: routeDestination.latitude,
							longitude: routeDestination.longitude,
						}}
						title={routeDestination.name}
						description={routeDestination.address ?? 'Route destination'}
						pinColor={colors.tertiary}
					/>
				) : null}
			</MapView>
			<View style={styles.controls} pointerEvents="box-none">
				{placesStatus === 'error' ? (
					<Surface
						style={[
							styles.banner,
							{
								backgroundColor: colors.surface,
								borderColor: colors.outline,
								bottom: tabBarHeight + (places.length ? 170 : 100),
							},
						]}
						elevation={1}
					>
						<View style={styles.bannerRow}>
							<Icon
								source="alert-circle-outline"
								size={18}
								color={colors.error}
							/>
							<View style={{ flex: 1 }}>
								<Text style={{ color: colors.onSurface }}>
									{placesError || 'Places lookup failed.'}
								</Text>
							</View>
							<IconButton
								icon="refresh"
								size={18}
								onPress={refetch}
								iconColor={colors.onSurface}
								style={styles.bannerAction}
								accessibilityLabel="Retry places search"
							/>
						</View>
					</Surface>
				) : null}
			</View>
			{routeDestination ? null : (
				<View style={[styles.topStack, { top: 0 }]} pointerEvents="box-none">
					{selectedPlace ? (
						<SelectedPlaceBar
							place={selectedPlace}
							onRoute={handleRouteToPlace}
						/>
					) : places.length ? (
						<PlacesTray
							places={places}
							activePlaceId={routeDestination?.id}
							onRoute={handleRouteToPlace}
						/>
					) : null}
				</View>
			)}
			<View style={[styles.bottomStack, { bottom: 0 }]} pointerEvents="box-none">
				<MapToolsPanel
					mode={activeRouteMode}
					onModeChange={setActiveRouteMode}
					onLocate={handleCenterOnUser}
					onClear={handleClearMap}
					nextStep={routeStatus === 'success' ? nextStep : null}
					showStart={
						!isRouteActive &&
						Boolean(routeDestination) &&
						routeStatus !== 'idle'
					}
					onStartRoute={handleStartRoute}
				/>
			</View>
			{routeStatus === 'success' ? (
				<IconButton
					icon="directions"
					size={24}
					mode="contained"
					onPress={() => setIsDrawerOpen(true)}
					style={styles.directionsFab}
					accessibilityLabel="Show turn-by-turn directions"
				/>
			) : null}
			<TurnByTurnDrawer
				open={isDrawerOpen}
				steps={routeSteps}
				onClose={() => setIsDrawerOpen(false)}
			/>
		</Surface>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	controls: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		zIndex: 10,
	},
	banner: {
		position: 'absolute',
		left: 16,
		right: 16,
		borderRadius: 12,
		borderWidth: 1,
		paddingVertical: 10,
		paddingHorizontal: 12,
	},
	bottomStack: {
		position: 'absolute',
		left: 0,
		right: 0,
		gap: 6,
		paddingHorizontal: 16,
	},
	topStack: {
		position: 'absolute',
		left: 0,
		right: 0,
		paddingHorizontal: 16,
	},
	directionsFab: {
		position: 'absolute',
		right: 16,
		bottom: 72,
	},
	bannerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	bannerAction: {
		margin: 0,
	},
});
