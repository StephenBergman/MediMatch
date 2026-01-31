import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider, List, Switch } from 'react-native-paper';

const settingsMoreSettings = () => {
	const router = useRouter();
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const styles = React.useMemo(() => createStyles(colors), [colors]);
    const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
	const [offlineModeEnabled, setOfflineModeEnabled] = React.useState(false);
	const [soundOnTypingEnabled, setSoundOnTypingEnabled] = React.useState(false);
	const [clearChatHistory, setClearChatHistory] = React.useState(false);
	const [voiceOverEnabled, setVoiceOverEnabled] = React.useState(false);
	const [displayTextSize, setDisplayTextSize] = React.useState(false);

	const toggleDarkMode = () =>
		setDarkModeEnabled((previousState) => !previousState);

	const toggleOfflineMode = () =>
		setDarkModeEnabled((previousState) => !previousState);

	const toggleSoundOnTyping = () =>
		setSoundOnTypingEnabled((previousState) => !previousState);

	const toggleClearChatHistory = () =>
		setClearChatHistory((previousState) => !previousState);

	const toggleVoiceOver = () =>
		setVoiceOverEnabled((previousState) => !previousState);
	
	const toggleDisplayTextSize = () =>
		setDisplayTextSize((previousState) => !previousState);

	return (
		<View style={styles.mainContainer}>
			<View style={styles.mainHeader}>
				<MaterialCommunityIcons
					style={styles.mainHeaderIcon}
					name="cog-outline"
					size={50}
					color={colors.primary}
				>
					<Text style={styles.notificationsTitle}>More Settings</Text>
				</MaterialCommunityIcons>
			</View>

			<View style={styles.subHeaderContainer}>
				<ScrollView>
					<List.Item
						title="Dark Mode"
						description="Changes the app theme to dark or light mode"
						titleStyle={{ color: colors.text }}
						descriptionStyle={{ color: colors.tabIconDefault }}
						right={() => (
							<Switch
								value={darkModeEnabled}
								onChange={() => setDarkModeEnabled(!darkModeEnabled)}
								color={colors.primary}
							/>
						)}
					/>
					<Divider style={styles.dividerLine} />

					<List.Item
						title="Offline Mode"
						description="App works without internet connection with limited functionality"
						titleStyle={{ color: colors.text }}
						descriptionStyle={{ color: colors.tabIconDefault }}
						right={() => (
							<Switch
								value={offlineModeEnabled}
								onChange={() => setOfflineModeEnabled(!offlineModeEnabled)}
								color={colors.primary}
							/>
						)}
					/>
					<Divider style={styles.dividerLine} />

					<List.Item
						title="Sound while Typing"
						description="Play a sound when typing"
						titleStyle={{ color: colors.text }}
						descriptionStyle={{ color: colors.tabIconDefault }}
						right={() => (
							<Switch
								value={soundOnTypingEnabled}
								onChange={() => setSoundOnTypingEnabled(!soundOnTypingEnabled)}
								color={colors.primary}
							/>
						)}
					/>
					<Divider style={styles.dividerLine} />

					<List.Item
						title="Voice Over"
						description="Voice feedback while typing or reading information on screen"
						titleStyle={{ color: colors.text }}
						descriptionStyle={{ color: colors.tabIconDefault }}
						right={() => (
							<Switch
								value={soundOnTypingEnabled}
								onChange={() => setSoundOnTypingEnabled(!soundOnTypingEnabled)}
								color={colors.primary}
							/>
						)}
					/>
					<Divider style={styles.dividerLine} />

					<List.Item
						title="Display Text Size"
						description="Adjust the size of the text displayed in the app"
						titleStyle={{ color: colors.text }}
						descriptionStyle={{ color: colors.tabIconDefault }}
						right={() => (
							<Switch
								value={soundOnTypingEnabled}
								onChange={() => setSoundOnTypingEnabled(!soundOnTypingEnabled)}
								color={colors.primary}
							/>
						)}
					/>
					<Divider style={styles.dividerLine} />
					
					<List.Item
						title="Clear Chat History"
						description="Delete all chat history"
						titleStyle={{ color: colors.text }}
						descriptionStyle={{ color: colors.tabIconDefault }}
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

export default settingsMoreSettings;

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
