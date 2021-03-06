/**
 * Reload the cache action button component
 *
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Popconfirm, Tooltip, Button } from 'antd'
import { ExclamationCircleFilled, SyncOutlined } from '@ant-design/icons'
import { useStoreState, useStoreActions } from 'library/store'
import { ActionButtonProps } from './types'

export const ReloadCacheActionButton: React.FC<ActionButtonProps> = ({ title }) => {
  const { nodes: cashedNodes, apiError } = useStoreState(state => state.cashedTreeNodes)
  const { refreshNodesById, setLoading, clear } = useStoreActions(state => state.cashedTreeNodes)

  const renderIcon = () => {
    if (apiError) {
      return (
        <Tooltip title={apiError}>
          <ExclamationCircleFilled style={{ color: 'red' }} />
        </Tooltip>
      )
    }
    return (
      <SyncOutlined />
    )
  }

  const handleCacheReload = async () => {
    setLoading(true)
    clear()

    const ids = cashedNodes.map(node => node.id)
    await refreshNodesById(ids)
    setLoading(false)
  }

  return (
    <Popconfirm
      key="clear"
      title={(
        <>
          Данные узлов будут перезагружены<br />
          Внесённые изменения будут потеряны<br />
          Продолжить?
        </>
      )}
      onConfirm={() => handleCacheReload()}
      okText="Да"
      cancelText="Нет"
    >
      <Button
        size="small"
        type="text"
        key="save"
        title={title}
        disabled={cashedNodes?.length === 0}
        danger={!!apiError}
      >
        {renderIcon()}
        <span className="title">{title}</span>
      </Button>
    </Popconfirm>
  )
}
