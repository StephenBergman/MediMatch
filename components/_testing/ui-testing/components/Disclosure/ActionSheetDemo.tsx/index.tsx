import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import { Button, ButtonText } from '@/components/ui/button';
import React, { useState } from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const ActionSheetDemo = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  return (
    <ComponentSnippet
      title="ActionSheet"
      example={
        <>
          <Button onPress={() => setShowActionSheet(true)}>
            <ButtonText>Open</ButtonText>
          </Button>
          <Actionsheet isOpen={showActionSheet} onClose={() => setShowActionSheet(false)}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>
              <ActionsheetItem onPress={() => setShowActionSheet(false)} isDisabled>
                <ActionsheetItemText>Delete</ActionsheetItemText>
              </ActionsheetItem>
              <ActionsheetItem onPress={() => setShowActionSheet(false)}>
                <ActionsheetItemText>Share</ActionsheetItemText>
              </ActionsheetItem>
              <ActionsheetItem onPress={() => setShowActionSheet(false)}>
                <ActionsheetItemText>Play</ActionsheetItemText>
              </ActionsheetItem>
              <ActionsheetItem onPress={() => setShowActionSheet(false)}>
                <ActionsheetItemText>Favourite</ActionsheetItemText>
              </ActionsheetItem>
              <ActionsheetItem onPress={() => setShowActionSheet(false)}>
                <ActionsheetItemText>Cancel</ActionsheetItemText>
              </ActionsheetItem>
            </ActionsheetContent>
          </Actionsheet>
        </>
      }
      snippet="gs-ActionsheetBasicActionsheet"
    />
  );
};

export default ActionSheetDemo;
