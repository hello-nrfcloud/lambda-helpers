/**
 * Returns a Map of headers with keys in lowercase.
 * This is useful for consistent header handling, especially in environments
 * where header keys may be case-insensitive.
 */
export const parseHeaders = (
	headers: Record<string, string | undefined> | null,
): Map<string, string | null> => {
	if (headers === null) return new Map()
	return Object.entries(headers).reduce((h, [key, value]) => {
		h.set(key.toLowerCase(), value ?? null)
		return h
	}, new Map())
}
