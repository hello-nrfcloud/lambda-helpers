import type {
	APIGatewayProxyEventHeaders,
	APIGatewayProxyStructuredResultV2,
} from 'aws-lambda'
import { corsHeaders } from './corsHeaders.ts'

export const corsResponse = (event: {
	headers: APIGatewayProxyEventHeaders
}): APIGatewayProxyStructuredResultV2 => ({
	statusCode: 200,
	headers: corsHeaders(event),
})
