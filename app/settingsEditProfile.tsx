//this is the settings page, there will be sub settings included and logout option.

import { StyleSheet, View, Image, Text, BackHandler, TextInput} from 'react-native'
import React from 'react'
import { Button, List, Searchbar, Divider, Avatar } from 'react-native-paper'
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
  const[phoneNumber, setPhoneNumber] = React.useState('');

  return (
	 <View style={styles.mainContainer}>

    <View style={styles.mainSettingsHeader}>

      <Text style={styles.settingsTitle}>Edit Profile</Text>

      <Avatar.Icon
        size={80}
        icon="account-edit"
        style={styles.SettingsIcon}
      />
		</View>
		
		<View style={styles.subSettingsContainer}>

			<ScrollView style={{margin: 10}}>

      <Text style={styles.inputLabels}>First Name</Text>
              <TextInput
                style={styles.changeFirstNameInputBox}
                placeholder="Set Firstname"
                onChangeText={text => setFirstName(text)}
                value={firstName}
                autoCapitalize="none"
              />
      <Text style={styles.inputLabels}>Last Name</Text>
              <TextInput
                style={styles.changeFirstNameInputBox}
                placeholder="Set Lastname"
                onChangeText={text => setLastName(text)}
                value={lastName}
                autoCapitalize="none"
              />
				
			
      </ScrollView>
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
    marginLeft  : -124,
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
  changeFirstNameInputBox:{
    height: 50, 
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
  },
});