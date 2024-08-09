import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import type { HttpStatusCode } from '@hello.nrfcloud.com/proto/hello'

export const aResponse = (
	status: HttpStatusCode,
	result?: {
		'@context': URL
	} & Record<string, unknown>,
	cacheForSeconds: number = 60,
	headers?: APIGatewayProxyStructuredResultV2['headers'],
): APIGatewayProxyStructuredResultV2 => {
	const body = result !== undefined ? JSON.stringify(result) : undefined
	return {
		statusCode: status,
		headers: {
			...(body !== undefined ? { 'content-type': 'application/json' } : {}),
			'content-length': `${body?.length ?? 0}`,
			'Cache-Control':
				cacheForSeconds > 0 ? `public, max-age=${cacheForSeconds}` : 'no-store',
			...(headers ?? {}),
		},
		body,
	}
}
