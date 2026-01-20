//this is the settings page, there will be sub settings included and logout option.

import { StyleSheet, View, Image, Text, BackHandler, TextInput} from 'react-native'
import React from 'react'
import { Button, List, Searchbar, Divider, Avatar, IconButton, Icon } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

//this page will route to the login page after user accepts the terms and coniditions policy
import { useRouter } from 'expo-router'

//icons logic
import { MaterialCommunityIcons } from '@expo/vector-icons'

const settingsEditProfile = () => {
	
	const router = useRouter();

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
        <Avatar.Icon
          size={100}
          icon="account-edit"
          style={styles.SettingsIcon}
        />
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
              />
      <Text style={styles.inputLabels}>Last Name</Text>
              <TextInput
                style={styles.changeLastNameInputBox}
                placeholder="Lastname"
                onChangeText={text => setLastName(text)}
                value={lastName}
                autoCapitalize="none"
              />
      <Text style={styles.inputLabels}>Email</Text>
              <TextInput
                style={styles.changePrimaryEmailInputBox}
                placeholder="Primary Email"
                onChangeText={text => setEmail(text)}
                value={email}
                autoCapitalize="none"
              />
      <Text style={styles.inputLabels}>Secondary Email</Text>
              <TextInput
                style={styles.changesecondaryEmailInputBox}
                placeholder="Secondary Email"
                onChangeText={text => setSecondaryEmail(text)}
                value={secondaryEmail}
                autoCapitalize="none"
              /> 
      <Text style={styles.inputLabels}>Phone Number</Text>
              <TextInput
                style={styles.changePhoneNumberInputBox}
                placeholder="Phone Number"
                onChangeText={text => setPhoneNumber(text)}
                value={phoneNumber}
                autoCapitalize="none"
              />
      
      <Text style={styles.inputLabels}>Birth Date</Text>
              <TextInput
                style={styles.changebirhthdateInputBox}
                placeholder="Birth Date"
                onChangeText={text => setBirthDate(text)}
                value={birthDate}
                autoCapitalize="none"
              />

      <Text style={styles.inputLabels}>Gender</Text>
              <TextInput
                style={styles.changeGenderInputBox}
                placeholder="Gender"
                onChangeText={text => setGender(text)}
                value={gender}
                autoCapitalize="none"
              />
              
      <Text style={styles.inputLabels}>Zip Code</Text>
              <TextInput
                style={styles.changeZipCodeInputBox}
                placeholder="Zip Code"
                onChangeText={text => setZipCode(text)}
                value={zipCode}
                autoCapitalize="none"
              />
      <Text style={styles.inputLabels}>City</Text>
              <TextInput
                style={styles.changeCityNameInputBox}
                placeholder="City"
                onChangeText={text => setCity(text)}            
                value={city}
                autoCapitalize="none"
              />
      <Text style={styles.inputLabels}>State</Text>
              <TextInput
                style={styles.changeStateNameInputBox}
                placeholder="State"
                onChangeText={text => setState(text)}
                value={state}
                autoCapitalize="none"
              />
      <Text style={styles.inputLabels}>Country</Text>
              <TextInput
                style={styles.changeCountryNameInputBox}
                placeholder="Country" 
                onChangeText={text => setCountry(text)}
                value={country}
                autoCapitalize="none"
              />
      <Text style={styles.inputLabels}>Health Insurance Provider Name</Text>
              <TextInput
                style={styles.changeHealthInsuranceProviderNameInputBox}
                placeholder="Health Insurance Provider Name"
                onChangeText={text => setHealthInsuranceProviderName(text)}
                value={healthinsuranceprovidername}
                autoCapitalize="none"
              />
      <Text style={styles.inputLabels}>Health Insurance Number</Text>
              <TextInput
                style={styles.changeHealthInsuranceNumberInputBox}
                placeholder="Health Insurance Number"
                onChangeText={text => setHealthInsuranceNumber(text)}
                value={healthinsurancenumber}
                autoCapitalize="none"
              />
        

      </ScrollView>
        <Button
              mode="contained"
              textColor='#ffffff'
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
              textColor='#ffffff'
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

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#7e7e7eff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    borderRadius:'',
    borderWidth:3,
    borderColor: '#0000000000'
  },
  subSettingsContainer: {
	flex: 1,
	backgroundColor: '#ffffffff',
	borderRadius: 15,
  borderWidth:3,
  borderColor: '#0000000000',
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
  marginLeft: -145,
  },
  SettingsIcon: {
    marginTop: 6,
    marginBottom: 6,
    marginLeft  : -133,
  },
   mainSettingsHeader: {
    marginTop: 20,
    marginBottom: 25,
    marginLeft: 170,
  },
  ButtonGroup: {
	flexDirection: 'row',
	justifyContent: 'space-around',
  },
  subheaderTitle:{
    fontSize:25,
    fontWeight:'bold',
    paddingLeft: -1,
    color: '#000000ff',
    marginBottom: 5,
    marginTop: 5,
  },
  dividerLine:{
    backgroundColor: '#000000ff',
    height: 4,
    width: '100%',
    marginLeft: 0,
  },
  inputLabels:{
    fontSize:14,
    color:'#000000ff',
    marginLeft: 20,
    marginBottom:-14,
  },
  changePasswordButton: {
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginTop: 20, 
        padding: 5,
        marginBottom: 10,
    },
  saveChangesButton: {
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginTop: 20, 
        padding: 5,
        marginBottom: 30,
    },
  firstNameInputlabel:{
    fontSize:14,
    color:'#000000ff',
    marginLeft: 20,
    marginBottom:-14,
    marginTop: 20,
  },
  changeFirstNameInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20,
    paddingLeft: 10, 
    borderRadius: 5,
    width: '60%',
    alignSelf: 'flex-start',
  },
  changeLastNameInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '60%',
    alignSelf: 'flex-start',
  },
  changePrimaryEmailInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '90%',
    alignSelf: 'flex-start',
  },
  changesecondaryEmailInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '90%',
    alignSelf: 'flex-start',
  },
  changePhoneNumberInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '40%',
    alignSelf: 'flex-start',
  },
  changeZipCodeInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '30%',
    alignSelf: 'flex-start',
  },
  changeCityNameInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '40%',
    alignSelf: 'flex-start',
  },
  changeStateNameInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '40%',
    alignSelf: 'flex-start',
  },
  changeCountryNameInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '60%',
    alignSelf: 'flex-start',
  },
  changeHealthInsuranceProviderNameInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '90%',
    alignSelf: 'flex-start',
  },
  changeHealthInsuranceNumberInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '60%',
    alignSelf: 'flex-start',
  },
  changeGenderInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '60%',
    alignSelf: 'flex-start',
  },
  changebirhthdateInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '60%',
    alignSelf: 'flex-start',
  },

});