import { Button, ButtonText } from '@/components/ui/button';
import { AddIcon, GlobeIcon, Icon, SettingsIcon } from '@/components/ui/icon';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { PaintBucket, PuzzleIcon } from 'lucide-react-native';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const MenuDemo = () => {
  return (
    <ComponentSnippet
      title="Menu"
      example={
        <Menu
          placement={'top'}
          disabledKeys={['Settings']}
          trigger={({ ...triggerProps }) => {
            return (
              <Button {...triggerProps}>
                <ButtonText>Menu</ButtonText>
              </Button>
            );
          }}
        >
          <MenuItem key="Community" textValue="Community">
            <Icon as={GlobeIcon} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Community</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Plugins" textValue="Plugins">
            <Icon as={PuzzleIcon} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Plugins</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Theme" textValue="Theme">
            <Icon as={PaintBucket} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Theme</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Settings" textValue="Settings">
            <Icon as={SettingsIcon} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Settings</MenuItemLabel>
          </MenuItem>
          <MenuItem key="Add account" textValue="Add account">
            <Icon as={AddIcon} size="sm" className="mr-2" />
            <MenuItemLabel size="sm">Add account</MenuItemLabel>
          </MenuItem>
        </Menu>
      }
      snippet="MenuBasic"
    />
  );
};

export default MenuDemo;
