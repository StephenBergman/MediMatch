//this is the settings page, there will be sub settings included and logout option.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';

//this page will route to the login page after user accepts the terms and coniditions policy
import { useRouter } from 'expo-router';

//icons logic
import { useAppToast } from '@/components/contexts/AppToastProvider';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Signup = () => {
	const router = useRouter();
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const styles = React.useMemo(() => createStyles(colors), [colors]);
	const { session, signUpWithEmail, isLoading } = useAuth();
	const { showToast } = useAppToast();

	//profile inputs
	const [firstName, setFirstName] = React.useState('');
	const [lastName, setLastName] = React.useState('');
	const [dob, setDob] = React.useState('');
	const [username, setUsername] = React.useState('');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [confirmPassword, setConfirmPassword] = React.useState('');

	React.useEffect(() => {
		if (session) {
			router.replace('/(protected)/(tabs)/chat');
		}
	}, [session, router]);

	const formatDobInput = (value: string) => {
		const digits = value.replace(/\D/g, '').slice(0, 8);
		if (!digits) return '';
		const month = digits.slice(0, 2);
		const day = digits.slice(2, 4);
		const year = digits.slice(4, 8);
		return [month, day, year].filter(Boolean).join('/');
	};

	const parseDobToIso = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) return { iso: null as string | null };

		const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
		if (!match) {
			return { error: 'DOB must be in MM/DD/YYYY format.' };
		}

		const month = Number(match[1]);
		const day = Number(match[2]);
		const year = Number(match[3]);

		if (month < 1 || month > 12) {
			return { error: 'DOB month must be between 01 and 12.' };
		}
		if (day < 1 || day > 31) {
			return { error: 'DOB day must be between 01 and 31.' };
		}
		if (year < 1900 || year > new Date().getFullYear()) {
			return { error: 'DOB year looks invalid.' };
		}

		const iso = `${String(year).padStart(4, '0')}-${String(month).padStart(
			2,
			'0',
		)}-${String(day).padStart(2, '0')}`;

		const date = new Date(`${iso}T00:00:00Z`);
		if (
			Number.isNaN(date.getTime()) ||
			date.getUTCFullYear() !== year ||
			date.getUTCMonth() + 1 !== month ||
			date.getUTCDate() !== day
		) {
			return { error: 'DOB is not a valid calendar date.' };
		}

		return { iso };
	};

	const handleSignUp = async () => {
		if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
			showToast('Please complete all required fields.');
			return;
		}

		if (password !== confirmPassword) {
			showToast('Passwords do not match.');
			return;
		}

		const { iso, error: dobError } = parseDobToIso(dob);
		if (dobError) {
			showToast(dobError);
			return;
		}

		const { error, needsEmailConfirmation } = await signUpWithEmail({
			email: email.trim(),
			password,
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			dob: iso,
			username: username.trim() ? username.trim() : undefined,
		});

		if (error) {
			showToast(error);
			return;
		}

		if (needsEmailConfirmation) {
			showToast('Check your email to confirm your account.');
			router.replace('/login');
			return;
		}

		router.replace('/(protected)/(tabs)/chat');
	};

	return (
		<View style={styles.mainContainer}>
			<View style={styles.mainSignUpHeader}>
				<MaterialCommunityIcons
					style={styles.signUpIcon}
					name="account"
					size={60}
					color={colors.primary}
				>
					<Text style={styles.settingsTitle}>Create Account</Text>
				</MaterialCommunityIcons>
			</View>

			<View style={styles.subSignUpContainer}>
				<ScrollView style={{ margin: 10 }}>
					<Text style={styles.inputLabels}>First Name</Text>
					<TextInput
						style={styles.signUpInputBox}
						placeholder="Enter Firstname"
						onChangeText={(text) => setFirstName(text)}
						value={firstName}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Last Name</Text>
					<TextInput
						style={styles.signUpInputBox}
						placeholder="Enter Lastname"
						onChangeText={(text) => setLastName(text)}
						value={lastName}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Date of Birth</Text>
					<TextInput
						style={styles.signUpInputBox}
						placeholder="MM/DD/YYYY"
						onChangeText={(text) => setDob(formatDobInput(text))}
						value={dob}
						autoCapitalize="none"
						keyboardType="number-pad"
						maxLength={10}
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Username</Text>
					<TextInput
						style={styles.signUpInputBox}
						placeholder="Create Username"
						onChangeText={(text) => setUsername(text)}
						value={username}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Email Address</Text>
					<TextInput
						style={styles.signUpInputBox}
						placeholder="Enter Email"
						onChangeText={(text) => setEmail(text)}
						value={email}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Create Password</Text>
					<TextInput
						style={styles.signUpInputBox}
						placeholder="Enter Password"
						onChangeText={(text) => setPassword(text)}
						value={password}
						secureTextEntry={true}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Confirm Password</Text>
					<TextInput
						style={styles.signUpInputBox}
						placeholder="Confirm Password"
						onChangeText={(text) => setConfirmPassword(text)}
						value={confirmPassword}
						secureTextEntry={true}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
				</ScrollView>

				<View style={styles.ButtonGroup}>
					<Button
						style={styles.createAccountButton}
						mode="contained"
						textColor={colors.inverseText}
						loading={isLoading}
						disabled={isLoading}
						onPress={handleSignUp}
					>
						Create Account
					</Button>
				</View>

				<Text style={styles.smallText}>OR</Text>

				<Button
					mode="outlined"
					textColor={colors.primary}
					style={styles.googleButton}
					onPress={() => showToast('Google sign-up coming soon.')}
				>
					Sign Up with Google
				</Button>

				<MaterialCommunityIcons
					name="arrow-left"
					size={15}
					color={colors.inverseText}
					style={styles.backButton}
					onPress={() => router.back()}
				/>
			</View>
		</View>
	);
};

