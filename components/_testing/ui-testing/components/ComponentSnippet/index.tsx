import { ExternalLink } from '@/components/Tools/ExternalLink';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon, LinkIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React from 'react';
import { Platform } from 'react-native';

/**
 * Props for the ComponentSnippet component.
 * @property title - The title of the component.
 * @property snippet - The code snippet shortcut.
 * @property badSnippet - If true, highlights the snippet as an error.
 * @property example - Example usage of the component.
 * @property example2 - An additional example usage.
 * @property notes - Informational notes.
 * @property warnings - Warning messages.
 * @property errors - Error messages.
 */
interface ComponentSnippetProps {
  title: string;
  snippet: string;
  badSnippet?: boolean;
  example?: React.ReactNode;
  example2?: React.ReactNode;
  notes?: React.ReactNode;
  warnings?: React.ReactNode;
  errors?: React.ReactNode;
}

/**
 * ComponentSnippet displays a formatted code snippet, examples, notes, warnings, and errors.
 * Useful for documentation, UI testing, and developer previews.
 * Integrates gluestack-ui components for consistent cross-platform styling.
 *
 * @param {ComponentSnippetProps} props - Props for ComponentSnippet.
 * @param {string} props.title - The title of the component.
 * @param {React.ReactNode} props.snippet - The code snippet shortcut.
 * @param {boolean} [props.badSnippet] - If true, highlights the snippet as an error.
 * @param {React.ReactNode} [props.example] - Example usage of the component.
 * @param {React.ReactNode} [props.example2] - An additional example usage.
 * @param {React.ReactNode} [props.notes] - Informational notes.
 * @param {React.ReactNode} [props.warnings] - Warning messages.
 * @param {React.ReactNode} [props.errors] - Error messages.
 * @returns {JSX.Element} The formatted snippet preview UI.
 */
const ComponentSnippet: React.FC<ComponentSnippetProps> = ({
  title,
  snippet,
  badSnippet = false,
  example,
  example2,
  notes,
  warnings,
  errors,
}: ComponentSnippetProps) => {
  const href = `https://gluestack.io/ui/docs/components/${title.toLowerCase()}`;
  return (
    <Box className="mb-8">
      {title && (
        <Box className="mb-2">
          <HStack className="items-center gap-4 align-bottom">
            <Heading size="2xl">{title}</Heading>
            {snippet && (
              <Box
                className={
                  `mt-1 w-auto rounded-md p-2 ` +
                  (badSnippet
                    ? 'border border-error-500 bg-white dark:border-error-700 dark:bg-neutral-900'
                    : 'border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800')
                }
              >
                <Text
                  className={
                    badSnippet
                      ? 'text-error text-sm'
                      : 'text-sm text-neutral-800 dark:text-neutral-200'
                  }
                >
                  <Text className="font-mono text-sm">{snippet}</Text>
                </Text>
              </Box>
            )}
            <ExternalLink href={href}>
              {Platform.OS === 'web' && <Text>gluestack.io</Text>}
              <Icon as={LinkIcon} size="sm" />
            </ExternalLink>
          </HStack>
        </Box>
      )}
      {example && (
        <Box className="mt-1 rounded-md border border-neutral-200 bg-white p-4 dark:border-neutral-600 dark:bg-neutral-900">
          <Text className="mb-2">Example:</Text>
          {example}
        </Box>
      )}
      {example2 && (
        <Box className="mt-2 rounded-md border border-neutral-200 bg-white p-4 dark:border-neutral-600 dark:bg-neutral-900">
          <Text className="mb-2">Example B:</Text>
          {example2}
        </Box>
      )}
      {notes && (
        <Box className="mt-4 w-auto rounded-md border border-info-500 bg-info-50 p-3">
          <Text className="text-sm text-info-900">{notes}</Text>
        </Box>
      )}
      {warnings && (
        <Box className="mt-4 w-auto rounded-md border border-warning-500 bg-warning-50 p-3">
          <Text className="text-sm text-warning-900">{warnings}</Text>
        </Box>
      )}
      {errors && (
        <Box className="mt-4 w-auto rounded-md border border-error-500 bg-error-50 p-3">
          <Text className="text-sm text-error-900">{errors}</Text>
        </Box>
      )}
    </Box>
  );
};

export default ComponentSnippet;
