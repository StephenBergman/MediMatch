//this is the settings page, there will be sub settings included and logout option.

import { StyleSheet, View, Image, Text, BackHandler} from 'react-native'
import React from 'react'
import { Button, Searchbar } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

//this page will route to the login page after user accepts the terms and coniditions policy
import { useRouter } from 'expo-router'

//icons logic
import { MaterialCommunityIcons } from '@expo/vector-icons'



const settings = () => {
	
	const router = useRouter();

  //stores for search bar
  const [query, setQuery] = React.useState("");

  return (
	 <View style={styles.mainContainer}>

    <MaterialCommunityIcons style={styles.SettingsIcon}
      name='cog-outline'
      size={60}
      color='#000000'>

        <Text style={styles.settingsTitle}>
			    Settings	
		    </Text>

    </MaterialCommunityIcons>
		
		
		<View style={styles.subSettingsContainer}>

			<ScrollView style={{margin: 10}}>
				<Text style={styles.cookieTermsConditionsPolicyText}>

          <Searchbar
          placeholder="Search"
          value={query}
          onChangeText={setQuery}
          style={styles.SettingsSearchBar}
          inputStyle={styles.SettingsSearchBarInput}
        />
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					{"\n"}{"\n"}
					Medimatch terms and conditions apply
					
				</Text>
			</ScrollView>

				<View style={styles.ButtonGroup}>

					<Button style={styles.logoutButton} mode="contained" 
					onPress={() => 
					{
						console.log('User has been logged out, re-directed to login screen');
						//if user accepts terms, they will be routed to the login page
						router.push('/login');
					}}>
						
						Logout

					</Button>
				</View>
		</View>
    </View>
  )
}

export default settings

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
  SettingsIcon: {
    marginRight: 10
  },
  SettingsSearchBar: {
    borderRadius: 10,
    borderColor: '#0000000',
    marginBottom: 10
  },
  SettingsSearchBarInput: {

  },
  cookieTermsConditions: {
	fontSize: 25,
	fontWeight: 'bold',
	textAlign: 'center',
	marginTop: 10,
  },
  logoutButton: {
	marginTop: 0,
	margin: 8,
	padding: 5,
	backgroundColor: '#000000ff',
	flexWrap: 'wrap',
	alignContent: 'center',
	borderRadius: 10,
	borderWidth: 3,
  },
  ButtonGroup: {
	flexDirection: 'row',
	justifyContent: 'space-around',
  },
  cookieTermsConditionsPolicyText: {
	fontSize: 16,
	marginBottom: 20,
  },
});