import ScreenView from '@/components/Tools/ScreenView';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

const tiles = [
	{
		title: 'Paper Kitchen Sink',
		description: 'Explore examples built with React Native Paper.',
		image:
			'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80',
		route: '/dev/kitchensink/kitchensink',
	},
	{
		title: 'Error Testing',
		description: 'Trigger runtime errors and test handling.',
		image:
			'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
		route: '/dev/errortesting',
	},
];

const KitchenSinkHub = () => {
	return (
		<ScreenView padded>
			<Text variant="headlineMedium" style={styles.heading}>
				Demos
			</Text>
			<View style={styles.grid}>
				{tiles.map((tile) => (
					<Card
						key={tile.route}
						style={styles.card}
						onPress={() => router.push(tile.route)}
					>
						<Card.Cover source={{ uri: tile.image }} />
						<Card.Title title={tile.title} subtitle={tile.description} />
					</Card>
				))}
			</View>
		</ScreenView>
	);
};

const styles = StyleSheet.create({
	heading: {
		marginBottom: 16,
	},
	grid: {
		flexDirection: 'row',
		gap: 16,
		flexWrap: 'wrap',
	},
	card: {
		flexBasis: '48%',
	},
});

export default KitchenSinkHub;
