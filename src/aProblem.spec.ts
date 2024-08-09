import { Context } from '@hello.nrfcloud.com/proto/hello'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { aProblem } from './aProblem.js'

void describe('aProblem()', () => {
	void it('should return a problem response', () =>
		assert.deepEqual(
			aProblem({
				title: `A Conflict!`,
				status: 409,
			}),
			{
				statusCode: 409,
				headers: {
					'content-type': 'application/problem+json',
					'Cache-Control': 'public, max-age=60',
				},
				body: JSON.stringify({
					'@context': Context.problemDetail.toString(),
					title: `A Conflict!`,
					status: 409,
				}),
			},
		))
})
