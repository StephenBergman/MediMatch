import ScreenView from '@/components/Tools/ScreenView';
import { useAppToast } from '@/components/contexts/AppToastProvider';
import {
	authError,
	invariantError,
	networkError,
	validationError,
} from '@/utils/ErrorHandling/errors/types';
import axios, { Method, isAxiosError } from 'axios';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Text } from 'react-native-paper';
import { guard } from 'utils/ErrorHandling/helpers/capture';

type ButtonAction = () => void | Promise<unknown>;

type ExampleConfig = {
	key: string;
	label: string;
	action: ButtonAction;
};

const SANDBOX_FALLBACK_BASE_URL = 'https://httpstat.us';
const SANDBOX_API_BASE_URL =
	process.env.EXPO_PUBLIC_SANDBOX_API_BASE_URL ?? SANDBOX_FALLBACK_BASE_URL;
const sandboxHttp = axios.create({
	baseURL: SANDBOX_API_BASE_URL,
	timeout: 4500,
	headers: { Accept: 'text/plain' },
});

const ROUTE_STATUS_MAP: Record<string, { success: number; failure?: number }> =
	{
		'/users/sandbox/test': { success: 200, failure: 500 },
		'/auth/login': { success: 200, failure: 401 },
	};

const resolveSandboxStatus = (url: string, shouldError: boolean) => {
	const entry = ROUTE_STATUS_MAP[url];
	if (shouldError) {
		return entry?.failure ?? 500;
	}
	return entry?.success ?? 200;
};

type SandboxCallArgs = {
	url: string;
	method?: Method;
	body?: Record<string, unknown>;
};

const ExampleCard = ({
	title,
	description,
	examples,
}: {
	title: string;
	description?: string;
	examples: ExampleConfig[];
}) => (
	<Card style={styles.card}>
		<Card.Title title={title} subtitle={description} />
		<Card.Content>
			<View style={styles.cardContent}>
				{examples.map((example) => (
					<Button
						key={example.key}
						mode="outlined"
						onPress={example.action}
						accessibilityLabel={example.label}
					>
						{example.label}
					</Button>
				))}
			</View>
		</Card.Content>
	</Card>
);

