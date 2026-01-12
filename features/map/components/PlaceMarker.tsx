import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { PlaceResult } from '../api/places';

type Props = {
	place: PlaceResult;
};

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const typeIconMap: Record<string, { icon: IconName | string; label: string }> = {
	hospital: { icon: 'hospital-building', label: 'Hospital' },
	pharmacy: { icon: 'pharmacy', label: 'Pharmacy' },
	urgent_care: { icon: 'medical-bag', label: 'Urgent Care' },
	health: { icon: 'medical-bag', label: 'Clinic' },
	doctor: { icon: 'stethoscope', label: 'Clinic' },
	dentist: { icon: 'tooth-outline', label: 'Dentist' },
	optometrist: { icon: 'glasses', label: 'Optical' },
	optician: { icon: 'glasses', label: 'Optical' },
	vision: { icon: 'eye-outline', label: 'Optical' },
	veterinary_care: { icon: 'paw', label: 'Vet' },
};

function getIconConfig(types: string[]) {
	for (const type of types) {
		const match = typeIconMap[type];
		if (match) return match;
	}
	// Keyword fallback based on our search terms
	const normalized = types.join(' ');
	if (normalized.includes('urgent')) return typeIconMap.urgent_care;
	if (normalized.includes('vet')) return typeIconMap.veterinary_care;
	if (normalized.includes('pharmacy')) return typeIconMap.pharmacy;
	if (normalized.includes('opt')) return typeIconMap.optometrist;
	if (normalized.includes('hospital')) return typeIconMap.hospital;
	return { icon: 'map-marker', label: 'Medical' };
}

export function PlaceMarker({ place }: Props) {
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const iconConfig = getIconConfig(place.types);
	const title = place.name?.trim() || iconConfig.label || 'Medical location';
	const address =
		place.address?.trim() ||
		(place.types.length ? place.types.join(', ') : 'Nearby care location');
	const iconName = (iconConfig.icon as IconName) ?? 'map-marker';

	return (
		<Marker
			coordinate={{ latitude: place.latitude, longitude: place.longitude }}
			anchor={{ x: 0.5, y: 1 }}
			calloutAnchor={{ x: 0.5, y: 0 }}
			tracksViewChanges={false}
		>
			<View
				style={[
					styles.marker,
					{
						backgroundColor: colors.card,
						borderColor: colors.border,
					},
				]}
			>
				<MaterialCommunityIcons
					name={iconName}
					size={22}
					color={colors.accent}
				/>
			</View>
			<Callout>
				<View
					style={[
						styles.callout,
						{
							backgroundColor: colors.card,
							borderColor: colors.border,
						},
					]}
				>
					<Text style={[styles.calloutTitle, { color: colors.text }]}>
						{title}
					</Text>
					<Text style={{ color: colors.secondary }}>{iconConfig.label}</Text>
					<Text style={[styles.calloutAddress, { color: colors.text }]}>
						{address}
					</Text>
				</View>
			</Callout>
		</Marker>
	);
}

const styles = StyleSheet.create({
	marker: {
		borderRadius: 16,
		borderWidth: 1,
		padding: 8,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 3,
		elevation: 2,
	},
	callout: {
		borderRadius: 12,
		borderWidth: 1,
		padding: 10,
		maxWidth: 220,
	},
	calloutTitle: {
		fontWeight: '600',
		marginBottom: 4,
	},
	calloutAddress: {
		marginTop: 4,
	},
});
