import { Key } from 'rc-tree/lib/interface'
import { DataNode } from 'antd/es/tree'
import React from 'react'

/**
 * Helper function to use antd tree expandedKeys paameter with component state
 */
export const antdTreeUseExpandedState =
  (expandedKeys: number[], setExpandedKeys: (keys: number[]) => void) =>
  (_keys: Key[], event: any): void => {
    const newKeys: number[] = [...expandedKeys]
    const {
      expanded,
      node: { key },
    } = event
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
export const execOnAntdEvent =
  (callback: () => void) =>
  (e: any): void => {
    callback()
    if (e?.stopPropagation) {
      e.stopPropagation()
    }
    if (e?.preventDefault) {
      e.preventDefault()
    }
  }

/**
 * Resolve DataNode title to ReactNode
 * Handles both string/ReactNode and function title types
 */
export const resolveTreeNodeTitle = (dataNode: DataNode): React.ReactNode => {
  const title = dataNode.title as React.ReactNode | ((data: DataNode) => React.ReactNode)
  if (typeof title === 'function') {
    return title(dataNode)
  }
  return title
}
