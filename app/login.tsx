import { StyleSheet, View, Image, TextInput } from 'react-native'
import React from 'react'

//this page will route to the home page after user signs in successfully
import { useRouter } from 'expo-router'
import { Button, Text, Checkbox} from 'react-native-paper';
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

//for Google Sign-In
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const login = () => {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const styles = React.useMemo(() => createStyles(colors), [colors]);

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
  <View style={styles.mainContainer}>

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
        placeholderTextColor={colors.tabIconDefault}
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
        placeholderTextColor={colors.tabIconDefault}
    />

    <View style={styles.buttonHorizontal}>

        <View style={styles.rememberMeRow}>

            <Checkbox
            status={rememberMe ? 'checked' : 'unchecked'} 
            onPress={() => setRememberMe(!rememberMe)}
            color={colors.primary}
            uncheckedColor={colors.border}
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
                textColor={colors.text}
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
        textColor={colors.inverseText}
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
        textColor={colors.primary}
        style={ styles.googleButton }
        onPress={() => {
            console.log('Google Sign-In pressed');
        }}
    >
        Sign In with Google
    </Button> 

    <Button
        mode="text"
        textColor={colors.text}
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

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.surface,
        paddingHorizontal: 12,
    },
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
        marginTop: 25,
        color: colors.text,
    },
    emailInputBox: {
        height: 50, 
        borderColor: colors.border, 
        borderWidth: 3, 
        margin: 20, 
        paddingLeft: 10, 
        borderRadius: 5,
        alignSelf: 'center',
        width: '75%',
        backgroundColor: colors.card,
        color: colors.text,
    },
    passwordInputBox: {
        height: 50, 
        borderColor: colors.border, 
        borderWidth: 3, 
        margin: 20, 
        paddingLeft: 10, 
        borderRadius: 5,
        width: '75%',
        alignSelf: 'center',
        backgroundColor: colors.card,
        color: colors.text,
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
        borderColor: colors.primary,
        borderWidth: 2,
        marginTop: 20, 
        padding: 5
    },
    signInButton: {
        width: '50%', 
        alignSelf: 'center',
        backgroundColor: colors.primary,
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
        color: colors.text,
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
