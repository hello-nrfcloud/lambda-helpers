import type { MiddlewareObj, Request } from '@middy/core'
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
} from 'aws-lambda'

export const addVersionHeader = (
	version: string,
): MiddlewareObj<APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2> => {
	const setVersionHeader = async (req: Request) => {
		if (req.response === null) return
		req.response = {
			...req.response,
			headers: {
				...req.response.headers,
				'x-backend-version': version,
			},
		}
	}

	return {
		after: setVersionHeader,
		onError: setVersionHeader,
	}
}
