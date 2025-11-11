import { useState, useCallback, useEffect } from 'react'

import { ApiError, getJson } from 'library/helpers/api'

export type UseApiDataHookValue<T> = [T | undefined, (value: T) => void, () => Promise<T | undefined>]

/**
 * Hook for using data from API
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */
export function useApiData<T>(path: string, onError?: (error?: ApiError) => void): UseApiDataHookValue<T> {
  const [data, setData] = useState<T>()
  const loadData = useCallback(async () => {
    const result = await getJson(path, onError)
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
