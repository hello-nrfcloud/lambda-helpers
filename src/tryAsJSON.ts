export const tryAsJSON = (body: unknown): Record<string, any> | null => {
	if (typeof body !== 'string') return null
	try {
		return JSON.parse(body)
	} catch {
		return null
	}
}
