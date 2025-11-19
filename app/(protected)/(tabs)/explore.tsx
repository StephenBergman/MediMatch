import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { Image } from 'expo-image';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const sections = [
  {
    title: 'File-based routing',
    content: (
      <>
        <ThemedText>
          This app has two screens{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{' '}
          and <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>.
        </ThemedText>
        <ThemedText>
          The layout file in{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          sets up the tab navigator.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </>
    ),
  },
  {
    title: 'Android, iOS, and web support',
    content: (
      <ThemedText>
        You can open this project on Android, iOS, and the web. To open the web version, press{' '}
        <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
      </ThemedText>
    ),
  },
  {
    title: 'Images',
    content: (
      <>
        <ThemedText>
          Provide @{`2x`} and @{`3x`} images to support different pixel densities.
        </ThemedText>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </>
    ),
  },
  {
    title: 'Light and dark mode components',
    content: (
      <>
        <ThemedText>
          This template has light and dark mode support. Use the{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook to adapt styling.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </>
    ),
  },
  {
    title: 'Animations',
    content: (
      <>
        <ThemedText>
          `components/HelloWave.tsx` demonstrates using{' '}
          <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText> for animation.
        </ThemedText>
        {Platform.OS === 'ios' && (
          <ThemedText>
            `components/ParallaxScrollView.tsx` provides the parallax effect shown on this screen.
          </ThemedText>
        )}
      </>
    ),
  },
];

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <MaterialCommunityIcons
          name="code-braces"
          size={260}
          color="#808080"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Explore
        </ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>

      <List.Section>
        {sections.map((section) => (
          <List.Accordion key={section.title} title={section.title}>
            <View style={styles.accordionContent}>{section.content}</View>
          </List.Accordion>
        ))}
      </List.Section>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
});
