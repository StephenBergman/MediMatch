import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Avatar, Text } from 'react-native-paper';

import { useAppToast } from '@/components/contexts/AppToastProvider';
import { Colors } from '@/constants/theme';
import { supabase } from '@/features/auth/api/supabaseClient';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

const Profile = () => {
	const { user, profile } = useAuth();
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const styles = useMemo(() => createStyles(colors), [colors]);
	const { showToast } = useAppToast();
	const [avatarUri, setAvatarUri] = useState<string | null>(
		profile?.avatarUrl ??
			(user?.user_metadata?.avatar_url as string | undefined) ??
			null,
	);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		setAvatarUri(profile?.avatarUrl ?? null);
	}, [profile?.avatarUrl]);

	const profileRow = profile ?? null;

	const handlePickAvatar = useCallback(async () => {
		if (!user) {
			showToast('Please sign in to update your avatar.');
			return;
		}

		if (isUploading) {
			return;
		}

		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permission.status !== 'granted') {
			showToast('Please allow photo access to upload an avatar.');
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.7,
		});

		if (result.canceled || !result.assets?.length) {
			return;
		}

		const asset = result.assets[0];
		const localUri = asset.uri;
		setAvatarUri(localUri);

		const mimeType = asset.mimeType ?? 'image/jpeg';
		const extension = mimeType.split('/')[1] || 'jpg';
		const filePath = `${user.id}.${extension}`;

		try {
			setIsUploading(true);
			const { error: uploadError } = await supabase.storage
				.from('avatars')
				.upload(filePath, await (await fetch(localUri)).arrayBuffer(), {
					contentType: mimeType,
					upsert: true,
				});

			if (uploadError) {
				throw uploadError;
			}

			const { data: publicData } = supabase.storage
				.from('avatars')
				.getPublicUrl(filePath);

			const publicUrl = publicData.publicUrl;
			if (!publicUrl) {
				throw new Error('Unable to resolve avatar URL.');
			}

			const { error: profileError } = await supabase
				.from('profiles')
				.update({ avatar_url: publicUrl })
				.eq('id', user.id);

			if (profileError) {
				throw profileError;
			}

			setAvatarUri(publicUrl);
			showToast('Avatar updated.');
		} catch (error) {
			console.error('[profile] avatar upload failed', error);
			showToast('Unable to upload avatar. Please try again.');
		} finally {
			setIsUploading(false);
		}
	}, [isUploading, showToast, user]);

	const displayName = useMemo(() => {
		const first =
			profileRow?.first_name?.trim() ?? profile?.firstName?.trim() ?? '';
		const last =
			profileRow?.last_name?.trim() ?? profile?.lastName?.trim() ?? '';
		return [first, last].filter(Boolean).join(' ') || 'New user';
	}, [profile?.firstName, profile?.lastName, profileRow]);

	const profileSections = useMemo(() => {
		const firstName = profile?.firstName ?? null;
		const lastName = profile?.lastName ?? null;
		const dob = profile?.dob ?? null;
		const email = profile?.email ?? user?.email ?? null;

		const sections = [
			{
				title: 'Profile',
				rows: [
					{ label: 'First name', value: firstName },
					{ label: 'Last name', value: lastName },
					{ label: 'Date of birth', value: dob },
					{ label: 'Gender', value: profile?.gender ?? null },
				],
			},
			{
				title: 'Contact',
				rows: [
					{ label: 'Email', value: email },
					{
						label: 'Secondary email',
						value: profile?.secondaryEmail ?? null,
					},
					{ label: 'Phone number', value: profile?.phoneNumber ?? null },
				],
			},
			{
				title: 'Location',
				rows: [
					{ label: 'Zip code', value: profile?.zipCode ?? null },
					{ label: 'City', value: profile?.city ?? null },
					{ label: 'State', value: profile?.state ?? null },
					{ label: 'Country', value: profile?.country ?? null },
				],
			},
			{
				title: 'Health Insurance',
				rows: [
					{
						label: 'Provider',
						value: profile?.healthInsuranceProviderName ?? null,
					},
					{
						label: 'Policy number',
						value: profile?.healthInsuranceNumber ?? null,
					},
				],
			},
		];

		return sections
			.map((section) => ({
				...section,
				rows: section.rows.filter((row) => row.value && `${row.value}`.trim()),
			}))
			.filter((section) => section.rows.length > 0);
	}, [profile, user]);

	const resolvedAvatarUri = avatarUri?.trim() || null;

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.headerCard}>
				<Pressable
					onPress={handlePickAvatar}
					style={styles.avatarWrap}
					disabled={isUploading}
				>
					{resolvedAvatarUri ? (
						<Avatar.Image
							size={120}
							source={{ uri: resolvedAvatarUri }}
							onError={(event) =>
								console.log('[] avatar image error', event.nativeEvent)
							}
						/>
					) : (
						<Avatar.Text size={120} label={displayName.slice(0, 2)} />
					)}
					<View style={styles.badge}>
						{isUploading ? (
							<ActivityIndicator size="small" color={colors.inverseText} />
						) : (
							<Avatar.Icon size={28} icon="camera" style={styles.badgeIcon} />
						)}
					</View>
				</Pressable>

				<Text variant="headlineSmall" style={styles.name}>
					{displayName}
				</Text>
				<Text variant="bodyMedium" style={styles.subtitle}>
					{user?.email ?? 'No email on file'}
				</Text>
			</View>

			{profileSections.length ? (
				profileSections.map((section) => (
					<View key={section.title} style={styles.infoCard}>
						<Text variant="titleMedium" style={styles.sectionTitle}>
							{section.title}
						</Text>
						{section.rows.map((row) => (
							<View key={row.label} style={styles.row}>
								<Text style={styles.label}>{row.label}</Text>
								<Text style={styles.value}>{row.value}</Text>
							</View>
						))}
					</View>
				))
			) : (
				<View style={styles.infoCard}>
					<Text variant="titleMedium" style={styles.sectionTitle}>
						Profile
					</Text>
					<Text style={styles.emptyState}>
						No profile details saved yet.
					</Text>
				</View>
			)}
		</ScrollView>
	);
};

