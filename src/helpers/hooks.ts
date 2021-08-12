import { useState, useCallback, useEffect } from 'react'

import { ApiErrorResponse, getEndpointUrl, getJson } from './api'

export type UseApiDataHookValue<T> = [
  T | undefined,
  (value: T) => void,
  () => Promise<T | undefined>,
]

/**
 * Hook for using data from API
 */
export function useApiData<T>(
  path: string,
): UseApiDataHookValue<T> {
  const [data, setData] = useState<T>()

  const loadData = useCallback(async () => {
    const url = getEndpointUrl(path)
    const result = await getJson(url)
    if (!(result as ApiErrorResponse).error) {
      return result as T
    }
    return undefined
  }, [])

  useEffect(() => {
    const getData = async () => {
      const loadedData = await loadData()
      loadedData && setData(loadedData)
    }
    getData()
  }, [])

  return [data, setData, loadData]
}
