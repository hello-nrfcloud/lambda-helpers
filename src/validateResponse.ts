import {
	formatTypeBoxErrors,
	validateWithTypeBox,
} from '@hello.nrfcloud.com/proto'
import type middy from '@middy/core'
import type { TSchema } from '@sinclair/typebox'
import type { ValueError } from '@sinclair/typebox/errors'
import { ValidationFailedError } from './validateInput.js'

export class ResponseValidationFailedError extends ValidationFailedError {
	constructor(errors: ValueError[]) {
		super(errors, 'Response validation failed')
		this.name = 'ResponseValidationFailedError'
	}
}

export const validateResponse = <ResponseSchema extends TSchema>(
	schema: ResponseSchema,
): middy.MiddlewareObj => {
	const validator = validateWithTypeBox(schema)
	return {
		after: async (req) => {
			const maybeValid = validator(req.response)
			if ('errors' in maybeValid) {
				console.error(
					`[validateResponse]`,
					`Response validation failed`,
					JSON.stringify({
						response: req.response,
						errors: formatTypeBoxErrors(maybeValid.errors),
					}),
				)
				throw new ResponseValidationFailedError(maybeValid.errors)
			}
			console.debug(`[validateResponse]`, `Response is`, schema.title)
			return undefined
		},
	}
}
