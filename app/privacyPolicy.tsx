import { StyleSheet, View, Image, Text, BackHandler} from 'react-native'
import React from 'react'
import { Button, List, Searchbar, Divider } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const privacyPolicy = () => {
	
	const router = useRouter();
  
  return (
	 <View style={styles.mainContainer}>

    <View style={styles.mainPrivacyPolicyHeader}>
      <MaterialCommunityIcons style={styles.privacyPolicyIcon}
        name='lock-outline'
        size={50}
        color='#000000'
        >
          <Text style={styles.privacyPolicyTitle}>
            Privacy Policy
          </Text>

      </MaterialCommunityIcons>
		</View>
		
		<View style={styles.subSettingsContainer}>

		

	
		</View>
    </View>
  )
}

export default privacyPolicy

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
	fontSize: 40,
	textAlign: 'center',
	alignContent: 'center',
	marginTop: 80,
	marginBottom: 20,
	marginHorizontal: 20,
	fontWeight: 'bold',
  marginLeft: -80,
  },
   mainPrivacyPolicyHeader: {
    marginTop: 20,
    marginBottom: 25,
    marginLeft: -170,
  },
  privacyPolicyTitle:{
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
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
  privacyPolicyIcon:{
    marginLeft: 130,
  },
 
});