//This will be the cookie policy page before user sees the login screen. User must agree to terms before they are able to continue.

import { StyleSheet, View, Image, Text} from 'react-native'
import React from 'react'

const index = () => {
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

});