import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router, Router } from 'expo-router';

const emergencyMedicalID = () => {

  return (
    <View>
      <Text>emergencyMedicalID</Text>





      <MaterialCommunityIcons
					name="arrow-left"
					size={34}
					color={colors.icon}
					style={styles.backButton}
					onPress={() => router.back()}
				/>
    </View>
    
  )
}

export default emergencyMedicalID

const styles = StyleSheet.create({
    backButton: {
			marginTop: 20,
			marginBottom: 30,
			marginLeft: 20,
		},
})