import {
	formatTypeBoxErrors,
	validateWithTypeBox,
} from '@hello.nrfcloud.com/proto'
import type middy from '@middy/core'
import type { TSchema } from '@sinclair/typebox'
import type { ValueError } from '@sinclair/typebox/errors'
import { tryAsJSON } from './tryAsJSON.js'
import { ValidationFailedError } from './validateInput.js'

export class ResponseValidationFailedError extends ValidationFailedError {
	constructor(errors: ValueError[]) {
		super(errors, 'Response validation failed')
		this.name = 'ResponseValidationFailedError'
	}
}

/**
 * Validate responses created with `aResponse`
 */
export const validateResponse = <ResponseSchema extends TSchema>(
	schema: ResponseSchema,
): middy.MiddlewareObj => {
	const validator = validateWithTypeBox(schema)
	return {
		after: async (req) => {
			const body = req.response?.body
			if ((body?.length ?? 0) === 0) {
				console.debug(`[validateResponse]`, `Response body is empty`)
			}
			if (
				(req.response.headers['content-type']?.includes('application/json') ??
					false) === false
			) {
				console.debug(`[validateResponse]`, `Response body is not JSON`)
			}
			const maybeValid = validator(tryAsJSON(req.response.body))
			if ('errors' in maybeValid) {
				console.error(
					`[validateResponse]`,
					`Response validation failed`,
					req.response.body,
					formatTypeBoxErrors(maybeValid.errors),
					schema.title,
				)
				throw new ResponseValidationFailedError(maybeValid.errors)
			}
			console.debug(`[validateResponse]`, `Response is valid`, schema.title)
			return undefined
		},
	}
}
