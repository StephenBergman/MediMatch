<<<<<<< HEAD
import { HelloWave } from '@/components/hello-wave'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import SignOutButton from '@/components/social-auth-buttons/sign-out-button'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuthContext } from '@/hooks/use-Auth-context'
import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
=======
import { Image, type ImageSource } from 'expo-image';
import { Link, type Href } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
>>>>>>> 6ec2c3e5d47522d9959ce6e1bdeff68ff87fad40

type Tile = {
	title: string;
	description: string;
	image: ImageSource;
	href: Href;
};

const tiles: Tile[] = [
	{
		title: 'Component kitchen sink',
		description: 'Preview React Native Paper components and styles.',
		image: require('@/assets/images/react-logo.png') as ImageSource,
		href: '/dev/kitchensink/kitchensink',
	},
	{
		title: 'Error handling playground',
		description: 'Trigger errors to validate boundaries and reporting.',
		image: require('@/assets/images/splash-icon.png') as ImageSource,
		href: '/dev/errortesting',
	},
];

/** Dev-only hub linking to kitchen sink and error testing utilities. */
export default function HomeScreen() {
<<<<<<< HEAD
  const { profile } = useAuthContext()

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Username</ThemedText>
        <ThemedText>{profile?.username}</ThemedText>
        <ThemedText type="subtitle">Full name</ThemedText>
        <ThemedText>{profile?.full_name}</ThemedText>
      </ThemedView>
      <SignOutButton />
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})
=======
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];

	if (!__DEV__) {
		return (
			<ThemedView style={[styles.container, { padding: 24 }]}>
				<ThemedText type="title">
					Developer tools are only available in dev builds.
				</ThemedText>
				<ThemedText style={{ marginTop: 8 }}>
					Launch the dev client to access the kitchen sink and error testing screens.
				</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ScrollView
			contentContainerStyle={[
				styles.container,
				{ backgroundColor: colors.background, padding: 20 },
			]}
		>
			<ThemedText type="title" style={styles.heading}>
				Developer toolbox
			</ThemedText>
			<ThemedText style={[styles.subhead, { color: colors.secondary }]}>
				Jump into the component kitchen sink or exercise error boundaries.
			</ThemedText>

			<View style={styles.grid}>
				{tiles.map((tile) => (
					<Link key={String(tile.href)} href={tile.href} asChild>
						<Pressable style={[styles.card, { borderColor: colors.border }]}>
							<Image source={tile.image} style={styles.image} contentFit="cover" />
							<View style={styles.cardContent}>
								<ThemedText type="subtitle">{tile.title}</ThemedText>
								<ThemedText style={{ color: colors.secondary }}>
									{tile.description}
								</ThemedText>
							</View>
						</Pressable>
					</Link>
				))}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		gap: 12,
	},
	heading: {
		marginBottom: 4,
	},
	subhead: {
		marginBottom: 12,
	},
	grid: {
		gap: 16,
	},
	card: {
		borderWidth: 1,
		borderRadius: 16,
		overflow: 'hidden',
		backgroundColor: 'transparent',
	},
	image: {
		width: '100%',
		height: 180,
	},
	cardContent: {
		padding: 12,
		gap: 4,
	},
});
>>>>>>> 6ec2c3e5d47522d9959ce6e1bdeff68ff87fad40
