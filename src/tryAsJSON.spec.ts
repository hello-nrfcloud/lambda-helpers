import assert from 'node:assert/strict'
import { describe, test as it } from 'node:test'
import { tryAsJSON } from './tryAsJSON.js'

void describe('tryAsJSON()', () => {
	void it('should return parsed JSON object if input is a valid JSON string', () => {
		const body = '{"name": "John", "age": 30}'
		const expected = { name: 'John', age: 30 }
		const result = tryAsJSON(body)
		assert.deepEqual(result, expected)
	})

	void it('should return null if input is not a string', () => {
		const body = 123
		const result = tryAsJSON(body)
		assert.equal(result, null)
	})

	void it('should return null if input is an invalid JSON string', () => {
		const body = '{"name": "John", "age": 30' // Missing closing brace
		const result = tryAsJSON(body)
		assert.equal(result, null)
	})
})
