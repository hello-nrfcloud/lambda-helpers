import { formatTypeBoxErrors } from '@hello.nrfcloud.com/proto'
import {
	HttpStatusCode,
	ProblemDetailError,
} from '@hello.nrfcloud.com/proto/hello'
import type { MiddlewareObj } from '@middy/core'
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
	Context as LambdaContext,
} from 'aws-lambda'
import { aProblem } from './aProblem.ts'
import { ValidationFailedError } from './validateInput.ts'
import { ResponseValidationFailedError } from './validateResponse.ts'

export const problemResponse = (): MiddlewareObj<
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
	Error,
	LambdaContext
> => ({
	onError: async (req) => {
		if (req.response !== undefined) return
		if (req.error instanceof ResponseValidationFailedError) {
			req.response = aProblem({
				title: 'Response validation failed',
				status: HttpStatusCode.INTERNAL_SERVER_ERROR,
				detail: formatTypeBoxErrors(req.error.errors),
			})
		} else if (req.error instanceof ValidationFailedError) {
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
