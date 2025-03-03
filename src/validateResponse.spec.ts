import middy from '@middy/core'
import { Type } from '@sinclair/typebox'
import type { Context } from 'aws-lambda'
import assert from 'node:assert'
import { describe, it } from 'node:test'
import {
	ResponseValidationFailedError,
	validateResponse,
} from './validateResponse.js'

void describe('validateResponse()', () => {
	void it('should validate the response', async () =>
		assert.equal(
			await middy()
				.use(validateResponse(Type.Boolean({ title: 'A boolean' })))
				.handler(async () => true)('Some event', {} as Context),
			true,
		))

	void it('should throw an Error in case the response is invalid', async () =>
		assert.rejects(
			async () =>
				middy()
					.use(validateResponse(Type.Boolean()))
					.handler(async () => 42)('Some event', {} as Context),
			ResponseValidationFailedError,
		))
})
