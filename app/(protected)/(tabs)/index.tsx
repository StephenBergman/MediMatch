//This will be the cookie policy page before user sees the login screen. User must agree to terms before they are able to continue.

import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const index = () => {
  return (
	 <View style={styles.mainContainer}>

		<View style={styles.policyContainer}>

		</View>

    </View>
  )
}

export default index

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#696969ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  policyContainer: {
	flex: 1,
	backgroundColor: '#ffffffff',
	borderRadius: 10,
	width: '200%',
	height: '100%',
	marginTop: 160,
  },
  mainContainerImage: {
	width: 100,
	height: 100,
	resizeMode: 'contain',
  },

});