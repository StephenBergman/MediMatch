import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'
import { router } from 'expo-router'

const verificationCode_NP = () => {

  //for users email entry
    const[password, setPassword] = React.useState('');
    const[confirmPassword, setConfirmPassword] = React.useState('');

  return (
    <View>
      <Text style={styles.verificationCode_NP_Title}>Verify New Password</Text>



      <Text style={styles.inputLabels}>Create New Password</Text>

      <TextInput
              style={styles.verificationCode_NP_EmailInputBox}
              onChangeText={text => setPassword(text)}
              value={password}
              secureTextEntry={false}
              autoCapitalize="none"
      />

      <Text style={styles.inputLabels}>Confirm New Password</Text>

      <TextInput
              style={styles.verificationCode_NP_EmailInputBox}
              onChangeText={text => setConfirmPassword(text)}
              value={confirmPassword}
              secureTextEntry={true}
              autoCapitalize="none"
      />

      <Button
        mode="contained"
        textColor='#ffffff'
        style={styles.verificationCode_NP_Button}
          onPress={() => {
            console.log("User sent to back to login screen")
            router.replace('../login');
            }}
        >
        Confirm New Password
      </Button>
      

    </View>
  )
}

export default verificationCode_NP

const styles = StyleSheet.create({
    verificationCode_NP_Title:{
        fontSize: 16,
        color:"#000000ff" ,
        fontWeight:'bold',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 30,      
    },
    verificationCode_NP_EnterEmailText:{
        fontSize: 18,
        color:"#000000ff" ,
        fontWeight:'bold',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: -12,
    },
    verificationCode_NP_EmailInputBox: {
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
        color:"#000000ff" ,
        fontWeight:'bold',
        textAlign: 'center',
        marginTop: -5, 
    },
    verificationCode_NP_Button:{
        width: '50%', 
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginTop: 20, 
        padding: 5,
        borderRadius: 5,
    },
    haveAnAccountText:{
        fontSize: 20,
        color:"#000000ff" ,
        fontWeight:'bold',
        textAlign: 'center',
        marginTop: -5, 
    },
    signUpButton: {
        width: '50%', 
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginTop: 20, 
        padding: 5,
        borderRadius: 5,
    },
    googleButton: {
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#000000',
        marginTop: 20, 
        padding: 5,
        borderRadius: 5,
    },
    bottomButtonGroup:{
        marginTop: 300,
        alignItems: 'center',
        paddingBottom: 20,
    },
    orText:{
        fontSize: 20,
        color:"#000000ff" ,
        fontWeight:'bold',
        textAlign: 'center',
        marginTop: 20, 
        marginBottom: 3,
    },
    inputLabels:{
    fontSize:14,
    color:'#000000ff',
    marginLeft: 55,
    marginBottom:-14,
  },
})