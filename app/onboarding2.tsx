
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	BackHandler,
	Image,
	Platform,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import { Button, Icon } from 'react-native-paper';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const onboarding1 = () => {
	const router = useRouter();
	const { session, isReady } = useAuth();
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const [isChecking, setIsChecking] = useState(true);

	return (
		<View style={styles.mainContainer}>

			<MaterialCommunityIcons style={styles.onboardingIcon}
  				name="robot-outline"
  				size={200}
  				color="#000"
			/>

			<Text style={styles.onboardingTitle}>
				Meet Your Medical AI Assistant
			</Text>

			<Text style={styles.onboardingText}>
				Ask questions about symptoms, medications, or
				{'\n'}
				general health concerns and get fast, intelligent 
				responses. Your assistant is designed to guide 
				{'\n'}
				you toward better decisions and help you understand your next steps.
			</Text>

				<View style={styles.ButtonGroup}>
					<Button
						style={styles.declineCookiesButton}
						mode="contained"
						textColor="#000000"
						onPress={() => {
							//if user declines terms, they will exit the application
							router.push('/')
						}}
					>
						Skip
					</Button>

					<Button
						style={styles.acceptCookiesButton}
						mode="contained"
						onPress={() => {
							//if user accepts terms, they will be routed to the login page
							router.push('/onboarding3')
						}}
					>
						Next
					</Button>
				</View>
		</View>
	);
};

export default onboarding1;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		backgroundColor: '#7e7e7eff',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingTop: 0,
		borderColor: '#0000000',
		borderWidth: 3,
	},
	policyContainer: {
		flex: 1,
		backgroundColor: '#ffffffff',
		borderRadius: 15,
		width: '100%',
		marginTop: -10,
		borderColor: '#0000000',
		borderWidth: 3,
	},
	cookieImage: {
		width: 200,
		height: 200,
		alignContent: 'center',
		top: 80,
		marginTop: -50,
		marginBottom: 20,
	},
	
	cookieTermsConditions: {
		fontSize: 25,
		fontWeight: 'bold',
		textAlign: 'center',
		marginTop: 10,
	},
	acceptCookiesButton: {
		marginTop: 0,
		margin: 8,
		padding: 5,
		backgroundColor: '#000000ff',
		flexWrap: 'wrap',
		alignContent: 'center',
		borderRadius: 10,
		borderWidth: 3,
	},
	declineCookiesButton: {
		marginTop: 0,
		margin: 8,
		padding: 5,
		backgroundColor: '#ffffffff',
		borderColor: '#000000ff',
		borderWidth: 3,
		flexWrap: 'wrap',
		alignContent: 'center',
		borderRadius: 10,
	},
	ButtonGroup: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		borderRadius: '',
		borderColor: '#00000000',
		borderWidth: 2,
	},
	cookieTermsConditionsPolicyText: {
		fontSize: 16,
		marginBottom: 20,
	},
  onboardingIcon: {
    marginTop: 150,
    marginBottom: 5,
  },
  onboardingTitle: {
    fontSize: 20,
		textAlign: 'center',
		alignContent: 'center',
		marginTop: 20,
		marginBottom: 10,
		fontWeight: 'bold',
  },
  onboardingText: {
		fontSize: 17,
		textAlign: 'center',
		alignContent: 'center',
		marginTop: 20,
		marginBottom: 20,
		marginHorizontal: 20,
		fontWeight: 'bold',
	},
});
