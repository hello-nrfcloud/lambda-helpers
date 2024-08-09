import { formatTypeBoxErrors } from '@hello.nrfcloud.com/proto'
import {
	HttpStatusCode,
	type ProblemDetail,
} from '@hello.nrfcloud.com/proto/hello'
import type { MiddlewareObj } from '@middy/core'
import type { Static } from '@sinclair/typebox'
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
	Context,
} from 'aws-lambda'
import { aProblem } from './aProblem.js'
import { ValidationFailedError } from './validateInput.js'

export class ProblemDetailError extends Error {
	public readonly problem: Static<typeof ProblemDetail>
	constructor(problem: Static<typeof ProblemDetail>) {
		super(problem.title)
		this.problem = problem
		this.name = 'ProblemDetailError'
	}
}

export const problemResponse = (): MiddlewareObj<
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
	Error,
	Context
> => ({
	onError: async (req) => {
		if (req.error instanceof ValidationFailedError) {
			return aProblem({
				title: 'Validation failed',
				status: HttpStatusCode.BAD_REQUEST,
				detail: formatTypeBoxErrors(req.error.errors),
			})
		}
		if (req.error instanceof ProblemDetailError) {
			return aProblem(req.error.problem)
		}
		return aProblem({
			title:
				req.error instanceof Error
					? req.error.message
					: 'Internal Server Error',
			status: HttpStatusCode.INTERNAL_SERVER_ERROR,
		})
	},
})
