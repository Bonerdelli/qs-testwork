import { useState, useCallback, useEffect } from 'react'

import { ApiError, getEndpointUrl, getJson } from './api'

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
  onError?: (error?: ApiError) => void,
): UseApiDataHookValue<T> {
  const [data, setData] = useState<T>()
  const loadData = useCallback(async () => {
    const url = getEndpointUrl(path)
    const result = await getJson(url, onError)
    return result as T
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
