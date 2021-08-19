/**
 * @author Nekrasov Andrew <bonerdelli@gmail.com>
 * @package qs-test-work
 */

import { Popconfirm, Button } from 'antd'
import { ClearOutlined } from '@ant-design/icons'
import { useStoreState, useStoreActions } from 'library/store'
import { ActionButtonProps } from './types'

export const ClearCacheActionButton: React.FC<ActionButtonProps> = ({ title }) => {
  const { nodes: cashedNodes } = useStoreState(state => state.cashedTreeNodes)
  const { clear } = useStoreActions(state => state.cashedTreeNodes)
  return (
    <Popconfirm
      key="clear"
      title={<>Внесённые изменения будут потеряны<br />Продолжить?</>}
      onConfirm={() => clear()}
      okText="Да"
      cancelText="Нет"
    >
      <Button
        size="small"
        type="text"
        disabled={cashedNodes?.length === 0}
      >
        <ClearOutlined />
        {title}
      </Button>
    </Popconfirm>
  )
}
