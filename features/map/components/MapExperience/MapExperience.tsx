import React, { useCallback, useEffect, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCachedUserLocation } from '@/features/map/hooks/useCachedUserLocation';
import { usePlacesSearch } from '@/features/map/hooks/usePlacesSearch';
import { PlaceMarker } from '@/features/map/components/PlaceMarker';

const initialRegion: Region = {
	latitude: 37.7749,
	longitude: -122.4194,
	latitudeDelta: 0.08,
	longitudeDelta: 0.08,
};

/** Fullscreen map experience with a starter marker. */
export function MapExperience() {
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const insets = useSafeAreaInsets();
	const mapRef = useRef<MapView | null>(null);
	const { region: cachedUserRegion, refresh } = useCachedUserLocation();
	const hasCenteredOnUser = useRef(false);
	const [mapRegion, setMapRegion] = useState<Region>(initialRegion);
	const [userRegion, setUserRegion] = useState<Region | null>(null);
	const { places, status: placesStatus, error: placesError, refetch } =
		usePlacesSearch(mapRegion);

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
		<ThemedView style={styles.container}>
			<MapView
				ref={mapRef}
				provider={PROVIDER_GOOGLE}
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
						<View
							style={[
								styles.banner,
								{
									backgroundColor: colors.card,
									borderColor: colors.border,
								},
							]}
						>
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
								<MaterialCommunityIcons
									name="alert-circle-outline"
									size={18}
									color={colors.danger}
								/>
								<View style={{ flex: 1 }}>
									<Text style={{ color: colors.text }}>
										{placesError || 'Places lookup failed.'}
									</Text>
								</View>
								<Pressable onPress={refetch} hitSlop={8}>
									<MaterialCommunityIcons
										name="refresh"
										size={18}
										color={colors.icon}
									/>
								</Pressable>
							</View>
						</View>
					) : null}
					<View
						style={[
							styles.fabContainer,
							{
								bottom: 20 + insets.bottom,
							right: 20,
							backgroundColor: colors.surface,
							borderColor: colors.border,
						},
					]}
					pointerEvents="box-none"
				>
					<Pressable
						onPress={handleCenterOnUser}
						style={({ pressed }) => [
							styles.fab,
							{
								backgroundColor: pressed ? colors.muted : colors.card,
								borderColor: colors.border,
							},
						]}
						accessibilityRole="button"
						accessibilityLabel="Center on my location"
						hitSlop={10}
					>
						<MaterialCommunityIcons
							name="crosshairs-gps"
							size={26}
							color={colors.icon}
						/>
					</Pressable>
				</View>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: 'hidden',
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
	fab: {
		position: 'absolute',
		borderRadius: 30,
		borderWidth: 1,
		minWidth: 60,
		minHeight: 60,
		paddingHorizontal: 14,
		paddingVertical: 14,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 3,
		shadowColor: '#000',
		shadowOpacity: 0.12,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
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
		elevation: 2,
	},
});
