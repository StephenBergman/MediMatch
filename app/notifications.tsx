import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider, List, Switch } from 'react-native-paper';

const Notifications = () => {
	const router = useRouter();
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const styles = React.useMemo(() => createStyles(colors), [colors]);

	const [isPushEnabled, setIsPushEnabled] = React.useState(true);
	const [isEmailEnabled, setIsEmailEnabled] = React.useState(false);
	const [isTextMessageEnabled, setIsTextMessageEnabled] = React.useState(false);
	const [isAlertSoundEnabled, setIsAlertSoundEnabled] = React.useState(true);
	
	const togglePushNotifications = () =>
		setIsPushEnabled((previousState) => !previousState);
	const toggleEmailNotifications = () =>
		setIsEmailEnabled((previousState) => !previousState);
	const toggleTextMessageNotifications = () =>
		setIsTextMessageEnabled((previousState) => !previousState);
	const toggleAlertSound = () =>
		setIsAlertSoundEnabled((previousState) => !previousState);

	return (
		<View style={styles.mainContainer}>
			<View style={styles.mainHeader}>
				<MaterialCommunityIcons
					style={styles.mainHeaderIcon}
					name="bell-outline"
					size={50}
					color={colors.primary}
				>
					<Text style={styles.notificationsTitle}>Notifications</Text>
				</MaterialCommunityIcons>
			</View>

			<View style={styles.subHeaderContainer}>
				<ScrollView>
					<List.Item
						title="Push Notifications"
						description="Receive notifications on your device"
						titleStyle={{ color: colors.text }}
						descriptionStyle={{ color: colors.tabIconDefault }}
						right={() => (
							<Switch
								value={isPushEnabled}
								onValueChange={togglePushNotifications}
								color={colors.primary}
							/>
						)}
					/>
					<Divider style={styles.dividerLine} />
					<List.Item
						title="Email Notifications"
						description="Receive notifications via email"
						titleStyle={{ color: colors.text }}
						descriptionStyle={{ color: colors.tabIconDefault }}
						right={() => (
							<Switch
								value={isEmailEnabled}
								onValueChange={toggleEmailNotifications}
								color={colors.primary}
							/>
						)}
					/>
					<Divider style={styles.dividerLine} />
					<List.Item
						title="Text Message Notifications"
						description="Receive notifications via text message"
						titleStyle={{ color: colors.text }}
						descriptionStyle={{ color: colors.tabIconDefault }}
						right={() => (
							<Switch
								value={isTextMessageEnabled}
								onValueChange={toggleTextMessageNotifications}
								color={colors.primary}
							/>
						)}
					/>
					<Divider style={styles.dividerLine} />
					<List.Item
						title="Alert Sounds"
						description="Play a sound when receiving notifications"
						titleStyle={{ color: colors.text }}
						descriptionStyle={{ color: colors.tabIconDefault }}
						right={() => (
							<Switch
								value={isAlertSoundEnabled}
								onValueChange={toggleAlertSound}
								color={colors.primary}
							/>
						)}
					/>
					<Divider style={styles.dividerLine} />
				</ScrollView>

				<MaterialCommunityIcons
					name="arrow-left"
					size={34}
					color={colors.icon}
					style={styles.backButton}
					onPress={() => router.back()}
				/>
			</View>
		</View>
	);
};

export default Notifications;

const createStyles = (colors: typeof Colors.light) =>
	StyleSheet.create({
		mainContainer: {
			flex: 1,
			backgroundColor: colors.surface,
			alignItems: 'center',
			justifyContent: 'flex-start',
			paddingTop: 0,
			borderRadius: '',
			borderWidth: 3,
			borderColor: colors.surface,
		},
		subHeaderContainer: {
			flex: 1,
			backgroundColor: colors.card,
			borderRadius: 15,
			borderWidth: 3,
			borderColor: colors.card,
			width: '100%',
			marginTop: -10,
			marginBottom: -15,
		},
		mainHeader: {
			marginTop: 20,
			marginBottom: 25,
			marginLeft: -170,
		},
		notificationsTitle: {
			fontSize: 30,
			fontWeight: 'bold',
			textAlign: 'center',
			marginTop: 10,
			color: colors.text,
		},
		subheaderTitle: {
			fontSize: 25,
			fontWeight: 'bold',
			paddingLeft: -1,
			color: colors.text,
			marginBottom: 5,
			marginTop: 5,
		},
		dividerLine: {
			backgroundColor: colors.border,
			height: 2,
			width: '100%',
			marginLeft: 0,
		},
		mainHeaderIcon: {
			marginLeft: 130,
		},
		backButton: {
			marginTop: 20,
			marginBottom: 30,
			marginLeft: 20,
		},
	});
