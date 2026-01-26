//this is the settings page, there will be sub settings included and logout option.

import { StyleSheet, View, Image, Text, BackHandler } from 'react-native'
import React from 'react'
import { Button, List, Searchbar, Divider } from 'react-native-paper'
import { ScrollView, TextInput } from 'react-native-gesture-handler'

//this page will route to the login page after user accepts the terms and coniditions policy
import { useRouter } from 'expo-router'

//icons logic
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

const signup = () => {
	
	const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const styles = React.useMemo(() => createStyles(colors), [colors]);

  //profile inputs
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');


  //stores for search bar
  const [query, setQuery] = React.useState("");

  return (
	 <View style={styles.mainContainer}>

    <View style={styles.mainSignUpHeader}>
      <MaterialCommunityIcons style={styles.signUpIcon}
        name='account'
        size={60}
        color={colors.primary}
        >
          <Text style={styles.settingsTitle}>
            Create Account	
          </Text>

      </MaterialCommunityIcons>
		</View>
		
		<View style={styles.subSignUpContainer}>

			<ScrollView style={{margin: 10}}>

      <Text style={styles.inputLabels}>First Name</Text>
        <TextInput
          style={styles.signUpInputBox}
          placeholder="Enter Firstname"
          onChangeText={text => setFirstName(text)}
          value={firstName}
          autoCapitalize="none"
          placeholderTextColor={colors.tabIconDefault}
        />
      <Text style={styles.inputLabels}>Last Name</Text>
        <TextInput
          style={styles.signUpInputBox}
          placeholder="Enter Lastname"
          onChangeText={text => setLastName(text)}
          value={lastName}
          autoCapitalize="none"
          placeholderTextColor={colors.tabIconDefault}
        />
      <Text style={styles.inputLabels}>Username</Text>
        <TextInput
          style={styles.signUpInputBox}
          placeholder="Create Username"
          onChangeText={text => setUsername(text)}
          value={username}
          autoCapitalize="none"
          placeholderTextColor={colors.tabIconDefault}
        />
      <Text style={styles.inputLabels}>Email Address</Text>
        <TextInput
          style={styles.signUpInputBox}
          placeholder="Enter Email"
          onChangeText={text => setEmail(text)}
          value={email}
          autoCapitalize="none"
          placeholderTextColor={colors.tabIconDefault}
        />
      <Text style={styles.inputLabels}>Create Password</Text>
        <TextInput
          style={styles.signUpInputBox}
          placeholder="Enter Password"
          onChangeText={text => setPassword(text)}
          value={password}
          autoCapitalize="none"
          placeholderTextColor={colors.tabIconDefault}
        />
      <Text style={styles.inputLabels}>Confirm Password</Text>
        <TextInput
          style={styles.signUpInputBox}
          placeholder="Confirm Password"
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          placeholderTextColor={colors.tabIconDefault}
        />
    
			</ScrollView>

				<View style={styles.ButtonGroup}>

					<Button style={styles.createAccountButton} mode="contained" 
          textColor={colors.inverseText}
					onPress={() => 
					{
						console.log("User account is created")
            console.log("User is be directed to login....")
            router.replace('/login');
					}}>
						
						Create Account

					</Button>
				</View>

        <Text style={styles.smallText}>OR</Text>

        <Button
          mode="outlined"
          textColor={colors.primary}
          style={ styles.googleButton }
          onPress={() => {
            console.log('Google Sign-In pressed');
          }}
          >
          Sign Up with Google
        </Button>

        <MaterialCommunityIcons
          name="arrow-left"
          size={15}
          color={colors.inverseText}
          style={styles.backButton}
          onPress={() => router.back()}
        />
		</View>
  </View>
  )
}

export default signup

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    borderRadius:'',
    borderWidth:3,
    borderColor: colors.surface,
  },
  subSignUpContainer: {
	flex: 1,
	backgroundColor: colors.card,
	borderRadius: 15,
  borderWidth:3,
  borderColor: colors.card,
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
  color: colors.text,
  },
  signUpIcon: {
    marginTop: 6,
    marginLeft:150,
    marginRight:20,
  },
   mainSignUpHeader: {
    marginTop: 20,
    marginBottom: 25,
    marginLeft: -170,
  },
  createAccountButton: {
	marginTop: -20,
	marginBottom: 15,
	padding: 5,
	backgroundColor: colors.primary,
	flexWrap: 'wrap',
	alignContent: 'center',
	borderRadius: 10,
	borderWidth: 3,
  borderColor: colors.primary,
  },
  ButtonGroup: {
	flexDirection: 'row',
	justifyContent: 'space-around',
  marginTop: 40,
  },
  subheaderTitle:{
    fontSize:25,
    fontWeight:'bold',
    paddingLeft: -1,
    color: colors.text,
    marginBottom: 5,
    marginTop: 5,
  },
  dividerLine:{
    backgroundColor: colors.border,
    height: 4,
    width: '80%',
    marginHorizontal: 40,
  },
  signUpInputBox:{
    height: 50, 
    borderColor: colors.border, 
    borderWidth: 3, 
    margin: 20, 
    paddingLeft: 10, 
    borderRadius: 5,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.card,
    color: colors.text,
  },
  googleButton: {
    width: '50%',
    alignSelf: 'center',
    borderColor: colors.primary,
    borderWidth: 2,
    marginTop: 20,
    marginBottom: 40,
    padding: 5
  },
  smallText:{
    fontSize:18,
    color: colors.text,
    marginHorizontal:194,
  },
  inputLabels:{
    fontSize:14,
    color: colors.text,
    marginLeft: 20,
    marginBottom:-14,
  },
  backButton:{
    position: 'absolute',
    bottom: 40,
    left: 16,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 20,
  }
 
});
