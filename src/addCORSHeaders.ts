import type { MiddlewareObj, Request } from '@middy/core'
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
} from 'aws-lambda'

export const addCORSHeaders = (
	AccessControlAllowOrigin: string = '*',
): MiddlewareObj<APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2> => {
	const setCORSHeaders = async (req: Request) => {
		if (req.response === null) return
		req.response = {
			...req.response,
			headers: {
				...(req.response.headers ?? {}),
				'Access-Control-Allow-Origin': AccessControlAllowOrigin,
			},
		}
	}

	return {
		after: setCORSHeaders,
		onError: setCORSHeaders,
	}
}
