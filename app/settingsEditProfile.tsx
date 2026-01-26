//this is the settings page, there will be sub settings included and logout option.

import { StyleSheet, View, Image, Text, BackHandler, TextInput } from 'react-native'
import React from 'react'
import { Button, List, Searchbar, Divider, Avatar, IconButton, Icon } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

//this page will route to the login page after user accepts the terms and coniditions policy
import { useRouter } from 'expo-router'

//icons logic
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

const settingsEditProfile = () => {
	
	const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  //stores for search bar
  const [query, setQuery] = React.useState("");

  //stores for profile information
  const[firstName, setFirstName] = React.useState('');
  const[lastName, setLastName] = React.useState('');
  const[email, setEmail] = React.useState('');
  const[secondaryEmail, setSecondaryEmail] = React.useState('');
  const[phoneNumber, setPhoneNumber] = React.useState('');
  const[birthDate, setBirthDate] = React.useState('');
  const[gender, setGender] = React.useState('');

  //Location preferences storage
  const [zipCode, setZipCode] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [country, setCountry] = React.useState('');  
  
  //Health Preferences storage
  const [healthinsuranceprovidername, setHealthInsuranceProviderName] = React.useState('');
  const [healthinsurancenumber, setHealthInsuranceNumber] = React.useState('');

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

			<ScrollView style={{margin: 10}}>

      <Text style={styles.firstNameInputlabel}>First Name</Text>
              <TextInput
                style={styles.changeFirstNameInputBox}
                placeholder="Firstname"
                onChangeText={text => setFirstName(text)}
                value={firstName}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              />
      <Text style={styles.inputLabels}>Last Name</Text>
              <TextInput
                style={styles.changeLastNameInputBox}
                placeholder="Lastname"
                onChangeText={text => setLastName(text)}
                value={lastName}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              />
      <Text style={styles.inputLabels}>Email</Text>
              <TextInput
                style={styles.changePrimaryEmailInputBox}
                placeholder="Primary Email"
                onChangeText={text => setEmail(text)}
                value={email}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              />
      <Text style={styles.inputLabels}>Secondary Email</Text>
              <TextInput
                style={styles.changesecondaryEmailInputBox}
                placeholder="Secondary Email"
                onChangeText={text => setSecondaryEmail(text)}
                value={secondaryEmail}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              /> 
      <Text style={styles.inputLabels}>Phone Number</Text>
              <TextInput
                style={styles.changePhoneNumberInputBox}
                placeholder="Phone Number"
                onChangeText={text => setPhoneNumber(text)}
                value={phoneNumber}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              />
      
      <Text style={styles.inputLabels}>Birth Date</Text>
              <TextInput
                style={styles.changebirhthdateInputBox}
                placeholder="Birth Date"
                onChangeText={text => setBirthDate(text)}
                value={birthDate}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              />

      <Text style={styles.inputLabels}>Gender</Text>
              <TextInput
                style={styles.changeGenderInputBox}
                placeholder="Gender"
                onChangeText={text => setGender(text)}
                value={gender}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              />
              
      <Text style={styles.inputLabels}>Zip Code</Text>
              <TextInput
                style={styles.changeZipCodeInputBox}
                placeholder="Zip Code"
                onChangeText={text => setZipCode(text)}
                value={zipCode}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              />
      <Text style={styles.inputLabels}>City</Text>
              <TextInput
                style={styles.changeCityNameInputBox}
                placeholder="City"
                onChangeText={text => setCity(text)}            
                value={city}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              />
      <Text style={styles.inputLabels}>State</Text>
              <TextInput
                style={styles.changeStateNameInputBox}
                placeholder="State"
                onChangeText={text => setState(text)}
                value={state}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              />
      <Text style={styles.inputLabels}>Country</Text>
              <TextInput
                style={styles.changeCountryNameInputBox}
                placeholder="Country" 
                onChangeText={text => setCountry(text)}
                value={country}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              />
      <Text style={styles.inputLabels}>Health Insurance Provider Name</Text>
              <TextInput
                style={styles.changeHealthInsuranceProviderNameInputBox}
                placeholder="Health Insurance Provider Name"
                onChangeText={text => setHealthInsuranceProviderName(text)}
                value={healthinsuranceprovidername}
                autoCapitalize="none"
                placeholderTextColor={colors.tabIconDefault}
              />
      <Text style={styles.inputLabels}>Health Insurance Number</Text>
              <TextInput
                style={styles.changeHealthInsuranceNumberInputBox}
                placeholder="Health Insurance Number"
                onChangeText={text => setHealthInsuranceNumber(text)}
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
                  console.log("user directed to change password")
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
                  router.replace('/(protected)/(tabs)/profile');
                  console.log("Profile changes have been made")
              }}
          >
            Save Changes
        </Button>
    </View>
  </View>
  )
}

export default settingsEditProfile

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    borderRadius:'',
    borderWidth:3,
    borderColor: colors.surface,
  },
  subSettingsContainer: {
	flex: 1,
	backgroundColor: colors.card,
	borderRadius: 15,
  borderWidth:3,
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
    marginLeft  : -133,
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
  subheaderTitle:{
    fontSize:25,
    fontWeight:'bold',
    paddingLeft: -1,
    color: colors.text,
    marginBottom: 5,
    marginTop: 5,
  },
  dividerLine:{
    backgroundColor: colors.border,
    height: 4,
    width: '100%',
    marginLeft: 0,
  },
  inputLabels:{
    fontSize:14,
    color: colors.text,
    marginLeft: 20,
    marginBottom:-14,
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
  firstNameInputlabel:{
    fontSize:14,
    color: colors.text,
    marginLeft: 20,
    marginBottom:-14,
    marginTop: 20,
  },
  changeFirstNameInputBox:{
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
  changeLastNameInputBox:{
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
  changePrimaryEmailInputBox:{
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
  changesecondaryEmailInputBox:{
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
  changePhoneNumberInputBox:{
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
  changeZipCodeInputBox:{
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
  changeCityNameInputBox:{
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
  changeStateNameInputBox:{
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
  changeCountryNameInputBox:{
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
  changeHealthInsuranceProviderNameInputBox:{
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
  changeHealthInsuranceNumberInputBox:{
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
  changeGenderInputBox:{
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
  changebirhthdateInputBox:{
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
