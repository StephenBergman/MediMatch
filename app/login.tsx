import React, { useEffect } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';

//this page will route to the home page after user signs in successfully
import { useRouter } from 'expo-router';
import { Button, Checkbox, Text } from 'react-native-paper';

//for Google Sign-In
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();



useEffect(() => {
  const testConnection = async () => {
    try {
      // Plain fetch to Supabase root (returns simple JSON)
      const response = await fetch('https://xnsxgefnbonqftldkfri.supabase.co/rest/v1/', {
        headers: {
          apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
        },
      });
      const data = await response.json();
      console.log('Plain fetch success:', data);

      
    } catch (err) {
      console.log('Fetch error:', err instanceof Error ? err.message : 'Unknown error');
    }
    
  };
  testConnection();
}, []);




const login = () => {

  //for users email and password variables
  const[email, setEmail] = React.useState('');
  const[password, setPassword] = React.useState('');

  //router variable to route to home page after login
  const router = useRouter();

  //user is able to check the box to stay signed into there account
  const [rememberMe, setRememberMe] = React.useState(false);


const redirectUri = 'https://auth.expo.io/@Dd0nk/medimatch';

console.log('Using redirectUri:', redirectUri);  // Test Log 


   // Google hook for authentication
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, 
    redirectUri: redirectUri, 
    scopes: ['profile', 'email'], 
  });

    const [loading, setLoading] = React.useState(false);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            const result = await promptAsync();
            
            if (result.type === 'success') {
                // Handle successful authentication
                // Extract the access token from result.authentication.accessToken
                console.log('Google sign-in successful:', result);
                
                // Navigate to home page after successful sign-in
                router.push('/home');
            } else {
                console.log('Google sign-in cancelled or failed');
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
        } finally {
            setLoading(false);
        }
    };

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

    <View style={styles.buttonHorizontal}>

        <View style={styles.rememberMeRow}>

            <Checkbox status={rememberMe ? 'checked' : 'unchecked'} 
            onPress={() => setRememberMe(!rememberMe)}
            />
            <Text 
                style={styles.rememberMeButton}
                onPress={() => setRememberMe(!rememberMe)}>
                    Remember Me
            </Text>
        </View>

            <Button
                mode="text"
                textColor='#000000ff'
                style={styles.forgotpasswordButton}
                onPress={() => {
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
            router.push('/home');
        }}
    >
        Sign In
    </Button>

    <Button
        mode="outlined"
        textColor="#ffffff"
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={loading || !request} // Disable until request is ready
      >
        Sign In with Google
      </Button>

    <Button
        mode="text"
        textColor='#000000ff'
        style={styles.signupButton}
        onPress={() => {
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