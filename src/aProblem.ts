import { Context, type ProblemDetail } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'

export const aProblem = (
	problem: Omit<Static<typeof ProblemDetail>, '@context'>,
	cacheForSeconds: number = 60,
): APIGatewayProxyStructuredResultV2 => ({
	statusCode: problem.status,
	headers: {
		'content-type': 'application/problem+json',
		'Cache-Control': `public, max-age=${cacheForSeconds}`,
	},
	body: JSON.stringify({
		'@context': Context.problemDetail.toString(),
		...problem,
	}),
})
