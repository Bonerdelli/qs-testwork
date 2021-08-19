/**
 * Helper function to use antd tree expandedKeys paameter with componen state
 */
export const antdTreeUseExpandedState = (
  expandedKeys: number[],
  setExpandedKeys: (keys: number[]) => void,
) => (_keys: (number | string)[], event: any): void => {
  const newKeys: number[] = [...expandedKeys]
  const { expanded, node: { key } } = event
  const keyIndex = expandedKeys.indexOf(key)
  if (!expanded && keyIndex !== -1) {
    newKeys.splice(keyIndex, 1)
  } else if (expanded && keyIndex === -1) {
    newKeys.push(+key)
  } else {
    return
  }
  setExpandedKeys(newKeys)
}

/**
 * Wrapper to use antd events
 */
export const execOnAntdEvent = (callback: () => void) => (e: any): void => {
  callback()
  e.stopPropagation()
  e.preventDefault()
}
