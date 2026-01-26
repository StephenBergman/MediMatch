import React, { useEffect } from 'react';
import { Image, Platform, StyleSheet, TextInput, View } from 'react-native';

//this page will route to the home page after user signs in successfully
import { useAppToast } from '@/components/contexts/AppToastProvider';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Button, Checkbox, Text } from 'react-native-paper';

//for Google Sign-In
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const styles = React.useMemo(() => createStyles(colors), [colors]);

	//for users email and password variables
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');

	//router variable to route to home page after login
	const router = useRouter();
	const { session, signInWithEmail, isLoading } = useAuth();
	const { showToast } = useAppToast();

	//user is able to check the box to stay signed into there account
	const [rememberMe, setRememberMe] = React.useState(false);

	const getRememberedEmail = async () => {
		const key = 'rememberedEmail';
		if (Platform.OS === 'web') {
			if (typeof localStorage === 'undefined') return null;
			return localStorage.getItem(key);
		}
		return SecureStore.getItemAsync(key);
	};

	const setRememberedEmail = async (value: string | null) => {
		const key = 'rememberedEmail';
		if (Platform.OS === 'web') {
			if (typeof localStorage === 'undefined') return;
			if (value) {
				localStorage.setItem(key, value);
			} else {
				localStorage.removeItem(key);
			}
			return;
		}
		if (value) {
			await SecureStore.setItemAsync(key, value);
		} else {
			await SecureStore.deleteItemAsync(key);
		}
	};

	useEffect(() => {
		let isMounted = true;
		getRememberedEmail()
			.then((savedEmail) => {
				if (!isMounted || !savedEmail) return;
				setEmail(savedEmail);
				setRememberMe(true);
			})
			.catch(() => {});

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		if (session) {
			router.replace('/(protected)/(tabs)/chat');
		}
	}, [session, router]);

	const handleSignIn = async () => {
		if (!email.trim() || !password) {
			showToast('Please enter your email and password.');
			return;
		}

		const { error } = await signInWithEmail({ email: email.trim(), password });
		if (error) {
			showToast(error);
			return;
		}

		if (rememberMe) {
			setRememberedEmail(email.trim()).catch(() => {});
		} else {
			setRememberedEmail(null).catch(() => {});
		}
	};

	return (
		<View style={styles.mainContainer}>
			<Image
				style={styles.MedimatchLogo}
				source={require('../assets/images/medimatch_logoMain.png')}
			/>

			<Text style={styles.MediMatchTitle}>Welcome to Medimatch!</Text>

			<TextInput
				style={styles.emailInputBox}
				placeholder="Enter Email"
				onChangeText={(text) => {
					setEmail(text);
				}}
				value={email}
				keyboardType="email-address"
				autoCapitalize="none"
				placeholderTextColor={colors.tabIconDefault}
			/>

			<TextInput
				style={styles.passwordInputBox}
				placeholder="Enter Password"
				onChangeText={(text) => {
					setPassword(text);
				}}
				value={password}
				secureTextEntry={true}
				placeholderTextColor={colors.tabIconDefault}
			/>

			<View style={styles.buttonHorizontal}>
				<View style={styles.rememberMeRow}>
					<Checkbox
						status={rememberMe ? 'checked' : 'unchecked'}
						onPress={() => setRememberMe(!rememberMe)}
						color={colors.primary}
						uncheckedColor={colors.border}
					/>
					<Text
						style={styles.rememberMeButton}
						onPress={() => setRememberMe(!rememberMe)}
					>
						Remember Me
					</Text>
				</View>

				<Button
					mode="text"
					textColor={colors.text}
					style={styles.forgotpasswordButton}
					onPress={() => {
						router.push('/forgotpassword');
					}}
				>
					Forgot Password?
				</Button>
			</View>

			<Button
				mode="contained"
				textColor={colors.inverseText}
				style={styles.signInButton}
				loading={isLoading}
				disabled={isLoading}
				onPress={handleSignIn}
			>
				Sign In
			</Button>

			<Button
				mode="outlined"
				textColor={colors.primary}
				style={styles.googleButton}
				onPress={() => {}}
			>
				Sign In with Google
			</Button>

			<Button
				mode="text"
				textColor={colors.text}
				style={styles.signupButton}
				onPress={() => {
					router.push('/signup');
				}}
			>
				{"Don't have an account? Sign Up Here"}
			</Button>
		</View>
	);
};

export default Login;

type ThemeColors = typeof Colors.light | typeof Colors.dark;

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		mainContainer: {
			flex: 1,
			backgroundColor: colors.surface,
			paddingHorizontal: 12,
		},
		MedimatchLogo: {
			width: 200,
			height: 200,
			alignSelf: 'center',
			marginTop: 50,
		},
		MediMatchTitle: {
			fontSize: 30,
			fontWeight: 'bold',
			textAlign: 'center',
			marginTop: 25,
			color: colors.text,
		},
		emailInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			alignSelf: 'center',
			width: '75%',
			backgroundColor: colors.card,
			color: colors.text,
		},
		passwordInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '75%',
			alignSelf: 'center',
			backgroundColor: colors.card,
			color: colors.text,
		},
		signupButton: {
			width: '75%',
			alignSelf: 'center',
			marginTop: 20,
			padding: 5,
		},
		googleButton: {
			width: '50%',
			alignSelf: 'center',
			borderColor: colors.primary,
			borderWidth: 2,
			marginTop: 20,
			padding: 5,
		},
		signInButton: {
			width: '50%',
			alignSelf: 'center',
			backgroundColor: colors.primary,
			marginTop: 20,
			padding: 5,
		},
		forgotpasswordButton: {
			flexDirection: 'row',
			alignSelf: 'auto',
			marginRight: '11%',
			marginTop: -25,
		},
		rememberMeButton: {
			flexDirection: 'row',
			alignSelf: 'auto',
			fontSize: 14,
			marginLeft: 4,
			color: colors.text,
		},
		buttonHorizontal: {
			flexDirection: 'row',
			width: '95%',
			alignSelf: 'center',
			justifyContent: 'space-between',
			marginTop: 5,
			alignItems: 'center',
		},
		rememberMeRow: {
			flexDirection: 'row',
			alignItems: 'center',
			marginTop: -25,
			marginLeft: '11%',
		},
	});
