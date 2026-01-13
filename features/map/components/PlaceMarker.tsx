import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo, useRef } from 'react';
import { Marker } from 'react-native-maps';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { PlaceResult } from '../api/places';

type Props = {
	place: PlaceResult;
	onRoute?: (place: PlaceResult) => void;
	onSelect?: (place: PlaceResult) => void;
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

const LONG_PRESS_MS = 520;

export function PlaceMarker({ place, onRoute, onSelect }: Props) {
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const markerRef = useRef<InstanceType<typeof Marker>>(null);
	const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const didLongPress = useRef(false);
	const { title, address, iconName } = useMemo(() => {
		const config = getIconConfig(place.types);
		const computedTitle =
			place.name?.trim() || config.label || 'Medical location';
		const computedAddress =
			place.address?.trim() ||
			(place.types.length ? place.types.join(', ') : 'Nearby care location');
		return {
			title: computedTitle,
			address: computedAddress,
			iconName: (config.icon as IconName) ?? 'map-marker',
		};
	}, [place.address, place.name, place.types]);

	const handlePress = () => {
		if (didLongPress.current) {
			didLongPress.current = false;
			return;
		}
		onSelect?.(place);
		markerRef.current?.showCallout();
	};

	const handlePressIn = () => {
		if (!onRoute) return;
		longPressTimer.current = setTimeout(() => {
			didLongPress.current = true;
			onSelect?.(place);
			onRoute(place);
			markerRef.current?.hideCallout();
		}, LONG_PRESS_MS);
	};

	const handlePressOut = () => {
		if (longPressTimer.current) {
			clearTimeout(longPressTimer.current);
			longPressTimer.current = null;
		}
	};

	return (
		<Marker
			ref={markerRef}
			coordinate={{ latitude: place.latitude, longitude: place.longitude }}
			anchor={{ x: 0.5, y: 1 }}
			tracksViewChanges={false}
			onPress={handlePress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			title={title}
			description={address}
		>
			<MaterialCommunityIcons name={iconName} size={32} color={colors.accent} />
		</Marker>
	);
}
