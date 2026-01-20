//this is the profile page where users can view and edit their profile information

import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { Avatar } from 'react-native-paper'

//icons logic

const profile = () => {
	
  //routes to other pages
	const router = useRouter();

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

    <View style={styles.mainProfileHeader}>

      

      <Avatar.Icon
        size={100}
        icon="account-edit"
        style={styles.profileIcon}
      />
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
        
        {/* Needs to be updated for a drop box option*/}
        <Text style={styles.inputLabels}>Cost Sensitivity</Text>
                      <TextInput
                        style={styles.costSensitivityInputBox}
                        placeholder="High, Medium, Low"
                        onChangeText={text => setCostSensitivity(text)}
                        value={costSensitivity}
                        autoCapitalize="none"
                      />
        

        <Text style={styles.subheaderTitle}>Recent Activity</Text>
        <View style={styles.dividerLine} />
        
        <Text style={styles.inputLabels}>Last Symptom Check</Text>
                      <TextInput
                        style={styles.lastSymptomCheckInputBox}
                        placeholder="MM/DD/YYYY"
                        onChangeText={text => setLastSymptomCheck(text)}
                        value={lastsymptomcheck}
                        autoCapitalize="none"
                      />
        <Text style={styles.inputLabels}>Last Doctor Visit</Text>
                      <TextInput
                        style={styles.lastDoctorVisitInputBox}
                        placeholder="MM/DD/YYYY"
                        onChangeText={text => setLastDoctorVisit(text)}
                        value={lastdoctorvisit}
                        autoCapitalize="none"
                      />
        <Text style={styles.inputLabels}>Most Common Symptom</Text>
                      <TextInput
                        style={styles.mostCommonSymptomInputBox}
                        placeholder="e.g., Headache"
                        onChangeText={text => setMostCommonSymptom(text)}
                        value={mostcommonsymptom}
                        autoCapitalize="none"
                      />
        <Text style={styles.inputLabels}>Last Care Recommended</Text>
                      <TextInput
                        style={styles.mostCommonSymptomInputBox}
                        placeholder="e.g., Headache"
                        onChangeText={text => setLastCareRecommended(text)}
                        value={lastcarerecommended}
                        autoCapitalize="none"
                      />                         
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
	textAlign: 'center',
	alignContent: 'center',
	marginTop: 5,
	fontWeight: 'bold',
  marginLeft: 5,
  },
  profileIcon: {
    marginTop: -15,
    marginBottom: 4,
    marginLeft  : -270,
    flexDirection: 'row',
  },
   mainProfileHeader: {
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
});