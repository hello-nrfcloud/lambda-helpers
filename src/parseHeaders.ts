/**
 * Returns a Map of headers with keys in lowercase.
 * This is useful for consistent header handling, especially in environments
 * where header keys may be case-insensitive.
 */
export const parseHeaders = (
	headers: Record<string, string | undefined> | null,
): ParsedHeaders => {
	if (headers === null) return new Map()
	return CaseInsensitiveMap(
		Object.entries(headers).reduce((h, [key, value]) => {
			h.set(key.toLowerCase(), value ?? null)
			return h
		}, new Map()),
	)
}

export type ParsedHeaders = Pick<
	Map<string, string | null>,
	'get' | 'has' | 'size' | 'keys' | 'values' | 'entries' | 'forEach'
>

export const CaseInsensitiveMap = (
	map: Map<string, string | null>,
): ParsedHeaders => ({
	get: (key) => map.get(key.toLowerCase()),
	has: (key) => map.has(key.toLowerCase()),
	size: map.size,
	keys: () => map.keys(),
	values: () => map.values(),
	entries: () => map.entries(),
	forEach: (callback, thisArg) => map.forEach(callback, thisArg),
})
