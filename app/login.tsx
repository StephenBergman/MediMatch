import { StyleSheet, View, Image, TextInput } from 'react-native'
import React from 'react'

//this page will route to the home page after user signs in successfully
import { useRouter } from 'expo-router'
import { Button, Text, Checkbox} from 'react-native-paper';

//for Google Sign-In
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const login = () => {

  //Login page is being loaded log
  console.log('Login page loaded');

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
        onChangeText={(text) => {
            console.log("Email is being typed", text);
            setEmail(text);
        }}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
    />

    <TextInput
        style={styles.passwordInputBox}
        placeholder="Enter Password"
        onChangeText={(text) => {
            console.log("Password is being typed", text);
            setPassword(text);
        }}
        value={password}
        secureTextEntry={true}
    />

    <View style={styles.buttonHorizontal}>

        <View style={styles.rememberMeRow}>

            <Checkbox status={rememberMe ? 'checked' : 'unchecked'} 
            onPress={() => setRememberMe(!rememberMe)}
            />
            <Text 
                style={styles.rememberMeButton}
                onPress={() => {
                    console.log('Remember Me pressed');
                    setRememberMe(!rememberMe);
                }}
                >
                    Remember Me
            </Text>
        </View>

            <Button
                mode="text"
                textColor='#000000ff'
                style={styles.forgotpasswordButton}
                onPress={() => {
                    console.log('Forgot-Password Pressed')
                    router.push('/forgotpassword');
                }}
            >
                Forgot Password?
            </Button>
    </View>

    <Button
        mode="contained"
        textColor='#ffffff'
        style={styles.signInButton}
        onPress={() => {
            console.log("Sign in pressed with email: " + email + " and password: " + password);
            router.replace('/(protected)/(tabs)/home');
        }}
    >
        Sign In
    </Button>

    <Button
        mode="outlined"
        textColor='#ffffff'
        style={ styles.googleButton }
        onPress={() => {
            console.log('Google Sign-In pressed');
        }}
    >
        Sign In with Google
    </Button> 

    <Button
        mode="text"
        textColor='#000000ff'
        style={styles.signupButton}
        onPress={() => {
            console.log('Sign-Up pressed')
            router.push('/signup');
        }}
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
        backgroundColor: '#000000',
        marginTop: 20, 
        padding: 5
    },
    forgotpasswordButton: {
        flexDirection: 'row',
        alignSelf: 'auto',
        marginRight: '11%',
        marginTop: -25,
    },
    rememberMeButton: {
        flexDirection: 'row',
        alignSelf: 'auto',
        fontSize: 14,
        marginLeft: 4,
        color:'#000000',
    },
    buttonHorizontal: {
        flexDirection: 'row',
        width: '95%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        alignItems: 'center'
    },
    rememberMeRow:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -25,
        marginLeft: '11%',
    },
    
})