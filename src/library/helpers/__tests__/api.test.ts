import { getEndpointUrl, isSuccessful } from '../api'
import { ApiErrorResponse, ApiSuccessResponse, ApiCrudResponse } from '../api'

describe('api helpers', () => {
  describe('getEndpointUrl', () => {
    it('should build URL with API_URL', () => {
      const result = getEndpointUrl('/tree')
      // API_URL is read at module load time, so we just verify the function works
      expect(result).toMatch(/^https?:\/\/.+\/tree$/)
    })

    it('should remove leading slashes', () => {
      const result = getEndpointUrl('///tree')
      expect(result).toBe('http://localhost:3001/tree')
    })

    it('should remove trailing slashes', () => {
      const result = getEndpointUrl('tree///')
      expect(result).toBe('http://localhost:3001/tree')
    })

    it('should handle path without slashes', () => {
      const result = getEndpointUrl('tree')
      expect(result).toBe('http://localhost:3001/tree')
    })

    it('should handle nested paths', () => {
      const result = getEndpointUrl('/tree/branch/1')
      expect(result).toBe('http://localhost:3001/tree/branch/1')
    })
  })

  describe('isSuccessful', () => {
    it('should return true for ApiSuccessResponse with success flag', () => {
      const response: ApiSuccessResponse = {
        success: true,
      }
      expect(isSuccessful(response)).toBe(true)
    })

    it('should return false for ApiErrorResponse', () => {
      const response: ApiErrorResponse = {
        error: {
          message: 'Error message',
        },
      }
      expect(isSuccessful(response)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isSuccessful(undefined)).toBe(false)
    })

    it('should return true for object without error property', () => {
      const response: ApiCrudResponse<{ data: string }> = {
        data: 'some data',
      }
      expect(isSuccessful(response)).toBe(true)
    })

    it('should return true for empty object', () => {
      const response: ApiCrudResponse<Record<string, never>> = {}
      expect(isSuccessful(response)).toBe(true)
    })

    it('should handle response with success false but no error', () => {
      const response: ApiCrudResponse<{ success: boolean }> = {
        success: false,
      }
      expect(isSuccessful(response)).toBe(true)
    })
  })
})
