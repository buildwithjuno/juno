export const APP_VERSION = VITE_APP_VERSION;

export const localIdentityCanisterId: string | null | undefined = import.meta.env
	.VITE_INTERNET_IDENTITY_CANISTER_ID as string | null | undefined;

// Workers
export const AUTH_TIMER_INTERVAL = 1000;
export const SYNC_CYCLES_TIMER_INTERVAL = 60000;
export const SYNC_CUSTOM_DOMAIN_TIMER_INTERVAL = 20000;

// How long the delegation identity should remain valid?
// e.g. BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000) = 7 days in nanoseconds
export const AUTH_MAX_TIME_TO_LIVE = BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000);

export const AUTH_POPUP_WIDTH = 576;
export const AUTH_POPUP_HEIGHT = 576;

export const E8S_PER_ICP = 100_000_000n;
export const IC_TRANSACTION_FEE_ICP = 10_000n;

export const CYCLES_WARNING = 500_000_000_000n;

export const PAGINATION = 10n;
