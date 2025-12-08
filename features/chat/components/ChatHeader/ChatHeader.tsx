import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Avatar, Chip, Text } from 'react-native-paper';

import { Colors } from '@/constants/theme';

const palette = Colors.palette;

type Props = {
	onReset: () => void;
	messageCount: number;
	isTyping: boolean;
};

/** Header for the chat screen showing assistant presence, meta chips, and a reset action. */
export function ChatHeader({ onReset, messageCount, isTyping }: Props) {
	return (
		<View style={styles.headerWrap}>
			<Appbar.Header mode="small" style={styles.header}>
				<View style={styles.titleRow}>
					<View style={styles.avatarWrap}>
						<Avatar.Text size={40} label="AI" style={styles.avatar} />
						<View style={styles.presence} />
					</View>
					<View style={styles.meta}>
						<Text variant="titleMedium" style={styles.title}>
							MediMatch Assistant
						</Text>
						<Text variant="labelSmall" style={styles.subtitle}>
							{isTyping ? 'Responding now…' : 'Typically replies in seconds'}
						</Text>
					</View>
				</View>
				<Appbar.Action
					icon="delete-sweep"
					onPress={onReset}
					accessibilityLabel="Clear conversation"
					color={palette.white}
				/>
			</Appbar.Header>
			<View style={styles.chips}>
				<Chip compact icon="shield-check" mode="outlined">
					Private
				</Chip>
				<Chip compact icon="clock-outline" mode="outlined">
					{messageCount || 'No'} messages
				</Chip>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	headerWrap: {
		backgroundColor: palette.midnight,
		paddingBottom: 0,
	},
	header: {
		backgroundColor: palette.midnight,
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingTop: 4,
		paddingBottom: 4,
	},
	titleRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
	},
	avatarWrap: {
		position: 'relative',
	},
	avatar: {
		backgroundColor: palette.teal,
	},
	presence: {
		position: 'absolute',
		bottom: 2,
		right: 4,
		width: 10,
		height: 10,
		borderRadius: 999,
		backgroundColor: palette.green,
		borderWidth: 1,
		borderColor: palette.midnight,
	},
	meta: {
		flex: 1,
		gap: 2,
		alignItems: 'center',
	},
	title: {
		color: palette.white,
		fontWeight: '700',
		textAlign: 'center',
	},
	subtitle: {
		color: palette.sky,
		textAlign: 'center',
	},
	chips: {
		flexDirection: 'row',
		gap: 6,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 12,
		paddingBottom: 2,
		marginTop: 2,
	},
});
