import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, {
	Marker,
	PROVIDER_GOOGLE,
	type Region,
} from 'react-native-maps';
import {
	Icon,
	IconButton,
	Surface,
	Text,
	TouchableRipple,
	useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlaceMarker } from '@/features/map/components/PlaceMarker';
import { useCachedUserLocation } from '@/features/map/hooks/useCachedUserLocation';
import { usePlacesSearch } from '@/features/map/hooks/usePlacesSearch';

const initialRegion: Region = {
	latitude: 37.7749,
	longitude: -122.4194,
	latitudeDelta: 0.08,
	longitudeDelta: 0.08,
};

const mapProvider = Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined;

/** Fullscreen map experience with a starter marker. */
export function MapExperience() {
	const theme = useTheme();
	const colors = theme.colors;
	const insets = useSafeAreaInsets();
	const mapRef = useRef<MapView | null>(null);
	const { region: cachedUserRegion, refresh } = useCachedUserLocation();
	const hasCenteredOnUser = useRef(false);
	const [mapRegion, setMapRegion] = useState<Region>(initialRegion);
	const [userRegion, setUserRegion] = useState<Region | null>(null);
	const {
		places,
		status: placesStatus,
		error: placesError,
		refetch,
	} = usePlacesSearch(mapRegion);

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
				showsMyLocationButton={false}
				onRegionChangeComplete={handleRegionChange}
			>
				{places.map((place) => (
					<PlaceMarker key={place.id} place={place} />
				))}
				<Marker
					coordinate={userRegion ?? cachedUserRegion ?? initialRegion}
					title="Your location"
					description="Current position"
					pinColor={colors.primary}
				/>
			</MapView>
			<View style={styles.controls} pointerEvents="box-none">
				{placesStatus === 'error' ? (
					<Surface
						style={[
							styles.banner,
							{
								backgroundColor: colors.surface,
								borderColor: colors.outline,
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
				<Surface
					style={[
						styles.fabContainer,
						{
							bottom: 20 + insets.bottom,
							right: 20,
							backgroundColor: colors.surface,
							borderColor: colors.outline,
						},
					]}
					elevation={2}
					pointerEvents="box-none"
				>
					<TouchableRipple
						onPress={handleCenterOnUser}
						style={[
							styles.centerButton,
							{
								backgroundColor: colors.surface,
								borderColor: colors.outline,
							},
						]}
						rippleColor={colors.backdrop}
						accessibilityRole="button"
						accessibilityLabel="Center on my location"
					>
						<Icon source="crosshairs-gps" size={26} color={colors.onSurface} />
					</TouchableRipple>
				</Surface>
			</View>
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
	fabContainer: {
		position: 'absolute',
		borderRadius: 34,
		borderWidth: 1,
		padding: 6,
	},
	banner: {
		position: 'absolute',
		left: 16,
		right: 16,
		bottom: 90,
		borderRadius: 12,
		borderWidth: 1,
		paddingVertical: 10,
		paddingHorizontal: 12,
	},
	bannerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	bannerAction: {
		margin: 0,
	},
	centerButton: {
		borderRadius: 30,
		borderWidth: 1,
		minWidth: 60,
		minHeight: 60,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
