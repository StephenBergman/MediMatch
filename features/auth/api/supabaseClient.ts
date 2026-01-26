import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').trim();
const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabaseHost = (() => {
	try {
		return new URL(supabaseUrl).host;
	} catch {
		return '';
	}
})();

const inMemoryStore = new Map<string, string>();

const webStorage = {
	getItem: async (key: string) => {
		if (typeof localStorage === 'undefined') {
			return inMemoryStore.get(key) ?? null;
		}
		return localStorage.getItem(key);
	},
	setItem: async (key: string, value: string) => {
		if (typeof localStorage === 'undefined') {
			inMemoryStore.set(key, value);
			return;
		}
		localStorage.setItem(key, value);
	},
	removeItem: async (key: string) => {
		if (typeof localStorage === 'undefined') {
			inMemoryStore.delete(key);
			return;
		}
		localStorage.removeItem(key);
	},
};

const secureStorage = {
	getItem: async (key: string) => SecureStore.getItemAsync(key),
	setItem: async (key: string, value: string) =>
		SecureStore.setItemAsync(key, value),
	removeItem: async (key: string) => SecureStore.deleteItemAsync(key),
};

const storage = Platform.OS === 'web' ? webStorage : secureStorage;

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn(
		'[auth] Missing Supabase env vars. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
	);
} else if (!supabaseUrl.startsWith('https://')) {
	console.warn('[auth] Supabase URL should start with https://');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
