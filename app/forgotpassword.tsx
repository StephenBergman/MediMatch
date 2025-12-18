import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import { router } from 'expo-router'

const forgotpassword = () => {

  //for users email entry
    const[email, setEmail] = React.useState('');

  return (
    <View>
      <Text style={styles.forgotPasswordTitle}>Forgot Password</Text>

      <Text style={styles.fp_EnterEmailText}>Enter Your Email Address</Text>

      <TextInput
              style={styles.fp_EmailInputBox}
              placeholder="Enter Email"
              onChangeText={text => setEmail(text)}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
      />

      <Text style={styles.backToSignInText}
          onPress={() => {
            console.log("User sent back to login")
            router.replace('../login');
          }}
        >
        Back to sign in
      </Text>

      <Button
        mode="contained"
        textColor='#ffffff'
        style={styles.resetpasswordButton}
          onPress={() => {
            console.log("User sent to verify code")
            router.replace('../verificationCode');
            }}
        >
        Reset Password
      </Button>
      
      

      <Button
        mode="contained"
        textColor='#ffffff'
        style={styles.signUpButton}
          onPress={() => {
            console.log("User sent to sign up page")
            router.replace('../signup');
            }}
        >
        Sign Up
      </Button>

      <Button
        mode="outlined"
        textColor='#ffffff'
        style={ styles.googleButton }
            onPress={() => {
            console.log('Google Sign-Up pressed');
          }}
        >
        Sign Up with Google
      </Button>

    </View>
  )
}

export default forgotpassword

const styles = StyleSheet.create({
    forgotPasswordTitle:{
        fontSize: 16,
        color:"#000000ff" ,
        fontWeight:'bold',
        textAlign: 'center',
        marginTop: 40,       
    },
    fp_EnterEmailText:{
        fontSize: 18,
        color:"#000000ff" ,
        fontWeight:'bold',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: -12,
    },
    fp_EmailInputBox: {
        height: 50, 
        borderColor: '#000', 
        borderWidth: 3, 
        margin: 20, 
        paddingLeft: 10, 
        borderRadius: 5,
        alignSelf: 'center',
        width: '75%',
    },
    backToSignInText:{
        fontSize: 14,
        color:"#003cffff" ,
        fontWeight:'bold',
        textAlign: 'center',
        marginTop: -5, 
    },
    resetpasswordButton:{
        width: '50%', 
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginTop: 20, 
        padding: 5
    },
    signUpButton: {
        width: '50%', 
        alignSelf: 'center',
        backgroundColor: '#000000',
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
})