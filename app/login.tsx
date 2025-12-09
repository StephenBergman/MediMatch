import { StyleSheet, View, Image, TextInput } from 'react-native'
import React from 'react'

//this page will route to the home page after user signs in successfully
import { useRouter } from 'expo-router'
import { Button, Text, Checkbox} from 'react-native-paper';

//for Google Sign-In
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const login = () => {

  //for users email and password variables
  const[email, setEmail] = React.useState('');
  const[password, setPassword] = React.useState('');

  //router variable to route to home page after login
  const router = useRouter();

  //user is able to check the box to stay signed into there account
  const [rememberMe, setRememberMe] = React.useState(false);

  return (
  <View>

    <Image style={styles.MedimatchLogo}
      source={require('../assets/images/medimatch_logoMain.png')}
    />

    <Text style={styles.MediMatchTitle}>
        Welcome to Medimatch!
    </Text>
    
    <TextInput
        style={styles.emailInputBox}
        placeholder="Enter Email"
        onChangeText={text => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
    />

    <TextInput
        style={styles.passwordInputBox}
        placeholder="Enter Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
    />

    <Button
        mode="text"
        onPress={() => {
            router.push('/forgotpassword');
        }}
        style={styles.forgotpasswordButton}
    >
        Forgot Password?
    </Button>

    <Button
        mode="contained"
        textColor='#ffffff'
        onPress={() => {
            router.push('/home');
        }}
        style={styles.signInButton}
    >
        Sign In
    </Button>

    <Button
        mode="outlined"
        textColor='#ffffff'
        onPress={() => {
            console.log('Google Sign-In pressed');
        }}
        style={ styles.googleButton }
    >
        Sign In with Google
    </Button> 

    <Button
        mode="text"
        textColor='#000000ff'
        onPress={() => {
            router.push('/signup');
        }}
        style={styles.signupButton}
    >
        Don't have an account? Sign Up Here
    </Button> 

  </View>
  )
}

export default login

const styles = StyleSheet.create({
    MedimatchLogo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginTop: 50,
    },
    MediMatchTitle: {
        fontSize: 30, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginTop: 25
    },
    emailInputBox: {
        height: 50, 
        borderColor: '#000', 
        borderWidth: 3, 
        margin: 20, 
        paddingLeft: 10, 
        borderRadius: 5,
        alignSelf: 'center',
        width: '75%',
    },
    passwordInputBox: {
        height: 50, 
        borderColor: '#000', 
        borderWidth: 3, 
        margin: 20, 
        paddingLeft: 10, 
        borderRadius: 5,
        width: '75%',
        alignSelf: 'center',
    },
    forgotpasswordButton: {
        alignSelf: 'flex-end',
        marginRight: '11%',
        marginTop: -20,
    },
    signupButton: {
        width: '75%', 
        alignSelf: 'center', 
        marginTop: 20, 
        padding: 5
    },
    googleButton: {
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginTop: 20, 
        padding: 5
    },
    signInButton: {
        width: '50%', 
        alignSelf: 'center', 
        marginTop: 20, 
        padding: 5
    },
})