export default Profile;

type ThemeColors = typeof Colors.light | typeof Colors.dark;

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			paddingHorizontal: 20,
			paddingTop: 32,
		},
		contentContainer: {
			paddingBottom: 32,
		},
		headerCard: {
			backgroundColor: colors.surface,
			borderRadius: 20,
			padding: 24,
			alignItems: 'center',
			borderWidth: 1,
			borderColor: colors.border,
			marginBottom: 20,
		},
		avatarWrap: {
			alignItems: 'center',
			justifyContent: 'center',
			marginBottom: 16,
		},
		badge: {
			position: 'absolute',
			bottom: 2,
			right: 2,
			borderRadius: 999,
			borderWidth: 2,
			borderColor: colors.surface,
			backgroundColor: colors.primary,
		},
		badgeIcon: {
			backgroundColor: colors.primary,
		},
		name: {
			color: colors.text,
			fontWeight: '700',
		},
		subtitle: {
			color: colors.tabIconDefault,
			marginTop: 4,
		},
		infoCard: {
			backgroundColor: colors.card,
			borderRadius: 18,
			padding: 20,
			borderWidth: 1,
			borderColor: colors.border,
			marginBottom: 16,
		},
		sectionTitle: {
			color: colors.text,
			marginBottom: 12,
			fontWeight: '600',
		},
		row: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			paddingVertical: 8,
			borderBottomWidth: 1,
			borderBottomColor: colors.border,
		},
		label: {
			color: colors.tabIconDefault,
		},
		value: {
			color: colors.text,
			fontWeight: '600',
		},
		emptyState: {
			color: colors.tabIconDefault,
		},
	});
