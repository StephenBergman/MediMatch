//this is the home page, there will be profile info and other details here
import { StyleSheet, View, Image, Text, BackHandler, TextInput} from 'react-native'
import React from 'react'
import { Button, List, Searchbar, Divider, Avatar, IconButton, Icon } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

//routing logic
import { useRouter } from 'expo-router'

//icons logic
import { MaterialCommunityIcons } from '@expo/vector-icons'

const home = () => {
	
	const router = useRouter();

  return (
	 <View style={styles.mainHomeContainer}>

    <View style={styles.mainHomeHeader}>

      <View style={styles.avatarHomeIcon}>
        <Avatar.Icon
          size={100}
          icon="account-edit"
        />
      </View>
		</View>
		
		<View style={styles.subHomeContainer}>

			<ScrollView style={{margin: 10}}>

    
      </ScrollView>
    </View>
  </View>
  )
}

export default home

const styles = StyleSheet.create({
  mainHomeContainer: {
    flex: 1,
    backgroundColor: '#7e7e7eff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    borderRadius:'',
    borderWidth:3,
    borderColor: '#0000000000'
  },
  subHomeContainer: {
    flex: 1,
    backgroundColor: '#ffffffff',
    borderRadius: 0,
    borderWidth:3,
    borderColor: '#0000000000',
    width: '101%',
    marginTop: -10,
    marginBottom: -15,
  },
  homeTitle: {
    fontSize: 20,
    textAlign: 'center',
    alignContent: 'center',
    marginTop: -15,
    marginBottom: 5,
    marginHorizontal: 20,
    fontWeight: 'bold',
  },
  avatarHomeIcon: {
    marginTop: 40,
    marginBottom: -60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#000000',
    elevation: 10,
    zIndex: 10,
  },
   mainHomeHeader: {
    marginTop: 20,
    marginBottom: 25,
    alignItems: 'center',
  },
  
});