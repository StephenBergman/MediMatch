//this is the profile page where users can view and edit their profile information

import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { Avatar } from 'react-native-paper'

//icons logic

const profile = () => {
	
  //routes to other pages
	const router = useRouter();

  //user storage display
  const [username, setUsername] = React.useState('');
  const [age, setAge] = React.useState('');
  const [gender, setGender] = React.useState('');

  //Location preferences storage
  const [zipCode, setZipCode] = React.useState('');
  const [area, setArea] = React.useState('');

  //Health Preferences storage
  const [healthinsuranceprovidername, setHealthInsuranceProviderName] = React.useState('');
  const [healthinsurancenumber, setHealthInsuranceNumber] = React.useState('');
  const [costSensitivity, setCostSensitivity] = React.useState('');

  //Recent Activity storage
  const [lastsymptomcheck, setLastSymptomCheck] = React.useState('');
  const [lastdoctorvisit, setLastDoctorVisit] = React.useState('');
  const [mostcommonsymptom, setMostCommonSymptom] = React.useState('');
  const [lastcarerecommended, setLastCareRecommended] = React.useState('');

  return (
	 <View style={styles.mainContainer}>

    <Text style={styles.profileTitle}>Profile</Text>

    <View style={styles.avatarNameRow}>
    
    <Pressable onPress={() => router.push('/settingsEditProfile')}>
      <Avatar.Icon
        size={80}
        icon="account-edit"
      />
    </Pressable>

      <View>
        <Text style={styles.username}>Username: {username}</Text>
        <Text style={styles.username}>Age: {age}</Text>
        <Text style={styles.username}>Gender: {gender}</Text>
      </View>

		</View>

		
		<View style={styles.subProfileContainer}>
		 <ScrollView style={{margin: 10}}>

        <Text style={styles.subheaderTitle}>User Location</Text>
        <View style={styles.dividerLine} />

        <Text style={styles.inputLabels}>Zip Code</Text>
                      <TextInput
                        style={styles.zipCodeInputBox}
                        placeholder="1234"
                        onChangeText={text => setZipCode(text)}
                        value={zipCode}
                        autoCapitalize="none"
                      />
                      
        <Text style={styles.inputLabels}>City, State</Text>
                      <TextInput
                        style={styles.areaInputBox}
                        placeholder="City, State"
                        onChangeText={text => setZipCode(text)}
                        value={zipCode}
                        autoCapitalize="none"
                      />

        <Text style={styles.subheaderTitle}>Health Preferences</Text>
        <View style={styles.dividerLine} />

        <Text style={styles.inputLabels}>Health Insurance Provider</Text>
                      <TextInput
                        style={styles.healthInsuranceProviderInputBox}
                        placeholder="Name of Provider"
                        onChangeText={text => setHealthInsuranceProviderName(text)}
                        value={healthinsuranceprovidername}
                        autoCapitalize="none"
                      />
        {/* Needs to be updated for a drop box option for insurance providers*/}
        <Text style={styles.inputLabels}>Insurance Number</Text>
                      <TextInput
                        style={styles.currentInsuranceInputBox}
                        placeholder="Insurance #"
                        onChangeText={text => setHealthInsuranceNumber(text)}
                        value={healthinsurancenumber}
                        autoCapitalize="none"
                      />
        
        <View style={styles.healthPreferencesRow}>
          <Text style={styles.HealthPreferencesName}>Cost Sensitivity: {costSensitivity}</Text>
        </View>
      

        <Text style={styles.subheaderTitle}>Recent Activity</Text>
        <View style={styles.dividerLine}/>
        
        <View style={styles.recentActivityRow}>  
          <Text style={styles.recentActivityName}>Last Symptom Check: {lastsymptomcheck}</Text>
        </View>

        <View style={styles.recentActivityRow}>  
          <Text style={styles.recentActivityName}>Last Doctor Visit: {lastdoctorvisit}</Text>
        </View>

        <View style={styles.recentActivityRow}>                 
          <Text style={styles.recentActivityName}>Most Common Symptom: {mostcommonsymptom}</Text>
        </View>

        <View style={styles.recentActivityRow}>
          <Text style={styles.recentActivityName}>Last Care Recommended: {lastcarerecommended}</Text>
        </View>

     </ScrollView>
    </View>
    
  </View>
  )
}

export default profile
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
  subProfileContainer: {
	flex: 1,
	backgroundColor: '#ffffffff',
	borderRadius: 15,
  borderWidth:3,
  borderColor: '#0000000000',
	width: '100%',
	marginTop: -10,
  marginBottom: -15,
  },
  profileTitle: {
	fontSize: 30,
  marginTop: 5,
  marginBottom: 10,
  fontWeight: 'bold',
	textAlign: 'center',
  },
  profileIcon: {
    marginTop: -15,
    marginBottom: 4,
    marginLeft  : -270,
    flexDirection: 'row',
  },
   avatarNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
    marginBottom: -15,
    marginTop: 10,
    marginLeft: 10,
  },
  zipCodeInputBox:{
    height: 50,
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '30%',
    marginLeft: 10,
  },
  areaInputBox:{
    height: 50,
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '30%',
    marginLeft: 10,
  },
  currentInsuranceInputBox:{
    height: 50,
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '50%',
    marginLeft: 10,
  },
  costSensitivityInputBox:{
    height: 50,
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '50%',
    marginLeft: 10,
  },  
  healthInsuranceProviderInputBox:{
    height: 50,
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '50%',
    marginLeft: 10,
  },

  lastSymptomCheckInputBox:{
    height: 50,
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '50%',
    marginLeft: 10,
  },
  lastDoctorVisitInputBox:{
    height: 50,
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '50%',
    marginLeft: 10,
  },
  mostCommonSymptomInputBox:{
    height: 50,
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '50%',
    marginLeft: 10,
  },
  lastCareRecommendedInputBox:{
    height: 50,
    borderColor: '#000', 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '50%',
    marginLeft: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  HealthPreferencesName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  healthPreferencesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 10,
  },
  recentActivityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  recentActivityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: 10,
  },
});