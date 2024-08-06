import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
	Context,
} from 'aws-lambda'
import type { MiddlewareObj } from '@middy/core'
import type { Static, TSchema } from '@sinclair/typebox'
import {
	formatTypeBoxErrors,
	validateWithTypeBox,
} from '@hello.nrfcloud.com/proto'
import { HttpStatusCode } from '@hello.nrfcloud.com/proto/hello'
import { tryAsJSON } from '../tryAsJSON.js'
import { aProblem } from '../aProblem.js'

export const validateInput = <Schema extends TSchema>(
	schema: Schema,
	mapInput?: (e: APIGatewayProxyEventV2) => unknown,
): MiddlewareObj<
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
	Error,
	Context & ValidInput<Schema>
> => {
	const v = validateWithTypeBox(schema)
	return {
		before: async (req) => {
			let reqBody = {}
			if (
				(req.event.headers?.['content-type'] ?? '').includes(
					'application/json',
				) &&
				parseInt(req.event.headers?.['content-length'] ?? '0', 10) > 0
			) {
				reqBody = tryAsJSON(req.event.body) ?? {}
			}
			const input = mapInput?.(req.event) ?? {
				...(req.event.pathParameters ?? {}),
				...(req.event.queryStringParameters ?? {}),
				...reqBody,
			}
			console.debug(`[validateInput]`, 'input', JSON.stringify(input))
			const maybeValidInput = v(input)
			if ('errors' in maybeValidInput) {
				console.debug(
					`[validateInput]`,
					`Input not valid`,
					JSON.stringify(maybeValidInput.errors),
				)
				return aProblem({
					title: 'Validation failed',
					status: HttpStatusCode.BAD_REQUEST,
					detail: formatTypeBoxErrors(maybeValidInput.errors),
				})
			}
			console.debug(`[validateInput]`, `Input valid`)
			req.context.validInput = maybeValidInput.value
			return undefined
		},
	}
}

export type ValidInput<Schema extends TSchema> = {
	validInput: Static<Schema>
}
