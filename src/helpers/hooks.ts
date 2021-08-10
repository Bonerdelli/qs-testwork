import { useState, useEffect } from 'react'

import { ApiErrorResponse, getEndpointUrl, getJson } from './api'

export type UseApiDataHookValue<T> = [ T | undefined, (value: T) => void ]

/**
 * Hook for using data from API
 */
export function useApiData<T>(
  path: string,
): UseApiDataHookValue<T> {
  const [data, setData] = useState<T>()

  useEffect(() => {
    const getData = async () => {
      const url = getEndpointUrl(path)
      const result = await getJson(url)
      if (!(result as ApiErrorResponse).error) {
        setData(result as T)
      }
    }
    getData()
  }, [])

  return [data, setData]
}
