import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import React, { useState } from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const FormControlDemo = () => {
  const [passwordDemo, setPasswordDemo] = useState('');
  return (
    <ComponentSnippet
      title="FormControl"
      snippet="gs-FormControlBasic-lg"
      example={
        <FormControl isInvalid={passwordDemo.length < 6} isDisabled={false} isRequired={true}>
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>
          <Input>
            <InputField
              type="password"
              defaultValue={passwordDemo}
              placeholder="password"
              onChange={(e) => {
                setPasswordDemo(e.nativeEvent.text);
              }}
            />
          </Input>

          <FormControlHelper>
            <FormControlHelperText>Must be at least 6 characters.</FormControlHelperText>
          </FormControlHelper>

          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>At least 6 characters are required.</FormControlErrorText>
          </FormControlError>
        </FormControl>
      }
    />
  );
};

export default FormControlDemo;
