import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import ComponentSnippet from '../../ComponentSnippet';

const AvatarDemo = () => {
  return (
    <ComponentSnippet
      title="Avatar"
      example={
        <VStack space="2xl">
          <HStack space="md">
            <Avatar>
              <AvatarFallbackText>SS</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: 'https://tse1.mm.bing.net/th/id/OIP.oclsmngXgMLCJBTkS_Z6MAHaJ2?rs=1&pid=ImgDetMain&o=7&rm=3',
                }}
              />
              <AvatarBadge />
            </Avatar>
            <VStack>
              <Heading size="sm">Spongebob Squarepants</Heading>
              <Text size="sm">Fry Cook</Text>
            </VStack>
          </HStack>
          <HStack space="md">
            <Avatar>
              <AvatarFallbackText>EK</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: 'https://tse4.mm.bing.net/th/id/OIP.FO0cJ0Z6FTisp1Zne42IpgHaMq?rs=1&pid=ImgDetMain&o=7&rm=3',
                }}
              />
              <AvatarBadge className="bg-yellow-300" />
            </Avatar>
            <VStack>
              <Heading size="sm">Eugene Krabs</Heading>
              <Text size="sm">Owner</Text>
            </VStack>
          </HStack>
        </VStack>
      }
      snippet="gs-AvatarBasic-lg"
      notes="AvatarBadge is optional, and can be styled with tailwind className='bg-color-x'."
    />
  );
};

export default AvatarDemo;
