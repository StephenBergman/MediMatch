import { StyleSheet, View, Image, Text, BackHandler} from 'react-native'
import React from 'react'
import { Button, List, Searchbar, Divider, Switch } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const notifications = () => {
	
	const router = useRouter();

  const [isPushEnabled, setIsPushEnabled] = React.useState(true);
  const [isEmailEnabled, setIsEmailEnabled] = React.useState(false);
  const togglePushNotifications = () => setIsPushEnabled(previousState => !previousState);
  const toggleEmailNotifications = () => setIsEmailEnabled(previousState => !previousState);
  
  return (
	 <View style={styles.mainContainer}>

    <View style={styles.mainHeader}>

      <MaterialCommunityIcons style={styles.mainHeaderIcon}
        name='bell-outline'
        size={50}
        color='#000000'
        >
          <Text style={styles.notificationsTitle}>
            Notifications
          </Text>

      </MaterialCommunityIcons>
		</View>
		
		<View style={styles.subHeaderContainer}>

      <ScrollView>

        <List.Item
          title="Push Notifications"
          description="Receive notifications on your device"
          right={() => (
            <Switch
              value={isPushEnabled}
              onValueChange={togglePushNotifications}
            />
          )}
        />
        <Divider style={styles.dividerLine} />
        <List.Item
          title="Email Notifications"
          description="Receive notifications via email"
          right={() => (
            <Switch
              value={isEmailEnabled}
              onValueChange={toggleEmailNotifications}
            />
          )}
        />
        <Divider style={styles.dividerLine} />  
        
      </ScrollView>

      <MaterialCommunityIcons
          name="arrow-left"
          size={34}
          color="#000000"
          style={styles.backButton}
          onPress={() => router.back()}
        />
	
		</View>
    </View>
  )
}

export default notifications

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
  subHeaderContainer: {
    flex: 1,
    backgroundColor: '#ffffffff',
    borderRadius: 15,
    borderWidth:3,
    borderColor: '#0000000000',
    width: '100%',
    marginTop: -10,
    marginBottom: -15,
  },
   mainHeader: {
    marginTop: 20,
    marginBottom: 25,
    marginLeft: -170,
  },
  notificationsTitle:{
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
    height: 2,
    width: '100%',
    marginLeft: 0,
  },
  mainHeaderIcon:{
    marginLeft: 130,
  },
  backButton:{
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 20,
  },
});