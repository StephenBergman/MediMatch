/**
 * Generic async retry with exponential backoff and jitter.
 */
export type RetryOptions = {
	attempts?: number;
	baseDelayMs?: number;
	maxDelayMs?: number;
	jitter?: boolean;
	shouldRetry?: (error: unknown, attempt: number) => boolean;
	onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
};

const defaultShouldRetry = (error: unknown) => {
	const status = (error as { status?: number | string })?.status;
	const retryable = (error as { retryable?: boolean })?.retryable;
	if (retryable) return true;
	if (typeof status === 'number') {
		return status === 429 || status === 503 || status >= 500;
	}
	if (typeof status === 'string') {
		const num = Number(status);
		return Number.isFinite(num) && (num === 429 || num === 503 || num >= 500);
	}
	return false;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function retry<T>(
	fn: (attempt: number) => Promise<T>,
	{
		attempts = 3,
		baseDelayMs = 300,
		maxDelayMs = 2000,
		jitter = true,
		shouldRetry = defaultShouldRetry,
		onRetry,
	}: RetryOptions = {}
): Promise<T> {
	let lastError: unknown;

	for (let attempt = 1; attempt <= Math.max(1, attempts); attempt += 1) {
		try {
			return await fn(attempt);
		} catch (error) {
			lastError = error;
			if (attempt >= attempts || !shouldRetry(error, attempt)) {
				break;
			}

			const backoff = Math.min(
				maxDelayMs,
				baseDelayMs * Math.pow(2, attempt - 1)
			);
			const jitterOffset = jitter ? Math.random() * backoff * 0.3 : 0;
			const delay = Math.round(backoff + jitterOffset);
			onRetry?.(error, attempt, delay);
			await sleep(delay);
		}
	}

	// If we exhaust retries, throw the last error
	throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
