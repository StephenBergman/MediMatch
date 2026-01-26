//this is the settings page, there will be sub settings included and logout option.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar, Button, Menu } from 'react-native-paper';

//this page will route to the login page after user accepts the terms and coniditions policy
import { useRouter } from 'expo-router';

//icons logic
import { useAppToast } from '@/components/contexts/AppToastProvider';
import { Colors } from '@/constants/theme';
import { supabase } from '@/features/auth/api/supabaseClient';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCachedUserLocation } from '@/features/map/hooks/useCachedUserLocation';

type DropdownOption = { label: string; value: string };

const GENDER_OPTIONS: DropdownOption[] = [
	{ label: 'Male', value: 'Male' },
	{ label: 'Female', value: 'Female' },
	{ label: 'Non-binary', value: 'Non-binary' },
	{ label: 'Prefer not to say', value: 'Prefer not to say' },
];

const SettingsEditProfile = () => {
	const router = useRouter();
	const scheme = useColorScheme() ?? 'light';
	const colors = Colors[scheme];
	const styles = useMemo(() => createStyles(colors), [colors]);
	const { user } = useAuth();
	const { showToast } = useAppToast();
	const [isSaving, setIsSaving] = useState(false);
	const { region } = useCachedUserLocation();
	const didAutofillRef = useRef(false);

	//stores for profile information
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [secondaryEmail, setSecondaryEmail] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [birthDate, setBirthDate] = useState('');
	const [gender, setGender] = useState('');

	//Location preferences storage
	const [zipCode, setZipCode] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [country, setCountry] = useState('');

	//Health Preferences storage
	const [healthinsuranceprovidername, setHealthInsuranceProviderName] =
		useState('');
	const [healthinsurancenumber, setHealthInsuranceNumber] = useState('');
	const handleSave = useSaveProfile({
		user,
		firstName,
		lastName,
		email,
		secondaryEmail,
		phoneNumber,
		birthDate,
		gender,
		zipCode,
		city,
		state,
		country,
		healthinsuranceprovidername,
		healthinsurancenumber,
		showToast,
		setIsSaving,
		router,
	});

	useEffect(() => {
		let isMounted = true;
		if (!user) return () => {
			isMounted = false;
		};

		supabase
			.from('profiles')
			.select(
				`first_name,last_name,dob,email,secondary_email,phone_number,gender,zip_code,city,state,country,health_insurance_provider_name,health_insurance_number`,
			)
			.eq('id', user.id)
			.single()
			.then(({ data }) => {
				if (!isMounted || !data) return;
				setFirstName(data.first_name ?? '');
				setLastName(data.last_name ?? '');
				setEmail(data.email ?? user.email ?? '');
				setSecondaryEmail(data.secondary_email ?? '');
				setPhoneNumber(data.phone_number ?? '');
				setBirthDate(formatDobForDisplay(data.dob));
				setGender(data.gender ?? '');
				setZipCode(data.zip_code ?? '');
				setCity(data.city ?? '');
				setState(data.state ?? '');
				setCountry(data.country ?? '');
				setHealthInsuranceProviderName(
					data.health_insurance_provider_name ?? '',
				);
				setHealthInsuranceNumber(data.health_insurance_number ?? '');
			});

		return () => {
			isMounted = false;
		};
	}, [user]);

	useEffect(() => {
		if (didAutofillRef.current) return;
		if (!region) return;
		const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
		if (!apiKey) return;

		const shouldFill =
			!city.trim() || !state.trim() || !country.trim() || !zipCode.trim();
		if (!shouldFill) return;

		didAutofillRef.current = true;

		const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region.latitude},${region.longitude}&key=${apiKey}`;

		fetch(url)
			.then((response) => response.json())
			.then((payload) => {
				const components = payload?.results?.[0]?.address_components ?? [];
				const findType = (type: string) =>
					components.find((component: { types: string[] }) =>
						component.types.includes(type),
					);

				const nextCity =
					findType('locality')?.long_name ??
					findType('postal_town')?.long_name ??
					findType('sublocality')?.long_name ??
					'';
				const nextState =
					findType('administrative_area_level_1')?.long_name ?? '';
				const nextCountry = findType('country')?.long_name ?? '';
				const nextZip = findType('postal_code')?.long_name ?? '';

				if (!city.trim() && nextCity) setCity(nextCity);
				if (!state.trim() && nextState) setState(nextState);
				if (!country.trim() && nextCountry) setCountry(nextCountry);
				if (!zipCode.trim() && nextZip) setZipCode(nextZip);
			})
			.catch(() => {
				didAutofillRef.current = false;
			});
	}, [city, country, region, state, zipCode]);

	return (
		<View style={styles.mainContainer}>
			<View style={styles.mainSettingsHeader}>
				<Text style={styles.settingsTitle}>Edit Profile</Text>

				<View style={styles.avatarIcon}>
					<Avatar.Icon
						size={100}
						icon="account-edit"
						color={colors.inverseText}
						style={styles.avatarIconInner}
					/>
				</View>
			</View>

			<View style={styles.subSettingsContainer}>
				<ScrollView style={{ margin: 10 }}>
					<Text style={styles.firstNameInputlabel}>First Name</Text>
					<TextInput
						style={styles.changeFirstNameInputBox}
						placeholder="Firstname"
						onChangeText={(text) => setFirstName(text)}
						value={firstName}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Last Name</Text>
					<TextInput
						style={styles.changeLastNameInputBox}
						placeholder="Lastname"
						onChangeText={(text) => setLastName(text)}
						value={lastName}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Email</Text>
					<TextInput
						style={styles.changePrimaryEmailInputBox}
						placeholder="Primary Email"
						onChangeText={(text) => setEmail(text)}
						value={email}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Secondary Email</Text>
					<TextInput
						style={styles.changesecondaryEmailInputBox}
						placeholder="Secondary Email"
						onChangeText={(text) => setSecondaryEmail(text)}
						value={secondaryEmail}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Phone Number</Text>
					<TextInput
						style={styles.changePhoneNumberInputBox}
						placeholder="Phone Number"
						onChangeText={(text) => setPhoneNumber(text)}
						value={phoneNumber}
						keyboardType="phone-pad"
						textContentType="telephoneNumber"
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>

					<Text style={styles.inputLabels}>Birth Date</Text>
					<TextInput
						style={styles.changebirhthdateInputBox}
						placeholder="Birth Date"
						onChangeText={(text) => setBirthDate(text)}
						value={birthDate}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>

					<Text style={styles.inputLabels}>Gender</Text>
					<DropdownField
						value={gender}
						placeholder="Select gender"
						options={GENDER_OPTIONS}
						onChange={setGender}
						styles={styles}
						placeholderColor={colors.tabIconDefault}
					/>

					<Text style={styles.inputLabels}>Zip Code</Text>
					<TextInput
						style={styles.changeZipCodeInputBox}
						placeholder="Zip Code"
						onChangeText={(text) => setZipCode(text)}
						value={zipCode}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>City</Text>
					<TextInput
						style={styles.changeCityNameInputBox}
						placeholder="City"
						onChangeText={(text) => setCity(text)}
						value={city}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>State</Text>
					<TextInput
						style={styles.changeStateNameInputBox}
						placeholder="State"
						onChangeText={(text) => setState(text)}
						value={state}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Country</Text>
					<TextInput
						style={styles.changeCountryNameInputBox}
						placeholder="Country"
						onChangeText={(text) => setCountry(text)}
						value={country}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Health Insurance Provider Name</Text>
					<TextInput
						style={styles.changeHealthInsuranceProviderNameInputBox}
						placeholder="Health Insurance Provider Name"
						onChangeText={(text) => setHealthInsuranceProviderName(text)}
						value={healthinsuranceprovidername}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
					<Text style={styles.inputLabels}>Health Insurance Number</Text>
					<TextInput
						style={styles.changeHealthInsuranceNumberInputBox}
						placeholder="Health Insurance Number"
						onChangeText={(text) => setHealthInsuranceNumber(text)}
						value={healthinsurancenumber}
						autoCapitalize="none"
						placeholderTextColor={colors.tabIconDefault}
					/>
				</ScrollView>
				<Button
					mode="contained"
					textColor={colors.inverseText}
					style={styles.changePasswordButton}
					onPress={() => {
						router.replace('/verificationCode_NP');
					}}
				>
					Change Password
				</Button>

				<Button
					mode="contained"
					textColor={colors.inverseText}
					style={styles.saveChangesButton}
					onPress={() => {
						handleSave();
					}}
					loading={isSaving}
					disabled={isSaving}
				>
					Save Changes
				</Button>
			</View>
		</View>
	);
};

export default SettingsEditProfile;

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
			fontSize: 20,
			textAlign: 'center',
			alignContent: 'center',
			marginTop: -15,
			marginBottom: 5,
			marginHorizontal: 20,
			fontWeight: 'bold',
			color: colors.text,
		},
		SettingsIcon: {
			marginTop: 6,
			marginBottom: 6,
			marginLeft: -133,
		},
		mainSettingsHeader: {
			marginTop: 20,
			marginBottom: 25,
			alignItems: 'center',
		},
		ButtonGroup: {
			flexDirection: 'row',
			justifyContent: 'space-around',
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
		inputLabels: {
			fontSize: 14,
			color: colors.text,
			marginLeft: 20,
			marginBottom: -14,
		},
		changePasswordButton: {
			width: '50%',
			alignSelf: 'center',
			backgroundColor: colors.primary,
			marginTop: 20,
			padding: 5,
			marginBottom: 10,
		},
		saveChangesButton: {
			width: '50%',
			alignSelf: 'center',
			backgroundColor: colors.primary,
			marginTop: 20,
			padding: 5,
			marginBottom: 30,
		},
		firstNameInputlabel: {
			fontSize: 14,
			color: colors.text,
			marginLeft: 20,
			marginBottom: -14,
			marginTop: 20,
		},
		changeFirstNameInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '60%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		changeLastNameInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '60%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		changePrimaryEmailInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '90%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		changesecondaryEmailInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '90%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		changePhoneNumberInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '40%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		changeZipCodeInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '30%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		changeCityNameInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '40%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		changeStateNameInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '40%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		changeCountryNameInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '60%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		changeHealthInsuranceProviderNameInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '90%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		changeHealthInsuranceNumberInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '60%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		dropdownButton: {
			borderColor: colors.border,
			borderWidth: 3,
			borderRadius: 5,
			margin: 20,
			alignSelf: 'flex-start',
			width: '60%',
			backgroundColor: colors.card,
			justifyContent: 'center',
		},
		dropdownText: {
			color: colors.text,
			textAlign: 'left',
		},
		changeGenderInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '60%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		changebirhthdateInputBox: {
			height: 50,
			borderColor: colors.border,
			borderWidth: 3,
			margin: 20,
			paddingLeft: 10,
			borderRadius: 5,
			width: '60%',
			alignSelf: 'flex-start',
			backgroundColor: colors.card,
			color: colors.text,
		},
		avatarIcon: {
			borderWidth: 3,
			borderRadius: 999,
			padding: 0,
			borderColor: colors.border,
		},
		avatarIconInner: {
			backgroundColor: colors.primary,
		},
	});

const formatDobForDisplay = (dob: string | null) => {
	if (!dob) return '';
	const [year, month, day] = dob.split('-');
	if (!year || !month || !day) return '';
	return `${month}/${day}/${year}`;
};

const parseDobToIso = (value: string) => {
	const trimmed = value.trim();
	if (!trimmed) return { iso: null as string | null };

	const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
	if (!match) {
		return { error: 'Birth date must be in MM/DD/YYYY format.' };
	}

	const month = Number(match[1]);
	const day = Number(match[2]);
	const year = Number(match[3]);

	if (month < 1 || month > 12) {
		return { error: 'Birth date month must be between 01 and 12.' };
	}
	if (day < 1 || day > 31) {
		return { error: 'Birth date day must be between 01 and 31.' };
	}
	if (year < 1900 || year > new Date().getFullYear()) {
		return { error: 'Birth date year looks invalid.' };
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
		return { error: 'Birth date is not a valid calendar date.' };
	}

	return { iso };
};

const handleSaveProfile = async ({
	userId,
	firstName,
	lastName,
	email,
	secondaryEmail,
	phoneNumber,
	birthDate,
	gender,
	zipCode,
	city,
	state,
	country,
	healthinsuranceprovidername,
	healthinsurancenumber,
}: {
	userId: string;
	firstName: string;
	lastName: string;
	email: string;
	secondaryEmail: string;
	phoneNumber: string;
	birthDate: string;
	gender: string;
	zipCode: string;
	city: string;
	state: string;
	country: string;
	healthinsuranceprovidername: string;
	healthinsurancenumber: string;
}) => {
	const { iso, error } = parseDobToIso(birthDate);
	if (error) {
		return { error };
	}

	const { error: updateError } = await supabase
		.from('profiles')
		.update({
			first_name: firstName.trim() || null,
			last_name: lastName.trim() || null,
			dob: iso,
			email: email.trim() || null,
			secondary_email: secondaryEmail.trim() || null,
			phone_number: phoneNumber.trim() || null,
			gender: gender.trim() || null,
			zip_code: zipCode.trim() || null,
			city: city.trim() || null,
			state: state.trim() || null,
			country: country.trim() || null,
			health_insurance_provider_name:
				healthinsuranceprovidername.trim() || null,
			health_insurance_number: healthinsurancenumber.trim() || null,
		})
		.eq('id', userId);

	if (updateError) {
		return { error: updateError.message };
	}

	return {};
};

function useSaveProfile({
	user,
	firstName,
	lastName,
	email,
	secondaryEmail,
	phoneNumber,
	birthDate,
	gender,
	zipCode,
	city,
	state,
	country,
	healthinsuranceprovidername,
	healthinsurancenumber,
	showToast,
	setIsSaving,
	router,
}: {
	user: { id: string } | null;
	firstName: string;
	lastName: string;
	email: string;
	secondaryEmail: string;
	phoneNumber: string;
	birthDate: string;
	gender: string;
	zipCode: string;
	city: string;
	state: string;
	country: string;
	healthinsuranceprovidername: string;
	healthinsurancenumber: string;
	showToast: (message: string) => void;
	setIsSaving: (value: boolean) => void;
	router: ReturnType<typeof useRouter>;
}) {
	const handleSave = async () => {
		if (!user) {
			showToast('Please sign in to update your profile.');
			return;
		}

		setIsSaving(true);
		const result = await handleSaveProfile({
			userId: user.id,
			firstName,
			lastName,
			email,
			secondaryEmail,
			phoneNumber,
			birthDate,
			gender,
			zipCode,
			city,
			state,
			country,
			healthinsuranceprovidername,
			healthinsurancenumber,
		});
		setIsSaving(false);

		if (result.error) {
			showToast(result.error);
			return;
		}

		showToast('Profile updated.');
		router.replace('/(protected)/(tabs)/profile');
	};

	return handleSave;
}

type DropdownFieldProps = {
	value: string;
	placeholder: string;
	options: DropdownOption[];
	onChange: (value: string) => void;
	styles: ReturnType<typeof createStyles>;
	placeholderColor: string;
};

const DropdownField = ({
	value,
	placeholder,
	options,
	onChange,
	styles,
	placeholderColor,
}: DropdownFieldProps) => {
	const [visible, setVisible] = useState(false);
	const displayValue = value?.trim();

	return (
		<Menu
			visible={visible}
			onDismiss={() => setVisible(false)}
			anchor={
				<Button
					mode="outlined"
					style={styles.dropdownButton}
					onPress={() => setVisible(true)}
				>
					<Text
						style={displayValue ? styles.dropdownText : { color: placeholderColor }}
					>
						{displayValue || placeholder}
					</Text>
				</Button>
			}
		>
			{options.map((option) => (
				<Menu.Item
					key={option.value}
					title={option.label}
					onPress={() => {
						onChange(option.value);
						setVisible(false);
					}}
				/>
			))}
		</Menu>
	);
};
