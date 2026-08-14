import type { MiddlewareObj, Request } from '@middy/core'
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
} from 'aws-lambda'
import { corsHeaders } from './corsHeaders.ts'

export const corsOPTIONS = (
	...allowedMethods: string[]
): MiddlewareObj<APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2> => {
	const setCorsHeaders = async (
		req: Request<APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2>,
	) => {
		if (req.response === null) {
			console.error(`[corsOPTIONS]`, `Response is null`)
			return
		}
		req.response = {
			...req.response,
			headers: {
				...(req.response?.headers ?? {}),
				...corsHeaders(req.event, allowedMethods),
			},
		}
	}
	return {
		before: async (req) => {
			if (req.event.requestContext.http.method === 'OPTIONS') {
				console.debug(`[corsOPTIONS]`, `Handling OPTIONS request`)
				return {
					statusCode: 200,
					headers: corsHeaders(req.event, allowedMethods),
				}
			}
			return undefined
		},
		after: setCorsHeaders,
		onError: setCorsHeaders,
	}
}
