import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';

const VerificationCodeNP = () => {
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const styles = React.useMemo(() => createStyles(colors), [colors]);

	//for users email entry
	const [password, setPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');

	return (
		<View style={styles.mainContainer}>
			<Text style={styles.verificationCode_NP_Title}>Verify New Password</Text>

			<Text style={styles.inputLabels}>Create New Password</Text>

			<TextInput
				style={styles.verificationCode_NP_EmailInputBox}
				onChangeText={(text) => setPassword(text)}
				value={password}
				secureTextEntry={false}
				autoCapitalize="none"
				placeholderTextColor={colors.tabIconDefault}
			/>

			<Text style={styles.inputLabels}>Confirm New Password</Text>

			<TextInput
				style={styles.verificationCode_NP_EmailInputBox}
				onChangeText={(text) => setConfirmPassword(text)}
				value={confirmPassword}
				secureTextEntry={true}
				autoCapitalize="none"
				placeholderTextColor={colors.tabIconDefault}
			/>

			<Button
				mode="contained"
				textColor={colors.inverseText}
				style={styles.verificationCode_NP_Button}
				onPress={() => {
					router.replace('../login');
				}}
			>
				Confirm New Password
			</Button>
		</View>
	);
};

export default VerificationCodeNP;

type ThemeColors = typeof Colors.light | typeof Colors.dark;

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		mainContainer: {
			flex: 1,
			backgroundColor: colors.surface,
			paddingHorizontal: 16,
		},
		verificationCode_NP_Title: {
			fontSize: 16,
			color: colors.text,
			fontWeight: 'bold',
			textAlign: 'center',
			marginTop: 40,
			marginBottom: 30,
		},
		verificationCode_NP_EnterEmailText: {
			fontSize: 18,
			color: colors.text,
			fontWeight: 'bold',
			textAlign: 'center',
			marginTop: 40,
			marginBottom: -12,
		},
		verificationCode_NP_EmailInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			alignSelf: 'center',
			width: '80%',
			backgroundColor: colors.card,
			color: colors.text,
		},
		backToSignInText: {
			fontSize: 14,
			color: colors.text,
			fontWeight: 'bold',
			textAlign: 'center',
			marginTop: -5,
		},
		verificationCode_NP_Button: {
			width: '50%',
			alignSelf: 'center',
			backgroundColor: colors.primary,
			marginTop: 20,
			padding: 5,
			borderRadius: 5,
		},
		haveAnAccountText: {
			fontSize: 20,
			color: colors.text,
			fontWeight: 'bold',
			textAlign: 'center',
			marginTop: -5,
		},
		signUpButton: {
			width: '50%',
			alignSelf: 'center',
			backgroundColor: colors.primary,
			marginTop: 20,
			padding: 5,
			borderRadius: 5,
		},
		googleButton: {
			width: '50%',
			alignSelf: 'center',
			backgroundColor: colors.primary,
			marginTop: 20,
			padding: 5,
			borderRadius: 5,
		},
		bottomButtonGroup: {
			marginTop: 300,
			alignItems: 'center',
			paddingBottom: 20,
		},
		orText: {
			fontSize: 20,
			color: colors.text,
			fontWeight: 'bold',
			textAlign: 'center',
			marginTop: 20,
			marginBottom: 3,
		},
		inputLabels: {
			fontSize: 14,
			color: colors.text,
			marginLeft: 45,
			marginBottom: -14,
		},
	});
