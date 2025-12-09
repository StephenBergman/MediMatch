import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React from 'react'

const login = () => {

  //for users email and password variables
  const[email, setEmail] = React.useState('');
  const[password, setPassword] = React.useState('');

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
    
})