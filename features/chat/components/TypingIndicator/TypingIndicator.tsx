import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

/** Shows the assistant typing state underneath the chat list. */
export function TypingIndicator() {
    const theme = useTheme();
    return (
        <View style={styles.row}>
            <Surface
                elevation={1}
                style={[
                    styles.bubble,
                    {
                        backgroundColor: theme.colors.surfaceVariant,
                        borderColor: theme.colors.outlineVariant,
                    },
                ]}
            >
                <Text
                    variant="labelMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                >
                    MediMatch
                </Text>
                <View style={styles.typingRow}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                    <Text style={[styles.copy, { color: theme.colors.onSurface }]}>
                        typing
                    </Text>
                </View>
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    bubble: {
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        gap: 8,
    },
    typingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    copy: {
        fontSize: 14,
    },
});