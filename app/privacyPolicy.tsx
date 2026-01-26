import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const PrivacyPolicy = () => {
	const router = useRouter();
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const styles = React.useMemo(() => createStyles(colors), [colors]);

	return (
		<View style={styles.mainContainer}>
			<View style={styles.mainPrivacyPolicyHeader}>
				<MaterialCommunityIcons
					style={styles.privacyPolicyIcon}
					name="lock-outline"
					size={50}
					color={colors.primary}
				>
					<Text style={styles.privacyPolicyTitle}>Privacy Policy</Text>
				</MaterialCommunityIcons>
			</View>

			<View style={styles.subSettingsContainer}>
				<ScrollView>
					<Text style={styles.privacyPolicyText}>
						{'\n'}
						MediMatch Privacy Policy
						{'\n'}
						{'\n'}
						Last updated: [Insert Date]
						{'\n'}
						{'\n'}
						This Privacy Policy describes how [Your Company Name] (“we”, “us”,
						or “our”) collects, uses, and shares your personal information when
						you use the mobile application [App Name] (the “App”).
						{'\n'}
						{'\n'}
						Information We Collect
						{'\n'}
						{'\n'}
						We may collect the following types of information: • Personal
						Information: such as your name, email address, and account
						information when you register or log in. • Usage Information: data
						about how you interact with our App, including pages visited,
						features used, and timestamps. • Analytics Data: aggregated and
						anonymized usage data to help improve the App’s performance.
						{'\n'}
						{'\n'}
						How We Use Your Information
						{'\n'}
						{'\n'}
						We use your information to: • Provide, maintain, and improve the
						functionality of the App. • Personalize your experience and deliver
						content that is relevant to you. • Communicate with you about
						updates, support, and promotional offers. • Comply with legal
						obligations and enforce our terms.
						{'\n'}
						{'\n'}
						Information Sharing
						{'\n'}
						{'\n'}
						We do not sell your personal information. We may share your data
						with: • Service providers who help operate or maintain the App. •
						Legal authorities if required by law or to protect our rights.
						{'\n'}
						{'\n'}
						Data Security
						{'\n'}
						{'\n'}
						We adopt reasonable technical and organizational measures to protect
						your personal data.
						{'\n'}
						{'\n'}
						Your Choices
						{'\n'}
						{'\n'}
						You may access, correct, or delete your personal data by contacting
						us at [Contact Email].
						{'\n'}
						{'\n'}
						Children’s Privacy Our App is not intended for children under the
						age of 13. If we discover that we have collected personal data from
						a child under 13, we will delete such data as soon as possible.
						{'\n'}
						{'\n'}
						Changes to This Policy
						{'\n'}
						{'\n'}
						We may update this Privacy Policy from time to time. If we make
						material changes, we will notify you within the App or by email.
						{'\n'}
						{'\n'}
						Contact Us
						{'\n'}
						{'\n'}
						If you have any questions about this Privacy Policy,
						{'\n'}
						please contact us at:
						{'\n'}
						{'\n'}
						[Contact Email]
						{'\n'}
						[Company Address — optional]
						{'\n'}
					</Text>
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

export default PrivacyPolicy;

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
		subSettingsContainer: {
			flex: 1,
			backgroundColor: colors.card,
			borderRadius: 15,
			borderWidth: 3,
			borderColor: colors.card,
			width: '100%',
			marginTop: -10,
			marginBottom: -15,
		},
		settingsTitle: {
			fontSize: 40,
			textAlign: 'center',
			alignContent: 'center',
			marginTop: 80,
			marginBottom: 20,
			marginHorizontal: 20,
			fontWeight: 'bold',
			marginLeft: -80,
		},
		mainPrivacyPolicyHeader: {
			marginTop: 20,
			marginBottom: 25,
			marginLeft: -170,
		},
		privacyPolicyTitle: {
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
			height: 4,
			width: '100%',
			marginLeft: 0,
		},
		privacyPolicyIcon: {
			marginLeft: 130,
		},
		backButton: {
			marginTop: 20,
			marginBottom: 30,
			marginLeft: 20,
		},
		privacyPolicyText: {
			fontSize: 16,
			marginHorizontal: 15,
			textAlign: 'left',
			color: colors.text,
		},
	});
