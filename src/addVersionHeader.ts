import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
} from 'aws-lambda'
import type { MiddlewareObj } from '@middy/core'

export const addVersionHeader = (
	version: string,
): MiddlewareObj<
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2
> => ({
	after: async (req) => {
		if (req.response === null) return
		req.response = {
			...req.response,
			headers: {
				...req.response.headers,
				'x-backend-version': version,
			},
		}
	},
})