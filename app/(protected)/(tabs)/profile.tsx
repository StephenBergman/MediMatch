//this is the profile page where users can view and edit their profile information

import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Avatar } from 'react-native-paper'

//icons logic

const profile = () => {
	
	const router = useRouter();


  return (
	 <View style={styles.mainContainer}>

    <View style={styles.mainProfileHeader}>

      <Text style={styles.profileTitle}>Profile</Text>

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

        <Text style={styles.subheaderTitle}>Health Preferences</Text>
        <View style={styles.dividerLine} />

        <Text style={styles.subheaderTitle}>Recent Activity</Text>
        <View style={styles.dividerLine} />
       

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
	fontSize: 20,
	textAlign: 'center',
	alignContent: 'center',
	marginTop: -15,
	marginBottom: 5,
	marginHorizontal: 20,
	fontWeight: 'bold',
  marginLeft: -145,
  },
  profileIcon: {
    marginTop: 6,
    marginBottom: 6,
    marginLeft  : -260,
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
    marginLeft: 20,
    marginBottom:-14,
  },
});