import { formatTypeBoxErrors } from '@hello.nrfcloud.com/proto'
import {
	Context,
	HttpStatusCode,
	type ProblemDetail,
} from '@hello.nrfcloud.com/proto/hello'
import type { MiddlewareObj } from '@middy/core'
import type { Static } from '@sinclair/typebox'
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
	Context as LambdaContext,
} from 'aws-lambda'
import { aProblem } from './aProblem.js'
import { ValidationFailedError } from './validateInput.js'

export class ProblemDetailError extends Error {
	public readonly problem: Static<typeof ProblemDetail>
	constructor(problem: Omit<Static<typeof ProblemDetail>, '@context'>) {
		super(problem.title)
		this.problem = {
			'@context': Context.problemDetail.toString(),
			...problem,
		}
		this.name = 'ProblemDetailError'
	}
}

export const problemResponse = (): MiddlewareObj<
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
	Error,
	LambdaContext
> => ({
	onError: async (req) => {
		if (req.response !== undefined) return
		if (req.error instanceof ValidationFailedError) {
			req.response = aProblem({
				title: 'Validation failed',
				status: HttpStatusCode.BAD_REQUEST,
				detail: formatTypeBoxErrors(req.error.errors),
			})
		} else if (req.error instanceof ProblemDetailError) {
			req.response = aProblem(req.error.problem)
		} else {
			req.response = aProblem({
				title:
					req.error instanceof Error
						? req.error.message
						: 'Internal Server Error',
				status: HttpStatusCode.INTERNAL_SERVER_ERROR,
			})
		}
	},
})
