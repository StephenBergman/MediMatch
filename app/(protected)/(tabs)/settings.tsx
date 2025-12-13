//This is the settings page that has multiple setting options for the user.

import { StyleSheet, Text, View, Image,  } from 'react-native'
import React from 'react'


const settings = () => {
  return (
    <View style={styles.mainContainer}>

      
    
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
  },
  SettingsContainer: {
	flex: 1,
	backgroundColor: '#ffffffff',
	borderRadius: 10,
	width: '100%',
	marginTop: -10,
  },
})