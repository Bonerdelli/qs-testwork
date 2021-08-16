/**
 * Helpers to handle API queries
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { notification } from 'antd'

export const API_URL = process.env.API_URL || 'http://localhost:3001'

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
export async function getJson<T>(url: string): Promise<T | ApiErrorResponse> {
  let result
  try {
    const response = await fetch(url)
    result = await response.json()
    if (result.error) {
      return await handleApiError(result.error)
    }
  } catch (e) {
    return await handleApiError(e)
  }
  return result as T
}

/**
 * POST request
 */
export async function post<T = void>(
  url: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data: any,
): Promise<ApiCrudResponse<T>> {
  let result
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    result = await response.json()
    if (result.error) {
      return await handleApiError(result.error)
    }
  } catch (e) {
    return await handleApiError(e)
  }
  return result as ApiCrudSuccessResponse<T>
}

/**
 * PUT request
 */
export async function put<T = void>(
  url: string,
  data: unknown,
): Promise<ApiCrudResponse<T>> {
  let result
  try {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    result = await response.json()
    if (result.error) {
      return await handleApiError(result.error)
    }
  } catch (e) {
    return await handleApiError(e)
  }
  return result as ApiCrudSuccessResponse<T>
}

/**
 * DELETE request
 */
export async function del<T = void>(
  url: string,
): Promise<ApiCrudResponse<T>> {
  let result
  try {
    const response = await fetch(url, {
      method: 'DELETE',
    })
    result = await response.json()
    if (result.error) {
      return await handleApiError(result.error)
    }
  } catch (e) {
    return await handleApiError(e)
  }
  return result as ApiCrudSuccessResponse<T>
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
async function handleApiError(error?: ApiError): Promise<ApiErrorResponse> {
  notification.error({
    message: 'Ошибка загрузки данных',
    description: error?.message,
    placement: 'bottomRight',
  })
  console.error('API Error', error?.message) // eslint-disable-line no-console
  return error ? { error } : {
    error: { message: 'Unknown error' },
  }
}
