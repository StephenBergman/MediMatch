import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';

const VerificationCode = () => {
	//for users email entry
	const [email, setEmail] = React.useState('');

	return (
		<View>
			<Text style={styles.verificationCodeTitle}>Verification</Text>

			<Text style={styles.verificationCode_EnterEmailText}>
				Enter Verification Code
			</Text>

			<TextInput
				style={styles.verificationCode_EmailInputBox}
				placeholder="Enter Code Here"
				onChangeText={(text) => setEmail(text)}
				value={email}
				keyboardType="email-address"
				autoCapitalize="none"
			/>

			<Text
				style={styles.backToSignInText}
				onPress={() => {
					router.replace('../login');
				}}
			>
				If you didnt recieve a code. Resend
			</Text>

			<Button
				mode="contained"
				textColor="#ffffff"
				style={styles.verificationButton}
				onPress={() => {
					router.replace('../verificationCode_NP');
				}}
			>
				Verify
			</Button>

			<View style={styles.bottomButtonGroup}>
				<Text style={styles.haveAnAccountText}>Do you have an Account? </Text>

				<Button
					mode="contained"
					textColor="#ffffff"
					style={styles.signUpButton}
					onPress={() => {
						router.replace('../signup');
					}}
				>
					Sign Up
				</Button>
				<Text style={styles.orText}>OR </Text>
				<Button
					mode="outlined"
					textColor="#ffffff"
					style={styles.googleButton}
					onPress={() => {}}
				>
					Sign Up with Google
				</Button>
			</View>
		</View>
	);
};

export default VerificationCode;

const styles = StyleSheet.create({
	verificationCodeTitle: {
		fontSize: 16,
		color: '#000000ff',
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 40,
	},
	verificationCode_EnterEmailText: {
		fontSize: 18,
		color: '#000000ff',
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 40,
		marginBottom: -12,
	},
	verificationCode_EmailInputBox: {
		height: 50,
		borderColor: '#000',
		borderWidth: 3,
		margin: 20,
		paddingLeft: 10,
		borderRadius: 5,
		alignSelf: 'center',
		width: '75%',
	},
	backToSignInText: {
		fontSize: 14,
		color: '#000000ff',
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: -5,
	},
	verificationButton: {
		width: '50%',
		alignSelf: 'center',
		backgroundColor: '#000000',
		marginTop: 20,
		padding: 5,
		borderRadius: 5,
	},
	haveAnAccountText: {
		fontSize: 20,
		color: '#000000ff',
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: -5,
	},
	signUpButton: {
		width: '50%',
		alignSelf: 'center',
		backgroundColor: '#000000',
		marginTop: 20,
		padding: 5,
		borderRadius: 5,
	},
	googleButton: {
		width: '50%',
		alignSelf: 'center',
		backgroundColor: '#000000',
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
		color: '#000000ff',
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 20,
		marginBottom: 3,
	},
});
