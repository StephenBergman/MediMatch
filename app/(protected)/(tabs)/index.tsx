//This will be the cookie policy page before user sees the login screen. User must agree to terms before they are able to continue.

import { StyleSheet, View, Image, Text} from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

//this page will route to the login page after user accepts the terms and coniditions policy
import { useRouter } from 'expo-router'

const index = () => {
	const router = useRouter();
  return (
	 <View style={styles.mainContainer}>

		<Image
				style={styles.cookieImage}
				source={require('../../../assets/images/cookie.png')}
		/>

		<Text style={styles.cookieText}>
			Hello, before you continue, please review and accept our cookie policy to enhance your experience on our app.	
		</Text>
		
		<View style={styles.policyContainer}>

			<Text style={styles.cookieTermsConditions}>
				Terms and Conditions
			</Text>

			<ScrollView style={{margin: 10}}>
				<Text style={styles.cookieTermsConditionsPolicyText}>
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

					<Button style={[styles.acceptCookiesButton, styles.declineCookiesButton]} mode="contained" 
					onPress={() => 
					{
						console.log('User Declined terms');
					}}>

						Decline

					</Button>

					<Button style={[styles.acceptCookiesButton, styles.declineCookiesButton]} mode="contained" 
					onPress={() => 
					{
						console.log('User Declined terms');
						router.push('/(protected)/(tabs)/login');
					}}>
						
						Accept

					</Button>

				</View>

		</View>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#7e7e7eff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  policyContainer: {
	flex: 1,
	backgroundColor: '#ffffffff',
	borderRadius: 10,
	width: '100%',
	marginTop: -10,
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
  },
  declineCookiesButton: {
	marginTop: 0,
	margin: 8,
	padding: 5,
	backgroundColor: '#000000ff',
	flexWrap: 'wrap',
	alignContent: 'center',
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