export default function ErrorTesting() {
	const { showToast } = useAppToast();

	const throwAuthSessionExpired = useMemo(
		() =>
			guard(() => {
				throw authError('Session expired (demo)', {
					code: 'AUTH_SESSION_EXPIRED',
					status: 401,
				});
			}),
		[]
	);
	const throwAuthEmailUnverified = useMemo(
		() =>
			guard(() => {
				throw authError('Email not verified (demo)', {
					code: 'AUTH_EMAIL_UNVERIFIED',
					status: 401,
				});
			}),
		[]
	);
	const throwAuthProviderMismatch = useMemo(
		() =>
			guard(() => {
				throw authError('Provider mismatch (demo)', {
					code: 'AUTH_PROVIDER_MISMATCH',
					metadata: { expected: 'google', actual: 'apple' },
				});
			}),
		[]
	);
	const throwAuthLoginRequired = useMemo(
		() =>
			guard(() => {
				throw authError('Login required (demo)', {
					code: 'AUTH_LOGIN_REQUIRED',
				});
			}),
		[]
	);
	const throwAuthCancelled = useMemo(
		() =>
			guard(() => {
				throw authError('Authentication cancelled (demo)', {
					code: 'AUTH_CANCELLED',
				});
			}),
		[]
	);
	const throwAuthRequestFailed = useMemo(
		() =>
			guard(() => {
				throw authError('Authentication failed (demo)', {
					code: 'AUTH_REQUEST_FAILED',
					status: 500,
				});
			}),
		[]
	);

	const throwValidationRequired = useMemo(
		() =>
			guard(() => {
				throw validationError('Name is required (demo)', {
					code: 'VALIDATION_REQUIRED',
				});
			}),
		[]
	);
	const throwValidationPattern = useMemo(
		() =>
			guard(() => {
				throw validationError('Phone number format mismatch (demo)', {
					code: 'VALIDATION_PATTERN_MISMATCH',
				});
			}),
		[]
	);
	const throwValidationRange = useMemo(
		() =>
			guard(() => {
				throw validationError('Value out of range (demo)', {
					code: 'VALIDATION_OUT_OF_RANGE',
				});
			}),
		[]
	);
	const throwValidationUnique = useMemo(
		() =>
			guard(() => {
				throw validationError('Email already taken (demo)', {
					code: 'VALIDATION_UNIQUE',
				});
			}),
		[]
	);
	const throwValidationConflict = useMemo(
		() =>
			guard(() => {
				throw validationError('Conflicting selections (demo)', {
					code: 'VALIDATION_CONFLICT',
				});
			}),
		[]
	);

	const throwNetworkOffline = useMemo(
		() =>
			guard(() => {
				throw networkError('Offline (demo)', {
					status: 0,
					retryable: false,
					metadata: { reason: 'offline' },
				});
			}),
		[]
	);
	const throwNetwork404 = useMemo(
		() =>
			guard(() => {
				throw networkError('Not found (demo)', {
					status: 404,
					retryable: false,
				});
			}),
		[]
	);
	const throwNetworkTimeout = useMemo(
		() =>
			guard(() => {
				throw networkError('Request timed out (demo)', {
					status: 408,
					retryable: true,
				});
			}),
		[]
	);

	const throwInvariant = useMemo(
		() =>
			guard(() => {
				throw invariantError('Invariant violated (demo)');
			}),
		[]
	);

	const callSandbox = useCallback(
		async (
			{ url, method = 'GET', body }: SandboxCallArgs,
			shouldError = false
		) => {
			const status = resolveSandboxStatus(url, shouldError);
			const fullUrl = `${url}?status=${status}`;
			try {
				await sandboxHttp.request({
					url: fullUrl,
					method,
					data: body,
				});
				showToast('Sandbox call succeeded');
			} catch (error) {
				if (isAxiosError(error)) {
					throw networkError(error.message, {
						status: error.response?.status,
						retryable: true,
					});
				}
				throw error;
			}
		},
		[showToast]
	);

	const sections: {
		title: string;
		description?: string;
		examples: ExampleConfig[];
	}[] = [
		{
			title: 'Authentication errors',
			description: 'Trigger guard flows for different auth scenarios.',
			examples: [
				{
					key: 'auth-session',
					label: 'Session expired',
					action: throwAuthSessionExpired,
				},
				{
					key: 'auth-email',
					label: 'Email unverified',
					action: throwAuthEmailUnverified,
				},
				{
					key: 'auth-provider',
					label: 'Provider mismatch',
					action: throwAuthProviderMismatch,
				},
				{
					key: 'auth-login',
					label: 'Login required',
					action: throwAuthLoginRequired,
				},
				{ key: 'auth-cancel', label: 'Cancelled', action: throwAuthCancelled },
				{
					key: 'auth-failed',
					label: 'Request failed',
					action: throwAuthRequestFailed,
				},
			],
		},
		{
			title: 'Validation errors',
			description: 'Test validation error factories.',
			examples: [
				{
					key: 'validation-required',
					label: 'Required field',
					action: throwValidationRequired,
				},
				{
					key: 'validation-pattern',
					label: 'Pattern mismatch',
					action: throwValidationPattern,
				},
				{
					key: 'validation-range',
					label: 'Range violation',
					action: throwValidationRange,
				},
				{
					key: 'validation-unique',
					label: 'Unique violation',
					action: throwValidationUnique,
				},
				{
					key: 'validation-conflict',
					label: 'Conflict',
					action: throwValidationConflict,
				},
			],
		},
		{
			title: 'Network errors',
			examples: [
				{
					key: 'network-offline',
					label: 'Offline',
					action: throwNetworkOffline,
				},
				{ key: 'network-404', label: 'Not found', action: throwNetwork404 },
				{
					key: 'network-timeout',
					label: 'Timeout',
					action: throwNetworkTimeout,
				},
			],
		},
		{
			title: 'Invariant & Sandbox',
			examples: [
				{ key: 'invariant', label: 'Invariant error', action: throwInvariant },
				{
					key: 'sandbox-success',
					label: 'Sandbox success',
					action: () => callSandbox({ url: '/users/sandbox/test' }, false),
				},
				{
					key: 'sandbox-error',
					label: 'Sandbox error',
					action: () => callSandbox({ url: '/users/sandbox/test' }, true),
				},
			],
		},
	];

	return (
		<ScreenView padded responsive={false}>
			<View style={styles.content}>
				<Text variant="headlineSmall">Error Handling Sandboxes</Text>
				<Text variant="bodyMedium">
					Use these controls to trigger each guard path and error factory. This
					lets you verify capture, policy, and UX behavior while developing.
				</Text>

				<Divider />

				{sections.map((section) => (
					<ExampleCard key={section.title} {...section} />
				))}
			</View>
		</ScreenView>
	);
}

const styles = StyleSheet.create({
	content: {
		gap: 24,
		width: '100%',
		alignSelf: 'stretch',
	},
	card: {
		width: '100%',
		alignSelf: 'stretch',
		marginBottom: 16,
	},
	cardContent: {
		gap: 8,
	},
});
