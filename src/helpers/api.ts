import { notification } from 'antd'

export const API_URL = process.env.API_URL || 'http://localhost:3031'

export interface ApiError {
  code?: string
  message: string
}

export interface ApiErrorResponse {
  error: ApiError
}

/**
 * Fetch and parse JSON from backend
 */
export async function getJson<T>(url: string): Promise<T | ApiErrorResponse> {
  let result = undefined
  try {
    const response = await fetch(url)
    result = await response.json()
    if (result.error) {
      return await handleApiError(result.error)
    }
  } catch (e) {
    console.error(e)
  }
  return result as T
}

/**
 * Helper function to build endpoint URL
 */
export function getEndpointUrl(path: string): string {
  let result = path.replace(/^\/+/, '').replace(/\/+$/, '')
  return `${API_URL}/${result}`
}


/**
 * Helper function to handle API errors
 */
async function handleApiError(error: ApiError): Promise<ApiErrorResponse> {
  notification.error({
    message: 'Ошибка загрузки данных',
    description: error.message,
    placement: 'bottomRight',
  })
  console.error('API Error', error.message)
  return { error }
}
