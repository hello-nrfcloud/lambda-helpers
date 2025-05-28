import assert from 'assert'
import { describe, it } from 'node:test'
import { parseHeaders } from './parseHeaders.js'

void describe('parseHeaders()', () => {
	void it('should parse both lowercase and uppercase headers', () => {
		const headers = {
			'content-type': 'application/json',
			'Content-Length': '1234',
			'x-custom-header': 'value',
		}

		const parsedHeaders = parseHeaders(headers)

		assert.deepEqual(
			parsedHeaders,
			new Map([
				['content-type', 'application/json'],
				['content-length', '1234'],
				['x-custom-header', 'value'],
			]),
		)
	})

	void it('should handle null values in headers', () =>
		assert.deepEqual(parseHeaders(null), new Map()))
})
