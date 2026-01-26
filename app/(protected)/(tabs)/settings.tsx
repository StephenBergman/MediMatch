//this is the settings page, there will be sub settings included and logout option.

import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { Button, List, Searchbar, Divider } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

//this page will route to the login page after user accepts the terms and coniditions policy
import { useRouter } from 'expo-router'

//icons logic
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useAuth } from '@/features/auth/contexts/AuthContext'
import { useAppToast } from '@/components/contexts/AppToastProvider'

const settings = () => {
	
	const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { signOut, isLoading } = useAuth();
  const { showToast } = useAppToast();

  //stores for search bar
  const [query, setQuery] = React.useState("");

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      showToast(error);
      return;
    }
    router.replace('/login');
  };
  

  return (
	 <View style={styles.mainContainer}>

    <View style={styles.mainSettingsHeader}>
      <MaterialCommunityIcons style={styles.SettingsIcon}
        name='cog-outline'
        size={60}
        color={colors.primary}
        >
          <Text style={styles.settingsTitle}>
            Settings	
          </Text>

      </MaterialCommunityIcons>
		</View>
		
		<View style={styles.subSettingsContainer}>

			<ScrollView style={{margin: 10}}>

        <Searchbar
          placeholder="Search"
          value={query}
          onChangeText={setQuery}
          style={styles.SettingsSearchBar}
          inputStyle={{ color: colors.text }}
          placeholderTextColor={colors.tabIconDefault}
          iconColor={colors.icon}
        />
      
        <List.Section>

          <List.Subheader style={styles.subheaderTitle}> Account Settings </List.Subheader>

          <List.Item 
          title="Edit Profile"
          titleStyle={{ color: colors.text }}
          left={(props) => <List.Icon {...props} icon="account-circle" color={colors.primary} />} 
          right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.icon} />}
          onPress={() => router.push('/settingsEditProfile')}
          />

          <List.Item 
          title="Edit Password"
          titleStyle={{ color: colors.text }}
          left={(props) => <List.Icon {...props} icon="lock" color={colors.primary} />}
          right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.icon} />}
          onPress={() => router.push('/verificationCode_NP')}
          />

          <List.Item 
          title="Notifications"
          titleStyle={{ color: colors.text }}
          left={(props) => <List.Icon {...props} icon="bell" color={colors.primary} />} 
          right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.icon} />}
          onPress={() => router.push('/notifications')}
          />

          <List.Item 
          title="Chat History"
          titleStyle={{ color: colors.text }}
          left={(props) => <List.Icon {...props} icon="chat" color={colors.primary} />} 
          right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.icon} />}
          onPress={() => router.push('/chatHistory')} 
          />
          
          <Divider style={styles.dividerLine} />

          <List.Subheader style={styles.subheaderTitle}> More Settings </List.Subheader>

          <List.Item 
          title="About Us"
          titleStyle={{ color: colors.text }}
          left={(props) => <List.Icon {...props} icon="information" color={colors.primary} />} 
          right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.icon} />}
          onPress={() => router.push('/aboutUs')}
          />

          <List.Item 
          title="Privacy Policy"
          titleStyle={{ color: colors.text }}
          left={(props) => <List.Icon {...props} icon="shield-account-outline" color={colors.primary} />} 
          right={(props) => <List.Icon {...props} icon="chevron-right" color={colors.icon} />}
          onPress={() => router.push('/privacyPolicy')}
          />

        </List.Section>


				
			</ScrollView>

				<View style={styles.ButtonGroup}>

					<Button style={styles.logoutButton} mode="contained" 
          textColor={colors.inverseText}
          loading={isLoading}
          disabled={isLoading}
					onPress={handleLogout}>
						
						Logout

					</Button>
				</View>
		</View>
    </View>
  )
}

export default settings

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
  subSettingsContainer: {
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
  SettingsSearchBar: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 10,
    backgroundColor: colors.card,
  },
   mainSettingsHeader: {
    marginTop: 20,
    marginBottom: 25,
    marginLeft: -170,
  },
  cookieTermsConditions: {
	fontSize: 25,
	fontWeight: 'bold',
	textAlign: 'center',
	marginTop: 10,
  },
  logoutButton: {
	marginTop: 0,
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
  },
  cookieTermsConditionsPolicyText: {
	fontSize: 16,
	marginBottom: 20,
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
    width: '100%',
    marginLeft: 0,
  },
  SettingsIcon:{
    marginLeft: 130,
  },
 
});
