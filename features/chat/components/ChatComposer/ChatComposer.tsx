import React from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	View,
} from 'react-native';
import { Button, HelperText, IconButton, Text, TextInput, useTheme } from 'react-native-paper';

type Props = {
	value: string;
	onChange: (value: string) => void;
	onSend: () => void;
	isSending: boolean;
	disabled?: boolean;
	placeholder?: string;
};

/** Message input + send control used at the bottom of the chat experience. */
export function ChatComposer({
	value,
	onChange,
	onSend,
	isSending,
	disabled,
	placeholder = 'Share symptoms or concerns…',
}: Props) {
	const theme = useTheme();
	const canSend = !!value.trim() && !isSending && !disabled;

	const renderSendControl = () => {
		if (isSending) {
			return (
				<View style={styles.spinnerWrap}>
					<ActivityIndicator animating size="small" color={theme.colors.primary} />
				</View>
			);
		}
		return (
			<IconButton
				mode="contained"
				icon="send"
				onPress={onSend}
				disabled={!canSend}
				size={28}
				style={styles.sendButton}
				accessibilityLabel="Send message"
			/>
		);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 76 : 0}
		>
			<View style={styles.container}>
				<View style={styles.headerRow}>
					<Text variant="labelLarge" style={styles.label}>
						Message
					</Text>
					<Text variant="labelMedium" style={styles.subdued}>
						Personal details optional—keep it brief.
					</Text>
				</View>
				<View style={styles.inputRow}>
					<TextInput
						mode="outlined"
						multiline
						value={value}
						onChangeText={onChange}
						placeholder={placeholder}
						style={styles.input}
						contentStyle={styles.inputContent}
						outlineStyle={styles.outline}
						returnKeyType="send"
						onSubmitEditing={() => {
							if (canSend) onSend();
						}}
						right={
							value ? (
								<TextInput.Icon icon="close-circle" onPress={() => onChange('')} />
							) : null
						}
					/>
					{renderSendControl()}
				</View>
				<HelperText type="info" visible>
					Replies come from MediMatch’s assistant—not a clinician.
				</HelperText>
				<Button
					mode="text"
					onPress={() => onChange('How can you help me decide between urgent care and the ER?')}
					icon="message-reply"
					compact
					style={styles.suggestion}
					disabled={isSending}
				>
					Fill with a sample question
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		gap: 8,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	label: {
		fontWeight: '600',
	},
	subdued: {
		opacity: 0.72,
	},
	inputRow: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		gap: 8,
	},
	input: {
		flex: 1,
	},
	inputContent: {
		minHeight: 64,
		paddingTop: 10,
	},
	outline: {
		borderRadius: 16,
	},
	sendButton: {
		alignSelf: 'flex-end',
		marginBottom: 2,
	},
	spinnerWrap: {
		alignSelf: 'flex-end',
		marginBottom: 6,
		marginRight: 4,
	},
	suggestion: {
		alignSelf: 'flex-start',
		paddingHorizontal: 0,
	},
});
