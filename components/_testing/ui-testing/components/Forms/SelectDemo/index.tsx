import { ChevronDownIcon } from '@/components/ui/icon';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const SelectDemo = () => {
  return (
    <ComponentSnippet
      title="Select"
      example={
        <Select isInvalid={false} isDisabled={false}>
          <SelectTrigger size={'lg'} variant={'outline'}>
            <SelectInput placeholder="Select option" />
            <SelectIcon className="mr-3" as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="UX Research" value="UX Research" />
              <SelectItem label="Web Development" value="Web Development" />
              <SelectItem
                label="Cross Platform Development Process"
                value="Cross Platform Development Process"
              />
              <SelectItem
                label="UI Designing (disabled)"
                value="UI Designing (disabled)"
                isDisabled={true}
              />
              <SelectItem label="Backend Development" value="Backend Development" />
            </SelectContent>
          </SelectPortal>
        </Select>
      }
      snippet="gs-SelectBasic-lg"
    />
  );
};

export default SelectDemo;
