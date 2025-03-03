import { HttpStatusCode } from '@hello.nrfcloud.com/proto/hello'
import middy from '@middy/core'
import { Type } from '@sinclair/typebox'
import type { Context } from 'aws-lambda'
import assert from 'node:assert'
import { describe, it } from 'node:test'
import { aResponse } from './aResponse.js'
import {
	ResponseValidationFailedError,
	validateResponse,
} from './validateResponse.js'

void describe('validateResponse()', () => {
	void it('should validate the response', async () =>
		assert.deepEqual(
			await middy()
				.use(validateResponse(Type.Object({ value: Type.Boolean() })))
				.handler(async () =>
					aResponse(HttpStatusCode.OK, {
						'@context': new URL('https://example.com'),
						value: true,
					}),
				)('Some event', {} as Context),
			{
				body: '{"@context":"https://example.com/","value":true}',
				headers: {
					'Cache-Control': 'public, max-age=60',
					'content-length': '48',
					'content-type': 'application/json',
				},
				statusCode: 200,
			},
		))

	void it('should throw an Error in case the response is invalid', async () =>
		assert.rejects(
			async () =>
				middy()
					.use(validateResponse(Type.Object({ value: Type.Boolean() })))
					.handler(async () =>
						aResponse(HttpStatusCode.OK, {
							'@context': new URL('https://example.com'),
							value: 42,
						}),
					)('Some event', {} as Context),
			ResponseValidationFailedError,
		))
})
