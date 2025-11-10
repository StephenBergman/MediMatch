import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetItem,
  BottomSheetItemText,
  BottomSheetPortal,
  BottomSheetTrigger,
} from '@/components/ui/bottomsheet';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import React from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ComponentSnippet from '../../ComponentSnippet';

const BottomSheetDemo = () => {
  return (
    <ComponentSnippet
      title="BottomSheet"
      snippet="NO SNIPPET"
      badSnippet
      example={
        Platform.OS === 'web' ? (
          <GestureHandlerRootView
            style={{
              width: '100%',
            }}
          >
            <Box className="h-[800px] w-full items-center justify-center bg-background-100">
              <BottomSheet>
                <BottomSheetTrigger>
                  <Text>Open BottomSheet</Text>
                </BottomSheetTrigger>
                <BottomSheetPortal
                  snapPoints={['25%', '50%']}
                  backdropComponent={BottomSheetBackdrop}
                  handleComponent={BottomSheetDragIndicator}
                >
                  <BottomSheetContent>
                    <BottomSheetItem>
                      <BottomSheetItemText>Item 1</BottomSheetItemText>
                    </BottomSheetItem>
                    <BottomSheetItem>
                      <BottomSheetItemText>Item 2</BottomSheetItemText>
                    </BottomSheetItem>
                    <BottomSheetItem>
                      <BottomSheetItemText>Item 3</BottomSheetItemText>
                    </BottomSheetItem>
                  </BottomSheetContent>
                </BottomSheetPortal>
              </BottomSheet>
            </Box>
          </GestureHandlerRootView>
        ) : (
          <Box className="h-[600px] w-full items-center justify-center bg-background-100">
            <Text className="mb-4 text-center">Preview disabled on mobile, see errors below.</Text>
          </Box>
        )
      }
      notes={`<BottomSheet> should be used at the 'screen' level, not inside other components. Behavior is not as expected when used inside other components, specifically on mobile.`}
      warnings={`<GestureHandlerRootView style={{ width: '100%' }}> must be used as a parent of <BottomSheet>.`}
      errors={`Error spamming in console on mobile, caused by <BottomSheetPortal>, potentially fixed by upgrading react-native-gesture-handler:

[Reanimated] Reading from 'value' during component render. Please ensure that you don't access the 'value' property nor use 'get' method of a shared value while React is rendering a component.

If you don't want to see this message, you can disable the 'strict' mode. Refer to:
https://docs.swmansion.com/react-native-reanimated/docs/debugging/logger-configuration for more details. `}
    />
  );
};

export default BottomSheetDemo;
