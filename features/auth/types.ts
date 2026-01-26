export type AuthProfile = {
	firstName?: string;
	lastName?: string;
	dob?: string | null;
	username?: string;
	email?: string;
	avatarUrl?: string | null;
	secondaryEmail?: string | null;
	phoneNumber?: string | null;
	gender?: string | null;
	zipCode?: string | null;
	city?: string | null;
	state?: string | null;
	country?: string | null;
	healthInsuranceProviderName?: string | null;
	healthInsuranceNumber?: string | null;
};
