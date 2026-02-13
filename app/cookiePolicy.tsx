/* eslint-disable react/no-unescaped-entities */
//This will be the cookie policy page before user sees the login screen. User must agree to terms before they are able to continue.

import * as SecureStore from 'expo-secure-store';
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
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';

//this page will route to the login page after user accepts the terms and coniditions policy
import { Colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

const Index = () => {
	const router = useRouter();
	const { session, isReady } = useAuth();
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const [isChecking, setIsChecking] = useState(true);

	const getTosAccepted = useCallback(async () => {
		const key = 'tosAccepted';
		if (Platform.OS === 'web') {
			if (typeof localStorage === 'undefined') return null;
			return localStorage.getItem(key);
		}
		return SecureStore.getItemAsync(key);
	}, []);

	const setTosAccepted = async () => {
		const key = 'tosAccepted';
		if (Platform.OS === 'web') {
			if (typeof localStorage === 'undefined') return;
			localStorage.setItem(key, 'true');
			return;
		}
		await SecureStore.setItemAsync(key, 'true');
	};

	useEffect(() => {
		let isMounted = true;
		if (!isReady) return;

		getTosAccepted()
			.then((accepted) => {
				if (!isMounted) return;
				if (session) {
					router.replace('/(protected)/(tabs)/chat');
					return;
				}
				if (accepted === 'true') {
					router.replace('/login');
					return;
				}
				setIsChecking(false);
			})
			.catch(() => {
				if (!isMounted) return;
				setIsChecking(false);
			});

		return () => {
			isMounted = false;
		};
	}, [getTosAccepted, isReady, router, session]);

	if (isChecking || !isReady) {
		return (
			<View style={[styles.mainContainer, { backgroundColor: colors.surface }]}>
				<ActivityIndicator size="large" color={colors.primary} />
			</View>
		);
	}

	return (
		<View style={styles.mainContainer}>
			<Image
				style={styles.cookieImage}
				source={require('../assets/images/cookie.png')}
			/>

			<Text style={styles.cookieText}>
				Hello, before you continue, please review and accept our cookie policy
				to enhance your experience on our app.
			</Text>

			<View style={styles.policyContainer}>
				<Text style={styles.cookieTermsConditions}>Terms and Conditions</Text>

				<ScrollView style={{ margin: 10 }}>
					<Text style={styles.cookieTermsConditionsPolicyText}>
						Our Terms and Conditions were last updated on [DATE].
						{'\n'}
						{'\n'}
						Please read these terms and conditions carefully before using Our
						Service.
						{'\n'}
						{'\n'}
						Interpretation and Definitions
						{'\n'}
						{'\n'}
						Interpretation
						{'\n'}
						{'\n'}
						The words of which the initial letter is capitalized have meanings
						defined under the following conditions.
						{'\n'}
						{'\n'}
						The following definitions shall have the same meaning regardless of
						whether they appear in singular or in plural.
						{'\n'}
						{'\n'}
						Definitions
						{'\n'}
						{'\n'}
						For the purposes of these Terms and Conditions:
						{'\n'}
						{'\n'}
						“Application” means the software program provided by the Company
						downloaded by You on any electronic device, named [APP_NAME]
						{'\n'}
						{'\n'}
						“Application Store” means the digital distribution service operated
						and developed by Apple Inc. (Apple App Store) or Google Inc. (Google
						Play Store) in which the Application has been downloaded.
						{'\n'}
						{'\n'}
						“Affiliate” means an entity that controls, is controlled by or is
						under common control with a party, where "control" means ownership
						of 50% or more of the shares, equity interest or other securities
						entitled to vote for election of directors or other managing
						authority.
						{'\n'}
						{'\n'}
						“Account” means a unique account created for You to access our
						Service or parts of our Service. “Company” (referred to as either
						"the Company", "We", "Us" or "Our" in this Agreement) refers to
						[COMPANY_INFORMATION]. “Country” refers to [COMPANY_COUNTRY].
						{'\n'}
						{'\n'}
						“Content” refers to content such as text, images, or other
						information that can be posted, uploaded, linked to or otherwise
						made available by You, regardless of the form of that content.
						{'\n'}
						{'\n'}
						“Device” means any device that can access the Service such as a
						computer, a cell phone or a digital tablet.
						{'\n'}
						{'\n'}
						“Feedback” means feedback, innovations or suggestions sent by You
						regarding the attributes, performance or features of our Service.
						{'\n'}
						{'\n'}
						“Service” refers to the Website.
						{'\n'}
						{'\n'}
						“Terms and Conditions” (also referred as "Terms") mean these Terms
						and Conditions that form the entire agreement between You and the
						Company regarding the use of the Service. This Terms and Conditions
						Agreement was generated by TermsFeed Mobile App Terms and Conditions
						Generator.
						{'\n'}
						{'\n'}
						“Third-party Social Media Service” means any services or content
						(including data, information, products or services) provided by a
						third-party that may be displayed, included or made available by the
						Service.
						{'\n'}
						{'\n'}
						“Website” refers to [WEBSITE_NAME], accessible from [WEBSITE_URL]
						{'\n'}
						{'\n'}
						“You” means the individual accessing or using the Service, or the
						company, or other legal entity on behalf of which such individual is
						accessing or using the Service, as applicable.
						{'\n'}
						{'\n'}
						Acknowledgment
						{'\n'}
						{'\n'}
						These are the Terms and Conditions governing the use of this Service
						and the agreement that operates between You and the Company. These
						Terms and Conditions set out the rights and obligations of all users
						regarding the use of the Service.
						{'\n'}
						{'\n'}
						Your access to and use of the Service is conditioned on Your
						acceptance of and compliance with these Terms and Conditions. These
						Terms and Conditions apply to all visitors, users and others who
						access or use the Service.
						{'\n'}
						{'\n'}
						By accessing or using the Service You agree to be bound by these
						Terms and Conditions. If You disagree with any part of these Terms
						and Conditions then You may not access the Service.
						{'\n'}
						{'\n'}
						You represent that you are over the age of 18. The Company does not
						permit those under 18 to use the Service.
						{'\n'}
						{'\n'}
						Your access to and use of the Service is also conditioned on Your
						acceptance of and compliance with the Privacy Policy of the Company.
						Our Privacy Policy describes Our policies and procedures on the
						collection, use and disclosure of Your personal information when You
						use the Application or the Website and tells You about Your privacy
						rights and how the law protects You. Please read Our Privacy Policy
						carefully before using Our Service.
						{'\n'}
						{'\n'}
						User Accounts
						{'\n'}
						{'\n'}
						When You create an account with Us, You must provide Us information
						that is accurate, complete, and current at all times. Failure to do
						so constitutes a breach of the Terms, which may result in immediate
						termination of Your account on Our Service.
						{'\n'}
						{'\n'}
						You are responsible for safeguarding the password that You use to
						access the Service and for any activities or actions under Your
						password, whether Your password is with Our Service or a Third-Party
						Social Media Service.
						{'\n'}
						{'\n'}
						You agree not to disclose Your password to any third party. You must
						notify Us immediately upon becoming aware of any breach of security
						or unauthorized use of Your account.
						{'\n'}
						{'\n'}
						You may not use as a username the name of another person or entity
						or that is not lawfully available for use, a name or trademark that
						is subject to any rights of another person or entity other than You
						without appropriate authorization, or a name that is otherwise
						offensive, vulgar or obscene.
						{'\n'}
						{'\n'}
						Content
						{'\n'}
						{'\n'}
						Your Right to Post Content
						{'\n'}
						{'\n'}
						Our Service allows You to post Content. You are responsible for the
						Content that You post to the Service, including its legality,
						reliability, and appropriateness.
						{'\n'}
						{'\n'}
						By posting Content to the Service, You grant Us the right and
						license to use, modify, publicly perform, publicly display,
						reproduce, and distribute such Content on and through the Service.
						You retain any and all of Your rights to any Content You submit,
						post or display on or through the Service and You are responsible
						for protecting those rights. You agree that this license includes
						the right for Us to make Your Content available to other users of
						the Service, who may also use Your Content subject to these Terms.
						{'\n'}
						{'\n'}
						You represent and warrant that: (i) the Content is Yours (You own
						it) or You have the right to use it and grant Us the rights and
						license as provided in these Terms, and (ii) the posting of Your
						Content on or through the Service does not violate the privacy
						rights, publicity rights, copyrights, contract rights or any other
						rights of any person.
						{'\n'}
						{'\n'}
						Content Restrictions
						{'\n'}
						{'\n'}
						The Company is not responsible for the content of the Service's
						users. You expressly understand and agree that You are solely
						responsible for the Content and for all activity that occurs under
						your account, whether done so by You or any third person using Your
						account.
						{'\n'}
						{'\n'}
						You may not transmit any Content that is unlawful, offensive,
						upsetting, intended to disgust, threatening, libelous, defamatory,
						obscene or otherwise objectionable. Examples of such objectionable
						Content include, but are not limited to, the following:
						{'\n'}
						{'\n'}
						Unlawful or promoting unlawful activity.
						{'\n'}
						{'\n'}
						Defamatory, discriminatory, or mean-spirited content, including
						references or commentary about religion, race, sexual orientation,
						gender, national/ethnic origin, or other targeted groups.
						{'\n'}
						{'\n'}
						Spam, machine – or randomly – generated, constituting unauthorized
						or unsolicited advertising, chain letters, any other form of
						unauthorized solicitation, or any form of lottery or gambling.
						{'\n'}
						{'\n'}
						Containing or installing any viruses, worms, malware, trojan horses,
						or other content that is designed or intended to disrupt, damage, or
						limit the functioning of any software, hardware or
						telecommunications equipment or to damage or obtain unauthorized
						access to any data or other information of a third person.
						{'\n'}
						{'\n'}
						Infringing on any proprietary rights of any party, including patent,
						trademark, trade secret, copyright, right of publicity or other
						rights.
						{'\n'}
						{'\n'}
						Impersonating any person or entity including the Company and its
						employees or representatives. Violating the privacy of any third
						person.
						{'\n'}
						{'\n'}
						False information and features.
						{'\n'}
						{'\n'}
						The Company reserves the right, but not the obligation, to, in its
						sole discretion, determine whether or not any Content is appropriate
						and complies with this Terms, refuse or remove this Content. The
						Company further reserves the right to make formatting and edits and
						change the manner of any Content. The Company can also limit or
						revoke the use of the Service if You post such objectionable
						Content. As the Company cannot control all content posted by users
						and/or third parties on the Service, you agree to use the Service at
						your own risk. You understand that by using the Service You may be
						exposed to content that You may find offensive, indecent, incorrect
						or objectionable, and You agree that under no circumstances will the
						Company be liable in any way for any content, including any errors
						or omissions in any content, or any loss or damage of any kind
						incurred as a result of your use of any content.
						{'\n'}
						{'\n'}
						Content Backups
						{'\n'}
						{'\n'}
						Although regular backups of Content are performed, the Company does
						not guarantee there will be no loss or corruption of data.
						{'\n'}
						{'\n'}
						Corrupt or invalid backup points may be caused by, without
						limitation, Content that is corrupted prior to being backed up or
						that changes during the time a backup is performed.
						{'\n'}
						{'\n'}
						The Company will provide support and attempt to troubleshoot any
						known or discovered issues that may affect the backups of Content.
						But You acknowledge that the Company has no liability related to the
						integrity of Content or the failure to successfully restore Content
						to a usable state.
						{'\n'}
						{'\n'}
						You agree to maintain a complete and accurate copy of any Content in
						a location independent of the Service.
						{'\n'}
						{'\n'}
						Copyright Policy
						{'\n'}
						{'\n'}
						Intellectual Property Infringement
						{'\n'}
						{'\n'}
						We respect the intellectual property rights of others. It is Our
						policy to respond to any claim that Content posted on the Service
						infringes a copyright or other intellectual property infringement of
						any person. If You are a copyright owner, or authorized on behalf of
						one, and You believe that the copyrighted work has been copied in a
						way that constitutes copyright infringement that is taking place
						through the Service, You must submit Your notice in writing to the
						attention of our copyright agent via email
						([COPYRIGHT_AGENT_CONTACT_EMAIL]) and include in Your notice a
						detailed description of the alleged infringement.
						{'\n'}
						{'\n'}
						You may be held accountable for damages (including costs and
						attorneys' fees) for misrepresenting that any Content is infringing
						Your copyright.
						{'\n'}
						{'\n'}
						DMCA Notice and DMCA Procedure for Copyright Infringement Claims
						{'\n'}
						{'\n'}
						You may submit a notification pursuant to the Digital Millennium
						Copyright Act (DMCA) by providing our Copyright Agent with the
						following information in writing (see 17 U.S.C 512(c)(3) for further
						detail): An electronic or physical signature of the person
						authorized to act on behalf of the owner of the copyright's
						interest.
						{'\n'}
						{'\n'}A description of the copyrighted work that You claim has been
						infringed, including the URL (i.e., web page address) of the
						location where the copyrighted work exists or a copy of the
						copyrighted work. Identification of the URL or other specific
						location on the Service where the material that You claim is
						infringing is located.
						{'\n'}
						{'\n'}
						Your address, telephone number, and email address.
						{'\n'}
						{'\n'}A statement by You that You have a good faith belief that the
						disputed use is not authorized by the copyright owner, its agent, or
						the law.
						{'\n'}
						{'\n'}A statement by You, made under penalty
						{'\n'}
						{'\n'}
					</Text>
				</ScrollView>

				<View style={styles.ButtonGroup}>
					<Button
						style={styles.declineCookiesButton}
						mode="contained"
						textColor="#000000"
						onPress={() => {
							//if user declines terms, they will exit the application
							BackHandler.exitApp();
						}}
					>
						Decline
					</Button>

					<Button
						style={styles.acceptCookiesButton}
						mode="contained"
						onPress={() => {
							//if user accepts terms, they will be routed to the login page
							setTosAccepted()
								.then(() => {
									router.replace('/login');
								})
								.catch(() => {
									router.replace('/login');
								});
						}}
					>
						Accept
					</Button>
				</View>
			</View>
		</View>
	);
};

export default Index;

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
	cookieText: {
		fontSize: 17,
		textAlign: 'center',
		alignContent: 'center',
		marginTop: 80,
		marginBottom: 20,
		marginHorizontal: 20,
		fontWeight: 'bold',
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
});
