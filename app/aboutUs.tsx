import { StyleSheet, View, Image, Text, BackHandler } from 'react-native'
import React from 'react'
import { Button, List, Searchbar, Divider } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

const aboutUs = () => {
	
	const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  
  return (
	 <View style={styles.mainContainer}>

    <View style={styles.mainHeader}>
      <MaterialCommunityIcons style={styles.headerIcon}
        name='domain'
        size={50}
        color={colors.primary}
        >
          <Text style={styles.privacyPolicyTitle}>
            About Us
          </Text>

      </MaterialCommunityIcons>
		</View>
		
		<View style={styles.subContainer}>

      <ScrollView>
        <Text style={styles.privacyPolicyText}>
          {"\n"}
          About MediMatch
          {"\n"}{"\n"}
          MediMatch is a mobile app created by three college students as part of a school project. 
          We built it to apply what we’ve learned about mobile development, design, and teamwork in a real-world setting.
          {"\n"}{"\n"}
          Purpose of the App
          {"\n"}{"\n"}
          This project is a hands-on learning experience where we experiment, improve our skills, and 
          turn ideas into a working app that could possibly be a real life application.
          {"\n"}{"\n"}
          Our Team
          {"\n"}{"\n"}
          Stephen - AI / Backend Developer
          {"\n"}
          Bachelors of Science in Computer Science 2026
          {"\n"}{"\n"}
          Aiden - SupaBase / Backend Developer
          {"\n"}
          Bachelors of Science in Computer Science 2026
          {"\n"}{"\n"}
          Austin - UI / Frontend Developer
          {"\n"}
          Bachelors of Science in Computer Science 2026
          {"\n"}{"\n"}
          Contact Us
          {"\n"}{"\n"}
          If you have any questions or feedback about MediMatch, feel free to reach out to us at:
          {"\n"}{"\n"}
          Email: theMediMatchProject@gmail.com
          
        </Text>  
      </ScrollView>

      <MaterialCommunityIcons
          name="arrow-left"
          size={34}
          color={colors.icon}
          style={styles.backButton}
          onPress={() => router.back()}
        />
	
		</View>
    </View>
  )
}

export default aboutUs

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
  subContainer: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 15,
    borderWidth:3,
    borderColor: colors.card,
    width: '100%',
    marginTop: -10,
    marginBottom: -15,
  },
   mainHeader: {
    marginTop: 20,
    marginBottom: 25,
    marginLeft: -170,
  },
  privacyPolicyTitle:{
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: colors.text,
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
  headerIcon:{
    marginLeft: 130,
  },
  backButton:{
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 20,
  },
  privacyPolicyText:{
    fontSize: 16,
    marginHorizontal: 15,
    textAlign: 'left',
    color: colors.text,
  },
 
});
