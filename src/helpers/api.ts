/**
 * Helpers to handle API queries
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */
import { notification } from 'antd'
import request, { Response } from 'superagent'

export const API_URL = process.env.API_URL || 'http://localhost:3001'
export const REQUEST_TIMEOUT = 5000 // in milliseconds
export const REQUEST_MAX_TIME = 20000 // in milliseconds

export interface ApiError {
  code?: string
  message: string
}

export interface ApiErrorResponse {
  error: ApiError
}

export interface ApiSuccessResponse {
  success: boolean
  // NOTE: for the future
  updatedRowId?: number
  updatedRowsCount?: number
  insertedRowsCount?: number
  deletedRowsCount?: number
}

export type ApiCrudResponse<T = void> = T | ApiErrorResponse | ApiSuccessResponse
export type ApiCrudSuccessResponse<T = void> = T | ApiSuccessResponse

/**
 * Fetch and parse JSON from backend
 */
export async function getJson<T>(
  url: string,
  onError?: (error?: ApiError) => void,
): Promise<T | ApiErrorResponse> {
  const response = await request
    .get(url)
    .timeout({
      response: REQUEST_TIMEOUT,
      deadline: REQUEST_MAX_TIME,
    })
    .type('json')
    .accept('json')
    .catch(err => handleApiError(err, onError))
  const result = (response as Response)?.body
  if (result?.error) {
    return handleApiError(result.error, onError)
  }
  return result
}

/**
 * POST request
 */
export async function post<T = void>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  payload: any,
  onError?: (error?: ApiError) => void,
): Promise<ApiCrudResponse<T>> {
  const response = await request
    .post(url)
    .timeout({
      response: REQUEST_TIMEOUT,
      deadline: REQUEST_MAX_TIME,
    })
    .type('json')
    .accept('json')
    .send(payload)
    .catch(err => handleApiError(err, onError))
  const result = (response as Response)?.body
  if (result?.error) {
    return handleApiError(result.error, onError)
  }
  return result
}

/**
 * PUT request
 */
export async function put<T = void>(
  url: string,
  payload?: any,
  onError?: (error?: ApiError) => void,
): Promise<ApiCrudResponse<T>> {
  const response = await request
    .put(url)
    .timeout({
      response: REQUEST_TIMEOUT,
      deadline: REQUEST_MAX_TIME,
    })
    .type('json')
    .accept('json')
    .send(payload)
    .catch(err => handleApiError(err, onError))
  const result = (response as Response)?.body
  if (result?.error) {
    return handleApiError(result.error, onError)
  }
  return result
}

/**
 * DELETE request
 */
export async function del<T = void>(
  url: string,
  onError?: (error?: ApiError) => void,
): Promise<ApiCrudResponse<T>> {
  const response = await request
    .delete(url)
    .timeout({
      response: REQUEST_TIMEOUT,
      deadline: REQUEST_MAX_TIME,
    })
    .type('json')
    .accept('json')
    .catch(err => handleApiError(err, onError))
  const result = (response as Response)?.body
  if (result?.error) {
    return handleApiError(result.error, onError)
  }
  return result
}

/**
 * Helper function to check if request was successful
 */
export function isSuccessful<T = void>(result: ApiCrudResponse<T>): boolean {
  if ((result as ApiErrorResponse).error) {
    return false
  }
  if ((result as ApiSuccessResponse).success) {
    return true
  }
  return true
}

/**
 * Helper function to build endpoint URL
 */
export function getEndpointUrl(path: string): string {
  const url = path.replace(/^\/+/, '').replace(/\/+$/, '')
  return `${API_URL}/${url}`
}

/**
 * Helper function to handle API errors
 */
function handleApiError(
  error?: ApiError,
  onError?: (error?: ApiError) => void,
): ApiErrorResponse {
  if (onError) {
    onError(error)
  } else {
    console.error('API Error', error?.message) // eslint-disable-line no-console
    notification.error({
      message: 'Ошибка загрузки данных',
      description: error?.message,
      placement: 'bottomRight',
    })
  }
  return error ? { error } : {
    error: { message: 'Неизвестная ошибка' },
  }
}
