import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useRef } from 'react';
import { Marker } from 'react-native-maps';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { PlaceResult } from '../api/places';

type Props = {
	place: PlaceResult;
};

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const typeIconMap: Record<string, { icon: IconName | string; label: string }> =
	{
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
	const markerRef = useRef<Marker | null>(null);
	const { iconConfig, title, address, iconName } = useMemo(() => {
		const config = getIconConfig(place.types);
		const computedTitle =
			place.name?.trim() || config.label || 'Medical location';
		const computedAddress =
			place.address?.trim() ||
			(place.types.length ? place.types.join(', ') : 'Nearby care location');
		return {
			iconConfig: config,
			title: computedTitle,
			address: computedAddress,
			iconName: (config.icon as IconName) ?? 'map-marker',
		};
	}, [place.address, place.name, place.types]);

	const handlePress = () => {
		markerRef.current?.showCallout();
	};

	return (
		<Marker
			ref={markerRef}
			coordinate={{ latitude: place.latitude, longitude: place.longitude }}
			anchor={{ x: 0.5, y: 1 }}
			calloutAnchor={{ x: 0.5, y: 0 }}
			tracksViewChanges={false}
			onPress={handlePress}
			title={title}
			description={address}
		>
			<MaterialCommunityIcons name={iconName} size={32} color={colors.accent} />
		</Marker>
	);
}

const styles = StyleSheet.create({});
