import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import React from 'react';
import { Alert } from 'react-native';
import ComponentSnippet from '../../ComponentSnippet';

const PressableDemo = () => {
  return (
    <ComponentSnippet
      title="Pressable"
      example={
        <Pressable
          onPress={() => {
            Alert.alert('Pressed!');
            console.log('Pressed!');
          }}
          disabled={false}
          className="bg-primary-500 p-5"
        >
          <Text className="text-typography-0">PRESSABLE</Text>
        </Pressable>
      }
      snippet="gs-PressableBasic"
      notes={`Use for clickable/tappable elements. Replacement for <TouchableOpacity />.`}
    />
  );
};

export default PressableDemo;