export default Signup;

type ThemeColors = typeof Colors.light | typeof Colors.dark;

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		mainContainer: {
			flex: 1,
			backgroundColor: colors.surface,
			alignItems: 'center',
			justifyContent: 'flex-start',
			paddingTop: 0,
			borderRadius: 0,
			borderWidth: 3,
			borderColor: colors.surface,
		},
		subSignUpContainer: {
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
			color: colors.text,
		},
		signUpIcon: {
			marginTop: 6,
			marginLeft: 150,
			marginRight: 20,
		},
		mainSignUpHeader: {
			marginTop: 20,
			marginBottom: 25,
			marginLeft: -170,
		},
		createAccountButton: {
			marginTop: -20,
			marginBottom: 15,
			padding: 5,
			backgroundColor: colors.primary,
			flexWrap: 'wrap',
			alignContent: 'center',
			borderRadius: 10,
			borderWidth: 3,
			borderColor: colors.primary,
		},
		ButtonGroup: {
			flexDirection: 'row',
			justifyContent: 'space-around',
			marginTop: 40,
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
			width: '80%',
			marginHorizontal: 40,
		},
		signUpInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '90%',
			alignSelf: 'center',
			backgroundColor: colors.card,
			color: colors.text,
		},
		googleButton: {
			width: '50%',
			alignSelf: 'center',
			borderColor: colors.primary,
			borderWidth: 2,
			marginTop: 20,
			marginBottom: 40,
			padding: 5,
		},
		smallText: {
			fontSize: 18,
			color: colors.text,
			marginHorizontal: 194,
		},
		inputLabels: {
			fontSize: 14,
			color: colors.text,
			marginLeft: 20,
			marginBottom: -14,
		},
		backButton: {
			position: 'absolute',
			bottom: 40,
			left: 16,
			backgroundColor: colors.primary,
			padding: 12,
			borderRadius: 20,
		},
	});
