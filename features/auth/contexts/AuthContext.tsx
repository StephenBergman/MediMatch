import type { Session, User } from '@supabase/supabase-js';
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Image } from 'react-native';

import {
	isSupabaseConfigured,
	supabase,
	supabaseHost,
} from '@/features/auth/api/supabaseClient';
import type { AuthProfile } from '@/features/auth/types';

type SignInPayload = {
	email: string;
	password: string;
};

type SignUpPayload = {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	dob?: string | null;
	username?: string;
};

type AuthResult = {
	error?: string;
	needsEmailConfirmation?: boolean;
};

type AuthContextValue = {
	session: Session | null;
	user: User | null;
	profile: AuthProfile | null;
	isReady: boolean;
	isLoading: boolean;
	signInWithEmail: (payload: SignInPayload) => Promise<AuthResult>;
	signUpWithEmail: (payload: SignUpPayload) => Promise<AuthResult>;
	signOut: () => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue>({
	session: null,
	user: null,
	profile: null,
	isReady: false,
	isLoading: false,
	signInWithEmail: async () => ({ error: 'Auth not initialized' }),
	signUpWithEmail: async () => ({ error: 'Auth not initialized' }),
	signOut: async () => ({ error: 'Auth not initialized' }),
});

const getMetadata = (user: User | null) =>
	(user?.user_metadata && typeof user.user_metadata === 'object'
		? user.user_metadata
		: {}) as Record<string, unknown>;

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [isReady, setIsReady] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
	const [profileRow, setProfileRow] = useState<{
		first_name?: string | null;
		last_name?: string | null;
		dob?: string | null;
		email?: string | null;
		secondary_email?: string | null;
		phone_number?: string | null;
		gender?: string | null;
		zip_code?: string | null;
		city?: string | null;
		state?: string | null;
		country?: string | null;
		health_insurance_provider_name?: string | null;
		health_insurance_number?: string | null;
	} | null>(null);

	useEffect(() => {
		let isMounted = true;

		supabase.auth
			.getSession()
			.then(({ data }) => {
				if (!isMounted) return;
				setSession(data.session ?? null);
				setIsReady(true);
			})
			.catch(() => {
				if (!isMounted) return;
				setSession(null);
				setIsReady(true);
			});

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, nextSession) => {
				if (!isMounted) return;
				setSession(nextSession);
				setIsReady(true);
			},
		);

		return () => {
			isMounted = false;
			listener?.subscription?.unsubscribe();
		};
	}, []);

	const user = session?.user ?? null;

	useEffect(() => {
		let isMounted = true;
		if (!user) {
			setAvatarUrl(null);
			setProfileRow(null);
			return () => {
				isMounted = false;
			};
		}

		supabase
			.from('profiles')
			.select(
				`avatar_url,first_name,last_name,dob,email,secondary_email,phone_number,gender,zip_code,city,state,country,health_insurance_provider_name,health_insurance_number`,
			)
			.eq('id', user.id)
			.single()
			.then(({ data, error }) => {
				if (!isMounted || error) return;
				setProfileRow(data ?? null);
				const storedUrl = data?.avatar_url?.trim() || null;
				if (!storedUrl) {
					setAvatarUrl(null);
					return;
				}

				const pathMatch = storedUrl.split('/avatars/');
				const rawPath = pathMatch.length > 1 ? pathMatch[1] : null;
				const filePath = rawPath ? rawPath.split('?')[0] : null;

				if (!filePath) {
					setAvatarUrl(storedUrl);
					Image.prefetch(storedUrl).catch(() => {});
					return;
				}

				supabase.storage
					.from('avatars')
					.createSignedUrl(filePath, 60 * 60)
					.then(({ data: signed, error: signedError }) => {
						if (!isMounted) return;
						const resolvedUrl =
							signedError || !signed?.signedUrl ? storedUrl : signed.signedUrl;
						setAvatarUrl(resolvedUrl);
						Image.prefetch(resolvedUrl).catch(() => {});
					});
			});

		return () => {
			isMounted = false;
		};
	}, [user]);

	const profile = useMemo<AuthProfile | null>(() => {
		if (!user) return null;
		const metadata = getMetadata(user);
		return {
			firstName:
				profileRow?.first_name ??
				(metadata.first_name as string | undefined) ??
				(metadata.firstName as string | undefined),
			lastName:
				profileRow?.last_name ??
				(metadata.last_name as string | undefined) ??
				(metadata.lastName as string | undefined),
			dob: profileRow?.dob ?? (metadata.dob as string | undefined) ?? null,
			username: metadata.username as string | undefined,
			email: profileRow?.email ?? user.email ?? undefined,
			avatarUrl:
				avatarUrl ??
				(metadata.avatar_url as string | undefined) ??
				(metadata.avatarUrl as string | undefined) ??
				null,
			secondaryEmail: profileRow?.secondary_email ?? null,
			phoneNumber: profileRow?.phone_number ?? null,
			gender: profileRow?.gender ?? null,
			zipCode: profileRow?.zip_code ?? null,
			city: profileRow?.city ?? null,
			state: profileRow?.state ?? null,
			country: profileRow?.country ?? null,
			healthInsuranceProviderName:
				profileRow?.health_insurance_provider_name ?? null,
			healthInsuranceNumber: profileRow?.health_insurance_number ?? null,
		};
	}, [avatarUrl, profileRow, user]);

	const signInWithEmail = useCallback(
		async ({ email, password }: SignInPayload): Promise<AuthResult> => {
			if (!isSupabaseConfigured) {
				return {
					error:
						'Supabase is not configured. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
				};
			}
			setIsLoading(true);
			try {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				setIsLoading(false);
				if (error) {
					console.error('[auth] signInWithEmail error', error);
					return { error: error.message };
				}
				return {};
			} catch (err) {
				setIsLoading(false);
				console.error('[auth] signInWithEmail failed', {
					host: supabaseHost,
					error: err,
				});
				return {
					error:
						'Network request failed. Check your connection and Supabase URL.',
				};
			}
		},
		[],
	);

	const signUpWithEmail = useCallback(
		async ({
			email,
			password,
			firstName,
			lastName,
			dob,
			username,
		}: SignUpPayload): Promise<AuthResult> => {
			if (!isSupabaseConfigured) {
				return {
					error:
						'Supabase is not configured. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
				};
			}
			setIsLoading(true);
			try {
				const fullName = [firstName, lastName]
					.map((part) => part?.trim())
					.filter(Boolean)
					.join(' ');

				const { data, error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: {
							name: fullName,
							first_name: firstName,
							last_name: lastName,
							dob,
							username,
						},
					},
				});
				setIsLoading(false);
				if (error) {
					console.error('[auth] signUpWithEmail error', {
						message: error.message,
						status: error.status,
						name: error.name,
					});
					return { error: error.message };
				}

				return { needsEmailConfirmation: !data.session };
			} catch (err) {
				setIsLoading(false);
				console.error('[auth] signUpWithEmail failed', {
					host: supabaseHost,
					error: err,
				});
				return {
					error:
						'Network request failed. Check your connection and Supabase URL.',
				};
			}
		},
		[],
	);

	const signOut = useCallback(async (): Promise<AuthResult> => {
		if (!isSupabaseConfigured) {
			return {
				error:
					'Supabase is not configured. Check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
			};
		}
		setIsLoading(true);
		try {
			const { error } = await supabase.auth.signOut();
			setIsLoading(false);
			if (error) {
				console.error('[auth] signOut error', error);
				return { error: error.message };
			}
			return {};
		} catch (err) {
			setIsLoading(false);
			console.error('[auth] signOut failed', {
				host: supabaseHost,
				error: err,
			});
			return {
				error:
					'Network request failed. Check your connection and Supabase URL.',
			};
		}
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			session,
			user,
			profile,
			isReady,
			isLoading,
			signInWithEmail,
			signUpWithEmail,
			signOut,
		}),
		[
			session,
			user,
			profile,
			isReady,
			isLoading,
			signInWithEmail,
			signUpWithEmail,
			signOut,
		],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
