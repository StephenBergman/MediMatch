import { useAppToast } from '@/components/contexts/AppToastProvider';
import React, { useState } from 'react';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { reportFeedback } from 'utils/ErrorHandling/helpers/capture';

type FeedbackModalProps = {
	open: boolean;
	onClose: () => void;
};

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const { showToast } = useAppToast();

	const handleSubmit = async () => {
		try {
			await reportFeedback({ email, message });
			showToast('Bug report submitted. Thanks!');
			setEmail('');
			setMessage('');
			onClose();
		} catch {
			showToast('Something went wrong. Please try again.');
		}
	};

	return (
		<>
			<Portal>
				<Dialog visible={open} onDismiss={onClose}>
					<Dialog.Title>Report this issue?</Dialog.Title>
					<Dialog.Content>
						<TextInput
							mode="outlined"
							label="Email (optional)"
							value={email}
							onChangeText={setEmail}
							autoCapitalize="none"
							keyboardType="email-address"
							style={{ marginBottom: 12 }}
						/>
						<TextInput
							mode="outlined"
							label="What went wrong?"
							value={message}
							onChangeText={setMessage}
							multiline
						/>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={onClose}>Cancel</Button>
						<Button onPress={handleSubmit}>Submit</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
}
